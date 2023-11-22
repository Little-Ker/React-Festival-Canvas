import React, {
  useState, useCallback, useEffect, useRef
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
import InterestsIcon from '@mui/icons-material/Interests'
import CallMissedIcon from '@mui/icons-material/CallMissed'
import HorizontalRuleIcon from '@mui/icons-material/HorizontalRule'
import CreateIcon from '@mui/icons-material/Create'
import TitleIcon from '@mui/icons-material/Title'
import CropSquareIcon from '@mui/icons-material/CropSquare'
import PanoramaFishEyeIcon from '@mui/icons-material/PanoramaFishEye'
import MenuList from '@mui/material/MenuList'
import MenuItem from '@mui/material/MenuItem'
import Divider from '@mui/material/Divider'
import SettingView from './sub/settingView'
import clsx from 'clsx'

const penIndex = 0
const paintPenIndex = 1
const shapeIndex = 2
const createLineIndex = 3
const createReactIndex = 4
const createCircleIndex = 5
const TextIndex = 6

const settingIndex = 7

function PaintTool() {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)

  const [useTool, setUseTool] = useState([false, false, false, false, false, false, false])

  const [setting, setSetting] = useState({
    isShowGrid: true,
    gridSize: 250,
  })

  const isMouseDown = useRef(false)

  // 鋼筆工具
  const [storyPointAry, setStoryPointAry] = useState([])
  const [storyPointCount,  setStoryPointCount] = useState(0)

  // 形狀工具
  const [storyShapeAry, setStoryShapeAry] = useState([])
  const [storyShapeCount,  setStoryShapeCount] = useState(0)

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

      setStoryShapeAry((prev) => {
        for(let i = 0; i < storyShapeCount; i++) {
          prev.pop()
        }
        return prev
      })
      setStoryShapeCount(0)
    })
  }, [storyPointCount, storyShapeCount])

  const onPrevious = useCallback((storyAryFn, storyCountFn, count) => {
    if (count <= 0) return
    storyAryFn((prev) => {
      prev.pop()
      return prev
    })
    storyCountFn((prev) => {
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

  const drawShape = useCallback(() => {
    storyShapeAry.forEach((cur, index) => {
      ctx.strokeStyle = ((index + 1) === storyShapeAry.length) ? '#f00': '#fff'
      if (cur.type === 'rect') ctx.strokeRect(cur.x, cur.y, cur.width, cur.height)
      if (cur.type === 'circle') {
        ctx.save()
        ctx.translate((cur.r / 4) * ((cur.getXDir) ? 1 : -1), (cur.r / 4) * ((cur.getYDir) ? 1 : -1))
        ctx.beginPath()
        ctx.arc(cur.x, cur.y, Math.abs(cur.r - (cur.r / 2)) / 2, 0, 2 * Math.PI)
        ctx.stroke()
        ctx.restore()
      }
    })
  }, [ctx, storyShapeAry])

  const paint = useCallback(() => {
    let ww = window.innerWidth - 3
    let wh = window.innerHeight - 3

    ctx.clearRect(0, 0, ww, wh)

    // 填滿背景色
    ctx.fillStyle = '#000'
    ctx.fillRect(0,0,ww,wh)

    // 繪製網格背景
    drawGrid()

    // 鋼筆工具效果
    drawPoint()

    // 形狀效果
    drawShape()
  }, [drawPoint])

  const onMouseDown = useCallback((evt) => {
    // 鋼筆工具
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

    // 矩形
    if (useTool[createReactIndex] && !isMouseDown.current) {
      isMouseDown.current = true
      setStoryShapeAry((prev) => {
        prev[storyShapeCount] = {
          type: 'rect',
          x: evt.x,
          y: evt.y,
          width: 10,
          height: 10,
        }
        return prev
      })
    }

    // 圓形
    if (useTool[createCircleIndex] && !isMouseDown.current) {
      isMouseDown.current = true
      setStoryShapeAry((prev) => {
        prev[storyShapeCount] = {
          type: 'circle',
          x: evt.x,
          y: evt.y,
          r: 10,
          getXDir: true,
          getYDir: true,
        }
        return prev
      })
    }
  }, [useTool, isMouseDown.current, createReactIndex, storyShapeCount])

  const onMousemove = useCallback((evt) => {
    if (isMouseDown.current) {
      if (useTool[createReactIndex]) {
        setStoryShapeAry((prev) => {
          prev[storyShapeCount] = {
            type: 'rect',
            x: prev[storyShapeCount].x,
            y: prev[storyShapeCount].y,
            width: evt.x - prev[storyShapeCount].x,
            height: evt.y - prev[storyShapeCount].y,
          }
          return prev
        })
      }
      if (useTool[createCircleIndex]) {
        setStoryShapeAry((prev) => {
          const getR = Math.abs(evt.x - prev[storyShapeCount].x) + Math.abs(evt.x - prev[storyShapeCount].x)
          prev[storyShapeCount] = {
            type: 'circle',
            x: prev[storyShapeCount].x,
            y: prev[storyShapeCount].y,
            r: getR,
            getXDir: (evt.x - prev[storyShapeCount].x) > 0,
            getYDir: (evt.y - prev[storyShapeCount].y) > 0,
          }
          return prev
        })
      }
    }
    
  }, [isMouseDown.current, storyShapeCount, setStoryShapeAry])

  const onMouseup = useCallback((evt) => {
    if (isMouseDown.current && useTool[shapeIndex]) {
      if (useTool[createReactIndex]) {
        setStoryShapeAry((prev) => {
          const getWidth = evt.x - prev[storyShapeCount].x
          const getHeight = evt.y - prev[storyShapeCount].y
          prev[storyShapeCount] = {
            type: 'rect',
            x: prev[storyShapeCount].x,
            y: prev[storyShapeCount].y,
            width: (Math.abs(getWidth) > 10) ? getWidth : 10,
            height: (Math.abs(getHeight) > 10) ? getHeight : 10,
          }
          return prev
        })
      }
      if (useTool[createCircleIndex]) {
        setStoryShapeAry((prev) => {
          const getR = Math.abs(evt.x - prev[storyShapeCount].x) + Math.abs(evt.x - prev[storyShapeCount].x)
          prev[storyShapeCount] = {
            type: 'circle',
            x: prev[storyShapeCount].x,
            y: prev[storyShapeCount].y,
            r: (getR > 10) ? getR : 10,
            getXDir: (evt.x - prev[storyShapeCount].x) > 0,
            getYDir: (evt.y - prev[storyShapeCount].y) > 0,
          }
          return prev
        })
      }
      setStoryShapeCount(prev => prev + 1)
      isMouseDown.current = false
    }
  }, [useTool, createReactIndex, isMouseDown.current, storyShapeCount])

  useEffect(() => {
    if (!canvas) return
    canvas.addEventListener('mousedown', onMouseDown)
    return () => canvas.removeEventListener('mousedown', onMouseDown)
  }, [onMouseDown])

  useEffect(() => {
    if (!canvas) return
    canvas.addEventListener('mousemove', onMousemove)
    return () => canvas.removeEventListener('mousemove', onMousemove)
  }, [onMousemove])

  useEffect(() => {
    if (!canvas) return
    canvas.addEventListener('mouseup', onMouseup)
    return () => canvas.removeEventListener('mouseup', onMouseup)
  }, [onMouseup])

  const onCreateShape = useCallback((index) => {
    isMouseDown.current = false
    const useToolAry = useTool.map(() => false)
    useToolAry[shapeIndex] = true
    useToolAry[index] = true
    setUseTool(useToolAry)
  }, [useTool, isMouseDown.current])

  const onCancel = useCallback(() => {
    const useToolAry = useTool.map(() => false)
    setUseTool(useToolAry)
    closeDialogs()
  }, [useTool])

  useEffect(() => {
    if (!ctx) return
    resizeCanvas()
    setInterval(paint, 50)
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
    if(index === shapeIndex) useToolAry[createLineIndex] = true
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
          <Collapse in={useTool[penIndex]}>  
            <MenuList>
              <MenuItem onClick={() => onPrevious(setStoryPointAry, setStoryPointCount, storyPointCount)} className={styles.toolBtn}>
                <CallMissedIcon fontSize="small" />
                <p className={styles.btnText}>{'上一步'}</p>
              </MenuItem>
              <MenuItem onClick={onOpenPointCode} className={styles.toolBtn}>
                <CodeIcon fontSize="small" />
                <p className={styles.btnText}>{'轉成程式碼'}</p>
              </MenuItem>
              <Divider />
            </MenuList >
          </Collapse>
        </div>
        <div className={styles.tool}>
          <Tooltip title={'形狀'} placement="right">
            <IconButton size="medium" onClick={() => onHandleClick(shapeIndex)} className={clsx(useTool[shapeIndex] && styles.use)}>
              <InterestsIcon />
            </IconButton >
          </Tooltip>
          <Collapse in={useTool[shapeIndex]}>  
            <MenuList>
              
              <MenuItem onClick={() => onCreateShape(createLineIndex)} className={clsx(styles.toolBtn, useTool[createLineIndex] && styles.useCreate)}>
                <HorizontalRuleIcon fontSize="small" />
                <p className={styles.btnText}>{'製作直線'}</p>
              </MenuItem>
              <MenuItem onClick={() => onCreateShape(createReactIndex)} className={clsx(styles.toolBtn, useTool[createReactIndex] && styles.useCreate)}>
                <CropSquareIcon fontSize="small" />
                <p className={styles.btnText}>{'製作矩形'}</p>
              </MenuItem>
              <MenuItem onClick={() => onCreateShape(createCircleIndex)} className={clsx(styles.toolBtn, useTool[createCircleIndex] && styles.useCreate)}>
                <PanoramaFishEyeIcon fontSize="small" />
                <p className={styles.btnText}>{'製作圓形'}</p>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => onPrevious(setStoryShapeAry, setStoryShapeCount, storyShapeCount)} className={styles.toolBtn}>
                <CallMissedIcon fontSize="small" />
                <p className={styles.btnText}>{'上一步'}</p>
              </MenuItem>
              <MenuItem onClick={onOpenPointCode} className={styles.toolBtn}>
                <CodeIcon fontSize="small" />
                <p className={styles.btnText}>{'轉成程式碼'}</p>
              </MenuItem>
              <Divider />
            </MenuList >
          </Collapse>
        </div>
        <div className={styles.tool}>
          <Tooltip title={'文字'} placement="right">
            <IconButton size="medium" onClick={() => onHandleClick(TextIndex)} className={clsx(useTool[TextIndex] && styles.use)}>
              <TitleIcon />
            </IconButton >
          </Tooltip>
          <Collapse in={useTool[TextIndex]}>  
            <MenuList>
              <MenuItem onClick={() => onPrevious(setStoryShapeAry, setStoryShapeCount, storyShapeCount)} className={styles.toolBtn}>
                <CallMissedIcon fontSize="small" />
                <p className={styles.btnText}>{'上一步'}</p>
              </MenuItem>
              <MenuItem onClick={onOpenPointCode} className={styles.toolBtn}>
                <CodeIcon fontSize="small" />
                <p className={styles.btnText}>{'轉成程式碼'}</p>
              </MenuItem>
              <Divider />
            </MenuList >
          </Collapse>
        </div>
        <div className={styles.tool}>
          <Tooltip title={'清除畫布'} placement="right">
            <IconButton size="medium"onClick={onResetCanvas} className={clsx(useTool[settingIndex] && styles.use)}>
              <HighlightOffIcon />
            </IconButton >
          </Tooltip>
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
