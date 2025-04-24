import React from "react";
import "./styles/faculty.css";

const facultyData = [
  {
    name: "Dr. A. P. J. Kalam",
    designation: "Professor of Computer Science",
    department: "CSE",
    email: "apjkalam@example.com",
    image: `${import.meta.env.BASE_URL}images/faculty1.jpg`,
  },
  {
    name: "Dr. Jane Doe",
    designation: "Assistant Professor",
    department: "ECE",
    email: "janedoe@example.com",
    image: `${import.meta.env.BASE_URL}images/faculty2.jpg`,
  },
  // Add more as needed
];

const FacultyPage = () => {
  return (
    <div className="faculty-page">
      <h1 className="faculty-title">Meet Our Faculty</h1>
      <div className="faculty-grid">
        {facultyData.map((faculty, index) => (
          <div className="faculty-card" key={index}>
            <img
              src={faculty.image}
              alt={faculty.name}
              className="faculty-image"
            />
            <h3>{faculty.name}</h3>
            <p>{faculty.designation}</p>
            <p>{faculty.department}</p>
            <p>{faculty.email}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyPage;
