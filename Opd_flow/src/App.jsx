import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'
import { ToastProvider } from './components/Toast'
import Home from './pages/Home'
import Login from './pages/Login'
import Request from './pages/Request'
import Intake from './pages/Intake'
import Admin from './pages/Admin'
import Video from './pages/Video'
import './pages/pages.css'

function App() {
  return (
    <Router>
      <ToastProvider>
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/request" element={<Request />} />
            <Route path="/intake" element={<Intake />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/video/:requestId" element={<Video />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </ToastProvider>
    </Router>
  )
}

export default App
