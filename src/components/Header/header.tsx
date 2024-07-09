import Menu from "../../assets/icons/menu";
import YtLogo from "../../assets/icons/yt";
import MoonIcon from "../../assets/icons/moon";

import SearchIcon from "../../assets/icons/search";
import {Link} from "react-router-dom";
import { useState, useEffect } from "react";
import Form from "./form";
// import { showToast } from "../utils/toast";

interface Headerprops{
  windowWidth :number;
}
const App :React.FC<Headerprops>=  ({windowWidth}) => {
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
          <button className="iconBtn menuBtn xs:!hidden">
            <Menu />
          </button>
          <Link to={"/"} className="logo xs:ml-1.5">
            <YtLogo />
          </Link>
        </div>
        <div className="searchbar flex gap-4  flex-shrink-0 flex-grow flex-basis-[732px] justify-center mdd:justify-end">
          <button  className="hidden searchBtn iconBtn xs:flex">
            <SearchIcon />
          </button>
         <Form windowWidth={windowWidth}/>
         
        </div>
        <div
          className="flex items-center justify-end ml-2.5
"
        >
          <button className="iconBtn  rotate-[135deg]	" onClick={toggleDarkMode}>
           <MoonIcon/>
          </button>
          {/* <button className="iconBtn  rotate-[135deg]	" onClick={() => showToast("Hello this is Toast Notification")}>
           <SearchIcon/>
          </button> */}
        </div>
      </header>
    </>
  );
};

export default App;
