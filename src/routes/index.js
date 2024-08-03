import { Routes, Route } from 'react-router-dom'

import Home from '../pages/Home';
import Register from '../pages/Register';



function RouterApp () {
  return (
   
      <Routes>
        <Route path='/' element={<Home/>} />
        <Route path='/register' element={<Register/>} />
      </Routes>
   
  )
}

export default RouterApp;