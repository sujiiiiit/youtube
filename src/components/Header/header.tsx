import Menu from "../../assets/icons/menu";
import YtLogo from "../../assets/icons/yt";

import SearchIcon from "../../assets/icons/search";

import { useState, useEffect } from "react";
import Form from "./form";

const App = () => {
  const getSystemThemePreference = () => {
    const prefersDarkMode =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    return prefersDarkMode ? "dark" : "light";
  };
  const getInitialTheme = () => {
    try {
      const storedTheme = localStorage.getItem("theme");
      return storedTheme || getSystemThemePreference(); // Use system theme if no theme is stored
    } catch (error) {
      console.error("Error retrieving theme from local storage:", error);
      return getSystemThemePreference(); // Use system theme if local storage retrieval fails
    }
  };
  const [darkMode, setDarkMode] = useState(getInitialTheme);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  };
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode === "dark"); // Apply theme class to body
    localStorage.setItem("theme", darkMode); // Save theme to local storage
  }, [darkMode]);



  return (
    <>
      <header className="header  h-14 xs:h-12 relative flex items-center	px-4 py-0 justify-between xs:px-2 z-30" >
        <div className="flex gap-4 xs:gap-2 flex-row h-14 xs:h-12 items-center justify-between">
          <button className="iconBtn menuBtn">
            <Menu />
          </button>
          <span className="logo">
            <YtLogo />
          </span>
        </div>
        <div className="searchbar flex gap-4  flex-shrink-0 flex-grow flex-basis-[732px] justify-center mdd:justify-end">
          <button  className="hidden searchBtn iconBtn xs:flex">
            <SearchIcon />
          </button>
         <Form/>
         
        </div>
        <div
          className="flex items-center justify-end ml-2.5
"
        >
          <button className="iconBtn  rotate-[135deg]	" onClick={toggleDarkMode}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              focusable="false"
              className="svg-icon"
            >
              <path d="M12 22C10.93 22 9.86998 21.83 8.83998 21.48L7.41998 21.01L8.83998 20.54C12.53 19.31 15 15.88 15 12C15 8.12 12.53 4.69 8.83998 3.47L7.41998 2.99L8.83998 2.52C9.86998 2.17 10.93 2 12 2C17.51 2 22 6.49 22 12C22 17.51 17.51 22 12 22ZM10.58 20.89C11.05 20.96 11.53 21 12 21C16.96 21 21 16.96 21 12C21 7.04 16.96 3 12 3C11.53 3 11.05 3.04 10.58 3.11C13.88 4.81 16 8.21 16 12C16 15.79 13.88 19.19 10.58 20.89Z"></path>
            </svg>{" "}
          </button>
        </div>
      </header>
    </>
  );
};

export default App;
