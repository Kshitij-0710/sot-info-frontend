import axios from 'axios';
import React, { useEffect, useState } from 'react';
import apiConfig from "./config/apiconfig";
import './styles/posts.css';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  // Fetch LinkedIn posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(apiConfig.getUrl("/api/linkedin-embeds/"));
        if (response.data && response.data.embed_urls) {
          setPosts(response.data.embed_urls);
        } else {
          setError("Failed to load LinkedIn posts. Please try again later.");
        }
      } catch (err) {
        console.error('Error fetching LinkedIn posts:', err);
        setError("Failed to load LinkedIn posts. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

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
      return { width: '100%', height: 350 };
    } else if (windowWidth <= 1024) {
      return { width: '100%', height: 400 };
    } else {
      return { width: '100%', height: 450 };
    }
  };

  const dimensions = getIframeDimensions();

  // Render loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="content-container">
          <section className="posts-section">
            <div className="container">
              <h1 className="section-heading">Our <span className="highlight">Insights</span></h1>
              <div className="loading-container">
                <div className="loading-spinner"></div>
                <p className="loading-text">Loading posts...</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Render error state
  if (error) {
    return (
      <div className="page-container">
        <div className="content-container">
          <section className="posts-section">
            <div className="container">
              <h1 className="section-heading">Our <span className="highlight">Insights</span></h1>
              <div className="error-container">
                <div className="error-icon">!</div>
                <p className="error-message">{error}</p>
                <button className="retry-button" onClick={() => window.location.reload()}>
                  Try Again
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  // Render empty state
  if (posts.length === 0) {
    return (
      <div className="page-container">
        <div className="content-container">
          <section className="posts-section">
            <div className="container">
              <h1 className="section-heading">Our <span className="highlight">Insights</span></h1>
              <div className="empty-container">
                <div className="empty-icon">📝</div>
                <p className="empty-message">
                  No LinkedIn posts available at the moment. 
                  <span className="empty-submessage">Check back soon for fresh insights.</span>
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-container">
        <section className="posts-section">
          <div className="container">
            <div className="section-header">
              <div className="header-decoration"></div>
              <h1 className="section-heading">Our <span className="highlight">Insights</span></h1>
              <div className="header-decoration"></div>
            </div>
            <p className="section-description">
              Stay updated with our latest announcements, achievements, and expert insights shared on LinkedIn.
            </p>
            <div className="posts-grid">
              {posts.map((postUrl, index) => (
                <div key={index} className="post-item">
                  <div className="post-header">
                    <div className="post-badge">{index + 1}</div>
                    <div className="post-accent"></div>
                  </div>
                  <div className="post-content">
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