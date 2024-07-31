import React, {
  useState, useCallback, useEffect
} from 'react'
import styles from './snowView.module.sass'
import snowflake from 'assets/images/snowflake.png'
import bg from 'assets/images/bg.jpg'
import tree1 from 'assets/images/tree1.svg'
import tree2 from 'assets/images/tree1.svg'
import tree3 from 'assets/images/tree1.svg'

function SnowView() {
  const [canvas, setCanvas] = useState(null)
  const [ctx, setCtx] = useState(null)
  const [snowflakeImg, setSnowflakeImg] = useState(null)
  const [treeImg, setTreeImg] = useState(null)

  const getScope = useCallback((value, min, max, newMin, newMax) => {
    const l1 = max - min
    const l2 = newMax - newMin
    const  ratio = l2 / l1
    return (value - min) * ratio + newMin
  }, [])

  const globalControl = {
    angle: 0,
    angleSpeed: 0.01,
    isDragging: false,
    mousePos: {
      x: 0,
      y: 0,
    },
    mouseDownPos: null,

    FPS: 50,
    snowMax: 50,
    snows: [],

    treeMax: 10,
    trees: [],

  }

  let ww = window.innerWidth
  let wh = window.innerHeight

  window.addEventListener('resize', () => {
    if (!canvas) return 
    canvas.width = ww
    canvas.height = wh
  })

  const color = {
    black: '#000',
    bgWhite: '#eee',
    blue: '#036faf',
    gold: '#d3b889',
  }

  const drawTree = useCallback((treeData) => {
    const color = treeData.color
    const pos = treeData.pos
    const width = treeData.width
    const height = treeData.height
    const treeCount = treeData.treeCount
    const treeType = treeData.treeType

    // ctx.save()
    // ctx.translate(500, 500)
    // ctx.rotate(angle * Math.PI / 180)
    // ctx.globalAlpha = opacity

    ctx.save()
    ctx.translate(pos.x, pos.y)
    // ctx.rotate(angle * Math.PI / 180)
    // ctx.globalAlpha = opacity
    ctx.drawImage(treeImg[treeType], 0, 0, height, height)
    ctx.restore()


    // ctx.drawImage(tree1Img, 0, 0, 500, 500)
    // ctx.restore()

    // ctx.translate(500, 500)
    // for(let i = 1; i < treeCount; i++) {

    //   ctx.fillStyle = color

    //   ctx.beginPath()
    //   ctx.moveTo(0, 0 + i * height / 3)
    //   ctx.lineTo(0 - width / 2, 0 + i * height / 3)
    //   ctx.lineTo(0, 0 - height+ i * height / 3)
    //   ctx.lineTo(0 + width / 2, 0+ i * height / 3)
    //   ctx.closePath()
    //   ctx.fill()
    // }
  }, [ctx, treeImg])

  const drawSnow = useCallback((snowData, index) => {
    const color = snowData.getColor()
    const pos = snowData.pos
    const speed = snowData.speed
    const type = snowData.type
    const width = (type === 'snow') ? snowData.snowWidth : snowData.snowflakeWidth
    const opacity = snowData.opacity
    const angle = snowData.angle

    globalControl.snows[index].pos = {
      x: pos.x + speed.x,
      y: pos.y + speed.y,
    }

    if (type === 'snow') {
      ctx.fillStyle = color
      ctx.save()
      ctx.translate(0, 0 - width)
      ctx.beginPath()
      ctx.arc(pos.x, pos.y, width, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.shadowColor = 'rgba(255, 255, 255, 0.7)'
      ctx.shadowBlur = 30
      ctx.fill()
      ctx.restore()
      return 
    }

    globalControl.snows[index].angle = angle + Math.random() * 1

    ctx.save()
    ctx.translate(pos.x, pos.y)
    ctx.rotate(angle * Math.PI / 180)
    ctx.globalAlpha = opacity
    ctx.drawImage(snowflakeImg, -width / 2, -width / 2, width, width)
    ctx.restore()

    // console.log('snowflakeImg',snowflakeImg)
    
  }, [ctx, snowflakeImg])




  const update = useCallback(() => {

  }, [])

  const paint = useCallback(() => {
    ctx.clearRect(0, 0, ww, wh)

    // 填滿漸層背景色
    const grd = ctx.createLinearGradient(ww / 2,0,ww / 2,wh)
    grd.addColorStop(0,'black')
    grd.addColorStop(1,'#3F424E')
    ctx.fillStyle = grd
    ctx.fillRect(0,0,ww,wh)

    globalControl.snows = globalControl.snows.filter((cur) => {
      return cur.pos.y < wh + 200
    })
    // 繪製樹背景
    globalControl.trees.forEach((cur, index) => {
      drawTree(cur, index)
    })

    // 繪製雪
    globalControl.snows.forEach((cur, index) => {
      drawSnow(cur, index)
    })
    ctx.save()
    
    ctx.restore()
  }, [ctx])

  const init = useCallback(() => {
    for(let i = 0; i < globalControl.snowMax; i++) {
      const newSnow = {
        pos: {
          x: Math.random() * ww,
          y: getScope(Math.random(),0,1,-(Math.random() * 2000),(Math.random() * 2000)),
        },
        speed: {
          x: Math.random() * 5,
          y: Math.random() * 5 + 8,
        },
        snowWidth: Math.random() * 3 + 5,
        snowflakeWidth: Math.random() * 20 + 10,
        type: (Math.floor(Math.random() * 5) === 0) ? 'snowflake' : 'snow',
        getSpeed: () => {
          return {
            x: Math.random() * 5,
            y: (newSnow.type === 'snow') ? Math.random() * 5 + 8 : Math.random() * 5 + 3,
          }
        },
        color: `rgba(255, 255, 255, ${Math.random() * 100}%)`,
        opacity: Math.random() * 1,
        angle: Math.random() * 360,
        getColor: () => `rgba(255, 255, 255, ${getScope(Math.floor(newSnow.speed.y),8,13,5,95)}%)`,
      }
      globalControl.snows.push(newSnow)
    }

    for(let i = 0; i < globalControl.treeMax; i++) {
      const newTree = {
        pos: {
          x: i * 200,
          y: wh - 200,
        },
        width: Math.random() * 300 + 50,
        height: Math.random() * 100 + 350,
        treeCount: Math.random() * 3 + 2,
        treeType: Math.floor(Math.random() * 3),
      
        // color: `rgba(255, 255, 255, ${Math.random() * 100}%)`,
        color: '#5e5e5e',
        opacity: Math.random() * 1,
      }
      globalControl.trees.push(newTree)
    }


    setInterval(() => {
      if (globalControl.snowMax > globalControl.snows.length) {
        for(let i = 0; i < globalControl.snowMax - globalControl.snows.length; i++) {
          const newSnow = {
            pos: {
              x: Math.random() * ww,
              y: -(Math.random() * 2000),
            },
            speed: {
              x: Math.random() * 5,
              y: Math.random() * 5 + 8,
            },
            snowWidth: Math.random() * 3 + 5,
            snowflakeWidth: Math.random() * 20 + 10,
            type: (Math.floor(Math.random() * 5) === 0) ? 'snowflake' : 'snow',
            color: `rgba(255, 255, 255, ${Math.random() * 100}%)`,
            // opacity: 0.5,
            opacity: Math.random() * 1,
            angle: Math.random() * 360,
            getSpeed: () => {
              return {
                x: Math.random() * 5,
                y: (newSnow.type === 'snow') ? Math.random() * 5 + 8 : Math.random() * 5 + 3,
              }
            },
            getColor: () => `rgba(255, 255, 255, ${getScope(Math.floor(newSnow.speed.y),8,13,5,95)}%)`,
          }
          globalControl.snows.push(newSnow)
        }
      }
    }, 1000)
   
  }, [globalControl.snows])

  useEffect(() => {
    if (!ctx) return
    canvas.width = ww
    canvas.height = wh

    init()

    // setInterval(update, 30)
    setInterval(paint, globalControl.FPS)
    // paint()
  }, [ctx, ww, wh])

  const initCanvas = useCallback(() => {
    const myCanvas = document.getElementById('myCanvas')
    setCanvas(myCanvas)
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    setCtx(ctx)

    const imageObj1 = new Image()
    imageObj1.src = snowflake
    setSnowflakeImg(imageObj1)

    const ary = []

    const imageTree1 = new Image()
    imageTree1.src = tree1
    ary.push(imageTree1)

    const imageTree2 = new Image()
    imageTree1.src = tree2
    ary.push(imageTree2)

    const imageTree3 = new Image()
    imageTree1.src = tree3
    ary.push(imageTree3)
  
    setTreeImg(ary)


    
  }, [canvas])

  useEffect(() => {
    initCanvas()
  }, [canvas])

  return (
    <div className={styles.snowView}>
      <canvas className={styles.canvas} id='myCanvas'
        style={{backgroundImage: `url(${bg})` }} />
    </div>
  )
}

export default SnowView
