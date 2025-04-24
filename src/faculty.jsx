import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail, Linkedin } from "lucide-react";
import Image from "next/image";

const FacultyCard = ({ name, designation, email, linkedin, imageSrc }) => {
  return (
    <Card className="w-full max-w-sm p-4 shadow-lg rounded-2xl">
      <div className="flex flex-col items-center">
        <div className="w-32 h-32 relative rounded-full overflow-hidden mb-4">
          <Image
            src={imageSrc || "/faculty-placeholder.png"}
            alt={name}
            fill
            className="object-cover"
          />
        </div>
        <h2 className="text-xl font-semibold text-center">{name}</h2>
        <p className="text-sm text-gray-500 text-center mb-2">{designation}</p>
        <div className="flex gap-3 mt-2">
          {email && (
            <Button variant="outline" size="icon" asChild>
              <a href={`mailto:${email}`}><Mail className="w-4 h-4" /></a>
            </Button>
          )}
          {linkedin && (
            <Button variant="outline" size="icon" asChild>
              <a href={linkedin} target="_blank" rel="noopener noreferrer">
                <Linkedin className="w-4 h-4" />
              </a>
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
};

const FacultyPage = () => {
  const facultyList = [
    {
      name: "Dr. A. Sharma",
      designation: "Professor & Head",
      email: "asharma@sot.edu",
      linkedin: "https://linkedin.com/in/asharma",
      imageSrc: "/faculty/sharma.jpg",
    },
    {
      name: "Dr. B. Mehta",
      designation: "Associate Professor",
      email: "bmehta@sot.edu",
      linkedin: "https://linkedin.com/in/bmehta",
      imageSrc: "/faculty/mehta.jpg",
    },
    // Add more faculty members here
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-12">
      <h1 className="text-3xl font-bold mb-8 text-center">Faculty Members</h1>
      <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {facultyList.map((faculty, index) => (
          <FacultyCard key={index} {...faculty} />
        ))}
      </div>
    </div>
  );
};

export default FacultyPage;
