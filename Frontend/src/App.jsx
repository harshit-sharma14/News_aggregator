import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Home from './components/Home'
import NewsDetail from './components/NewsDetail'
const App = () => {
  return (
    <Routes>
      <Route path='/'element={<Home/>}/>
      <Route path='/news/:title'element={<NewsDetail/>}/>
    </Routes>
   
  )
}

export default App