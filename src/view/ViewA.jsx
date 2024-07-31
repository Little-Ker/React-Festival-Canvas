import React, {
  useEffect, useRef
} from 'react'
import axios from 'axios'
import {
  useDispatch 
} from 'react-redux'
import {
  addTodo 
} from 'redux/todoSlice'
import TodoList from 'component/test/TodoList'

const ReduxEX = () => {
  const dispatch = useDispatch()
  return (
    <div>
      <h2 style={{marginTop: '30px'}}>Redux 讀改資料</h2>
      <TodoList />
      <button onClick={() => dispatch(addTodo('test'))}>add</button>
    </div>
  )
}

const AxiosEx = () => {
  const [data, setData] = React.useState([])

  useEffect(() => {
    axios.get('/data/dataList.json').then((response) => {
      setData(response.data.titleData)
    })
  }, [])

  return (
    <div>
      <h2 style={{marginTop: '30px'}}>Axios</h2>
      {data.map((item, index) => (
        <p key={index}>{item.title} : {item.txt}</p>
      ))}
    </div>
  )
}

const ViewA = () => {

  return (
    <>
      <AxiosEx />
      <ReduxEX />
      <iframe style={{border: '1px solid rgba(0, 0, 0, 0.1)'}} width="600" height="550" src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FHC9EAVXqGHy8DqYbE6z7X3%2Ftest%3Fpage-id%3D0%253A1%26type%3Ddesign%26node-id%3D705-467%26viewport%3D999%252C3806%252C0.09%26t%3DhB9RFmRp9pDMusfj-1%26scaling%3Dscale-down%26starting-point-node-id%3D695%253A516%26show-proto-sidebar%3D1%26mode%3Ddesign" allowfullscreen></iframe>
    </>
  )
}

export default ViewA