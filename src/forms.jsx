import React, { useEffect, useState } from "react";
import apiConfig from "./config/apiconfig";
import "./index.css";
import './styles/forms.css';
// Add new styles for improved UI components


const Forms = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [forms, setForms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  // Form data state matching Django model fields
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    team_members: "",
    tech_stack: "",
    projecturl: "",
    achivements: "",
    from_date: "",
    to_date: "",
    category: "",
    is_ongoing: false,
    document: null
  });

  // Get user data from localStorage
  const getUserFromLocalStorage = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        return JSON.parse(userStr);
      } catch (e) {
        console.error('Failed to parse user data:', e);
      }
    }
    return null;
  };

  const user = getUserFromLocalStorage();

  // Fetch user's forms on component mount
  useEffect(() => {
    fetchForms();
  }, []);

  // Fetch only forms belonging to the current user
  const fetchForms = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      const user = getUserFromLocalStorage();
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      if (!user || !user.id) {
        throw new Error('User information is missing. Please log in again.');
      }

      // Get only the current user's forms using dedicated endpoint
      const response = await fetch(apiConfig.getUrl('api/forms/my_forms/'), {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Your session has expired. Please log in again.');
        }
        throw new Error('Failed to fetch your forms. Please try again.');
      }

      const data = await response.json();
      
      // Filter forms to only show forms created by the current user
      const userForms = data.filter(form => form.user && form.user.id === user.id);
      setForms(userForms);
    } catch (err) {
      console.error('Error fetching forms:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input change with title validation
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Handle checkbox inputs
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: checked });
      return;
    }

    // Handle file inputs
    if (type === 'file') {
      if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0]);
        setFormData({ ...formData, document: e.target.files[0] });
      }
      return;
    }

    if (name === "title") {
      const wordCount = value.trim().split(/\s+/).length;
      if (wordCount > 4) {
        setError("Title should not exceed 4 words.");
        return;
      } else {
        setError(null); // Clear the error if within limit
      }
    }

    setFormData({ ...formData, [name]: value });
  };

  // Handle form deletion
  const handleDeleteForm = async (formId) => {
    setFormToDelete(formId);
    setShowDeleteModal(true);
  };
  
  // Confirm deletion from modal
  const confirmDelete = async () => {
    const formId = formToDelete;
    setShowDeleteModal(false);
    setIsLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Fixed URL format - removed the leading slash
      const response = await fetch(apiConfig.getUrl(`api/forms/${formId}/`), {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Your session has expired. Please log in again.');
        } else if (response.status === 403) {
          throw new Error('You do not have permission to delete this entry.');
        } else if (response.status === 404) {
          throw new Error('This entry no longer exists.');
        }
        throw new Error('Failed to delete entry. Please try again.');
      }

      // Successfully deleted
      setSuccess('Entry deleted successfully');
      
      // Update the forms list by removing the deleted form
      setForms(forms.filter(form => form.id !== formId));
      
    } catch (err) {
      console.error('Error deleting form:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
      
      // Clear success message after a delay
      if (!error) {
        setTimeout(() => {
          setSuccess(null);
        }, 3000);
      }
    }
  };

  // Convert comma-separated string to array
  const stringToArray = (str) => {
    if (!str) return [];
    return str.split(',').map(item => item.trim()).filter(Boolean);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found. Please log in again.');
      }

      // Use FormData for multipart/form-data to handle file uploads
      const formDataToSubmit = new FormData();
      
      // Add all text fields
      formDataToSubmit.append('title', formData.title);
      formDataToSubmit.append('description', formData.description);
      formDataToSubmit.append('team_members', formData.team_members);
      formDataToSubmit.append('projecturl', formData.projecturl);
      formDataToSubmit.append('category', formData.category);
      formDataToSubmit.append('from_date', formData.from_date);
      formDataToSubmit.append('is_ongoing', formData.is_ongoing);
      
      // If to_date is empty and is_ongoing is checked, don't send to_date
      if (!formData.is_ongoing && formData.to_date) {
        formDataToSubmit.append('to_date', formData.to_date);
      }
      
      // Add arrays - convert strings to arrays first
      const techStackArray = stringToArray(formData.tech_stack);
      const achievementsArray = stringToArray(formData.achivements);
      
      // For arrays, we need to append each item individually with the same key
      techStackArray.forEach(tech => {
        formDataToSubmit.append('tech_stack', tech);
      });
      
      achievementsArray.forEach(achievement => {
        formDataToSubmit.append('achivements', achievement);
      });
      
      // Add file if selected
      if (selectedFile) {
        formDataToSubmit.append('document', selectedFile);
      }

      const response = await fetch(apiConfig.getUrl('api/forms/'), {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          // Don't set Content-Type when using FormData - the browser will set it automatically with boundary
        },
        body: formDataToSubmit
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Your session has expired. Please log in again.');
        }
        
        const errorData = await response.json();
        if (errorData.detail) {
          throw new Error(errorData.detail);
        } else {
          // Format validation errors
          const errorMessages = [];
          for (const field in errorData) {
            errorMessages.push(`${field}: ${errorData[field].join(' ')}`);
          }
          throw new Error(errorMessages.join('. '));
        }
      }

      const data = await response.json();
      setSuccess('Form submitted successfully!');
      
      // Reset form data
      setFormData({
        title: "",
        description: "",
        team_members: "",
        tech_stack: "",
        projecturl: "",
        achivements: "",
        from_date: "",
        to_date: "",
        category: "",
        is_ongoing: false,
        document: null
      });
      setSelectedFile(null);
      
      setShowForm(false);
      fetchForms(); // Refresh the forms list
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Present';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  // Safely render tech stack badges
  const renderTechStack = (techStack) => {
    if (!techStack) return null;
    
    // Parse if string, use directly if already array
    let techItems = [];
    
    if (typeof techStack === 'string') {
      techItems = techStack.split(',').map(item => item.trim()).filter(Boolean);
    } else if (Array.isArray(techStack)) {
      techItems = techStack;
    } else {
      console.warn('Unexpected tech_stack type:', typeof techStack);
      return null;
    }
    
    return techItems.map((tech, index) => (
      <span key={index} className="tech-badge">{tech}</span>
    ));
  };

  // Render document link if available
  const renderDocumentLink = (form) => {
    if (form.document) {
      return (
        <div className="document-link">
          <a href={form.document} target="_blank" rel="noopener noreferrer">
            View Document
          </a>
        </div>
      );
    }
    return null;
  };

  // Safely render achievements
  const renderAchievements = (achievements) => {
    if (!achievements) return null;
    
    // Parse if string, use directly if already array
    let achievementItems = [];
    
    if (typeof achievements === 'string') {
      achievementItems = achievements.split(',').map(item => item.trim()).filter(Boolean);
    } else if (Array.isArray(achievements)) {
      achievementItems = achievements;
    } else {
      console.warn('Unexpected achievements type:', typeof achievements);
      return null;
    }
    
    // Only used for display, we're returning null here since achievements
    // aren't shown in the cards in the original code
    return null;
  };

  if (!user) {
    return (
      <div className="forms-container">
        <h2>Authentication Required</h2>
        <p>Please log in to access this page.</p>
        <button onClick={() => window.location.href = '/login'}>Go to Login</button>
      </div>
    );
  }

return (
    <div className="forms-wrapper">
    <div className="forms-container">
      <h2>Research, Projects & Achievements</h2>
      
      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">{success}</div>}
      
      {!showForm ? (
        <div className="forms-list-container">
          <button className="add-form-btn" onClick={() => setShowForm(true)}>
            + Add New Entry
          </button>
          
          {isLoading ? (
            <p>Loading your entries...</p>
          ) : forms.length > 0 ? (
            <div className="forms-grid">
              {forms.map(form => (
                <div className="form-card" key={form.id}>
                  <div className="card-header">
                    <h3>{form.title}</h3>
                    <button 
                      className="delete-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteForm(form.id);
                      }}
                      title="Delete entry"
                    >
                      ×
                    </button>
                  </div>
                  <span className="category-badge">{form.category}</span>
                  <p className="description-text">{form.description}</p>
                  <div className="form-dates">
                    {formatDate(form.from_date)} - {formatDate(form.to_date)}
                  </div>
                  <div className="tech-stack">
                    {renderTechStack(form.tech_stack)}
                  </div>
                  {renderDocumentLink(form)}
                </div>
              ))}
            </div>
          ) : (
            <p>You haven't added any entries yet. Click the button above to get started!</p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="entry-form" encType="multipart/form-data">
          <h3>Add New Entry</h3>
          
          <div className="form-group">
            <label>Category:</label>
            <select 
              name="category" 
              value={formData.category} 
              onChange={handleChange} 
              required
            >
              <option value="">Select a Category</option>
              <option value="achievement">Achievement</option>
              <option value="research">Research</option>
              <option value="project">Project</option>
            </select>
          </div>

          <div className="form-group">
            <label>Title:</label>
            <input 
              type="text" 
              name="title" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Description:</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Team Members (comma separated):</label>
            <input 
              type="text" 
              name="team_members" 
              value={formData.team_members} 
              onChange={handleChange} 
            />
            <small>Optional: Leave blank if no team members</small>
          </div>

          <div className="form-group">
            <label>Technology Stack (comma separated):</label>
            <input 
              type="text" 
              name="tech_stack" 
              value={formData.tech_stack} 
              onChange={handleChange} 
              required 
            />
            <small>Example: React, Django, Python</small>
          </div>

          <div className="form-group">
            <label>Project URL:</label>
            <input 
              type="text" 
              name="projecturl" 
              value={formData.projecturl} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group">
            <label>Achievements (comma separated):</label>
            <textarea 
              name="achivements" 
              value={formData.achivements} 
              onChange={handleChange} 
              required 
            />
            <small>Example: Won first prize, Published paper</small>
          </div>

          <div className="form-group file-upload-container">
            <label>Document Upload (PDF, DOC, etc.):</label>
            <div className="custom-file-upload">
              <input 
                type="file" 
                id="document-upload"
                name="document" 
                onChange={handleChange} 
                accept=".pdf,.doc,.docx,.ppt,.pptx,.xlsx,.xls,.txt,.zip"
                className="file-input"
              />
              <label htmlFor="document-upload" className="file-label">
                <span className="file-icon">📎</span>
                <span className="file-text">
                  {selectedFile ? selectedFile.name : "Choose a file"}
                </span>
              </label>
              {selectedFile && (
                <button 
                  type="button" 
                  className="file-clear-btn"
                  onClick={() => {
                    setSelectedFile(null);
                    setFormData({...formData, document: null});
                  }}
                >
                  ✕
                </button>
              )}
            </div>
            <small>Upload supporting documents (max 10MB)</small>
          </div>

          <div className="form-group">
            <label>From Date:</label>
            <input 
              type="date" 
              name="from_date" 
              value={formData.from_date} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group toggle-switch-container">
            <label>Is this an ongoing project/research?</label>
            <div className="toggle-switch">
              <input 
                type="checkbox" 
                id="is-ongoing-toggle"
                name="is_ongoing" 
                checked={formData.is_ongoing} 
                onChange={handleChange}
                className="toggle-input" 
              />
              <label htmlFor="is-ongoing-toggle" className="toggle-label">
                <span className="toggle-inner"></span>
                <span className="toggle-switch-status">
                  {formData.is_ongoing ? "Yes" : "No"}
                </span>
              </label>
            </div>
          </div>

          {!formData.is_ongoing && (
            <div className="form-group">
              <label>To Date:</label>
              <input 
                type="date" 
                name="to_date" 
                value={formData.to_date} 
                onChange={handleChange} 
                required={!formData.is_ongoing}
              />
            </div>
          )}

          <div className="form-buttons">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Submitting...' : 'Submit Entry'}
            </button>
            <button 
              type="button" 
              onClick={() => setShowForm(false)} 
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
          </div>
      
      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="delete-modal">
            <h3>Confirm Deletion</h3>
            <p>Are you sure you want to delete this entry? This action cannot be undone.</p>
            <div className="modal-buttons">
              <button 
                className="cancel-modal-btn" 
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button 
                className="confirm-delete-btn" 
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Forms;