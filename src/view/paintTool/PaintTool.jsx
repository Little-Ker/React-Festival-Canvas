import React, {
  useState, useCallback, useEffect, useRef, useMemo
} from 'react'
import styles from './paintTool.module.sass'
import {
  SketchPicker 
} from 'react-color'
import rgbHex from 'rgb-hex'
import {
  Popper, ClickAwayListener, Collapse, Tooltip, IconButton, MenuList, MenuItem, Divider
} from '@mui/material'
import Slider from '@mui/material/Slider'
import {
  LinearScale, Code, HighlightOff, Settings, Interests, CallMissed, HorizontalRule, FormatSize, 
  Draw, Title, CropSquare, PanoramaFishEye, ColorLens, InsertPhoto, AddPhotoAlternate, CleaningServices,
  Crop, SaveAlt
} from '@mui/icons-material'
import {
  openAlert, openConfirm, closeDialogs, openForm
} from 'component/dialog'
import SettingView from './sub/settingView'
import CodeView from './sub/codeView'
import UploadPhoto from './sub/uploadPhoto'
import clsx from 'clsx'

const pointIndex = 0
const penIndex = 1
const eraserIndex = 2
const shapeIndex = 3
const createLineIndex = 4
const createRectIndex = 5
const createCircleIndex = 6
const textIndex = 7
const textSizeIndex = 8
const photoIndex = 9
const addPhotoIndex = 10
const editPhotoIndex = 11

const settingIndex = 12

const titlesList = {
  pen: '繪筆',
  point: '鋼筆',
  shape: '形狀',
  text: '文字',
  photo: '圖片',
}

function PaintTool() {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)

  // 顏色選擇
  const [anchorColorEl, setAnchorColorEl] = useState(null)
  const [openColorPick, setOpenColorPick] = useState(false)
  const [chooseColor, setChooseColor] = useState('#fff')

  // 字體大小
  const [anchorFontSizeEl, setAnchorFontSizeEl] = useState(null)
  const [openFontSize, setOpenFontSize] = useState(false)
  const [fontSize, setFontSize] = useState(30)

  const inputRef = useRef(null)
  const isInputText = useRef(false)
  const [storyMousePos, setStoryMousePos] = useState({
    x: 0,
    y: 0,
  })

  const defaultUseToolAry = useMemo(() => [...Array(settingIndex).keys()].map(() => false), [])
  const [useTool, setUseTool] = useState(defaultUseToolAry)

  const [setting, setSetting] = useState({
    isShowGrid: true,
    gridSize: 250,
  })

  const zoom = [0.2, 0.4, 0.6, 0.8, 1, 1.2, 1.4, 1.6, 1.8, 2]

  const isMouseDown = useRef(false)
  const chooseImgIndex = useRef(null)

  // 繪筆工具
  const [storyPenAry, setStoryPenAry] = useState([])
  const [storyPenCount,  setStoryPenCount] = useState(0)

  // 鋼筆工具
  const [storyPointAry, setStoryPointAry] = useState([])
  const [storyPointCount,  setStoryPointCount] = useState(0)

  // 形狀工具
  const [storyShapeAry, setStoryShapeAry] = useState([])
  const [storyShapeCount,  setStoryShapeCount] = useState(0)

  // 文字工具
  const [storyTextAry, setStoryTextAry] = useState([])
  const [storyTextCount,  setStoryTextCount] = useState(0)

  // 圖片工具
  const [storyPhotoAry, setStoryPhotoAry] = useState([])
  const [storyPhotoCount, setStoryPhotoCount] = useState(0)

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
    const gridWidth = setting.gridSize
    const gCount = ww / gridWidth
    ctx.beginPath()
    for(let i = 0; i <= gCount; i++) {
      ctx.moveTo(i * gridWidth, -wh)
      ctx.lineTo(i * gridWidth, wh)
      ctx.moveTo(-ww, i * gridWidth)
      ctx.lineTo(ww, i * gridWidth)
    }
    ctx.strokeStyle='rgba(255,255,255,0.2)'
    ctx.stroke()
  }, [ctx, setting])

  const drawShape = useCallback(() => {
    storyShapeAry.forEach((cur, index) => {
      ctx.strokeStyle = cur.color
      if (cur.type === 'rect') ctx.strokeRect(cur.x, cur.y, cur.width, cur.height)
      if (cur.type === 'line') {
        ctx.beginPath()
        ctx.moveTo(cur.x, cur.y)
        ctx.lineTo(cur.finalX, cur.finalY)
        ctx.stroke() 
      }
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

  const drawPen = useCallback(() => {
    ctx.beginPath()
    storyPenAry.forEach((cur, index) => {
      ctx.fillStyle = cur.color
      ctx.beginPath()
      ctx.arc(cur.x, cur.y, 5, 0, 2 * Math.PI)
      ctx.fill()
    })
  }, [ctx, storyPointAry]) 

  const drawPhoto = useCallback(() => {
    storyPhotoAry.forEach((cur, index) => {
      const width = cur.width * zoom[cur.scaleIndex]
      const height = cur.height * zoom[cur.scaleIndex]
      ctx.drawImage(cur.img, cur.x - (width / 2), cur.y - (height / 2), width, height)
      if (index === chooseImgIndex.current) {
        ctx.strokeStyle = ((storyPhotoCount - 1) === index) ? '#f00' : '#fff'
        ctx.strokeRect(cur.x - width / 2, cur.y - height / 2, width, height)
        ctx.stroke()
      }
    })
  }, [ctx, storyPhotoAry, chooseImgIndex, useTool, editPhotoIndex, storyPhotoCount])

  const drawText = useCallback(() => {
    storyTextAry.forEach((cur) => {
      ctx.font = `${cur.size}px Arial`
      ctx.fillStyle = cur.color
      ctx.fillText(cur.text, cur.x, cur.y)
    })
  }, [ctx, storyTextAry])

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

    // 繪筆效果
    drawPen()

    // 圖片效果
    drawPhoto()

    // 文字效果
    drawText()
  }, [drawPoint, drawShape, drawPen, drawPhoto, drawText])

  const resizeCanvas = useCallback(() => {
    let ww = window.innerWidth - 3
    let wh = window.innerHeight - 3
    canvas.width = ww
    canvas.height = wh
    if (!ctx) return
    paint()
  }, [canvas, paint, ctx])

  window.addEventListener('resize', () => {
    if (!canvas) return 
    resizeCanvas()
  })

  const handleTextEnter = useCallback((event,value, point) => {
    const keyCode = event?.keyCode
    if ((event && keyCode !== 13) || (event && keyCode === 13 && value === '')) return
    setStoryTextAry((prev) => {
      prev.push({
        x: point.x + 0,
        y: point.y + fontSize - (fontSize / 4),
        text: value,
        size: fontSize,
        color: chooseColor,
      })
      return prev
    })
    setStoryTextCount(prev => prev + 1)
    inputRef.current.value = ''
    isInputText.current = false
    inputRef.current.style.display = 'none'
    paint()
  }, [chooseColor, fontSize, paint, inputRef, isInputText])

  const addTextInput = useCallback((point) => {
    inputRef.current.style.display = 'block'
    inputRef.current.style.color = chooseColor
    inputRef.current.style.left = `${point.x - 15}px`
    inputRef.current.style.top = `${point.y - 20}px`
    inputRef.current.style.fontSize = `${fontSize}px`
    inputRef.current.onkeydown = event => handleTextEnter(event, inputRef.current.value, point)
  }, [fontSize, chooseColor, handleTextEnter, inputRef])

  const onMouseDown = useCallback((evt) => {
    // 鋼筆工具
    if (useTool[pointIndex]) {
      setStoryPointAry((prev) => {
        prev.push({
          x: evt.x,
          y: evt.y,
        })
        return prev
      })
      setStoryPointCount(prev => prev + 1)
    }
    if (!isMouseDown.current) {
      isMouseDown.current = true
      // 直線
      if (useTool[createLineIndex]) {
        setStoryShapeAry((prev) => {
          prev[storyShapeCount] = {
            type: 'line',
            x: evt.x,
            y: evt.y,
            finalX: evt.x + 3,
            finalY: evt.y + 3,
            color: chooseColor,
          }
          return prev
        })
      }
      // 矩形
      if (useTool[createRectIndex]) {
        setStoryShapeAry((prev) => {
          prev[storyShapeCount] = {
            type: 'rect',
            x: evt.x,
            y: evt.y,
            width: 10,
            height: 10,
            color: chooseColor,
          }
          return prev
        })
      }
      // 圓形
      if (useTool[createCircleIndex]) {
        setStoryShapeAry((prev) => {
          prev[storyShapeCount] = {
            type: 'circle',
            x: evt.x,
            y: evt.y,
            r: 10,
            getXDir: true,
            getYDir: true,
            color: chooseColor,
          }
          return prev
        })
      }
      // 編輯圖片
      if (useTool[editPhotoIndex]) {
        storyPhotoAry.forEach((cur, index) => {
          const mouseX = evt.x
          const imgX = cur.x
          const width = cur.width * zoom[cur.scaleIndex] / 2
          const mouseY = evt.y
          const imgY = cur.y
          const height = cur.height * zoom[cur.scaleIndex] / 2
          if ((mouseX > imgX - width) && (mouseX < imgX + width) && 
          (mouseY > imgY - height) && (mouseY < imgY + height)) {
            chooseImgIndex.current = index
          }
        })
      }
      // 繪筆
      if (useTool[penIndex] && !useTool[eraserIndex]) {
        // console.log('useTool[eraserIndex]',useTool[eraserIndex])
        setStoryPenAry((prev) => {
          prev.push({
            x: evt.x,
            y: evt.y,
            color: chooseColor,
            // getXDir: true,
            // getYDir: true,
          })
          // prev[storyPenCount] = {
          //   x: evt.x,
          //   y: evt.y,
          //   // color: 10,
          //   // getXDir: true,
          //   // getYDir: true,
          // }
          return prev
        })
        // setStoryPenCount(prev => prev + 1)
      }
      // 橡皮擦
      if (useTool[eraserIndex]) {
        setStoryPenAry((prev, index) => {
          const ary = prev.filter((cur) => {
            return !((cur.x <=  evt.x) && (cur.x >=  evt.x) && (cur.y >=  evt.y) && (cur.y >=  evt.y))
          })
          // ary.forEach((cur, index2) => {
          //   if ((cur.x <=  evt.x) && (cur.x >=  evt.x) && (cur.y >=  evt.y) && (cur.y >=  evt.y)) {
          //     prev.splice(index2, 1)
          //   }
          // })
          return ary
        })
      }
      // 文字
      if (useTool[textIndex]) {
        if (!isInputText.current) {
          addTextInput(evt)
          isInputText.current = true
          setStoryMousePos((prev) => {
            prev.x = evt.x
            prev.y = evt.y
            return prev
          })
        } else if (isInputText.current && inputRef.current.value !== '') {
          handleTextEnter(null, inputRef.current.value, storyMousePos)
        }
      }
    }
    paint()
  }, [useTool, isMouseDown.current, createRectIndex, storyShapeCount, paint, chooseColor, inputRef, storyMousePos])

  const onMousemove = useCallback((evt) => {
    if (isMouseDown.current) {
      if (useTool[createRectIndex]) {
        setStoryShapeAry((prev) => {
          prev[storyShapeCount] = {
            type: 'rect',
            x: prev[storyShapeCount].x,
            y: prev[storyShapeCount].y,
            width: evt.x - prev[storyShapeCount].x,
            height: evt.y - prev[storyShapeCount].y,
            color: chooseColor,
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
            color: chooseColor,
          }
          return prev
        })
      }
      if (useTool[createLineIndex]) {
        setStoryShapeAry((prev) => {
          prev[storyShapeCount] = {
            type: 'line',
            x: prev[storyShapeCount].x,
            y: prev[storyShapeCount].y,
            finalX: evt.x,
            finalY: evt.y,
            color: chooseColor,
          }
          return prev
        })
      }
      if (useTool[editPhotoIndex] && chooseImgIndex.current !== null) {
        setStoryPhotoAry((prev) => {
          prev[chooseImgIndex.current].x = evt.x
          prev[chooseImgIndex.current].y = evt.y
          return prev
        })
      }
      if (useTool[penIndex] && !useTool[eraserIndex]) {
        setStoryPenAry((prev) => {
          prev.push({
            x: evt.x,
            y: evt.y,
            color: chooseColor,
            // color: 10,
            // getXDir: true,
            // getYDir: true,
          })
          // prev[storyPenCount] = {
          //   x: evt.x,
          //   y: evt.y,
          //   // color: 10,
          //   // getXDir: true,
          //   // getYDir: true,
          // }
          return prev
        })
        // setStoryPenCount(prev => prev + 1)
      }
      // 橡皮擦
      if (useTool[eraserIndex]) {
        setStoryPenAry((prev, index) => {
          const ary = [...prev]
          ary.forEach((cur, index2) => {
            if ((cur.x <=  evt.x) && (cur.x >=  evt.x) && (cur.y >=  evt.y) && (cur.y >=  evt.y)) {
              prev.splice(index2, 1)
            }
          })
          
   
          return prev
        })
      }
    }
    paint()
  }, [isMouseDown.current, storyShapeCount, setStoryShapeAry, useTool, chooseImgIndex.current, paint, chooseColor])

  const onMouseup = useCallback((evt) => {
    if (isMouseDown.current && useTool[shapeIndex]) {
      if (useTool[createRectIndex]) {
        setStoryShapeAry((prev) => {
          const getWidth = evt.x - prev[storyShapeCount].x
          const getHeight = evt.y - prev[storyShapeCount].y
          prev[storyShapeCount] = {
            type: 'rect',
            x: prev[storyShapeCount].x,
            y: prev[storyShapeCount].y,
            width: (Math.abs(getWidth) > 10) ? getWidth : 10,
            height: (Math.abs(getHeight) > 10) ? getHeight : 10,
            color: chooseColor,
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
            color: chooseColor,
          }
          return prev
        })
      }
      if (useTool[createLineIndex]) {
        setStoryShapeAry((prev) => {
          prev[storyShapeCount] = {
            type: 'line',
            x: prev[storyShapeCount].x,
            y: prev[storyShapeCount].y,
            finalX: evt.x,
            finalY: evt.y,
            color: chooseColor,
          }
          return prev
        })
      }
      setStoryShapeCount(prev => prev + 1)
    }
    isMouseDown.current = false
    paint()
  }, [useTool, createRectIndex, isMouseDown.current, storyShapeCount, paint, chooseColor])

  const onMousewheel = useCallback((evt) => {
    if (useTool[editPhotoIndex] && chooseImgIndex.current !== null) {
      setStoryPhotoAry((prev) => {
        let scaleIndex = prev[chooseImgIndex.current].scaleIndex
        let wheelDelta = evt.wheelDelta
        if (wheelDelta > 0) {
          if (scaleIndex + 1 < zoom.length) {
            scaleIndex += 1
          } else {
            scaleIndex = zoom.length - 1
          }
        } else {
          if (scaleIndex - 1 >= 0) {
            scaleIndex -= 1
          } else {
            scaleIndex = 0
          }
        }
        prev[chooseImgIndex.current].scaleIndex = scaleIndex
        return prev
      })
    }
    paint()
  }, [chooseImgIndex.current, useTool, paint, editPhotoIndex])

  const onPrevious = useCallback((storyAryFn, storyCountFn, count) => {
    if (count <= 0) return
    storyAryFn((prev) => {
      prev.pop()
      return prev
    })
    storyCountFn((prev) => {
      return prev - 1
    })
    paint()
  }, [paint])

  const onOpenCode = useCallback((type, codeAry) => {
    openAlert(
      {title: `【${titlesList[type]}】Code`,
        content: (
          <CodeView type={type} codeAry={codeAry} zoom={zoom} />
        )}
    )
  }, [zoom])

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

  useEffect(() => {
    if (!canvas) return
    canvas.addEventListener('mousewheel', onMousewheel)
    return () => canvas.removeEventListener('mousewheel', onMousewheel)
  }, [onMousewheel])

  const onChooseImgIndex = useCallback((index) => {
    chooseImgIndex.current = index
  }, [])

  const onCancel = useCallback((mainIndex, subIndex) => {
    const useToolAry = useTool.map(() => false)
    if (mainIndex) useToolAry[mainIndex] = true
    if (subIndex) useToolAry[subIndex] = true

    setUseTool(useToolAry)
    closeDialogs()
    paint()
  }, [useTool, paint])

  const onCreateBtn = useCallback((mainIndex, subIndex) => {
    isMouseDown.current = false
    const useToolAry = useTool.map(() => false)
    useToolAry[mainIndex] = true
    useToolAry[subIndex] = true
    setUseTool(useToolAry)
    chooseImgIndex.current = null

    if (addPhotoIndex === subIndex) {
      openForm({
        title: '新增圖片',
        content: (
          <UploadPhoto
            storyPhotoAry={storyPhotoAry}
            setStoryPhotoAry={setStoryPhotoAry}
            onCancel={() => onCancel(photoIndex, editPhotoIndex)}
            onChooseImgIndex={onChooseImgIndex}
            setStoryPhotoCount={setStoryPhotoCount}
          />),
      })
    }
  }, [useTool, isMouseDown.current, photoIndex, editPhotoIndex, onChooseImgIndex, storyPhotoAry])

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

      setStoryPhotoAry((prev) => {
        for(let i = 0; i < storyPhotoCount; i++) {
          prev.pop()
        }
        return prev
      })
      setStoryPhotoCount(0)
      paint()
    })
  }, [storyPointCount, storyShapeCount, storyPhotoCount,  paint])

  useEffect(() => {
    if (!ctx) return
    resizeCanvas()
    paint()
    // setInterval(paint, 50)
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

  const handleColorClick = useCallback((event) => {
    setAnchorColorEl(event.currentTarget)
    setOpenColorPick(true)
  }, [])

  const handleFontSizeClick = useCallback((event) => {
    setAnchorFontSizeEl(event.currentTarget)
    setOpenFontSize(true)
    onCreateBtn(textIndex, textSizeIndex)
  }, [textIndex, textSizeIndex])

  const handleColorClose = useCallback(() => {
    setAnchorColorEl(null)
    setOpenColorPick(false)
  }, [])

  const handleFontSizeClose = useCallback(() => {
    setAnchorFontSizeEl(null)
    setOpenFontSize(false)
  }, [])

  const onDownloadCanvas = useCallback(() => {
    const canvas = document.querySelector('#myCanvas')

    const el = document.createElement('a')
    el.href = canvas.toDataURL()
    el.download = 'image'
  
    const event = new MouseEvent('click')
    el.dispatchEvent(event)
  }, [])

  useEffect(() => {
    closeDialogs()
  }, [])

  return (
    <div className={styles.paintTool}>
      <canvas className={styles.canvas} id='myCanvas' />
      <div className={styles.toolBox}>
        <div className={styles.tool}>
          <Tooltip title={titlesList.pen} placement="right">
            <IconButton size="medium" onClick={() => onHandleClick(penIndex)} className={clsx(useTool[penIndex] && styles.use)}>
              <Draw />
            </IconButton >
          </Tooltip>
          <Collapse in={useTool[penIndex]}>  
            <MenuList>
              <MenuItem onClick={() => onCreateBtn(penIndex, eraserIndex)} className={clsx(styles.toolBtn, useTool[eraserIndex] && styles.useCreate)}>
                <CleaningServices fontSize="small" />
                <p className={styles.btnText}>{'橡皮擦'}</p>
              </MenuItem>
              <MenuItem onClick={() => onOpenCode('pen', storyPointAry)} className={styles.toolBtn}>
                <Code fontSize="small" />
                <p className={styles.btnText}>{'轉成程式碼'}</p>
              </MenuItem>
              <Divider />
            </MenuList >
          </Collapse>
        </div>
        <div className={styles.tool}>
          <Tooltip title={titlesList.point} placement="right">
            <IconButton size="medium" onClick={() => onHandleClick(pointIndex)} className={clsx(useTool[pointIndex] && styles.use)}>
              <LinearScale />
            </IconButton >
          </Tooltip>
          <Collapse in={useTool[pointIndex]}>  
            <MenuList>
              <MenuItem onClick={() => onPrevious(setStoryPointAry, setStoryPointCount, storyPointCount)} className={styles.toolBtn}>
                <CallMissed fontSize="small" />
                <p className={styles.btnText}>{'上一步'}</p>
              </MenuItem>
              <MenuItem onClick={() => onOpenCode('point', storyPointAry)} className={styles.toolBtn}>
                <Code fontSize="small" />
                <p className={styles.btnText}>{'轉成程式碼'}</p>
              </MenuItem>
              <Divider />
            </MenuList >
          </Collapse>
        </div>
        <div className={styles.tool}>
          <Tooltip title={titlesList.shape} placement="right">
            <IconButton size="medium" onClick={() => onHandleClick(shapeIndex)} className={clsx(useTool[shapeIndex] && styles.use)}>
              <Interests />
            </IconButton >
          </Tooltip>
          <Collapse in={useTool[shapeIndex]}>  
            <MenuList>
              <MenuItem onClick={() => onCreateBtn(shapeIndex, createLineIndex)} className={clsx(styles.toolBtn, useTool[createLineIndex] && styles.useCreate)}>
                <HorizontalRule fontSize="small" />
                <p className={styles.btnText}>{'製作直線'}</p>
              </MenuItem>
              <MenuItem onClick={() => onCreateBtn(shapeIndex, createRectIndex)} className={clsx(styles.toolBtn, useTool[createRectIndex] && styles.useCreate)}>
                <CropSquare fontSize="small" />
                <p className={styles.btnText}>{'製作矩形'}</p>
              </MenuItem>
              <MenuItem onClick={() => onCreateBtn(shapeIndex, createCircleIndex)} className={clsx(styles.toolBtn, useTool[createCircleIndex] && styles.useCreate)}>
                <PanoramaFishEye fontSize="small" />
                <p className={styles.btnText}>{'製作圓形'}</p>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => onPrevious(setStoryShapeAry, setStoryShapeCount, storyShapeCount)} className={styles.toolBtn}>
                <CallMissed fontSize="small" />
                <p className={styles.btnText}>{'上一步'}</p>
              </MenuItem>
              <MenuItem onClick={() => onOpenCode('shape', storyShapeAry)} className={styles.toolBtn}>
                <Code fontSize="small" />
                <p className={styles.btnText}>{'轉成程式碼'}</p>
              </MenuItem>
              <Divider />
            </MenuList >
          </Collapse>
        </div>
        <div className={styles.tool}>
          <Tooltip title={titlesList.text} placement="right">
            <IconButton size="medium" onClick={() => onHandleClick(textIndex)} className={clsx(useTool[textIndex] && styles.use)}>
              <Title />
            </IconButton >
          </Tooltip>
          <Collapse in={useTool[textIndex]}>  
            <MenuList>
              <MenuItem onClick={handleFontSizeClick} className={clsx(styles.toolBtn, useTool[textSizeIndex] && styles.useCreate)}>
                <FormatSize fontSize="small" />
                <p className={styles.btnText}>{'文字大小'}</p>
                <Popper open={openFontSize} anchorEl={anchorFontSizeEl} disablePortal>
                  <ClickAwayListener onClickAway={handleFontSizeClose}>
                    <div className={styles.fontSizePicker}>
                      <Slider
                        value={fontSize}
                        onChange={(e, n) => setFontSize(n)}
                        valueLabelDisplay="auto"
                        min={20}
                        max={100}
                      />
                      <p className={styles.fontSize}>{fontSize}</p>
                    </div>
                  </ClickAwayListener>
                </Popper>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => onPrevious(setStoryTextAry, setStoryTextCount, storyTextCount)} className={styles.toolBtn}>
                <CallMissed fontSize="small" />
                <p className={styles.btnText}>{'上一步'}</p>
              </MenuItem>
              <MenuItem onClick={() => onOpenCode('text', storyTextAry)} className={styles.toolBtn}>
                <Code fontSize="small" />
                <p className={styles.btnText}>{'轉成程式碼'}</p>
              </MenuItem>
              <Divider />
            </MenuList >
          </Collapse>
        </div>
        <div className={styles.tool}>
          <Tooltip title={titlesList.photo} placement="right">
            <IconButton size="medium" onClick={() => onHandleClick(photoIndex)} className={clsx(useTool[photoIndex] && styles.use)}>
              <InsertPhoto />
            </IconButton >
          </Tooltip>
          <Collapse in={useTool[photoIndex]}>  
            <MenuList>
              <MenuItem onClick={() => onCreateBtn(photoIndex, addPhotoIndex)} className={clsx(styles.toolBtn, useTool[addPhotoIndex] && styles.useCreate)}>
                <AddPhotoAlternate fontSize="small" />
                <p className={styles.btnText}>{'新增圖片'}</p>
              </MenuItem>
              <MenuItem onClick={() => onCreateBtn(photoIndex, editPhotoIndex)} className={clsx(styles.toolBtn, useTool[editPhotoIndex] && styles.useCreate)}>
                <Crop fontSize="small" />
                <p className={styles.btnText}>{'編輯圖片'}</p>
              </MenuItem>
              <Divider />
              <MenuItem onClick={() => onPrevious(setStoryPhotoAry, setStoryPhotoCount, storyPhotoCount)} className={styles.toolBtn}>
                <CallMissed fontSize="small" />
                <p className={styles.btnText}>{'上一步'}</p>
              </MenuItem>
              <MenuItem onClick={() => onOpenCode('photo', storyPhotoAry)} className={styles.toolBtn}>
                <Code fontSize="small" />
                <p className={styles.btnText}>{'轉成程式碼'}</p>
              </MenuItem>
              <Divider />
            </MenuList >
          </Collapse>
        </div>
        <div className={styles.tool}>
          <Tooltip title={'顏色選擇'} placement="right">
            <IconButton size="medium" onClick={handleColorClick} sx={{backgroundColor: `${chooseColor} !important` }} className={styles.chooseColor}>
              <ColorLens />
            </IconButton >
          </Tooltip>
          <Popper open={openColorPick} anchorEl={anchorColorEl} disablePortal>
            <ClickAwayListener onClickAway={handleColorClose}>
              <div className={styles.colorPicker}>
                <SketchPicker color={chooseColor} onChange={c => setChooseColor(`#${rgbHex(c.rgb.r, c.rgb.g, c.rgb.b, c.rgb.a)}`)} />
              </div>
            </ClickAwayListener>
          </Popper>
        </div>
        <div className={styles.tool}>
          <Tooltip title={'清除畫布'} placement="right">
            <IconButton size="medium"onClick={onResetCanvas} className={clsx(useTool[settingIndex] && styles.use)}>
              <HighlightOff />
            </IconButton >
          </Tooltip>
        </div>   
        <div className={styles.tool}>
          <Tooltip title={'畫布下載'} placement="right">
            <IconButton size="medium" onClick={onDownloadCanvas} className={clsx(useTool[settingIndex] && styles.use)}>
              <SaveAlt />
            </IconButton >
          </Tooltip>
        </div>    
        <div className={styles.tool}>
          <Tooltip title={'設定'} placement="right">
            <IconButton size="medium"onClick={() => onHandleClick(settingIndex)} className={clsx(useTool[settingIndex] && styles.use)}>
              <Settings />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      <input type="text" ref={inputRef} className={styles.input} />
    </div>
  )
}

export default PaintTool
