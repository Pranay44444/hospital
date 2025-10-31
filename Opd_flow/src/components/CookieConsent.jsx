import { useState, useEffect } from 'react'
import { Cookie } from 'lucide-react'
import './CookieConsent.css'

function CookieConsent() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent')
    if (!consent) {
      setTimeout(() => setShow(true), 1000)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setShow(false)
  }

  const decline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="cookie">
      <div className="content">
        <div className="icon">
          <Cookie size={24} />
        </div>
        <div className="text">
          <h3>We value your privacy</h3>
          <p>We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.</p>
        </div>
      </div>
      <div className="actions">
        <button className="btn btn-secondary" onClick={decline}>Decline</button>
        <button className="btn btn-primary" onClick={accept}>Accept</button>
      </div>
    </div>
  )
}

export default CookieConsent
