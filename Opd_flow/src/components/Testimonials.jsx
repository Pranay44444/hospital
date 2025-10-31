import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import './Testimonials.css';

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Patient',
    content: 'OPDFlow has transformed how I access healthcare. I can consult with my doctor from home, saving hours of travel time. The video quality is excellent and the platform is incredibly easy to use.',
    rating: 5,
    avatar: 'SJ'
  },
  {
    name: 'Dr. Michael Chen',
    role: 'General Physician',
    content: 'As a healthcare provider, OPDFlow has streamlined my workflow significantly. The intelligent intake forms give me all the information I need before consultations, making each session more productive.',
    rating: 5,
    avatar: 'MC'
  },
  {
    name: 'Priya Patel',
    role: 'Patient',
    content: 'I was skeptical about video consultations at first, but OPDFlow exceeded my expectations. The doctors are professional, the connection is reliable, and I get prescriptions instantly. Highly recommend!',
    rating: 5,
    avatar: 'PP'
  },
  {
    name: 'Robert Williams',
    role: 'Patient',
    content: 'Being able to manage healthcare for my elderly parents through OPDFlow has been a game-changer. The multi-patient support feature is fantastic, and the doctors are always attentive and caring.',
    rating: 5,
    avatar: 'RW'
  }
];

function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index) => {
    setIsAutoPlaying(false);
    setCurrentIndex(index);
  };

  return (
    <section className="testimonials-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">What Our Users Say</h2>
          <p className="section-description">
            Join thousands of satisfied patients and healthcare providers who trust OPDFlow.
          </p>
        </div>

        <div className="testimonials-carousel">
          <button
            className="carousel-button prev"
            onClick={goToPrevious}
            aria-label="Previous testimonial"
          >
            <ChevronLeft size={24} />
          </button>

          <div className="testimonials-track">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className={`testimonial-card ${index === currentIndex ? 'active' : ''}`}
                style={{
                  transform: `translateX(${(index - currentIndex) * 100}%)`,
                  opacity: index === currentIndex ? 1 : 0
                }}
              >
                <div className="quote-icon">
                  <Quote size={40} />
                </div>

                <div className="rating">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} size={20} fill="currentColor" />
                  ))}
                </div>

                <p className="testimonial-content">{testimonial.content}</p>

                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            className="carousel-button next"
            onClick={goToNext}
            aria-label="Next testimonial"
          >
            <ChevronRight size={24} />
          </button>
        </div>

        <div className="carousel-dots">
          {testimonials.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
