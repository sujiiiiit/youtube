import { useRef, useEffect, useState } from "react";

const MainTags = () => {
  const listRef = useRef<HTMLUListElement | null>(null); // Explicitly specify type
  const [showLeftScroll, setShowLeftScroll] = useState(false);
  const [showRightScroll, setShowRightScroll] = useState(false);

  const checkScrollPosition = () => {
    if (listRef.current) {
      setShowLeftScroll(listRef.current.scrollLeft > 0);
      setShowRightScroll(
        listRef.current.scrollLeft <
          listRef.current.scrollWidth - listRef.current.clientWidth
      );
    }
  };

  useEffect(() => {
    // Check initial scroll position once component is mounted
    checkScrollPosition();

    // Add scroll event listener
    if (listRef.current) {
      listRef.current.addEventListener("scroll", checkScrollPosition);
    }

    // Clean up event listener
    return () => {
      if (listRef.current) {
        listRef.current.removeEventListener("scroll", checkScrollPosition);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (listRef.current) {
      listRef.current.scrollLeft -= 256; // Adjust the scroll amount as needed
    }
  };

  const scrollRight = () => {
    if (listRef.current) {
      listRef.current.scrollLeft += 256; // Adjust the scroll amount as needed
    }
  };

  return (
    <div className="main_tags w-full relative flex items-center h-[var(--header-height)] xs:border-y border-y-[var(--hover-color)] border-x-0">
      <div
        id="left-slide-arrow"
        className={`xs:hidden absolute flex flex-row justify-center z-10 top-0 bottom-0 items-center ${
          showLeftScroll ? "flex" : "hidden"
        }`}
      >
        <span className="flex items-center h-full bg-[var(--background)]">
          <button className="iconBtn scroll-left" onClick={scrollLeft}>
            <svg viewBox="0 0 24 24">
              <path d="M14.96 18.96 8 12l6.96-6.96.71.71L9.41 12l6.25 6.25-.7.71z"></path>
            </svg>
          </button>
        </span>
      </div>
      <ul
        ref={listRef}
        className="hide-scrollbar h-full items items-center flex border-0 list-none overflow-x-auto m-0 px-4 xs:px-2 scroll-smooth"
      >
        <button className="hidden group menuBtn tag_items mx-3 xs:mx-1 xs:block text-ellipsis justify-center whitespace-nowrap m-[12px] ml-0 bg-[var(--hover-color)] rounded-lg xs:rounded-md px-[12px] transition-[background-color_0.5s_cubic-bezier(0.05,0,0,1)]">
          <a className="  no-underline h-[32px] min-w-[12px] box-border outline-none overflow-hidden cursor-pointer select-none relative text-sm xs:text-xs	  leading-5 flex flex-row items-center whitespace-nowrap xs:h-7">
            <svg
              className="svg-icons"
              height="24"
              viewBox="0 0 24 24"
              width="24"
            >
              <path d="m9.8 9.8-3.83 8.23 8.23-3.83 3.83-8.23L9.8 9.8zm3.28 2.97c-.21.29-.51.48-.86.54-.07.01-.15.02-.22.02-.28 0-.54-.08-.77-.25-.29-.21-.48-.51-.54-.86-.06-.35.02-.71.23-.99.21-.29.51-.48.86-.54.35-.06.7.02.99.23.29.21.48.51.54.86.06.35-.02.7-.23.99zM12 3c4.96 0 9 4.04 9 9s-4.04 9-9 9-9-4.04-9-9 4.04-9 9-9m0-1C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"></path>
            </svg>
          </a>
        </button>
        {["Recent",
        "Anime",
          "Korean Drama",
          "Japanese Drama",
          "Taiwanese Drama",
          "Hong Kong Drama",
          "Chinese Drama",
          "American Drama",
          "Other Asia Drama",
          "Thailand Drama",
          "Indian Drama",
          "Indian Drama",
          "Indian Drama",
          "Indian Drama",
          "Indian Drama",
          "Indian Drama",
          "other",
        ].map((title, index) => (
          <li
            className="tag_items mx-3 xs:mx-1 block text-ellipsis justify-center whitespace-nowrap m-[12px] ml-0 bg-[var(--hover-color)] rounded-lg xs:rounded-md px-[12px] transition-[background-color_0.5s_cubic-bezier(0.05,0,0,1)]"
            key={index}
          >
            <a
              href="#"
              title={title}
              className="text-Primary no-underline h-[32px] min-w-[12px] box-border outline-none overflow-hidden cursor-pointer select-none relative text-sm xs:text-xs	  leading-5 flex flex-row items-center whitespace-nowrap xs:h-7"
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
      <div
        id="right-slide-arrow"
        className={`absolute flex flex-row justify-center z-10 top-0 bottom-0 items-center right-0 xs:hidden ${
          showRightScroll ? "flex" : "hidden"
        }`}
      >
        <span className="flex items-center h-full bg-[var(--background)]">
          <button className="iconBtn scroll-right" onClick={scrollRight}>
            <svg viewBox="0 0 24 24">
              <path d="m9.4 18.4-.7-.7 5.6-5.6-5.7-5.7.7-.7 6.4 6.4-6.3 6.3z"></path>
            </svg>
          </button>
        </span>
      </div>
    </div>
  );
};

export default MainTags;
