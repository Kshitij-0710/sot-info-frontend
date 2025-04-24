import React from "react";
import "./styles/faculty.css";

const facultyData = [
  {
    name: "Dr. Peplluis Esteva de la Rosa",
    designation: "Executive Dean - School of Technology",
    department: "Blockchain & DeFi Expert",
    email: "peplluis.esteva@woxsen.edu.in",
    image: "images/dean_sot.webp",
  },
  {
    name: "Dr. Amogh Deshmukh",
    designation: "Assistant Dean - Student Affairs",
    department: "Associate Professor - School of Technology",
    email: "amogh.deshmukh@woxsen.edu.in",
    image: "/images/dr_amogh.webp",
  },
  {
    name: "Dr. Daya Shankar",
    designation: "Dean - School of Sciences",
    department: "School of Sciences",
    email: "daya.shankar@woxsen.edu.in",
    image: "/images/dean_sos.webp",
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
            <p className="faculty-email">
              <a href={`mailto:${faculty.email}`}>{faculty.email}</a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyPage;
