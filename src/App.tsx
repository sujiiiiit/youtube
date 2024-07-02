import React, { useState, useEffect } from "react";
// import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from "./components/Header/header";
import Navbar from "./components/Navbar/navbar";
import Tags from "./components/Main/tags";
import ContentItem from "./components/Main/recent";
import SearchPage from "./components/Main/search";

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 600 ? true : false);

  const updateIsOpen = () => {
    if (window.innerWidth >= 810) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
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
            className={`mainContainer ${
              isOpen && window.innerWidth > 600
                ? "w-[calc(100dvw_-_var(--navwidth))]"
                : "w-dvw"
            } bg-[var(--primary)] h-[calc(100vh_-_var(--header-height))] transition-[max-width_0.3s] mr-2 xs:mr-0 ${
              isOpen ? "nav-opened" : ""
            }`}
          >
            <Tags/>
            <Routes>
              <Route path="/" element={<ContentItem />} />
              <Route path="/search" element={<SearchPage />} />
              {/* Add more routes as needed */}
            </Routes>
          </div>
        </section>
      </div>
    </Router>
  );
};

export default App;
