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

              <div className="modal-section">
                <strong>Education:</strong>
                <ul>
                  {selectedFaculty.education?.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>

              {selectedFaculty.specialization && (
                <div className="modal-section">
                  <strong>Specialization:</strong>
                  <ul>
                    {selectedFaculty.specialization.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedFaculty.research && (
                <div className="modal-section">
                  <strong>Research:</strong>
                  <ul>
                    {selectedFaculty.research.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedFaculty.courses_taught && (
                <div className="modal-section">
                  <strong>Courses Taught:</strong>
                  <ul>
                    {selectedFaculty.courses_taught.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="modal-section">
                {selectedFaculty.teaching_experience && (
                  <p>
                    <strong>Teaching Experience:</strong>{" "}
                    {selectedFaculty.teaching_experience}
                  </p>
                )}
                {selectedFaculty.research_experience && (
                  <p>
                    <strong>Research Experience:</strong>{" "}
                    {selectedFaculty.research_experience}
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
