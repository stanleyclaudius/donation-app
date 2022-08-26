import { useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AppDispatch } from './redux/store'
import { refreshToken } from './redux/slice/authSlice'
import Alert from './components/general/Alert'
import PageRender from './utils/PageRender'
import Home from './pages'

const App = () => {
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(refreshToken())
  }, [dispatch])

  return (
    <Router>
      <Alert />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/:page' element={<PageRender />} />
        <Route path='/:page/:id' element={<PageRender />} />
      </Routes>
    </Router>
  )
}

export default App