import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import SharedView from './pages/SharedView'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/shared/:shareId" element={<SharedView />} />
      </Routes>
    </BrowserRouter>
  )
}
