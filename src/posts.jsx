import React, { useState, useEffect } from 'react';
import './styles/posts.css';

const Posts = () => {
  // Example LinkedIn post URLs - these would typically come from an API or config
  const [posts, setPosts] = useState([
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7311813479655448576?collapsed=1",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7292588416783773697?collapsed=1",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7173706847309037568?collapsed=1",
    "https://www.linkedin.com/embed/feed/update/urn:li:share:7197579113868001280?collapsed=1"
  ]);

  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Handle responsive iframe sizing
  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Calculate dimensions based on screen size
  const getIframeDimensions = () => {
    if (windowWidth <= 768) {
      // Mobile: full width, shorter height
      return { width: '100%', height: 350 };
    } else if (windowWidth <= 1024) {
      // Tablet: half width, medium height
      return { width: '100%', height: 400 };
    } else {
      // Desktop: fixed width, taller height
      return { width: '100%', height: 450 };
    }
  };

  const dimensions = getIframeDimensions();

  return (
    <div className="page-container">
      <div className="content-container">
        <section className="posts-section">
          <div className="container">
            <h1 className="section-heading">LinkedIn Posts</h1>
            <p className="section-description">
              Stay updated with our latest announcements, achievements, and insights shared on LinkedIn.
            </p>
            
            <div className="posts-grid">
              {posts.map((postUrl, index) => (
                <div key={index} className="post-item">
                  <iframe 
                    src={postUrl}
                    height={dimensions.height}
                    width={dimensions.width}
                    frameBorder="0"
                    allowFullScreen=""
                    title={`LinkedIn post ${index + 1}`}
                    className="linkedin-iframe"
                  ></iframe>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Posts; 