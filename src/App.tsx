import React, { useState, useEffect } from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import Header from "./components/Header/header";
import Navbar from "./components/Navbar/navbar";
import ContentItem from "./components/Main/recent";
import SearchPage from "./components/Main/search";
import WatchPage from "./components/Main/watch";
import DramaDetail from "./components/Main/drama-detail";
import MainLayout from "./components/Main/MainLayout"; // Import the new MainLayout component

const App: React.FC = () => {
  const location = useLocation();
  const isLocation = location.pathname.includes("/watch");

  const [isOpen, setIsOpen] = useState(window.innerWidth > 810);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const updateIsOpen = () => {
    setIsOpen(window.innerWidth > 810 && !isLocation);
  };

  useEffect(() => {
    updateIsOpen(); // Update isOpen initially

    const handleResize = () => {
      setWindowWidth(window.innerWidth);

      updateIsOpen(); // Update isOpen on window resize
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [location.pathname]); // Listen to changes in location.pathname

  return (
    <div className="h-dvh w-dvw font-Geist bg-[var(--background)]">
      <Header windowWidth={window.innerWidth} />

      <section className="main flex w-dvw">
        <Navbar
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          windowWidth={windowWidth}
        />
        <MainLayout isOpen={isOpen} windowWidth={window.innerWidth}>
          <Routes>
            <Route path="/" element={<ContentItem />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/watch" element={<Navigate to="/" />} />
            <Route path="/watch/*" element={<WatchPage />} />
            <Route path="/drama-detail" element={<Navigate to="/" />} />
            <Route path="/drama-detail/*" element={<DramaDetail />} />
            {/* Add more routes as needed */}
          </Routes>
        </MainLayout>
      </section>
    </div>
  );
};

export default App;
