import MenuBtn from "../../assets/icons/menu";
import YtLogo from "../../assets/icons/yt";
import { useEffect, useRef, useState } from "react";

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navContainerRef = useRef<HTMLDivElement>(null);

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

  const toggleOpenedClass = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const handleMenuBtnClick = () => {
      toggleOpenedClass();
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
  }, []);

  return (
    <>
      <div className={`overlay menuBtn ${isOpen ? "opened" : ""}`}></div>
      <div
        ref={navContainerRef}
        className={`navContainer ${
          isOpen ? "opened" : ""
        } relative h-[calc(100vh - 56px)] transition-transform transition-width max-w-[var(--navwidth)] w-0 overflow-auto bg-[var(--background)] mdd:absolute mdd:h-dvh mdd:left-0 mdd:top-0 mdd:bottom-0 z-20 mdd:z-30`}
      >
        <header className="header h-14 xs:h-12 relative items-center px-4 py-0 gap-4 xs:gap-2 xs:px-2 pr-0 hidden mdd:flex">
          <button className="iconBtn menuBtn">
            <MenuBtn />
          </button>
          <span className="logo">
            <YtLogo />
          </span>
        </header>
        <div className="navsection p-3 mdd:py-2 mdd:px-2 border-b border-black/10 dark:border-white/10">
          <div className="h-10 block relative rounded-xl w-[calc(100% - 12px)] hover:bg-[var(--hover-color)] xs:px-2">
            <a className="min-h-[40px] cursor-pointer box-border outline-none text-Primary flex flex-row items-center no-underline px-3 xs:px-0 rounded-xl">
              <span className="flex items-center mr-6 mdd:mr-4">
                <svg height="24px" viewBox="0 0 24 24" width="24px">
                  <path d="m12 4.44 7 6.09V20h-4v-6H9v6H5v-9.47l7-6.09m0-1.32-8 6.96V21h6v-6h4v6h6V10.08l-8-6.96z"></path>
                </svg>
              </span>
              <span className="flex items-center text-Primary overflow-hidden whitespace-nowrap overflow-ellipsis text-sm leading-[2rem] font-normal flex-1">
                Home
              </span>
            </a>
          </div>
        
          <div className="h-10 block relative rounded-xl w-[calc(100% - 12px)] hover:bg-[var(--hover-color)] xs:px-2">
            <a className="min-h-[40px] cursor-pointer box-border outline-none text-Primary flex flex-row items-center no-underline px-3 xs:px-0 rounded-xl">
              <span className="flex items-center mr-6 mdd:mr-4">
                <svg height="24px" viewBox="0 0 24 24" width="24px">
                  <path d="M10 14.65v-5.3L15 12l-5 2.65zm7.77-4.33-1.2-.5L18 9.06c1.84-.96 2.53-3.23 1.56-5.06s-3.24-2.53-5.07-1.56L6 6.94c-1.29.68-2.07 2.04-2 3.49.07 1.42.93 2.67 2.22 3.25.03.01 1.2.5 1.2.5L6 14.93c-1.83.97-2.53 3.24-1.56 5.07.97 1.83 3.24 2.53 5.07 1.56l8.5-4.5c1.29-.68 2.06-2.04 1.99-3.49-.07-1.42-.94-2.68-2.23-3.25zm-.23 5.86-8.5 4.5c-1.34.71-3.01.2-3.72-1.14-.71-1.34-.2-3.01 1.14-3.72l2.04-1.08v-1.21l-.69-.28-1.11-.46c-.99-.41-1.65-1.35-1.7-2.41-.05-1.06.52-2.06 1.46-2.56l8.5-4.5c1.34-.71 3.01-.2 3.72 1.14.71 1.34.2 3.01-1.14 3.72L15.5 9.26v1.21l1.8.74c.99.41 1.65 1.35 1.7 2.41.05 1.06-.52 2.06-1.46 2.56z"></path>
                </svg>
              </span>
              <span className="flex items-center text-Primary overflow-hidden whitespace-nowrap overflow-ellipsis text-sm leading-[2rem] font-normal flex-1">
                Shorts
              </span>
            </a>
          </div>
          <div className="h-10 block relative rounded-xl w-[calc(100% - 12px)] hover:bg-[var(--hover-color)] xs:px-2">
            <a className="min-h-[40px] cursor-pointer box-border outline-none text-Primary flex flex-row items-center no-underline px-3 xs:px-0 rounded-xl">
              <span className="flex items-center mr-6 mdd:mr-4">
                <svg height="24px" viewBox="0 0 24 24" width="24px">
                  <path d="M10 18v-6l5 3-5 3zm7-15H7v1h10V3zm3 3H4v1h16V6zm2 3H2v12h20V9zM3 10h18v10H3V10z"></path>
                </svg>
              </span>
              <span className="flex items-center text-Primary overflow-hidden whitespace-nowrap overflow-ellipsis text-sm leading-[2rem] font-normal flex-1">
                Subscription
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
