import React, { useEffect } from "react";
import MenuBtn from "../../assets/icons/menu";
import YtLogo from "../../assets/icons/yt";
import HomeIcon from "../../assets/icons/home";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  windowWidth: number;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen, windowWidth }) => {
  const location = useLocation();
  const isLocationWatch = location.pathname.includes("/watch");

  // Set initial isOpen state based on conditions
  useEffect(() => {
    setIsOpen(!isLocationWatch);
    
  }, [isLocationWatch, setIsOpen]);

  const toggleOpenedClass = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  const handleMenuBtnClick = () => {
    toggleOpenedClass();
    // Additional logic if needed
  };

  useEffect(() => {
    const menuBtns = document.querySelectorAll(".menuBtn");
    menuBtns.forEach((menuBtn) => {
      menuBtn.addEventListener("click", handleMenuBtnClick);
    });

    return () => {
      menuBtns.forEach((menuBtn) => {
        menuBtn.removeEventListener("click", handleMenuBtnClick);
      });
    };
  }, []);

  useEffect(() => {
    // Update isOpen based on location change
    if (isLocationWatch) {
      setIsOpen(false); // Close navbar if navigating to /watch
    } else {
      setIsOpen(true); // Open navbar for other pages
    }
  }, [location.pathname, setIsOpen]);

  return (
    <>
      <div
        className={`overlay h-dvh menuBtn ${isOpen ? "opened" : ""} ${
          windowWidth <= 810 ? "block" : isLocationWatch ?"block" : "hidden"
        }`}
      ></div>
      <div
        style={{ height: "calc(100vh - var(--header-height))" }}
        className={`navContainer ${isOpen ? "opened" : ""} relative transition-transform transition-width max-w-[var(--navwidth)] w-0 overflow-auto bg-[var(--background)] ${
          isLocationWatch ? "!absolute !h-dvh !left-0 !top-0 !bottom-0 !z-30" : ""
        } mdd:absolute mdd:!h-dvh mdd:left-0 mdd:top-0 mdd:bottom-0 mdd:z-30`}
      >
        <header className={`header h-14 xs:h-12 relative items-center px-4 py-0 gap-4 xs:gap-2 xs:px-2 pr-0 ${isLocationWatch?"!flex":"!hidden"} hidden mdd:flex`}>
          <button className="iconBtn menuBtn xs:!hidden">
            <MenuBtn />
          </button>
          <span className="logo xs:ml-1.5">
            <YtLogo />
          </span>
        </header>
        <div className="navsection p-3 mdd:py-2 mdd:px-2 border-b border-black/10 dark:border-white/10">
          <div className="h-10 block relative rounded-lg w-[calc(100% - 12px)] hover:bg-[var(--hover-color)] xs:px-2">
            <Link
              to={"/"}
              className="min-h-[40px] cursor-pointer box-border outline-none text-Primary flex flex-row items-center no-underline px-3 xs:px-0 rounded-lg"
              onClick={() => {
                windowWidth <= 600 ? setIsOpen(false) : "";
              }}
            >
              <span className="flex items-center mr-6 mdd:mr-4">
                <HomeIcon />
              </span>
              <span className="flex items-center text-Primary overflow-hidden whitespace-nowrap overflow-ellipsis text-sm leading-[2rem] font-normal flex-1">
                Home
              </span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
