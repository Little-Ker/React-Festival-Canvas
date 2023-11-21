import React, {
  useState, useCallback, useEffect, useMemo, useRef
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
  openAlert, openConfirm, closeDialogs  
} from 'component/dialog'
import CallMissedIcon from '@mui/icons-material/CallMissed'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import clsx from 'clsx'

function PaintTool() {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)

  const [useTool, setUseTool] = useState([false, false])

  const [setting, setSetting] = useState({
    gridSize: 250,
    FPS: 50,
    isShowGrid: true,
  })

  const [storyPointAry, setStoryPointAry] = useState([])
  const [storyPointCount,  setStoryPointCount] = useState(0)

  const globalControl = {
    storyPointAry: [],
  }

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

  const clearArray = useCallback(() => {
    openConfirm('確認是否清除畫布?', () => {
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
  }, [globalControl.storyPointAry])

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

  const onMouseDown = useCallback((evt) => {
    setStoryPointAry((prev) => {
      prev.push({
        x: evt.x,
        y: evt.y,
      })
      return prev
    })

    setStoryPointCount(prev => prev + 1)
  }, [useTool])

  useEffect(() => {
    if (!canvas) return
    canvas.addEventListener('mousedown', onMouseDown)

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

    // 鋼筆工具效果
    drawPoint()
  }, [drawPoint, globalControl.storyPointAry])

  useEffect(() => {
    if (!ctx) return
    resizeCanvas()

    setInterval(paint, setting.FPS)
    // paint()
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
  }, [useTool])

  useEffect(() => {
    closeDialogs()
  }, [])

  return (
    <div className={styles.paintTool}>
      <canvas className={styles.canvas} id='myCanvas' />
      <div className={styles.toolBox}>
        <div className={styles.tool}>
          <Tooltip title={'鋼筆'} placement="right">
            <IconButton size="medium" onClick={() => onHandleClick(0)} className={clsx(useTool[0] && styles.use)}>
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
              <MenuItem onClick={clearArray} className={styles.toolBtn}>
                <HighlightOffIcon fontSize="small" />
                <p className={styles.btnText}>{'清除畫面'}</p>
              </MenuItem>
              <Divider />
            </MenuList >
          </Collapse>
        </div>
        <div className={styles.tool}>
          <Tooltip title={'設定'} placement="right">
            <IconButton size="medium"onClick={() => onHandleClick(1)} className={clsx(useTool[1] && styles.use)}>
              <SettingsIcon />
            </IconButton >
          </Tooltip>
        </div>
      </div>
    </div>
  )
}

export default PaintTool
