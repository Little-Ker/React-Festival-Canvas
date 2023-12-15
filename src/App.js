import React from 'react'
import {
  HashRouter as Router, Route, Routes 
} from 'react-router-dom'
import './App.css'
import Navbar from 'component/navbar/Navbar'
import Dialog from 'component/dialog'
import ViewA from 'view/ViewA'
import ViewB from 'view/ViewB'
import PaintTool from 'view/paintTool'
import Lottie from 'view/lottie'
 
const RouterPage = () => {
  return (
    <Routes>
      <Route exact path="/" element={<ViewA/>} />
      <Route exact path="viewA" element={<ViewA/>} />
      <Route exact path="viewB" element={<ViewB/>} />
      <Route exact path="paintTool" element={<PaintTool/>} />
      <Route exact path="lottie" element={<Lottie/>} />
      <Route path="*" element={<ViewA/>} />
    </Routes>
  )
}
 
function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <RouterPage />
      </Router>
      <Dialog />
    </div>
  )
}
 
export default App