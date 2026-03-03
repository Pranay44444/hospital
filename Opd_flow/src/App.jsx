import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'
import { ToastProvider } from './context/ToastContext'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Messages from './pages/Messages'
import Request from './pages/Request'
import Dashboard from './pages/Dashboard'
import Appointments from './pages/Appointments'
import Admin from './pages/Admin'
import Video from './pages/Video'
import DoctorRegistration from './pages/DoctorRegistration'
import DoctorList from './pages/DoctorList'
import DoctorProfile from './pages/DoctorProfile'
import DoctorPanel from './pages/DoctorPanel'
import Consultation from './pages/Consultation'
import About from './pages/About'
import Services from './pages/Services'
import Contact from './pages/Contact'
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
            <Route path="/register" element={<Register />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/request" element={<Request />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/video/:requestId" element={<Video />} />
            <Route path="/doctor/register" element={<DoctorRegistration />} />
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/doctor/:id" element={<DoctorProfile />} />
            <Route path="/doctor-panel" element={<DoctorPanel />} />
            <Route path="/consultation/:appointmentId" element={<Consultation />} />
            <Route path="/about" element={<About />} />
            <Route path="/services" element={<Services />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>
        <Footer />
        <CookieConsent />
      </ToastProvider>
    </Router>
  )
}

export default App
