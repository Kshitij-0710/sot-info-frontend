import './styles/imageslider.css';
import React, { useState } from "react";
import ContactUs from "./contactus";
import './index.css';
import TopContributions from "./topcontributions";

// Event data with enhanced information
const eventsData = [
  {
    id: 1,
    title: "Tech Symposium 2024",
    organizer: "School of Science & Technology",
    description: "A cutting-edge event showcasing the latest innovations in technology, featuring expert talks and live demos. Join industry leaders and academic experts as they discuss emerging trends in AI, cybersecurity, and quantum computing. Network with professionals and discover new opportunities in tech.",
    image: "/images/event1.jpg",
    date: "June 15-16, 2024",
    location: "Main Auditorium, SOT Campus",
    time: "9:00 AM - 5:00 PM",
    featured: true,
    speakers: [
      "Dr. Amelia Roberts - AI Research Lead",
      "Prof. James Chen - Quantum Computing Expert",
      "Sarah Johnson - Industry Partner"
    ]
  },
  {
    id: 2,
    title: "AI & Machine Learning Workshop",
    organizer: "SOST AI Club",
    description: "Hands-on workshop exploring the fundamentals and real-world applications of AI and machine learning. This interactive session will cover practical implementations of ML algorithms, data preprocessing techniques, and model evaluation. Perfect for beginners and intermediate practitioners looking to enhance their skills.",
    image: "/images/event2.jpg",
    date: "July 8, 2024",
    location: "Lab 204, Technology Building",
    time: "1:00 PM - 4:30 PM",
    featured: false,
    requirements: "Participants should bring laptops with Python installed. Basic programming knowledge recommended."
  },
  {
    id: 3,
    title: "Science Fair 2025",
    organizer: "SOST Science Department",
    description: "An exhibition of scientific discoveries and innovations by students across different disciplines. This annual event showcases student research projects, experimental results, and scientific breakthroughs. Visitors can explore interactive displays, attend demonstration sessions, and vote for their favorite projects.",
    image: "/images/event2.jpg",
    date: "February 12-13, 2025",
    location: "Science Complex, SOT Campus",
    time: "10:00 AM - 6:00 PM",
    featured: true,
    registration: "Open to all students. Project submissions due by January 15, 2025."
  },
];

// Modal Component with enhanced details
const EventModal = ({ event, isOpen, onClose }) => {
  if (!isOpen) return null;

  // Determine event type for header display
  const getEventType = () => {
    const title = event.title.toLowerCase();
    if (title.includes('workshop')) return { text: 'WORKSHOP TEMPLATE', color: '#00a8ff' };
    if (title.includes('symposium')) return { text: 'SYMPOSIUM TEMPLATE', color: '#4a00e0' };
    if (title.includes('fair')) return { text: 'FAIR TEMPLATE', color: '#00c853' };
    return { text: 'EVENT TEMPLATE', color: '#fc3c5b' };
  };

  const eventType = getEventType();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
        <div className="modal-body">
          <div className="modal-left-column">
            <div className="modal-header" style={{ backgroundColor: eventType.color }}>
              <div className="event-type">{eventType.text}</div>
            </div>
            <img src={event.image} alt={event.title} className="modal-image" />
          </div>
          <div className="modal-details">
            {event.featured && <span className="featured-badge">Featured Event</span>}
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
                <span>{event.date}</span>
              </div>
              <div className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="meta-icon">
                  <path d="M12 22C12 22 20 18 20 12V5L12 2L4 5V12C4 18 12 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{event.location}</span>
              </div>
              <div className="meta-item">
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="meta-icon">
                  <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <span>{event.time}</span>
              </div>
            </div>
            
            <p className="modal-description">{event.description}</p>
            
            {event.speakers && (
              <div className="event-speakers">
                <h3>Featured Speakers</h3>
                <ul>
                  {event.speakers.map((speaker, index) => (
                    <li key={index}>{speaker}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {event.requirements && (
              <div className="event-requirements">
                <h3>Requirements</h3>
                <p>{event.requirements}</p>
              </div>
            )}
            
            {event.registration && (
              <div className="event-registration-info">
                <h3>Registration Info</h3>
                <p>{event.registration}</p>
              </div>
            )}
            
            <div className="modal-actions">
              <button className="register-btn">Register Now</button>
              <button className="share-btn">Share Event</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const EventsPage = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  };

  const closeModal = () => {
    setIsModalOpen(false);
    document.body.style.overflow = 'auto'; // Restore scrolling
  };

  return (
    <div className="page-container">

      {/* Events Content */}
      <div className="content-container">
        {/* Introduction Section */}
        <section className="section-research">
          <div className="container-research">
            <h2 className="section-heading">Events @ SOT</h2>
            <div className="research-section-content">
              <div className="research-paragraphs">
                <p>
                  At the School of Technology, we believe that learning extends far beyond the classroom. Our diverse range of events offers students, faculty, and enthusiasts the opportunity to explore groundbreaking ideas, collaborate with industry leaders, and engage in hands-on experiences.
                </p>
                <p>
                  From cutting-edge technology showcases to thought-provoking scientific discussions, our events foster innovation, creativity, and a spirit of discovery. Whether you're a curious learner or an experienced professional, there's always something exciting happening at SOT.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <h2 className="section-heading">Upcoming Events</h2>
        <div className="events-grid">
          {eventsData.map((event) => (
            <div key={event.id} className="event-card">
              {event.featured && <span className="featured-tag">Featured</span>}
              <img src={event.image} alt={event.title} className="event-image" />
              <div className="event-card-content">
                <h3>{event.title}</h3>
                <p className="event-date">{event.date}</p>
                <p><strong>{event.organizer}</strong></p>
                <p>{event.description.substring(0, 100)}...</p>
                <button className="details-btn" onClick={() => openModal(event)}>View Details</button>
              </div>
            </div>
          ))}
        </div>
        <h2 className="section-heading">Past Events</h2>
        <div className="events-grid">
          {eventsData.map((event) => (
            <div key={event.id} className="event-card">
              <img src={event.image} alt={event.title} className="event-image" />
              <div className="event-card-content">
                <h3>{event.title}</h3>
                <p className="event-date">{event.date}</p>
                <p><strong>{event.organizer}</strong></p>
                <p>{event.description.substring(0, 100)}...</p>
                <button className="details-btn" onClick={() => openModal(event)}>View Details</button>
              </div>
            </div>
          ))}
        </div>

        {/* Event Modal */}
        {selectedEvent && (
          <EventModal 
            event={selectedEvent} 
            isOpen={isModalOpen} 
            onClose={closeModal} 
          />
        )}

        {/* Contact Us Section */}
        <ContactUs />
      </div>
    </div>
  );
};

export default EventsPage;
