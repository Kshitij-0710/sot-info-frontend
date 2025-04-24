import './styles/imageslider.css';

import React, { useEffect, useRef, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { Link } from "react-router-dom";

import { Document, Page, pdfjs } from 'react-pdf';

import apiConfig from "./config/apiconfig";
import ContactUs from "./contactus";
import './index.css';
import TopContributions from "./topcontributions";
// Import the PDF file
import januaryPdf from './January.pdf';
import chroniclesPdf from './chronicles.pdf';

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
      title: "School of Sciences",
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
        setTestimonials([]);
      }
    };

    fetchPlacements();
  }, []);

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

// PDF Preview Component - Simple and Reliable Implementation
const ChroniclesPreview = () => {
  // State for chronicles PDF
  const [chroniclesNumPages, setChroniclesNumPages] = useState(null);
  const [chroniclesPageNumber, setChroniclesPageNumber] = useState(1);
  
  // State for January PDF
  const [januaryNumPages, setJanuaryNumPages] = useState(null);
  const [januaryPageNumber, setJanuaryPageNumber] = useState(1);
  
  const [isHovered, setIsHovered] = useState(false);

  const pdfFiles = {
    chronicles: {
      file: chroniclesPdf,
      title: 'SCITECH Chronicles',
      subtitle: 'Latest Edition'
    },
    january: {
      file: januaryPdf,
      title: 'SCITECH Chronicles',
      subtitle: 'January Edition'
    }
  };

  // Set up PDF.js worker
  useEffect(() => {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
  }, []);

  function onChroniclesLoadSuccess({ numPages }) {
    setChroniclesNumPages(numPages);
  }

  function onJanuaryLoadSuccess({ numPages }) {
    setJanuaryNumPages(numPages);
  }

  function changeChroniclesPage(offset) {
    setChroniclesPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), chroniclesNumPages);
    });
  }

  function changeJanuaryPage(offset) {
    setJanuaryPageNumber(prevPageNumber => {
      const newPageNumber = prevPageNumber + offset;
      return Math.min(Math.max(1, newPageNumber), januaryNumPages);
    });
  }

  // CSS Styles for the component
  const styles = {
    section: {
      padding: '40px 0',
      backgroundColor: '#000000'
    },
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 20px',
      textAlign: 'center'
    },
    heading: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '30px',
      color: '#ffffff'
    },
    pdfContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '20px',
      flexWrap: 'wrap'
    },
    previewCard: {
      width: '450px',
      backgroundColor: '#111111',
      boxShadow: '0 4px 8px rgba(255,255,255,0.1)',
      borderRadius: '4px',
      overflow: 'hidden',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      cursor: 'pointer',
      flex: '0 0 auto'
    },
    previewCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 6px 12px rgba(255,255,255,0.2)'
    },
    previewTop: {
      padding: '15px',
      backgroundColor: '#1a1a1a',
      textAlign: 'center'
    },
    pdfTitle: {
      margin: '0 0 5px',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#ffffff'
    },
    pdfSubtitle: {
      margin: '0',
      fontSize: '14px',
      color: '#aaaaaa'
    },
    downloadBar: {
      backgroundColor: '#e03747',
      color: 'white',
      padding: '12px 20px',
      textAlign: 'center',
      fontWeight: 'bold',
      fontSize: '14px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    pdfViewerContainer: {
      padding: '10px',
      backgroundColor: '#222222',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    controls: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
      padding: '10px 0',
      alignItems: 'center'
    },
    pageControls: {
      display: 'flex',
      gap: '10px',
      alignItems: 'center'
    },
    button: {
      backgroundColor: '#e03747',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      padding: '5px 10px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonDisabled: {
      backgroundColor: '#555555',
      cursor: 'not-allowed'
    },
    pageInfo: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#ffffff'
    },
    documentContainer: {
      border: '1px solid #333333',
      borderRadius: '4px',
      overflow: 'hidden',
      width: '100%',
      maxHeight: '500px',
      display: 'flex',
      justifyContent: 'center',
      backgroundColor: '#333333'
    }
  };

  return (
    <section style={styles.section} className="chronicles-section">
      <div style={styles.container} className="chronicles-container">
        <h2 style={styles.heading} className="section-heading">Latest Chronicles</h2>
        
        <div style={styles.pdfContainer}>
          {/* Chronicles PDF */}
          <div 
            style={{
              ...styles.previewCard,
              ...(isHovered ? styles.previewCardHover : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div style={styles.previewTop}>
              <h3 style={styles.pdfTitle}>
                {pdfFiles.chronicles.title}
              </h3>
              
              <p style={styles.pdfSubtitle}>
                {pdfFiles.chronicles.subtitle}
              </p>
            </div>
            
            <div style={styles.pdfViewerContainer}>
              <div style={styles.controls}>
                <div style={styles.pageControls}>
                  <button 
                    type="button" 
                    disabled={chroniclesPageNumber <= 1} 
                    onClick={() => changeChroniclesPage(-1)}
                    style={{
                      ...styles.button,
                      ...(chroniclesPageNumber <= 1 ? styles.buttonDisabled : {})
                    }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <p style={styles.pageInfo}>
                    Page {chroniclesPageNumber} of {chroniclesNumPages || '--'}
                  </p>
                  <button 
                    type="button"
                    disabled={chroniclesPageNumber >= chroniclesNumPages} 
                    onClick={() => changeChroniclesPage(1)}
                    style={{
                      ...styles.button,
                      ...(chroniclesPageNumber >= chroniclesNumPages ? styles.buttonDisabled : {})
                    }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div style={styles.documentContainer}>
                <Document
                  file={pdfFiles.chronicles.file}
                  onLoadSuccess={onChroniclesLoadSuccess}
                  loading={<div style={{color: '#ffffff', padding: '20px'}}>Loading PDF...</div>}
                  error={<div style={{color: '#e03747', padding: '20px'}}>Failed to load PDF!</div>}
                >
                  <Page 
                    pageNumber={chroniclesPageNumber} 
                    width={400}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
            </div>
            
            <a 
              href={pdfFiles.chronicles.file}
              download="chronicles.pdf"
              style={{
                ...styles.downloadBar,
                textDecoration: 'none',
                color: 'white'
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PDF
            </a>
          </div>
          
          {/* January PDF */}
          <div 
            style={{
              ...styles.previewCard,
              ...(isHovered ? styles.previewCardHover : {})
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <div style={styles.previewTop}>
              <h3 style={styles.pdfTitle}>
                {pdfFiles.january.title}
              </h3>
              
              <p style={styles.pdfSubtitle}>
                {pdfFiles.january.subtitle}
              </p>
            </div>
            
            <div style={styles.pdfViewerContainer}>
              <div style={styles.controls}>
                <div style={styles.pageControls}>
                  <button 
                    type="button" 
                    disabled={januaryPageNumber <= 1} 
                    onClick={() => changeJanuaryPage(-1)}
                    style={{
                      ...styles.button,
                      ...(januaryPageNumber <= 1 ? styles.buttonDisabled : {})
                    }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polyline points="15 18 9 12 15 6"></polyline>
                    </svg>
                  </button>
                  <p style={styles.pageInfo}>
                    Page {januaryPageNumber} of {januaryNumPages || '--'}
                  </p>
                  <button 
                    type="button"
                    disabled={januaryPageNumber >= januaryNumPages} 
                    onClick={() => changeJanuaryPage(1)}
                    style={{
                      ...styles.button,
                      ...(januaryPageNumber >= januaryNumPages ? styles.buttonDisabled : {})
                    }}
                  >
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <polyline points="9 18 15 12 9 6"></polyline>
                    </svg>
                  </button>
                </div>
              </div>
              
              <div style={styles.documentContainer}>
                <Document
                  file={pdfFiles.january.file}
                  onLoadSuccess={onJanuaryLoadSuccess}
                  loading={<div style={{color: '#ffffff', padding: '20px'}}>Loading PDF...</div>}
                  error={<div style={{color: '#e03747', padding: '20px'}}>Failed to load PDF!</div>}
                >
                  <Page 
                    pageNumber={januaryPageNumber} 
                    width={400}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
            </div>
            
            <a 
              href={pdfFiles.january.file}
              download="january.pdf"
              style={{
                ...styles.downloadBar,
                textDecoration: 'none',
                color: 'white'
              }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="16" 
                height="16" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              Download PDF
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

// The HomePage component remains the same
const HomePage = () => {
  return (
    <div className="page-container">
        <div className="hero-section">
          <ImageSlider />
        </div>
        <div className="content-container">
          <PlacementHighlights />
          <ChroniclesPreview />
          <section className="section-research">
            <div className="container-research">
              <h2 className="section-heading">Research, Projects & Achievements</h2>
              
              <div className="research-section-content">
                <div className="research-paragraphs">
                  <p className="research-paragraph">
                    At SOST, both students and faculty are actively involved in research, hands-on projects, and academic achievements across various fields. From <strong>AI and cybersecurity</strong> to <strong>renewable energy</strong> and <strong>biomedical engineering</strong>, research here focuses on practical solutions and real-world impact.
                  </p>
                  
                  <p className="research-paragraph">
                    Faculty members contribute through publications, industry collaborations, and research initiatives, while students take on technical projects, competitions, and entrepreneurial ventures. Their combined efforts have led to patents, conference presentations, and awards, highlighting SOST's commitment to innovation and academic excellence.
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