import './styles/imageslider.css';
import React, { useState, useEffect } from "react";
import ContactUs from "./contactus";
import './index.css';
import axios from 'axios';
import apiConfig from "./config/apiconfig";

// Modal Component for event details
const EventModal = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Determine event type for header display
  const getEventType = () => {
    const title = event.title.toLowerCase();
    if (title.includes('workshop')) return { text: 'WORKSHOP', color: '#00a8ff' };
    if (title.includes('symposium')) return { text: 'SYMPOSIUM', color: '#4a00e0' };
    if (title.includes('fair')) return { text: 'FAIR', color: '#00c853' };
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
      <button className="modal-close" onClick={onClose}>X</button>
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
            <h2 >{event.title}</h2>
            <p className="modal-organizer"><strong>{event.organizer}</strong></p>
            <div className="event-meta">
              <div className="meta-item">
                {/* Date Icon */}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="meta-icon">
                  <path d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M16 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M8 2V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{eventDate}</span>
              </div>
              <div className="meta-item">
                {/* Location Icon */}
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="meta-icon">
                  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{event.location}</span>
              </div>
            </div>
            <p className="modal-description">{event.description}</p>
            <div className="modal-actions">
              <button className="share-btn" onClick={() => shareEvent(event)}>Share Event</button>
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
  const [pastEvents, setPastEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchEvents();
    document.body.classList.add('dark-mode');
  }, []);

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

      setEvents(allEvents);
      setUpcomingEvents(upcoming);
      setPastEvents(featured);
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

  if (loading) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="content-container">
          <div className="error-container">
            <h2>Oops!</h2>
            <p>{error}</p>
            <button onClick={fetchEvents} className="retry-btn">Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="content-container">
        {/* Introduction Section */}
        <section className="section-events">
          <div className="container-events">
            <h2 className="section-heading">Events @ SOT</h2>
            <div className="events-section-content">
              <div className="events-paragraphs">
                <p>
                  At the School of Technology, we believe that learning extends far beyond the classroom.
                  Our diverse range of events offers students, faculty, and enthusiasts the opportunity to explore groundbreaking ideas.
                </p>
                <p>
                  From cutting-edge technology showcases to thought-provoking scientific discussions, there's always something exciting happening at SOT.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <h2 className="section-heading">Upcoming Events</h2>
        {upcomingEvents.length > 0 ? (
          <div className="events-grid">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="card" onClick={() => openModal(event)}>
                <img
                  src={event.image_url || '/images/default-event.jpg'}
                  alt={event.title}
                  className="event-image"
                  onError={(e) => { e.target.src = '/images/default-event.jpg'; }}
                />
                <div className="card-content">
                  <h4>{event.title}</h4>
                  <p className="event-date">
                    {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p><strong>{event.organizer}</strong></p>
                  <p>{event.description.substring(0, 100)}...</p>
                  <button
                    className="view-details-btn"
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
            <p>No upcoming events at the moment. Check back soon!</p>
          </div>
        )}

        {/* Featured Events Section */}
        <h2 className="section-heading">Featured Events</h2>
        {pastEvents.length > 0 ? (
          <div className="events-grid">
            {pastEvents.map((event) => (
              <div key={event.id} className="card" onClick={() => openModal(event)}>
                <span className="featured-tag">Featured</span>
                <img
                  src={event.image_url || '/images/default-event.jpg'}
                  alt={event.title}
                  className="event-image"
                  onError={(e) => { e.target.src = '/images/default-event.jpg'; }}
                />
                <div className="card-content">
                  <h4>{event.title}</h4>
                  <p className="event-date">
                    {new Date(event.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p><strong>{event.organizer}</strong></p>
                  <p>{event.description.substring(0, 100)}...</p>
                  <button
                    className="view-details-btn"
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
            <p>No featured events to display.</p>
          </div>
        )}

        {/* Event Modal */}
        {selectedEvent && (
          <EventModal event={selectedEvent} isOpen={isModalOpen} onClose={closeModal} />
        )}

        {/* Contact Us Section */}
        <ContactUs />
      </div>
    </div>
  );
};

export default EventsPage;
