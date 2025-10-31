import { useState } from 'react'
import Hero from '../components/Hero'
import FeatureGrid from '../components/FeatureGrid'
import Stats from '../components/Stats'
import Testimonials from '../components/Testimonials'
import HowItWorks from '../components/HowItWorks'
import FAQ from '../components/FAQ'
import Modal from '../components/Modal'
import { useToast } from '../components/Toast'
import { Video } from 'lucide-react'
import './Home.css'

function Home() {
  const [showModal, setShowModal] = useState(false)
  const { addToast } = useToast()

  const openDemo = () => {
    setShowModal(true)
    addToast('Demo modal opened successfully!', 'info')
  }

  const closeDemo = () => {
    addToast('Feature demonstration completed!', 'success')
    setShowModal(false)
  }

  return (
    <div className="home">
      <Hero />
      <FeatureGrid />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <FAQ />

      <section className="cta">
        <div className="container">
          <div className="card">
            <h2>Ready to Experience Better Healthcare?</h2>
            <p>Join thousands of patients who have already made the switch to OPDFlow</p>
            <div className="actions">
              <button className="btn btn-primary btn-lg" onClick={openDemo}>
                <Video size={20} />
                Watch Demo
              </button>
            </div>
          </div>
        </div>
      </section>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="OPDFlow Demo">
        <div className="demo">
          <p>Welcome to OPDFlow demo!</p>
          <p>This modal demonstrates our interactive UI components with smooth animations and accessibility features.</p>
          <div className="features">
            <h3>Key Features Demonstrated:</h3>
            <ul>
              <li>Accessible modal with ARIA labels</li>
              <li>Smooth animations and transitions</li>
              <li>Keyboard navigation (ESC to close)</li>
              <li>Toast notification system</li>
              <li>Responsive design</li>
            </ul>
          </div>
          <button className="btn btn-primary" onClick={closeDemo}>Got it!</button>
        </div>
      </Modal>
    </div>
  )
}

export default Home
