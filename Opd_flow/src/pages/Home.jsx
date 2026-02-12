import Hero from '../components/Hero';
import Trust from '../components/Trust';
import HowItWorks from '../components/HowItWorks';
import FeatureGrid from '../components/FeatureGrid';
import Stats from '../components/Stats';
import DoctorsSection from '../components/DoctorsSection';
import Testimonials from '../components/Testimonials';
import Awards from '../components/Awards';
import ContactCta from '../components/ContactCta';
import FAQ from '../components/FAQ';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <Hero />
      <Trust />
      <HowItWorks />
      <FeatureGrid />
      <Stats />
      <DoctorsSection />
      <Testimonials />
      <Awards />
      <ContactCta />
      <FAQ />
    </div>
  );
}

export default Home;
