import React, { useEffect, useState } from "react";
import apiConfig from "./config/apiconfig";
import ContactUs from "./contactus";
import './index.css';
import './styles/achievements.css';

// Cache key for local storage
const ACHIEVEMENTS_CACHE_KEY = 'sot_achievements_data';
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_VERSION_KEY = 'sot_data_version'; // Version tracking for cache invalidation

const AchievementsPage = () => {
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);
  const projectsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  // Filter state for student/faculty toggle
  const [activeFilter, setActiveFilter] = useState("all"); // "all", "student", or "faculty"
  // New state for search
  const [searchQuery, setSearchQuery] = useState("");

  // Function to check for data updates in the background
  const checkForUpdates = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));

      const response = await fetch(apiConfig.getUrl('api/forms/'), {
        headers: { 'X-Check-Updates-Only': 'true' },
        cache: 'no-store'  // Bypass browser cache
      });

      if (!response.ok) return;

      const data = await response.json();
      const allAchievements = data.filter(item => item.category === 'achievement');

      // Compare achievements count - simple heuristic for detecting changes
      const cachedData = localStorage.getItem(ACHIEVEMENTS_CACHE_KEY);
      if (cachedData) {
        const { data: cachedAchievements } = JSON.parse(cachedData);

        // Check if count has changed or if the latest achievement is different
        if (cachedAchievements.length !== allAchievements.length ||
          (allAchievements[0]?.id !== cachedAchievements[0]?.id)) {
          console.log('New achievements data detected, invalidating cache');

          // Increment version to invalidate caches
          const newVersion = (parseInt(localStorage.getItem(CACHE_VERSION_KEY) || '0')) + 1;
          localStorage.setItem(CACHE_VERSION_KEY, newVersion.toString());

          // Update state with new data
          setAchievements(allAchievements);

          // Store updated cache
          localStorage.setItem(ACHIEVEMENTS_CACHE_KEY, JSON.stringify({
            data: allAchievements,
            timestamp: Date.now(),
            version: newVersion
          }));
        }
      }
    } catch (error) {
      console.error("Background update check failed:", error);
    }
  };

  // Set up polling for updates (every 2 minutes)
  useEffect(() => {
    const pollInterval = setInterval(checkForUpdates, 2 * 60 * 1000);
    return () => clearInterval(pollInterval);
  }, []);

  // Effect to watch for version changes (from other tabs)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === CACHE_VERSION_KEY) {
        setDataVersion(parseInt(e.newValue || '0'));
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Fetch achievements from API with caching
  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        setLoading(true);

        // Get current cache version
        const currentVersion = parseInt(localStorage.getItem(CACHE_VERSION_KEY) || '0');

        // Check if we have cached data
        const cachedData = localStorage.getItem(ACHIEVEMENTS_CACHE_KEY);

        if (cachedData) {
          const { data, timestamp, version } = JSON.parse(cachedData);

          // Check if cache is still valid (within expiry time and version matches)
          if (Date.now() - timestamp < CACHE_EXPIRY_TIME && version === currentVersion) {
            console.log('Using cached achievements data');
            setAchievements(data);
            setLoading(false);

            // Still check for updates in the background
            setTimeout(checkForUpdates, 1000);
            return;
          }
        }

        // If no valid cache, fetch from API
        console.log('Fetching fresh achievements data');
        const response = await fetch(apiConfig.getUrl('api/forms/'));

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data = await response.json();

        // Filter for achievements only
        const allAchievements = data.filter(item => item.category === 'achievement');

        // Store in state
        setAchievements(allAchievements);

        // Cache the data with timestamp and version
        localStorage.setItem(ACHIEVEMENTS_CACHE_KEY, JSON.stringify({
          data: allAchievements,
          timestamp: Date.now(),
          version: currentVersion
        }));

        setLoading(false);
      } catch (error) {
        console.error("Error fetching achievements:", error);
        setError(error.message);
        setLoading(false);
      }
    };

    fetchAchievements();
  }, [dataVersion]); // Re-fetch when dataVersion changes (cache invalidated)

  // Function to force refresh data
  const refreshData = async () => {
    // Increment version to invalidate caches
    const newVersion = (parseInt(localStorage.getItem(CACHE_VERSION_KEY) || '0')) + 1;
    localStorage.setItem(CACHE_VERSION_KEY, newVersion.toString());

    // This will trigger a re-fetch due to the dataVersion dependency
    setDataVersion(newVersion);
  };

  // Filter achievements based on activeFilter and search query
  const filteredAchievements = achievements.filter(achievement => {
    // User type filter
    const matchesUserType =
      activeFilter === "all" ||
      (activeFilter === "student" && achievement.user_type === "STUDENT") ||
      (activeFilter === "faculty" && achievement.user_type === "FACULTY");

    // Search query filter (case-insensitive)
    const matchesSearch =
      searchQuery === "" ||
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (achievement.user?.name && achievement.user.name.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesUserType && matchesSearch;
  });

  // Calculate pagination details
  const totalPages = Math.ceil(filteredAchievements.length / projectsPerPage);
  const indexOfLastAchievement = currentPage * projectsPerPage;
  const indexOfFirstAchievement = indexOfLastAchievement - projectsPerPage;
  const currentAchievements = filteredAchievements.slice(indexOfFirstAchievement, indexOfLastAchievement);

  // Function to change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Generate limited page numbers for pagination
  const getPageNumbers = () => {
    const maxVisiblePages = 5;
    let pageNumbers = [];

    if (totalPages <= maxVisiblePages) {
      // If total pages are less than or equal to max visible, show all
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else if (currentPage <= 3) {
      // Show first 5 pages when at the beginning
      for (let i = 1; i <= 5; i++) {
        pageNumbers.push(i);
      }
      // Add ellipsis and last page
      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      // Show first page, ellipsis, and last 5 pages when near the end
      pageNumbers.push(1);
      pageNumbers.push('...');
      for (let i = totalPages - 4; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Show first page, ellipsis, current page and neighbors, ellipsis, last page
      pageNumbers.push(1);
      pageNumbers.push('...');

      // Add current page and neighbors
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        pageNumbers.push(i);
      }

      pageNumbers.push('...');
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  // Handler for filter change
  const handleFilterChange = (filter) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Handler for search
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
  };

  // Get counts for statistics
  const studentAchievementsCount = achievements.filter(a => a.user_type === "STUDENT").length;
  const facultyAchievementsCount = achievements.filter(a => a.user_type === "FACULTY").length;

  // Loading state
  const PremiumLoader = () => {
    return (
      <div className="premium-loader-container">
        <div className="premium-loader">
          <div className="circle-container">
            <div className="circle circle-1"></div>
            <div className="circle circle-2"></div>
            <div className="circle circle-3"></div>
          </div>
        </div>
      </div>
    );
  };

  const FullscreenLoader = () => <PremiumLoader />;

  const premiumLoaderStyles = `
  .premium-loader-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 1);
    backdrop-filter: blur(5px);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
  }
  
  .premium-loader {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  .circle-container {
    display: flex;
    gap: 15px;
    margin-bottom: 30px;
  }
  
  .circle {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: linear-gradient(145deg, #e74c3c, #ff7675);
    box-shadow: 0 0 15px rgba(231, 76, 60, 0.7);
    animation: pulse 1.5s infinite ease-in-out;
  }
  
  .circle-1 {
    animation-delay: 0s;
  }
  
  .circle-2 {
    animation-delay: 0.2s;
  }
  
  .circle-3 {
    animation-delay: 0.4s;
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(0.8);
      opacity: 0.6;
    }
    50% {
      transform: scale(1.2);
      opacity: 1;
    }
  }
  
  /* Add a subtle logo effect (placeholder) */
  .premium-loader::before {
    content: '';
    position: absolute;
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(231, 76, 60, 0.1) 0%, rgba(0, 0, 0, 0) 70%);
    animation: pulse-bg 4s infinite ease-in-out;
    z-index: -1;
  }
  
  @keyframes pulse-bg {
    0%, 100% {
      transform: scale(0.8);
      opacity: 0.3;
    }
    50% {
      transform: scale(1.2);
      opacity: 0.5;
    }
  }

  /* Filter toggle buttons styles */
  .filter-toggle-container {
    display: flex;
    gap: 15px;
    margin: 20px 0;
    flex-wrap: wrap;
  }
  
  .pagination-ellipsis {
    margin: 0 5px;
    color: #888;
  }
  
  .filter-toggle-button {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .search-container {
    display: flex;
        gap: 15px;
        align-items: center;
        flex-wrap: wrap;
  }
  
  .filter-toggle-button, .search-button {
    padding: 10px 20px;
    background-color: #1a1a1a;
    color: white;
    border: 1px solid #333;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.2s ease;
    font-weight: 500;
    font-size: 16px;
  }

  .search-input {
    flex-grow: 1;
        padding: 10px;
        border: 1px solid #333;
        background-color: #1a1a1a;
        color: white;
        border-radius: 6px;
        min-width: 200px;
  }
  
  .search-button {
    padding: 10px 20px;
    white-space: nowrap;
  }

  .search-button:hover {
    background-color: #f64758;
  }
  
  .filter-toggle-button:hover {
    background-color: #2a2a2a;
    border-color: #444;
  }
  
  .filter-toggle-button.active {
    background-color: #f64758;
    color: white;
    border-color: #f64758;
  }
  
  .filter-toggle-button:hover:not(.active) {
    background: #444;
    border-color: #555;
  }
  
  @media (max-width: 768px) {
    .filter-toggle-container, .search-container {
      justify-content: center;
      gap: 10px;
    }
    
    .filter-toggle-button, .search-input, .search-button {
      padding: 8px 16px;
      font-size: 14px;
    }
  }
  
  @media (max-width: 480px) {
    .filter-toggle-container, .search-container {
      flex-direction: column;
      width: 100%;
    }
    
    .filter-toggle-button, .search-input, .search-button {
      width: 100%;
      padding: 10px;
    }
    
    .search-container {
      flex-direction: row;
    }
  }
    /* Single line description with ellipsis */
.achivement-description {
  display: -webkit-box;
  -webkit-line-clamp: 2; /* Limit to 2 lines */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  max-height: 2.8em; /* Approximately 2 lines of text */
  line-height: 1.4;
  font-size: 0.9rem;
  width: 100%;
}

/* Adjust column widths to accommodate the new documents column */
.achievements-table th:first-child,
.achievements-table td:first-child {
  width: 20%;
}

.achievements-table th:nth-child(2),
.achievements-table td:nth-child(2) {
  width: 20%;
}

.achievements-table th:nth-child(3),
.achievements-table td:nth-child(3) {
  width: 40%;
}

.achievements-table th:nth-child(4),
.achievements-table td:nth-child(4) {
  width: 20%;
}

/* Document link styling */
.document-link {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background-color: #2a2a2a;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-size: 14px;
  transition: all 0.2s ease;
  border: 1px solid #444;
  white-space: nowrap;
}

.document-link:hover {
  background-color: #f64758;
  border-color: #f64758;
}

.document-icon {
  margin-right: 6px;
  font-size: 16px;
}

.no-document {
  color: #888;
  font-style: italic;
  font-size: 14px;
}

.mobile-document-container {
  display: none;
}

/* Tooltip for description */
.description-container {
  position: relative;
}

.description-container:hover .description-tooltip {
  display: block;
}

.description-tooltip {
  display: none;
  position: absolute;
  bottom: 100%;
  left: 0;
  background-color: #333;
  color: white;
  padding: 10px;
  border-radius: 4px;
  z-index: 100;
  width: 250px;
  white-space: normal;
  box-shadow: 0 2px 8px rgba(0,0,0,0.3);
  font-size: 14px;
  line-height: 1.4;
  max-height: 200px;
  overflow-y: auto;
}

/* Add a little arrow at the bottom of the tooltip */
.description-tooltip:after {
  content: '';
  position: absolute;
  top: 100%;
  left: 20px;
  border-width: 5px;
  border-style: solid;
  border-color: #333 transparent transparent transparent;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .achievements-table th:nth-child(4),
  .achievements-table td:nth-child(4) {
    display: none;
  }
  
  /* Restore original column widths for mobile */
  .achievements-table th:first-child,
  .achievements-table td:first-child,
  .achievements-table th:nth-child(2),
  .achievements-table td:nth-child(2),
  .achievements-table th:nth-child(3),
  .achievements-table td:nth-child(3) {
    width: auto;
  }
  
  .mobile-document-container {
    display: block;
    margin-top: 10px;
    padding-top: 8px;
    border-top: 1px solid #444;
  }
  
  .mobile-document-link {
    display: inline-flex;
    align-items: center;
    padding: 4px 8px;
    background-color: #2a2a2a;
    color: white;
    border-radius: 4px;
    text-decoration: none;
    font-size: 13px;
    transition: all 0.2s ease;
    border: 1px solid #444;
  }
  
  .mobile-document-link:hover {
    background-color: #f64758;
    border-color: #f64758;
  }
  
  .mobile-no-document {
    display: block;
    color: #888;
    font-style: italic;
    font-size: 13px;
  }
}
  `;

  // Loading state
  if (loading) {
    return (
      <>
        <style>{premiumLoaderStyles}</style>
        <FullscreenLoader />
      </>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="page-container">
        <div className="error-message">
          <p>Error loading achievements: {error}</p>
          <button onClick={refreshData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <style>{premiumLoaderStyles}</style>
      <section className="placement-hero">
        <div className="placement-hero-content">
          <h1 className="hero-title">Achievements at School of technology and School of Sciences and School of Sciences</h1>
          <p className="hero-description">
            Our students and faculty have received numerous accolades and recognitions for their
            outstanding work in various domains. These achievements reflect the quality of education,
            research, and innovation at our institution and inspire others to pursue excellence.
          </p>
        </div>
        <div className="placement-stats">
          <div className="stat-item">
            <h2>{achievements.length}</h2>
            <p>Total Achievements</p>
          </div>
          <div className="stat-item">
            <h2>{studentAchievementsCount}</h2>
            <p>Student Achievements</p>
          </div>
          <div className="stat-item">
            <h2>{facultyAchievementsCount}</h2>
            <p>Faculty Achievements</p>
          </div>
          <div className="stat-item">
            <h2>25+</h2>
            <p>Industry Collaborations</p>
          </div>
        </div>
      </section>
      <div className="content-container">
        <div className="research-section">
          <div className="research-content">
            <h2>Achievements at SOT and SOS</h2>
            <p>The School of technology and School of Sciences and School of Sciences takes pride in the achievements of its students, faculty, and alumni. These achievements span across various domains including academic excellence, research breakthroughs, innovation, entrepreneurship, and community service.</p>
            <p>Our community members regularly participate in and win competitions, secure research grants, publish in prestigious journals, receive awards, and contribute significantly to their fields. These accomplishments enhance the reputation of our institution and create opportunities for future generations.</p>
          </div>
        </div>
        <div className="contributions-section">
          <div className="research-content">
            <div className="header-with-refresh">
              <h2>Notable Achievements</h2>
              <button onClick={refreshData} className="refresh-button" title="Refresh achievements">
                <span className="refresh-icon">↻</span>
              </button>
            </div>
            <p>Below are some of the notable achievements by our students and faculty. These achievements demonstrate excellence, innovation, and dedication to advancing knowledge and solving real-world problems.</p>



            {/* Filter toggle buttons */}
            <div className="filter-toggle-container">
              <button
                className={`filter-toggle-button ${activeFilter === "all" ? "active" : ""}`}
                onClick={() => handleFilterChange("all")}
              >
                All Achievements
              </button>
              <button
                className={`filter-toggle-button ${activeFilter === "student" ? "active" : ""}`}
                onClick={() => handleFilterChange("student")}
              >
                Student Achievements
              </button>
              <button
                className={`filter-toggle-button ${activeFilter === "faculty" ? "active" : ""}`}
                onClick={() => handleFilterChange("faculty")}
              >
                Faculty Achievements
              </button>
            </div>
            {/* Search Container */}
            <div className="search-container">
              <input
                type="text"
                placeholder="Search achievements..."
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <button
                className="search-button"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          <div className="achievements-table-container">
            {filteredAchievements.length === 0 ? (
              <p>No {activeFilter !== "all" ? activeFilter : ""} achievements found matching your search.</p>
            ) : (
              <>
                <table className="achievements-table">
                  <thead>
                    <tr>
                      <th>Achievement Title</th>
                      <th>Achieved By</th>
                      <th>Description</th>
                      <th>Documents</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentAchievements.map((achievement, index) => (
                      <tr key={achievement.id || index}>
                        <td>{achievement.title}</td>
                        <td>
                          {achievement.user?.name ||
                            (achievement.user_type === 'STUDENT' ? 'Student' :
                              achievement.user_type === 'FACULTY' ? 'Faculty' : 'Admin')}
                          {achievement.team_members && `, ${achievement.team_members}`}
                        </td>
                        <td>
                          <div className="description-container">
                            <span className="achivement-description">{achievement.description}</span>
                            <div className="description-tooltip">
                              {achievement.description}
                            </div>
                          </div>
                          {/* Mobile-only document link that appears below description */}
                          <div className="mobile-document-container">
                            {achievement.document ? (
                              <a
                                href={achievement.document}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mobile-document-link"
                              >
                                <span className="document-icon">📄</span> View Document
                              </a>
                            ) : (
                              <span className="mobile-no-document">No file uploaded</span>
                            )}
                          </div>
                        </td>
                        <td>
                          {achievement.document ? (
                            <a
                              href={achievement.document}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="document-link"
                            >
                              <span className="document-icon">📄</span> View Document
                            </a>
                          ) : (
                            <span className="no-document">No file uploaded</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="pagination-container">
                    <div className="pagination">
                      {getPageNumbers().map((number, index) => (
                        number === '...' ?
                          <span key={`ellipsis-${index}`} className="pagination-ellipsis">...</span> :
                          <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`page-btn ${currentPage === number ? 'active' : ''}`}
                          >
                            {number}
                          </button>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

      </div>
      <ContactUs />
    </div>
  );
};

export default AchievementsPage;