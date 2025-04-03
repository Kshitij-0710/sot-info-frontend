import React, { useState, useEffect } from "react";
import { FaArrowRight } from "react-icons/fa";
import ContactUs from "./contactus";
import "./index.css"; // Load index.css first
import "./styles/Placements.css"; // Load placement.css after, so it overrides index.css
import apiConfig from "./config/apiconfig";

// Ensure consistent styling with index.css for the hero banner
const bannerStyles = {
  placementHero: {
    minHeight: "350px",
    height: "auto",
    padding: "4rem 8rem"
  },
  statItem: {
    height: "180px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center"
  }
};

// Default company logos
const companyLogos = [
  { name: "Google", src: "https://img.icons8.com/color/96/google-logo.png" },
  { name: "Microsoft", src: "https://img.icons8.com/fluency/96/microsoft.png" },
  { name: "Amazon", src: "https://img.icons8.com/color/96/amazon.png" },
  { name: "Meta", src: "https://img.icons8.com/color/96/facebook-new.png" },
];

// Hardcoded testimonials as fallback
const hardcodedTestimonials = [
  {
    id: 1,
    title: "Success Story 1",
    student: "Student 1",
    batch: "BTech 2024",
    company: "Google",
    description: "The placement cell helped me refine my skills and connect with the right companies. The experience was invaluable!",
    date: "2023-05-15",
    package: "24 LPA"
  },
  {
    id: 2,
    title: "Success Story 2",
    student: "Student 2",
    batch: "BTech 2024",
    company: "Amazon",
    description: "The placement cell helped me refine my skills and connect with the right companies. The experience was invaluable!",
    date: "2023-06-20",
    package: "18 LPA"
  },
  {
    id: 3,
    title: "Success Story 3",
    student: "Student 3",
    batch: "BTech 2024",
    company: "Microsoft",
    description: "The placement cell helped me refine my skills and connect with the right companies. The experience was invaluable!",
    date: "2023-07-10",
    package: "22 LPA"
  }
];

const Placements = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const testimonialsPerPage = 2;

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
        
        // We'll use all placements here, not just top_2 since this is the full page
        setTestimonials(data);
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

  const nextTestimonials = () => {
    setCurrentIndex((prevIndex) => {
      if (prevIndex + testimonialsPerPage >= testimonials.length) {
        return 0; // Reset to the beginning when reaching the end
      }
      return prevIndex + testimonialsPerPage;
    });
  };
  
  if (loading) {
    return <div className="loading">Loading placement data...</div>;
  }

  if (error && testimonials.length === 0) {
    return <div className="error">{error}</div>;
  }
  
  return (
    <div>
      <div className="placements-container">
        <section className="placement-hero">
          <div className="placement-hero-content">
            <h1 className="hero-title">B.Tech Placement Highlights</h1>
            <p className="hero-description">
              Woxsen's B.Tech program stands out for its cutting-edge facilities,
              including the AI & Robotics studio, where students immerse
              themselves in hands-on projects. Workshops for skill development and
              mentorship opportunities at the Trade Tower further enhance their
              learning journey. With a steadfast dedication to industry relevance
              and practical learning, Woxsen ensures that B.Tech graduates are
              equipped to excel in today's dynamic tech sector, positioning them
              as top choices for leading recruiters.
            </p>
          </div>
          <div className="placement-stats">
            <div className="stat-item">
              <h2>100%</h2>
              <p>Placement Track</p>
            </div>
            <div className="stat-item" style={bannerStyles.statItem}>
              <h2>24.00</h2>
              <p>Highest CTC</p>
            </div>
            <div className="stat-item" style={bannerStyles.statItem}>
              <h2>11.5</h2>
              <p>Top 20% Avg. CTC</p>
            </div>
            <div className="stat-item" style={bannerStyles.statItem}>
              <h2>8.6</h2>
              <p>Overall Avg. CTC</p>
            </div>
            <div className="stat-item" style={bannerStyles.statItem}>
              <h2>40+</h2>
              <p>Corporates for Internships</p>
            </div>
          </div>
        </section>

        <section className="hiring-section">
          <h2 className="hiring-section-title">Top Hiring Companies</h2>
          <div className="hiring-companies">
            {companyLogos.map((company, index) => (
              <div key={index} className="company-card">
                <img
                  src={company.src}
                  alt={company.name}
                  className="company-logo"
                />
              </div>
            ))}
          </div>
        </section>

        <div className="testimonials-wrapper">
          <h2 className="testimonials-title">Placement Stories</h2>
          {testimonials.length > 0 ? (
            <div className="testimonials-container">
              {testimonials
                .slice(currentIndex, currentIndex + testimonialsPerPage)
                .map((testimonial) => (
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
                ))}
              <div className="next-arrow" onClick={nextTestimonials}>
                <FaArrowRight />
              </div>
            </div>
          ) : (
            <div className="no-data">No placement data available</div>
          )}
        </div>
      </div>
      <ContactUs />
    </div>
  );
};

export default Placements;