import React, {
  useState, useCallback, useEffect
} from 'react'
import styles from './paintTool.module.sass'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Collapse from '@mui/material/Collapse'
import LinearScaleIcon from '@mui/icons-material/LinearScale'
import CodeIcon from '@mui/icons-material/Code'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import SettingsIcon from '@mui/icons-material/Settings'
import {
  openAlert, openConfirm, closeDialogs, openForm
} from 'component/dialog'
import CallMissedIcon from '@mui/icons-material/CallMissed'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import SettingView from './sub/settingView'
import clsx from 'clsx'

const penIndex = 0
const settingIndex = 1

function PaintTool() {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)

  const [useTool, setUseTool] = useState([false, false])

  const [setting, setSetting] = useState({
    isShowGrid: true,
    gridSize: 250,
  })

  // 鋼筆工具
  const [storyPointAry, setStoryPointAry] = useState([])
  const [storyPointCount,  setStoryPointCount] = useState(0)

  const resizeCanvas = useCallback(() => {
    let ww = window.innerWidth - 3
    let wh = window.innerHeight - 3
    canvas.width = ww
    canvas.height = wh
  }, [canvas])

  window.addEventListener('resize', () => {
    if (!canvas) return 
    resizeCanvas()
  })

  const onResetCanvas = useCallback(() => {
    openConfirm('確認', '是否清除畫布?', () => {
      setStoryPointAry((prev) => {
        for(let i = 0; i < storyPointCount; i++) {
          prev.pop()
        }
        return prev
      })
      setStoryPointCount(0)
    })
  }, [storyPointCount])

  const onPrevious = useCallback(() => {
    setStoryPointAry((prev) => {
      prev.pop()
      return prev
    })

    setStoryPointCount((prev) => {
      return prev - 1
    })
  }, [])

  const onOpenPointCode = useCallback(() => {
    openAlert(
      {title: 'Code',
        content: (<div className={styles.pintCodeList}>
          <p>{'ctx.beginPath()'}</p>
          <div>
            {storyPointAry.map((cur, index) => ((index === 0)? 
              (<p key={index}>{`ctx.moveTo(${cur.x}, ${cur.y})`}</p>) : (<p key={index}>{`ctx.lineTo(${cur.x}, ${cur.y})`}</p>))
            )}
          </div>
          <p>{'ctx.strokeStyle = "#fff"'}</p>
          <p>{'ctx.stroke()'}</p>
        </div>
        )}
    )
  }, [storyPointAry])

  const drawPoint = useCallback(() => {
    ctx.beginPath()
    storyPointAry.forEach((cur, index) => {
      if (index === 0) {
        ctx.moveTo(cur.x, cur.y)
      } else {
        ctx.lineTo(cur.x, cur.y)
      }
      ctx.strokeStyle = '#fff'
      ctx.stroke()  
      ctx.fillStyle= ((index + 1) === storyPointAry.length) ? '#0B57D0' : '#fff'
      ctx.fillRect(cur.x - 5, cur.y - 5, 10, 10)
    })
  }, [ctx, storyPointAry])

  const drawGrid = useCallback(() => {
    let ww = window.innerWidth - 3
    let wh = window.innerHeight - 3

    if (!setting.isShowGrid) return
    ctx.strokeStyle='rgba(255,255,255,0.4)'
    const gridWidth = setting.gridSize
    const gCount = ww / gridWidth
    ctx.beginPath()
    for(let i = 0; i <= gCount; i++) {
      ctx.moveTo(i * gridWidth, -wh)
      ctx.lineTo(i * gridWidth, wh)
      ctx.moveTo(-ww, i * gridWidth)
      ctx.lineTo(ww, i * gridWidth)
    }
    ctx.strokeStyle='rgba(255,255,255,0.4)'
    ctx.stroke()
  }, [ctx, setting])

  const onMouseDown = useCallback((evt) => {
    if (useTool[penIndex]) {
      setStoryPointAry((prev) => {
        prev.push({
          x: evt.x,
          y: evt.y,
        })
        return prev
      })
      setStoryPointCount(prev => prev + 1)
    }
  }, [useTool])

  useEffect(() => {
    if (!canvas) return
    canvas.addEventListener('mousedown', onMouseDown)
    return () => canvas.removeEventListener('mousedown', onMouseDown)
    // canvas.addEventListener('mousemove', (evt) => {})
    // canvas.addEventListener('mouseup', (evt) => {})
  }, [onMouseDown])


  const paint = useCallback(() => {
    let ww = window.innerWidth - 3
    let wh = window.innerHeight - 3

    ctx.clearRect(0, 0, ww, wh)

    // 填滿背景色
    // const grd = ctx.createLinearGradient(ww / 2,0,ww / 2,wh)
    // grd.addColorStop(0,'black')
    // grd.addColorStop(1,'#3F424E')
    ctx.fillStyle = '#000'
    ctx.fillRect(0,0,ww,wh)

    // 繪製網格背景
    drawGrid()

    // 鋼筆工具效果
    drawPoint()
  }, [drawPoint])

  const onCancel = useCallback(() => {
    const useToolAry = useTool.map(() => false)
    setUseTool(useToolAry)
    closeDialogs()
    paint()
  }, [useTool, setting, paint])

  useEffect(() => {
    if (!ctx) return
    resizeCanvas()
    paint()
  }, [ctx])

  const initCanvas = useCallback(() => {
    const myCanvas = document.getElementById('myCanvas')
    setCanvas(myCanvas)
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    setCtx(ctx)
  }, [canvas])

  useEffect(() => {
    initCanvas()
  }, [canvas])

  const onHandleClick = useCallback((index) => {
    const useToolAry = useTool.map(() => false)
    useToolAry[index] = true
    setUseTool(useToolAry)

    if (settingIndex === index) {
      openForm({
        title: '設定',
        content: (
          <SettingView
            setting={setting}
            setSetting={setSetting}
            onCancel={onCancel}
          />),
      })
    }
  }, [useTool, setting, setSetting, onCancel])

  useEffect(() => {
    closeDialogs()
  }, [])

  return (
    <div className={styles.paintTool}>
      <canvas className={styles.canvas} id='myCanvas' />
      <div className={styles.toolBox}>
        <div className={styles.tool}>
          <Tooltip title={'鋼筆'} placement="right">
            <IconButton size="medium" onClick={() => onHandleClick(penIndex)} className={clsx(useTool[penIndex] && styles.use)}>
              <LinearScaleIcon />
            </IconButton >
          </Tooltip>
          <Collapse in={useTool[0]}>  
            <MenuList>
              <MenuItem onClick={onPrevious} className={styles.toolBtn}>
                <CallMissedIcon fontSize="small" />
                <p className={styles.btnText}>{'上一步'}</p>
              </MenuItem>
              <MenuItem onClick={onOpenPointCode} className={styles.toolBtn}>
                <CodeIcon fontSize="small" />
                <p className={styles.btnText}>{'轉成程式碼'}</p>
              </MenuItem>
              <MenuItem onClick={onResetCanvas} className={styles.toolBtn}>
                <HighlightOffIcon fontSize="small" />
                <p className={styles.btnText}>{'清除畫面'}</p>
              </MenuItem>
              <Divider />
            </MenuList >
          </Collapse>
        </div>
        <div className={styles.tool}>
          <Tooltip title={'設定'} placement="right">
            <IconButton size="medium"onClick={() => onHandleClick(settingIndex)} className={clsx(useTool[settingIndex] && styles.use)}>
              <SettingsIcon />
            </IconButton >
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default PaintTool
