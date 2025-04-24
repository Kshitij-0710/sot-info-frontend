import React from "react";
import { Route, Routes } from "react-router-dom";
import Placements from './Placements';
import AchievementsPage from "./achievements";
import ContactPage from "./contactpage";
import Forms from "./forms";
import HomePage from "./homepage";
import Navbar from "./navbar";
import Posts from "./posts";
import ProjectsPage from "./projects";
import ResearchPage from "./research";
import SignUp from "./signup";
import EventsPage from "./Events";
import FacultyPage from "./faculty"; // ✅ Added this import

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forms" element={<Forms />} />
        <Route path="/placements" element={<Placements />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/research" element={<ResearchPage />} />
        <Route path="/contactpage" element={<ContactPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/posts" element={<Posts />} />
        <Route path="/faculty" element={<FacultyPage />} /> {/* ✅ Added route */}
      </Routes>
    </>
  );
};

export default App;
