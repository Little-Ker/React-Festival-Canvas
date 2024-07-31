import React, {
  useState, useCallback
} from 'react'
import PropTypes from 'prop-types'
import {
  TextField, Checkbox , FormControlLabel, Box, Button, Grid, Divider,Popper, ClickAwayListener
} from '@mui/material'
import rgbHex from 'rgb-hex'
import {
  SketchPicker 
} from 'react-color'
import {
  openAlert
} from 'component/dialog'
import clsx from 'clsx'
import styles from './settingView.module.sass'

function SettingView(props) {
  const {setting, setSetting, onCancel} = props

  const [isShowGrid, setIsShowGrid] = useState(setting.isShowGrid)
  const [gridSize, setGridSize] = useState(setting.gridSize)

  // 顏色選擇
  const [anchorColorEl, setAnchorColorEl] = useState(null)
  const [openColorPick, setOpenColorPick] = useState(false)

  const [chooseBgColor, setChooseBgColor] = useState('#000')
  const [chooseGridColor, setChooseGridColor] = useState('#fff')


  const handleColorClose = useCallback(() => {
    setAnchorColorEl(null)
    setOpenColorPick(false)
  }, [])

  const handleColorClick = useCallback((event) => {
    setAnchorColorEl(event.currentTarget)
    setOpenColorPick(true)
  }, [])

  const onSend = useCallback(() => {
    if (isShowGrid && gridSize < 1) {
      openAlert(
        {title: '提示',
          content: '格線大小不可小於 0'}
      )
      return 
    }
  
    setSetting((prev) => {
      prev.isShowGrid = isShowGrid
      prev.gridSize = Number(gridSize)
      prev.gridColor = chooseGridColor
      return prev
    })
    onCancel()
  }, [isShowGrid, gridSize, chooseGridColor])

  const onChangeColor = useCallback((type, color) => {
    console.log('type',type)
    if (type === 'grid') setChooseGridColor(`#${rgbHex(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a)}`)
    if (type === 'bg') setChooseBgColor(`#${rgbHex(color.rgb.r, color.rgb.g, color.rgb.b, color.rgb.a)}`)
  }, [])

  return (
    <Box sx={
      {padding: '1rem',
        paddingBottom: '0'}
    }
    className={styles.settingView}
    >
      <Grid
        container
        spacing={2}
        direction="column"
      >
        <Grid item className={clsx(styles.setting, styles.bgColor)}>
          <p>{'背景顏色'}</p>
          {/* <FormControlLabel
            control={(
              <Checkbox
                checked={isShowGrid}
                onChange={event => setIsShowGrid(event.target.checked)}
              />
            )}
            label={<p>{'背景顏色'}</p>}
            labelPlacement="start"
          /> */}
          <div style={{background: chooseBgColor}} className={styles.colorPickerModel} onClick={handleColorClick}>
           
          </div>
          {/* <Popper open={openColorPick} anchorEl={anchorColorEl} disablePortal>
            <ClickAwayListener onClickAway={handleColorClose}>
              <div className={styles.colorPicker}>
                <SketchPicker color={chooseBgColor} onChange={c => onChangeColor('bg', c)} />
              </div>
            </ClickAwayListener>
          </Popper> */}
        </Grid>
        <Divider sx={{marginTop: '1rem'}} />
        <Grid item className={styles.setting}>
          <FormControlLabel
            control={(
              <Checkbox
                checked={isShowGrid}
                onChange={event => setIsShowGrid(event.target.checked)}
              />
            )}
            label={<p>{'開啟格線工具'}</p>}
            labelPlacement="start"
          />
          <TextField
            label={'格線大小'}
            value={gridSize}
            onChange={(event) => {
              setGridSize(event.target.value)
            }}
            variant="standard"
            inputProps={{
              type: 'number',
            }}
            sx={{marginLeft: '1rem'}}
          />
          <div style={{background: chooseGridColor}} className={styles.colorPickerModel} onClick={handleColorClick}>
            
          </div>
          <Popper open={openColorPick} anchorEl={anchorColorEl} disablePortal>
            <ClickAwayListener onClickAway={handleColorClose}>
              <div className={styles.colorPicker}>
                <SketchPicker color={chooseGridColor} onChange={c => onChangeColor('grid', c)} />
              </div>
            </ClickAwayListener>
          </Popper>
        </Grid>
        <Divider sx={{marginTop: '1rem'}} />
        <Grid item
          sx={{display: 'flex',
            justifyContent: 'flex-end'}}
        >
          <Button sx={{marginRight: '.5rem'}} onClick={onCancel} variant="outlined">{'取消'}</Button>
          <Button variant="contained" onClick={onSend}>{'確認修改'}</Button>
        </Grid>
      </Grid>
    </Box>
  )
}

SettingView.propTypes = {
  setting: PropTypes.object,
  setSetting: PropTypes.func,
  onCancel: PropTypes.func,
}

export default SettingView
