import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        {/* Left: copy */}
        <div className="hero-copy">
          <span className="eyebrow">A Telehealth Platform · Est. 2021</span>
          <h1 className="hero-title">
            <span className="line">Outpatient</span>
            <span className="line">care that <em>meets</em></span>
            <span className="line">you where <em>you are.</em></span>
          </h1>
          <p className="hero-sub">
            OPD Flow connects patients and clinicians through calm, secure video consultations,
            intelligent intake and a scheduling layer that respects everyone's time.
            No waiting room. No paperwork you've already filled out.
          </p>
          <div className="hero-ctas">
            <Link to="/request" className="btn btn-primary btn-lg">
              Request an appointment <span className="arrow-ic"/>
            </Link>
            <a href="#how" className="btn btn-ghost btn-lg">See how it works</a>
          </div>
          <div className="hero-meta">
            <div className="hero-meta-item">
              <div className="hero-meta-num">5<span className="hero-meta-accent">'</span></div>
              <div className="hero-meta-lbl">Avg. wait time</div>
            </div>
            <div className="hero-meta-item">
              <div className="hero-meta-num">142<span className="hero-meta-accent">k</span></div>
              <div className="hero-meta-lbl">Consultations / yr</div>
            </div>
            <div className="hero-meta-item">
              <div className="hero-meta-num">4.9<span className="hero-meta-accent">★</span></div>
              <div className="hero-meta-lbl">Patient rating</div>
            </div>
          </div>
        </div>

        {/* Right: visual */}
        <div className="hero-stage" aria-hidden="true">
          <div className="stage-glow" />
          <div className="stage-ground" />

          {/* Animated medical cross */}
          <div className="cross-scene">
            <div className="orbit-ring" />
            <div className="cross-3d">
              <div className="cross-vert">
                <div className="face f-front" />
                <div className="face f-back" />
                <div className="face f-left" />
                <div className="face f-right" />
                <div className="face f-top" />
                <div className="face f-bottom" />
              </div>
              <div className="cross-horiz">
                <div className="face f-front" />
                <div className="face f-back" />
                <div className="face f-left" />
                <div className="face f-right" />
                <div className="face f-top" />
                <div className="face f-bottom" />
              </div>
            </div>
            <div className="pill-orbit pill-a" />
            <div className="pill-orbit pill-b" />
          </div>

          {/* Floating info chips */}
          <div className="float-chip chip-one">
            <span className="chip-dot dot-orange" />
            <div>
              <strong>Dr. Meera Iyer</strong>
              <span className="chip-sub">CARDIOLOGY · IN CALL</span>
            </div>
          </div>
          <div className="float-chip chip-two">
            <span className="chip-dot dot-green" />
            <div>
              <strong>Intake reviewed</strong>
              <span className="chip-sub">4 MIN AGO</span>
            </div>
          </div>
          <div className="float-chip chip-three">
            <span className="chip-dot dot-orange" />
            <div>
              <strong>Rx dispatched</strong>
              <span className="chip-sub">DELIVERY BY 6PM</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
