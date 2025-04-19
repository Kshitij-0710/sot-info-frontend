import axios from 'axios';
import React, { useEffect, useState } from "react";
import apiConfig from "./config/apiconfig";
import ContactUs from "./contactus";
import './styles/events.css';

// Event Modal Component
const EventModal = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Determine event type for header display
  const getEventType = () => {
    const title = event.title.toLowerCase();
    if (title.includes('workshop')) return { text: 'WORKSHOP', color: '#f64758' };
    if (title.includes('symposium')) return { text: 'SYMPOSIUM', color: '#f64758' };
    if (title.includes('fair')) return { text: 'FAIR', color: '#f64758' };
    return { text: 'EVENT', color: '#f64758' };
  };

  const eventType = getEventType();
  const eventDate = new Date(event.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <div className="modal-body">
          <div className="modal-left-column">
            <div className="modal-header" style={{ backgroundColor: eventType.color }}>
              <div className="event-type">{eventType.text}</div>
            </div>
            <img
              src={event.image_url || '/images/default-event.jpg'}
              alt={event.title}
              className="modal-image"
              onError={(e) => { e.target.src = '/images/default-event.jpg'; }}
            />
          </div>
          <div className="modal-details">
            {event.is_featured && <span className="featured-badge">Featured Event</span>}
            <h2>{event.title}</h2>
            <p className="modal-organizer"><strong>{event.organizer}</strong></p>
            <div className="event-meta">
              <div className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="meta-icon">
                  <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{eventDate}</span>
              </div>
              <div className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="meta-icon">
                  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{event.location}</span>
              </div>
            </div>
            <p className="modal-description">{event.description}</p>
            <div className="modal-actions">
              <button className="primary-button" onClick={() => shareEvent(event)}>Share Event</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const shareEvent = (event) => {
  if (navigator.share) {
    navigator.share({
      title: event.title,
      text: `Check out this event: ${event.title}`,
      url: window.location.href,
    }).catch((error) => console.log('Error sharing', error));
  } else {
    navigator.clipboard.writeText(window.location.href)
      .then(() => alert('Event link copied to clipboard!'))
      .catch(() => alert('Failed to copy link'));
  }
};

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetchEvents();
  }, []);

  // Function to get event image path with cycling through available images
  const getEventImagePath = (index) => {
    const imageNumber = (index % 3) + 3; // This will cycle through 3, 4, 5
    return `/images/event${imageNumber}.jpg`;
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const [eventsResponse, featuredResponse] = await Promise.all([
        axios.get(apiConfig.getUrl('api/events/')),
        axios.get(apiConfig.getUrl('api/events/featured/'))
      ]);

      const allEvents = eventsResponse.data;
      const featured = featuredResponse.data;
      const upcoming = allEvents.filter(event => !event.is_featured);
      upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));

      // Add sample events if needed
      if (upcoming.length < 3) {
        const upcomingCount = upcoming.length;
        
        upcoming.push(
          {
            id: 'sample-1',
            title: 'AI Research Workshop',
            date: new Date().setDate(new Date().getDate() + 14),
            organizer: 'Department of Computer Science',
            description: 'Join us for an interactive workshop on the latest advances in artificial intelligence research. Learn about machine learning models, neural networks, and practical applications in various industries.',
            location: 'Tech Building, Room 305',
            image_url: getEventImagePath(upcomingCount)
          },
          {
            id: 'sample-2',
            title: 'Robotics Symposium',
            date: new Date().setDate(new Date().getDate() + 21),
            organizer: 'Robotics Lab',
            description: 'This symposium brings together experts in robotics to discuss cutting-edge developments in automation, machine vision, and human-robot interaction. Includes demonstrations of the latest robotic systems.',
            location: 'Innovation Center, Main Hall',
            image_url: getEventImagePath(upcomingCount + 1)
          }
        );
      }

      if (featured.length < 3) {
        const featuredCount = featured.length;
        
        featured.push(
          {
            id: 'featured-sample-1',
            title: 'Annual Tech Fair',
            date: new Date().setDate(new Date().getDate() + 30),
            organizer: 'School of Technology',
            description: 'Our annual technology fair showcases student projects, industry innovations, and research breakthroughs. Network with industry professionals and explore career opportunities in technology.',
            location: 'Campus Square',
            image_url: getEventImagePath(featuredCount),
            is_featured: true
          },
          {
            id: 'featured-sample-2',
            title: 'Cybersecurity Summit',
            date: new Date().setDate(new Date().getDate() + 45),
            organizer: 'Information Security Department',
            description: 'Explore the latest trends in cybersecurity with experts from academia and industry. Topics include threat intelligence, secure coding practices, and emerging security technologies.',
            location: 'Virtual Event',
            image_url: getEventImagePath(featuredCount + 1),
            is_featured: true
          }
        );
      }

      setEvents([...upcoming, ...featured]);
      setUpcomingEvents(upcoming);
      setFeaturedEvents(featured);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch events. Please try again later.');
      setLoading(false);
      console.error('Error fetching events:', err);
    }
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto';
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const filteredEvents = () => {
    switch(filter) {
      case 'upcoming':
        return upcomingEvents;
      case 'featured':
        return featuredEvents;
      default:
        return events;
    }
  };

  if (loading) {
    return (
      <div className="page-container events-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading events...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container events-page">
        <div className="error-container">
          <h2>Oops!</h2>
          <p>{error}</p>
          <button onClick={fetchEvents} className="primary-button">Try Again</button>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container events-page">
      <div className="content-container">
        {/* Header Section - Now separated properly */}
        <section className="section-header">
          <h1 className="page-title">Events</h1>
        </section>
        
        {/* Description Section - Now in its own section */}
        <section className="section-description-container">
          <div className="section-description">
            <p>
              At the School of Technology, we believe that learning extends far beyond the classroom.
              Our diverse range of events offers students, faculty, and enthusiasts the opportunity to explore groundbreaking ideas.
            </p>
            <p>
              From cutting-edge technology showcases to thought-provoking scientific discussions, there's always something exciting happening at SOT.
            </p>
          </div>
        </section>

        {/* Filters Section - Removed search functionality */}
        <section className="events-filter-section">
          <div className="filter-buttons">
            <button 
              className={`filter-button ${filter === 'all' ? 'active' : ''}`}
              onClick={() => handleFilterChange('all')}
            >
              All Events
            </button>
            <button 
              className={`filter-button ${filter === 'upcoming' ? 'active' : ''}`}
              onClick={() => handleFilterChange('upcoming')}
            >
              Upcoming Events
            </button>
            <button 
              className={`filter-button ${filter === 'featured' ? 'active' : ''}`}
              onClick={() => handleFilterChange('featured')}
            >
              Featured Events
            </button>
          </div>
        </section>

        {/* Events Grid */}
        <section className="events-grid-section">
          <h2 className="section-title">
            {filter === 'all' ? 'All Events' : filter === 'upcoming' ? 'Upcoming Events' : 'Featured Events'}
          </h2>
          
          {filteredEvents().length > 0 ? (
            <div className={`events-grid ${filteredEvents().length % 2 !== 0 ? 'odd' : ''}`}>
              {filteredEvents().map((event) => (
                <div key={event.id} className="event-card" onClick={() => openModal(event)}>
                  {event.is_featured && <span className="featured-tag">Featured</span>}
                  <div className="event-image-container">
                    <img
                      src={event.image_url || '/images/default-event.jpg'}
                      alt={event.title}
                      className="event-image"
                      onError={(e) => { e.target.src = '/images/default-event.jpg'; }}
                    />
                  </div>
                  <div className="event-content">
                    <h3 className="event-title">{event.title}</h3>
                    <div className="event-meta">
                      <div className="date-location">
                        <p className="event-date">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="meta-icon">
                            <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                        <p className="event-location">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="meta-icon">
                            <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                          {event.location}
                        </p>
                      </div>
                    </div>
                    <p className="event-organizer"><strong>{event.organizer}</strong></p>
                    <p className="event-description">{event.description.substring(0, 100)}...</p>
                    <button
                      className="details-button"
                      onClick={(e) => { e.stopPropagation(); openModal(event); }}
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-events-message">
              <p>No events to display for this filter. Check back soon!</p>
            </div>
          )}
        </section>

        {/* Event Modal */}
        {selectedEvent && (
          <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={closeModal} />
        )}
      </div>
      
      {/* Contact Us Section */}
      <ContactUs />
    </div>
  );
};

export default EventsPage;