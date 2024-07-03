import React, { useEffect, useRef } from "react";
import MenuBtn from "../../assets/icons/menu";
import YtLogo from "../../assets/icons/yt";
import HomeIcon from "../../assets/icons/home";
import {Link} from "react-router-dom";

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const navContainerRef = useRef<HTMLDivElement>(null);

  const toggleOpenedClass = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const handleMenuBtnClick = () => {
      toggleOpenedClass();
      // console.log("menuBtn clicked");
    };

    const menuBtns = document.querySelectorAll(".menuBtn");
    menuBtns.forEach((menuBtn) => {
      menuBtn.addEventListener("click", handleMenuBtnClick);
    });

    return () => {
      menuBtns.forEach((menuBtn) => {
        menuBtn.removeEventListener("click", handleMenuBtnClick);
      });
    };
  }, [setIsOpen]);


  return (
    <>
      <div className={`overlay h-dvh menuBtn ${isOpen ? "opened" : ""}`}></div>
      <div
      style={{height: "calc(100dvh - var(--header-height)"}}
        ref={navContainerRef}
        className={`navContainer ${
          isOpen ? "opened" : ""
        } relative  transition-transform transition-width  max-w-[var(--navwidth)] w-0 overflow-auto bg-[var(--background)] mdd:absolute mdd:!h-dvh mdd:left-0 mdd:top-0 mdd:bottom-0 z-20 mdd:z-30`}
      >
        <header className="header h-14 xs:h-12 relative items-center px-4 py-0 gap-4 xs:gap-2 xs:px-2 pr-0 hidden mdd:flex">
          <button className="iconBtn menuBtn xs:!hidden">
            <MenuBtn />
          </button>
          <span className="logo xs:ml-1.5">
            <YtLogo />
          </span>
        </header>
        <div className="navsection p-3 mdd:py-2 mdd:px-2 border-b border-black/10 dark:border-white/10">
          <div className="h-10 block relative rounded-lg w-[calc(100% - 12px)] hover:bg-[var(--hover-color)] xs:px-2">
            <Link to={"/"} className="min-h-[40px] cursor-pointer box-border outline-none text-Primary flex flex-row items-center no-underline px-3 xs:px-0 rounded-lg" onClick={()=>{window.innerWidth<=600 ? setIsOpen(false):""}}>
              <span className="flex items-center mr-6 mdd:mr-4">
                <HomeIcon/>
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
