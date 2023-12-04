import React from 'react'
import PropTypes from 'prop-types'
import {
  Box
} from '@mui/material'
import styles from './codeView.module.sass'

function CodeView(props) {
  const {type, codeAry, zoom} = props

  return (
    <Box sx={{padding: '1rem'}} className={'codeView'}>
      {(type === 'point') && (
        <div className={styles.codeList}>
          <p>{'ctx.beginPath()'}</p>
          <div>
            {codeAry.map((cur, index) => ((index === 0)? 
              (<p key={index} className={styles.marginLeft}>{`ctx.moveTo(${cur.x}, ${cur.y})`}</p>) : (<p key={index} className={styles.marginLeft}>{`ctx.lineTo(${cur.x}, ${cur.y})`}</p>))
            )}
          </div>
          <p>{'ctx.strokeStyle = "#fff"'}</p>
          <p>{'ctx.stroke()'}</p>
        </div>
      )}
      {(type === 'shape' && (
        <div className={styles.codeList}>
          {([...codeAry].filter(cur => cur.type === 'rect').length > 0) && (
            <p>{'// 矩形'}</p>
          )}
          {[...codeAry].filter(cur => cur.type === 'rect').map((cur, index) =>
            <div key={index}>
              <p>{`ctx.strokeStyle = "${cur.color}"`}</p>
              <p>{`ctx.strokeRect(${cur.x}, ${cur.y}, ${cur.width}, ${cur.height})`}</p>
            </div>
          )}
          {([...codeAry].filter(cur => cur.type === 'circle').length > 0) && (
            <p>{'// 圓形'}</p>
          )}
          {[...codeAry].filter(cur => cur.type === 'circle').map((cur, index) => 
            <div key={index}>
              <p>{`ctx.strokeStyle = "${cur.color}"`}</p>
              <p>{'ctx.save()'}</p>
              <div className={styles.marginLeft}>
                <p>{`ctx.translate(${(cur.r / 4) * ((cur.getXDir) ? 1 : -1)}, ${(cur.r / 4) * ((cur.getYDir) ? 1 : -1)})`}</p>
                <p>{'ctx.beginPath()'}</p>
                <p className={styles.marginLeft}>{`ctx.arc(${cur.x}, ${cur.y}, ${Math.abs(cur.r - (cur.r / 2)) / 2}, 0, 2 * Math.PI)`}</p>
              </div>
              <p className={styles.marginLeft}>{'ctx.restore()'}</p>
            </div>
          )}
          {([...codeAry].filter(cur => cur.type === 'line').length > 0) && (
            <p>{'// 直線'}</p>
          )}
          <p>{'ctx.beginPath()'}</p>
          {[...codeAry].filter(cur => cur.type === 'line').map((cur, index) => 
            <div key={index}>
              <p>{`ctx.strokeStyle = "${cur.color}"`}</p>
              <p className={styles.marginLeft}>{`ctx.moveTo(${cur.x}, ${cur.y})`}</p>
              <p className={styles.marginLeft}>{`ctx.lineTo(${cur.finalX}, ${cur.finalY})`}</p>
            </div>
          )}
          <p>{'ctx.stroke()'}</p>
        </div>
      ))}
      {(type === 'photo') && (
        <div className={styles.codeList}>
          <div>
            {codeAry.map((cur, index) => {
              const width = cur.width * zoom[cur.scaleIndex]
              const height = cur.height * zoom[cur.scaleIndex]
              return (
                <div key={index}>
                  <p>{`const image${index} = new Image()`}</p>
                  <p>{`image${index}.src = ${cur.imgName}`}</p>
                  <p>{`image${index}.addEventListener('load',function(){ ctx.drawImage(image${index}, ${cur.x - (width / 2)}, ${cur.y - (height / 2)}, ${width}, ${height}) })`}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}
      {(type === 'text') && (
        <div className={styles.codeList}>
          {codeAry.map((cur, index) => (
            <div key={index}>
              {console.log('codeAry',codeAry)}
              <p>{`ctx.font = "${cur.size}px Arial"`}</p>
              <p>{`ctx.fillStyle = ${cur.color}`}</p>
              <p>{`ctx.fillText(${cur.text}, ${cur.x}, ${cur.y})`}</p>
            </div>
          ))}
        </div>
      )}
    </Box>
  )
}

CodeView.propTypes = {
  type: PropTypes.string,
  codeAry: PropTypes.array,
  zoom: PropTypes.array,
}

export default CodeView
