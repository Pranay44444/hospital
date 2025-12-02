import Hero from '../components/Hero'
import FeatureGrid from '../components/FeatureGrid'
import Stats from '../components/Stats'
import Testimonials from '../components/Testimonials'
import HowItWorks from '../components/HowItWorks'
import FAQ from '../components/FAQ'
import './Home.css'

function Home() {
  return (
    <div className="home">
      <Hero />
      <FeatureGrid />
      <Stats />
      <HowItWorks />
      <Testimonials />
      <FAQ />
    </div>
  )
}

export default Home
