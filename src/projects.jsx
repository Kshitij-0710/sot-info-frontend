import React, { useEffect, useState } from "react";
import apiConfig from "./config/apiconfig";
import ContactUs from "./contactus";
import './index.css';


// Cache key for local storage
const PROJECTS_CACHE_KEY = 'sot_projects_data';
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes in milliseconds
const CACHE_VERSION_KEY = 'sot_data_version'; // Version tracking for cache invalidation

const ProjectsPage = () => {
  // State for API projects
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataVersion, setDataVersion] = useState(0);
  
  // Configuration for pagination
  const projectsPerPage = 5;
  const [currentPage, setCurrentPage] = useState(1);
  
  // New state for filter
  const [projectFilter, setProjectFilter] = useState('all'); // 'all', 'student', or 'faculty'
  const [searchQuery, setSearchQuery] = useState(''); // New state for search query
  const [isSearching, setIsSearching] = useState(false); // New state to track searching

  
  // Function to check for data updates in the background
  const checkForUpdates = async () => {
    try {
      // Add a small random delay to prevent all clients from checking at the same time
      await new Promise(resolve => setTimeout(resolve, Math.random() * 1000));
      
      const response = await fetch(apiConfig.getUrl('api/forms/'), { 
        headers: { 'X-Check-Updates-Only': 'true' },
        cache: 'no-store'  // Bypass browser cache
      });
      
      if (!response.ok) return;
      
      const data = await response.json();
      const allProjects = data.filter(item => item.category === 'project');
      
      // Compare project count - simple heuristic for detecting changes
      const cachedData = localStorage.getItem(PROJECTS_CACHE_KEY);
      if (cachedData) {
        const { data: cachedProjects } = JSON.parse(cachedData);
        
        // Check if count has changed or if the latest project is different
        if (cachedProjects.length !== allProjects.length || 
            (allProjects[0]?.id !== cachedProjects[0]?.id)) {
          console.log('New data detected, invalidating cache');
          
          // Increment version to invalidate caches
          const newVersion = (parseInt(localStorage.getItem(CACHE_VERSION_KEY) || '0')) + 1;
          localStorage.setItem(CACHE_VERSION_KEY, newVersion.toString());
          
          // Update state with new data
          setProjects(allProjects);
          
          // Store updated cache
          localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify({
            data: allProjects,
            timestamp: Date.now(),
            version: newVersion
          }));
        }
      }
    } catch (error) {
      console.error("Background update check failed:", error);
      // Non-critical, so we don't set error state
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
  
  // Fetch projects from API with caching
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Get current cache version
        const currentVersion = parseInt(localStorage.getItem(CACHE_VERSION_KEY) || '0');
        
        // Check if we have cached data
        const cachedData = localStorage.getItem(PROJECTS_CACHE_KEY);
        
        if (cachedData) {
          const { data, timestamp, version } = JSON.parse(cachedData);
          
          // Check if cache is still valid (within expiry time and version matches)
          if (Date.now() - timestamp < CACHE_EXPIRY_TIME && version === currentVersion) {
            console.log('Using cached projects data');
            setProjects(data);
            setLoading(false);
            
            // Still check for updates in the background
            setTimeout(checkForUpdates, 1000);
            return;
          }
        }
        
        // If no valid cache, fetch from API
        console.log('Fetching fresh projects data');
        const response = await fetch(apiConfig.getUrl('api/forms/'));
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Filter for projects only
        const allProjects = data.filter(item => item.category === 'project');
        
        // Store in state
        setProjects(allProjects);
        
        // Cache the data with timestamp and version
        localStorage.setItem(PROJECTS_CACHE_KEY, JSON.stringify({
          data: allProjects,
          timestamp: Date.now(),
          version: currentVersion
        }));
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching projects:", error);
        setError(error.message);
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, [dataVersion]); // Re-fetch when dataVersion changes (cache invalidated)
  
  // Function to force refresh data
  const refreshData = async () => {
    // Increment version to invalidate caches
    const newVersion = (parseInt(localStorage.getItem(CACHE_VERSION_KEY) || '0')) + 1;
    localStorage.setItem(CACHE_VERSION_KEY, newVersion.toString());
    
    // This will trigger a re-fetch due to the dataVersion dependency
    setDataVersion(newVersion);
  };
  
  const handleFilterChange = (filter) => {
    setProjectFilter(filter);
    setCurrentPage(1); // Reset to first page when changing filters
  };
    // Handle search input change
    const handleSearchChange = (e) => {
      setSearchQuery(e.target.value);
      setCurrentPage(1); // Reset to first page when searching
    };
    
    // Handle search button click
    const handleSearchClick = () => {
      setIsSearching(true);
      // You can add additional search logic here if needed
    };
    
    // Filter projects based on selection and search
    const filteredProjects = projects.filter(project => {
      const matchesFilter = 
        projectFilter === 'all' || 
        (projectFilter === 'student' && project.user_type === 'STUDENT') || 
        (projectFilter === 'faculty' && project.user_type === 'FACULTY');
      
      const matchesSearch = 
        !searchQuery || 
        project.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.user?.name && project.user.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (project.team_members && project.team_members.toLowerCase().includes(searchQuery.toLowerCase()));
      
      return matchesFilter && matchesSearch;
    });
  // Calculate pagination details
  const totalPages = Math.ceil(filteredProjects.length / projectsPerPage);
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = filteredProjects.slice(indexOfFirstProject, indexOfLastProject);
  
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
  
  .loading-text {
    color: #ffffff;
    font-family: 'Poppins', sans-serif;
    font-size: 18px;
    font-weight: 500;
    letter-spacing: 3px;
    margin-top: 10px;
    display: flex;
  }
  
  .loading-text span {
    animation: fadeInOut 2s infinite ease-in-out;
    opacity: 0.3;
    margin: 0 1px;
  }
  
  .loading-text span:nth-child(1) { animation-delay: 0.1s; }
  .loading-text span:nth-child(2) { animation-delay: 0.2s; }
  .loading-text span:nth-child(3) { animation-delay: 0.3s; }
  .loading-text span:nth-child(4) { animation-delay: 0.4s; }
  .loading-text span:nth-child(5) { animation-delay: 0.5s; }
  .loading-text span:nth-child(6) { animation-delay: 0.6s; }
  .loading-text span:nth-child(7) { animation-delay: 0.7s; }
  .loading-text span:nth-child(8) { animation-delay: 0.8s; }
  .loading-text span:nth-child(9) { animation-delay: 0.9s; }
  .loading-text span:nth-child(10) { animation-delay: 1.0s; }
  
  @keyframes fadeInOut {
    0%, 100% {
      opacity: 0.3;
    }
    50% {
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
          <p>Error loading projects: {error}</p>
          <button onClick={refreshData} className="retry-button">
            Retry
          </button>
        </div>
      </div>
    );
  }
  
  // Count projects by type for display
  const studentProjectsCount = projects.filter(project => project.user_type === 'STUDENT').length;
  const facultyProjectsCount = projects.filter(project => project.user_type === 'FACULTY').length;
  
  return (
    
    <div className="page-container">
        <section className="placement-hero">
          <div className="placement-hero-content">
            <h1 className="hero-title">Projects at School of Technology and Sciences</h1>
            <p className="hero-description">
              Our students engage in a wide range of innovative projects spanning software development, 
              hardware design, data analysis, and more. These projects provide practical experience 
              and help students apply theoretical knowledge to real-world problems, often in collaboration 
              with industry partners.
            </p>
          </div>
          <div className="placement-stats">
            <div className="stat-item">
              <h2>{projects.length}</h2>
              <p>Active Projects</p>
            </div>
            <div className="stat-item">
              <h2>{studentProjectsCount}</h2>
              <p>Student Projects</p>
            </div>
            <div className="stat-item">
              <h2>{facultyProjectsCount}</h2>
              <p>Faculty Projects</p>
            </div>
            <div className="stat-item">
              <h2>8</h2>
              <p>Research Areas</p>
            </div>
          </div>
        </section>
        <div className="content-container">
          <div className="research-section">
            <div className="research-content">
              <h2>Projects at SOT and SOS</h2>
              <p>At the School of Technology and School of Sciences, projects form an integral part of our curriculum. Students engage in a wide range of projects, from individual assignments to collaborative ventures, covering diverse areas such as software development, hardware design, data analysis, and more.</p>
              <p>These projects provide practical experience and help students apply theoretical knowledge to real-world problems. Many projects are developed in collaboration with industry partners, ensuring relevance and exposure to current industry practices and challenges.</p>
            </div>
          </div>
          <div className="contributions-section">
            <div className="research-content">
              <div className="header-with-refresh">
                <h2>All Projects</h2>
                <button onClick={refreshData} className="refresh-button" title="Refresh projects">
                  <span className="refresh-icon">↻</span>
                </button>
              </div>
              <p>
                {projectFilter === 'all' && 'Below are projects developed by our students and faculty.'}
                {projectFilter === 'student' && 'Below are projects developed by our talented students.'}
                {projectFilter === 'faculty' && 'Below are research and development projects led by our faculty.'}
                {' '}These projects showcase innovation, technical excellence, and creative problem-solving approaches.
              </p>
              
              
              {/* Project type toggle buttons */}
              <div className="project-filter-buttons">
                <button 
                  className={`filter-btn ${projectFilter === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('all')}
                >
                  All Projects
                </button>
                <button 
                  className={`filter-btn ${projectFilter === 'student' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('student')}
                >
                  Student Projects
                </button>
                <button 
                  className={`filter-btn ${projectFilter === 'faculty' ? 'active' : ''}`}
                  onClick={() => handleFilterChange('faculty')}
                >
                  Faculty Projects
                </button>
              </div>
              <div className="projects-search-container">
                <div className="search-input-wrapper">
                  <input 
                    type="text" 
                    placeholder="Search projects..." 
                    className="projects-search-input"
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                  <button 
                    className={`search-btn ${isSearching ? 'searching' : ''}`}
                    onClick={handleSearchClick}
                  >
                    Search
                  </button>
                </div>
              </div>
              
             
            </div>
            <div className="projects-table-container">
              {filteredProjects.length === 0 ? (
                <p className="no-projects-message">No {projectFilter !== 'all' ? projectFilter : ''} projects available at this time.</p>
              ) : (
                <>
                  <table className="projects-table">
                    <thead>
                      <tr>
                        <th>Project Name</th>
                        <th>Authors</th>
                        <th>Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {currentProjects.map((project, index) => (
                        <tr key={project.id || index}>
                          <td>{project.title}</td>
                          <td>
                            {project.user?.name || 
                              (project.user_type === 'STUDENT' ? 'Student' : 
                               project.user_type === 'FACULTY' ? 'Faculty' : 'Admin')}
                            {project.team_members && `, ${project.team_members}`}
                          </td>
                          <td>{project.description}</td>
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
        {/* Add styles for loading, error, and refresh */}
        <style jsx>{`          
          .error-message {
            text-align: center;
            padding: 30px;
            background: #f9f9f9;
            border-radius: 8px;
            color: #dc3545;
          }
          
          .retry-button {
            padding: 8px 16px;
            background: #dc3545;
            color: white;
            border: none;
            border-radius: 4px;
            margin-top: 15px;
            cursor: pointer;
          }
          
          .header-with-refresh {
            display: flex;
            align-items: center;
            gap: 15px;
          }
          
          .refresh-button {
            margin-top: -25px;
            background: none;
            border: none;
            font-size: 18px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #f64758;
            transition: transform 0.3s ease;
          }
          
          .refresh-button:hover {
            transform: rotate(180deg);
          }
          
          .refresh-icon {
            font-size: 35px;
          }
          
          .pagination-ellipsis {
            margin: 0 5px;
            color: #888;
          }
          
          /* Project filter buttons */
          .project-filter-buttons {
            display: flex;
            gap: 15px;
            margin: 20px 0;
            flex-wrap: wrap;
          }
          
          .filter-btn {
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
          
          .filter-btn:hover {
            background-color: #2a2a2a;
            border-color: #444;
          }
          
          .filter-btn.active {
            background-color: #f64758;
            color: white;
            border-color: #f64758;
          }
          
          .no-projects-message {
            text-align: center;
            padding: 30px;
            background: #1a1a1a;
            border-radius: 8px;
            color: white;
            margin: 20px 0;
          }
          
          /* Responsive filter buttons */
          @media (max-width: 768px) {
            .project-filter-buttons {
              justify-content: center;
              gap: 10px;
            }
            
            .filter-btn {
              padding: 8px 16px;
              font-size: 14px;
            }
          }
          
          @media (max-width: 480px) {
            .project-filter-buttons {
              flex-direction: column;
              width: 100%;
            }
            
            .filter-btn {
              width: 100%;
              padding: 10px;
            }
          }
          .projects-search-container {
            margin: 20px 0;
            display: flex;
            justify-content: center;
          }
          
          .search-input-wrapper {
            display: flex;
            width: 100%;
            gap: 10px;
          }
          
          .projects-search-input {
            flex-grow: 1;
            padding: 10px 20px;
            border: 1px solid #333;
            background-color: #1a1a1a;
            color: white;
            border-radius: 6px;
            font-size: 16px;
            transition: all 0.2s ease;
          }
          
          
          .projects-search-input::placeholder {
            color: #888;
          }
          
          .search-btn {
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
          
          .search-btn:hover {
            background-color: #f64758;
          }
          
          .search-btn.searching {
            background-color: #f64758;
            color: white;
            border-color: #f64758;
          }
          
          @media (max-width: 768px) {
            .projects-search-input,
            .search-btn {
              font-size: 14px;
              padding: 8px 16px;
            }
            
            .search-input-wrapper {
              flex-direction: column;
            }
            
            .search-btn {
              margin-top: 10px;
              width: 100%;
            }
          }
        `}</style>
    </div>
  );
};

export default ProjectsPage;