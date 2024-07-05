import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Header from "./components/Header/header";
import Navbar from "./components/Navbar/navbar";
import ContentItem from "./components/Main/recent";
import SearchPage from "./components/Main/search";
import WatchPage from "./components/Main/watch";
import DramaDetail from "./components/Main/drama-detail";
// import DramaDetail from "./components/Main/drama2";
import MainLayout from "./components/Main/MainLayout"; // Import the new MainLayout component

const App: React.FC = () => {
  const [isOpen, setIsOpen] = useState(window.innerWidth > 600 ? true : false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  const updateIsOpen = () => {
    setIsOpen(window.innerWidth >= 810);
  };

  useEffect(() => {
    updateIsOpen();

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
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
          <MainLayout isOpen={isOpen} windowWidth={windowWidth}>
            <Routes>
              <Route path="/" element={<ContentItem />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/watch" element={<WatchPage />} />
              <Route path="/watch/*" element={<WatchPage />} />
              <Route path="/drama-detail" element={<Navigate to="/" />} />
              <Route path="/drama-detail/*" element={<DramaDetail />} />
              {/* Add more routes as needed */}
            </Routes>
          </MainLayout>
        </section>
      </div>
    </Router>
  );
};

export default App;
