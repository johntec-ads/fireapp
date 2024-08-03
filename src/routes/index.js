import { Routes, Route } from 'react-router-dom'

import Home from '../pages/Home';



function RouterApp () {
  return (
   
      <Routes>
        <Route path='/' element={<Home/>} />
      </Routes>
   
  )
}

export default RouterApp;