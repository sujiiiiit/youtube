import React from "react";
import { useLocation } from "react-router-dom";
import Tags from "./tags";

interface MainLayoutProps {
  children: React.ReactNode;
  isOpen: boolean;
  windowWidth: number;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, isOpen, windowWidth }) => {
  const location = useLocation();

  return (
    <div
      className={`mainContainer overflow-x-hidden overflow-auto relative ${
        isOpen && windowWidth > 810
          ? "w-[calc(100dvw_-_var(--navwidth))]"
          : "w-dvw"
      } bg-[var(--primary)] h-[calc(100vh_-_var(--header-height))] transition-[max-width_0.3s] mr-2 mdd:mr-0 ${
        isOpen ? "nav-opened" : ""
      }`}
    >
      {!(location.pathname.includes("/watch") || location.pathname.includes("/drama-detail")) && <Tags />}
      {children}
    </div>
  );
};

export default MainLayout;
