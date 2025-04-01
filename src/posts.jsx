import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './styles/posts.css';
import apiConfig from "./config/apiconfig";

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const [apiResponse, setApiResponse] = useState(null); // For debugging

  // Fetch LinkedIn posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        console.log("Fetching LinkedIn posts...");
        setLoading(true);
        
        
        
        const response = await axios.get(apiConfig.getUrl("/api/linkedin-embeds/"));
        console.log("API Response:", response.data);
        
        setApiResponse(response.data); // Store full response for debugging
        
        // Check if embed_urls exists in response data
        if (response.data && response.data.embed_urls) {
          setPosts(response.data.embed_urls);
          console.log("Posts set successfully:", response.data.embed_urls);
        } else {
          // If the expected data structure isn't found
          console.error("Unexpected API response structure:", response.data);
          setError("API returned an unexpected data format. Check console for details.");
        }
      } catch (err) {
        console.error('Error fetching LinkedIn posts:', err);
        console.error('Error details:', err.response ? err.response.data : 'No response data');
        setError(`Failed to load LinkedIn posts: ${err.message}. Check the console for more details.`);
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

  // Debug info component
  const DebugInfo = () => (
    <div style={{ padding: '20px', border: '1px solid #ccc', marginTop: '20px', background: '#f5f5f5' }}>
      <h3>Debug Information</h3>
      <p><strong>API Response:</strong> {JSON.stringify(apiResponse)}</p>
      <p><strong>Loading:</strong> {loading.toString()}</p>
      <p><strong>Error:</strong> {error || 'None'}</p>
      <p><strong>Posts Count:</strong> {posts.length}</p>
      <p><strong>Window Width:</strong> {windowWidth}px</p>
    </div>
  );

  // Render loading state
  if (loading) {
    return (
      <div className="page-container">
        <div className="content-container">
          <section className="posts-section">
            <div className="container">
              <h1 className="section-heading">LinkedIn Posts</h1>
              <p className="section-description">Loading posts...</p>
              <DebugInfo />
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
              <h1 className="section-heading">LinkedIn Posts</h1>
              <p className="section-description">{error}</p>
              <DebugInfo />
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
              <h1 className="section-heading">LinkedIn Posts</h1>
              <p className="section-description">
                No LinkedIn posts available at the moment. Please check back later.
              </p>
              <DebugInfo />
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
            <DebugInfo />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Posts;