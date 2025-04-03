import './styles/imageslider.css';

import React, { useEffect, useRef, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import ContactUs from "./contactus";
import apiConfig from "./config/apiconfig";
import './index.css';
import TopContributions from "./topcontributions";

const ImageSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const autoplayRef = useRef(null);
  
  // Define slider images and content
  const sliderContent = [
    {
      image: `${import.meta.env.BASE_URL}images/image.png`,
      title: "School Of Technology",
      subtitle: "Offering innovative engineering programs designed to equip students with skills in emerging fields such as Data Science, Artificial Intelligence, Blockchain, IoT, and Cybersecurity"
    },
    {
      image: `${import.meta.env.BASE_URL}images/sos.png`,  // Assuming you have more images
      title: "Leading Research and Development",
      subtitle: "Advancing Technology Through Collaborative Innovation"
    },
    {
      image: `${import.meta.env.BASE_URL}images/students.png`,  // Assuming you have more images
      title: "Student-Led Projects",
      subtitle: "Transforming Ideas into Real-World Solutions"
    }
  ];

  // Auto-advance slides
  useEffect(() => {
    startAutoplay();
    return () => clearInterval(autoplayRef.current);
  }, [currentSlide]);

  const startAutoplay = () => {
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      nextSlide();
    }, 6000);
  };

  const pauseAutoplay = () => {
    clearInterval(autoplayRef.current);
  };

  // Navigate to next slide
  const nextSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev === sliderContent.length - 1 ? 0 : prev + 1));
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  // Navigate to previous slide
  const prevSlide = () => {
    if (!isTransitioning) {
      setIsTransitioning(true);
      setCurrentSlide((prev) => (prev === 0 ? sliderContent.length - 1 : prev - 1));
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  // Go to a specific slide
  const goToSlide = (index) => {
    if (!isTransitioning && index !== currentSlide) {
      setIsTransitioning(true);
      setCurrentSlide(index);
      setTimeout(() => setIsTransitioning(false), 600);
    }
  };

  return (
    <div 
      className="slider-container"
      onMouseEnter={pauseAutoplay}
      onMouseLeave={startAutoplay}
    >
      {/* Slides */}
      <div className="slides-wrapper">
        {sliderContent.map((slide, index) => (
          <div 
            key={index} 
            className={`slide ${index === currentSlide ? 'active' : ''}`}
            style={{ 
              transform: `translateX(${100 * (index - currentSlide)}%)`,
              zIndex: index === currentSlide ? 2 : 1
            }}
          >
            <div className="slide-overlay"></div>
            <img 
              src={slide.image} 
              alt={slide.title} 
              className="slide-image"
              loading={index === 0 ? "eager" : "lazy"}
            />
            <div className="slide-content">
              <div className="slide-text-container">
                <h1 className="slide-title">{slide.title}</h1>
                <div className="title-underline"></div>
                <p className="slide-subtitle">{slide.subtitle}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Navigation arrows */}
      <button 
        className="slide-arrow prev-arrow" 
        onClick={prevSlide} 
        aria-label="Previous slide"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
          <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button 
        className="slide-arrow next-arrow" 
        onClick={nextSlide} 
        aria-label="Next slide"
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="arrow-icon">
          <path d="M9 6L15 12L9 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      
      {/* Progress indicators */}
      <div className="progress-container">
        {sliderContent.map((_, index) => (
          <button 
            key={index} 
            className={`progress-indicator ${index === currentSlide ? 'active' : ''}`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          >
            <span className="progress-dot"></span>
            {index === currentSlide && (
              <span className="progress-fill" style={{animationDuration: '6s'}}></span>
            )}
          </button>
        ))}
      </div>
      
      {/* Slide counter */}
      <div className="slide-counter">
        <span className="current-slide">{String(currentSlide + 1).padStart(2, '0')}</span>
        <span className="slide-divider">/</span>
        <span className="total-slides">{String(sliderContent.length).padStart(2, '0')}</span>
      </div>
    </div>
  );
};

// Top hiring company logos
const companyLogos = [
  { name: "Google", src: "https://img.icons8.com/color/96/google-logo.png" },
  { name: "Microsoft", src: "https://img.icons8.com/fluency/96/microsoft.png" },
  { name: "Amazon", src: "https://img.icons8.com/color/96/amazon.png" },
  { name: "Meta", src: "https://img.icons8.com/color/96/facebook-new.png" },
];

const PlacementHighlights = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlacements = async () => {
      try {
        // Using the baseUrl from your API config
        const response = await fetch(apiConfig.getUrl('/api/placements/top_placements/'));
        
        // Check if the response is ok
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        // Parse the JSON response
        const data = await response.json();
        
        // Filter to get only the top 2 placements
        const topPlacements = data.filter(placement => placement.top_2);
        
        setTestimonials(topPlacements);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching placement data:', err);
        setError('Failed to load placement data');
        setLoading(false);
        
        // Fallback to hardcoded data if API call fails
        setTestimonials(hardcodedTestimonials);
      }
    };

    fetchPlacements();
  }, []);

  // Hardcoded testimonial data as fallback
  const hardcodedTestimonials = [
    {
      id: 1,
      title: "Dream Opportunity at Google",
      student: "Aisha Patel",
      description: "The placement cell helped me refine my skills and connect with the right companies. The experience was invaluable!",
      package: "24 LPA",
      company: "Google",
      date: "2024-05-15",
      created_at: "2024-05-20T14:15:22Z",
      top_2: true
    },
    {
      id: 2,
      title: "My Journey to Amazon",
      student: "Raj Sharma",
      description: "I secured my dream role thanks to the extensive preparation and industry connections provided by SOT.",
      package: "21 LPA",
      company: "Amazon",
      date: "2024-05-10",
      created_at: "2024-05-18T10:45:30Z",
      top_2: true
    }
  ];

  if (loading) {
    return <div className="loading">Loading placement data...</div>;
  }

  if (error && testimonials.length === 0) {
    return <div className="error">{error}</div>;
  }

  return (
    <section className="placement-highlights dark-theme">
      <div className="placement-highlights-container">
        <h2 className="section-heading">Placement Success Stories</h2>
        
        <div className="placement-testimonials">
          <div className="testimonials-container">
            {testimonials.length > 0 ? (
              testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-header">
                    <h3 className="testimonial-title">{testimonial.title}</h3>
                  </div>
                  <div className="testimonial-content">
                    <p className="testimonial-quote">"{testimonial.description}"</p>
                    <div className="testimonial-details">
                      <h4 className="testimonial-name">{testimonial.student}</h4>
                      <p className="testimonial-company">
                        <strong>{testimonial.company}</strong>
                      </p>
                      <p className="testimonial-date">
                        Placed on: {new Date(testimonial.date).toLocaleDateString()}
                      </p>
                      <div className="testimonial-package-container">
                        <p className="testimonial-package">{testimonial.package}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">No top placement data available</div>
            )}
          </div>
        </div>

        <div className="top-recruiters">
          <h3>Top Recruiters</h3>
          <div className="company-logos">
            {companyLogos.map((company, index) => (
              <div key={index} className="company-logo-container">
                <img
                  src={company.src}
                  alt={company.name}
                  className="company-logo"
                />
              </div>
            ))}
          </div>
        </div>
        
        <div className="view-more-container">
  <Link to="/placements" className="view-more-link">
    View All Placement Details <FaArrowRight className="arrow-icon" />
  </Link>
</div>
        </div>

    </section>
  );
};


const HomePage = () => {
  return (
    <div className="page-container">
        <div className="hero-section">
          <ImageSlider />
        </div>
        <div className="content-container">
          <PlacementHighlights />
          <section className="section-research">
            <div className="container-research">
              <h2 className="section-heading">Research, Projects & Achievements</h2>
              
              <div className="research-section-content">
                
                {/* Content Paragraphs */}
                <div className="research-paragraphs">
                  <p className="research-paragraph">
                    At SOT, both students and faculty are actively involved in research, hands-on projects, and academic achievements across various fields. From <strong>AI and cybersecurity</strong> to <strong>renewable energy</strong> and <strong>biomedical engineering</strong>, research here focuses on practical solutions and real-world impact.
                  </p>
                  
                  <p className="research-paragraph">
                    Faculty members contribute through publications, industry collaborations, and research initiatives, while students take on technical projects, competitions, and entrepreneurial ventures. Their combined efforts have led to patents, conference presentations, and awards, highlighting SOT's commitment to innovation and academic excellence.
                  </p>
                </div>
              </div>
            </div>
          </section>
          <TopContributions />
        </div>
        <ContactUs />
    </div>
  );
};

export default HomePage;