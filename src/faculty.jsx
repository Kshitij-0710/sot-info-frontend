import React, { useState } from "react";
import facultyData from "./data/facultyData.json";
import "./styles/faculty.css";

const FacultyPage = () => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const closeModal = () => {
    setIsClosing(true);
    setTimeout(() => {
      setSelectedFaculty(null);
      setIsClosing(false);
    }, 300);
  };

  // Filter faculty by school and search term
  const filteredFaculty = facultyData
    .filter(
      (faculty) =>
        selectedSchool === "All" ||
        (faculty.designation && faculty.designation.includes(selectedSchool))
    )
    .filter((faculty) =>
      faculty.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Helper to render content as array
  const renderList = (data) => {
    if (!data) return null;
    const items = Array.isArray(data)
      ? data
      : typeof data === "string"
      ? data.split(",").map((item) => item.trim())
      : [];
    return (
      <ul>
        {items.map((item, i) => (
          <li key={i}>{item}</li>
        ))}
      </ul>
    );
  };

  return (
    <div className="faculty-page">
      <h1 className="faculty-title">Meet Our Faculty</h1>

      {/* School Filter */}
      <div className="filter-bar">
        {["All", "School of Technology", "School of Sciences"].map((school) => (
          <button
            key={school}
            className={selectedSchool === school ? "active" : ""}
            onClick={() => setSelectedSchool(school)}
          >
            {school}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search faculty by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Faculty Grid */}
      <div className="faculty-grid">
        {filteredFaculty.map((faculty, index) => (
          <div
            className="faculty-card"
            key={index}
            onClick={() => setSelectedFaculty(faculty)}
          >
            <img
              src={faculty.imageURL}
              alt={faculty.name}
              className="faculty-image"
            />
            <h3>{faculty.name}</h3>
            <p>{faculty.designation}</p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedFaculty && (
        <div className="faculty-modal-overlay" onClick={closeModal}>
          <div
            className={`faculty-modal ${isClosing ? "closing" : ""}`}
            onClick={(e) => e.stopPropagation()}
          >
            <button className="close-btn" onClick={closeModal}>
              ×
            </button>

            <div className="modal-image-wrapper">
              <img
                src={selectedFaculty.imageURL}
                alt={selectedFaculty.name}
                className="modal-image"
              />
            </div>

            <div className="modal-content">
              <h2>{selectedFaculty.name}</h2>
              <h4>{selectedFaculty.designation}</h4>

              {selectedFaculty.education && (
                <div className="modal-section">
                  <strong>Education:</strong>
                  {renderList(selectedFaculty.education)}
                </div>
              )}

              {selectedFaculty.specialization && (
                <div className="modal-section">
                  <strong>Specialization:</strong>
                  {renderList(selectedFaculty.specialization)}
                </div>
              )}

              {selectedFaculty.research && (
                <div className="modal-section">
                  <strong>Research:</strong>
                  {renderList(selectedFaculty.research)}
                </div>
              )}

              {selectedFaculty.courses_taught && (
                <div className="modal-section">
                  <strong>Courses Taught:</strong>
                  {renderList(selectedFaculty.courses_taught)}
                </div>
              )}

              <div className="modal-section">
                {selectedFaculty["years of teaching experience"] && (
                  <p>
                    <strong>Teaching Experience:</strong>{" "}
                    {selectedFaculty["years of teaching experience"]}
                  </p>
                )}
                {selectedFaculty["years of research experience"] && (
                  <p>
                    <strong>Research Experience:</strong>{" "}
                    {selectedFaculty["years of research experience"]}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacultyPage;
