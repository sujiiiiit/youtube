import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Header from "./components/Header/header";
import Navbar from "./components/Navbar/navbar";
import Tags from "./components/Main/tags";
import ContentItem from "./components/Main/recent";
import SearchPage from "./components/Main/search";
import WatchPage from "./components/Main/watch";
import DramaDetail from "./components/Main/drama-detail";

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 600 ? true : false);

  const updateIsOpen = () => {
    setIsOpen(window.innerWidth >= 810);
  };

  useEffect(() => {
    updateIsOpen();

    const handleResize = () => {
      updateIsOpen();
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <Router>
      <div className="h-dvh w-dvw font-Geist bg-[var(--background)] ">
        <Header />
        <section className="main flex w-dvw">
          <Navbar isOpen={isOpen} setIsOpen={setIsOpen} />
          <div
            className={`mainContainer relative ${
              isOpen && window.innerWidth > 600
                ? "w-[calc(100dvw_-_var(--navwidth))]"
                : "w-dvw"
            } bg-[var(--primary)] h-[calc(100vh_-_var(--header-height))] transition-[max-width_0.3s] mr-2 xs:mr-0 ${
              isOpen ? "nav-opened" : ""
            }`}
          >
            <Tags />
            <Routes>
              <Route path="/" element={<ContentItem />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/watch" element={<WatchPage />} />
              <Route path="/drama-detail/*" element={<DramaDetail />} />
              <Route path="/drama-detail" element={<Navigate to="/drama-detail" />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </section>
      </div>
    </Router>
  );
};

export default App;
