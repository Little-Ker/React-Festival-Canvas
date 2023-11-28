import React, {
  useState, useCallback
} from 'react'
import PropTypes from 'prop-types'
import {
  Box, Button, Grid, Divider
} from '@mui/material'
import noPhoto from 'assets/images/noImage.jpg'
import styles from './uploadPhoto.module.sass'

function UploadPhoto(props) {
  const {storyPhotoAry, setStoryPhotoAry, onCancel, onChooseImgIndex} = props
  const [showImgSrc, setShowImgSrc] = useState(null)
  const [img, setImg] = useState(null)
  const [imgName, setImgName] = useState('')

  const onFileUpload = (event) => {

    const file = event.target.files[0]
    setImgName(file.name)
    const reader = new FileReader()
    reader.addEventListener('load', (e) => {
      setShowImgSrc(reader.result)
      const data = e.target.result
      const image = new Image()
      image.src = data
      setImg(image)
    }, false)
    if (file) reader.readAsDataURL(file)
  }

  const onSend = useCallback(() => {
    let ww = window.innerWidth - 3
    let wh = window.innerHeight - 3
  
    setStoryPhotoAry((prev) => {
      prev.push({
        x: ww / 2,
        y: wh / 2,
        img: img,
        imgName: imgName,
        width: img.width,
        height: img.height,
        scaleIndex: 4,
      })
      return prev
    })
    onChooseImgIndex(storyPhotoAry.length - 1)
    onCancel()
  }, [img])

  return (
    <Box className={styles.uploadPhoto}>
      <Grid
        container
        spacing={2}
        direction="column"
      >
        <Grid item className={styles.imgBox}>
          <img className={styles.img} src={(!showImgSrc) ? noPhoto : showImgSrc} alt="" />
        </Grid>
        <Grid item>
          <Button
            type="file"
            component="label"
            variant="contained"
            sx={{width: '100%'}}
            size="large"
          >
            {'上傳圖片'}
            <input
              type={'file'}
              accept="image/*"
              style={{ display: 'none' }}
              onChange={onFileUpload}
            />
          </Button>
        </Grid>
        <Divider sx={{marginTop: '1rem'}} />
        <Grid item
          sx={{display: 'flex',
            justifyContent: 'flex-end'}}
        >
          <Button sx={{marginRight: '.5rem'}} onClick={onCancel} variant="outlined">{'取消'}</Button>
          <Button variant="contained" disabled={!showImgSrc} onClick={onSend}>{'確認新增'}</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

UploadPhoto.propTypes = {
  storyPhotoAry: PropTypes.array,
  setStoryPhotoAry: PropTypes.func,
  onCancel: PropTypes.func,
  onChooseImgIndex: PropTypes.func,
}

export default UploadPhoto
