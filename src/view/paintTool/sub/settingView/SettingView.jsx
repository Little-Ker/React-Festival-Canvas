import React, {
  useState, useCallback
} from 'react'
import PropTypes from 'prop-types'
import {
  TextField, Checkbox , FormControlLabel, Box, Button, Grid, Divider
} from '@mui/material'
import {
  openAlert
} from 'component/dialog'

function SettingView(props) {
  const {setting, setSetting, onCancel} = props

  const [isShowGrid, setIsShowGrid] = useState(setting.isShowGrid)
  const [gridSize, setGridSize] = useState(setting.gridSize)

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
      return prev
    })
    onCancel()
  }, [isShowGrid, gridSize])

  return (
    <Box sx={
      {padding: '1rem',
        paddingBottom: '0'}
    }>
      <Grid
        container
        spacing={2}
        direction="column"
      >
        <Grid item>
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
