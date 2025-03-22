import './styles/imageslider.css';
import React, { useState } from "react";
import ContactUs from "./contactus";
import './index.css';
import TopContributions from "./topcontributions";

// Event data
const eventsData = [
  {
    id: 1,
    title: "Tech Symposium 2024",
    organizer: "School of Science & Technology",
    description: "A cutting-edge event showcasing the latest innovations in technology, featuring expert talks and live demos.",
    image: "/images/event1.jpg", // Ensure correct path
  },
  {
    id: 2,
    title: "AI & Machine Learning Workshop",
    organizer: "SOST AI Club",
    description: "Hands-on workshop exploring the fundamentals and real-world applications of AI and machine learning.",
    image: "/images/event2.jpg", // Ensure correct path
  },
  {
    id: 3,
    title: "Science Fair 2025",
    organizer: "SOST Science Department",
    description: "An exhibition of scientific discoveries and innovations by students across different disciplines.",
    image: "/images/event2.jpg", // Ensure correct path
  },
];

const EventsPage = () => {

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
              <img src={event.image} alt={event.title} className="event-image" />
              <h3>{event.title}</h3>
              <p><strong>{event.organizer}</strong></p>
              <p>{event.description.substring(0, 100)}...</p>
              <button className="details-btn" onClick={() => openModal(event)}>View Details</button>
            </div>
          ))}
        </div>
        <h2 className="section-heading">Past Events</h2>
        <div className="events-grid">
          {eventsData.map((event) => (
            <div key={event.id} className="event-card">
              <img src={event.image} alt={event.title} className="event-image" />
              <h3>{event.title}</h3>
              <p><strong>{event.organizer}</strong></p>
              <p>{event.description.substring(0, 100)}...</p>
              <button className="details-btn" onClick={() => openModal(event)}>View Details</button>
            </div>
          ))}
        </div>

        {/* Contact Us Section */}
        <ContactUs />
      </div>
    </div>
  );
};

export default EventsPage;
