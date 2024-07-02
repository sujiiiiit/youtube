import React, { useState, useEffect, useRef } from "react";
import CrossIcon from "../../assets/icons/cross";
import SearchIcon from "../../assets/icons/search";
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{ postLink: string; title: string }[]>(
    []
  );
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const displayedPages = useRef(new Set<number>());
  const navigate = useNavigate(); // React Router's navigate function

  const handleClearSearch = () => {
    setSearchValue("");
    inputRef.current?.focus();
  };

  const toggleOpenedClass = () => {
    setIsOpen((prevOpen) => !prevOpen);
  };

  useEffect(() => {
    const handleMenuBtnClick = () => {
      toggleOpenedClass();
    };

    const searchBtn = document.querySelectorAll(".searchBtn");
    searchBtn.forEach((searchBtn) => {
      searchBtn.addEventListener("click", handleMenuBtnClick);
    });

    return () => {
      searchBtn.forEach((searchBtn) => {
        searchBtn.removeEventListener("click", handleMenuBtnClick);
      });
    };
  }, []);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const fetchResults = (searchValue: string, page: number) => {
    if (displayedPages.current.has(page)) {
      return;
    }

    fetch(
      `https://yt-api.sujitdwivediii.workers.dev/search/${searchValue}/${page}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.length === 0) {
          setHasMore(false);
        } else {
          setResults((prevResults) =>
            page === 1 ? data : [...prevResults, ...data]
          );
          displayedPages.current.add(page);
          console.log(`Showing result for page ${page}`);
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  };

  const debouncedFetchResults = useRef(
    debounce((searchValue: string) => {
      setPage(1);
      setHasMore(true);
      displayedPages.current.clear();
      fetchResults(searchValue, 1);
    }, 300)
  ).current;

  useEffect(() => {
    if (searchValue) {
      debouncedFetchResults(searchValue);
    } else {
      setResults([]);
    }
  }, [searchValue, debouncedFetchResults]);

  useEffect(() => {
    const handleScroll = () => {
      const container = document.getElementById("auto_suggest");
      if (container) {
        const { scrollTop, scrollHeight, clientHeight } = container;
        if (scrollTop + clientHeight >= scrollHeight - 10 && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    const container = document.getElementById("auto_suggest");
    if (container) {
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (container) {
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, [hasMore]);

  useEffect(() => {
    if (page > 1 && hasMore) {
      fetchResults(searchValue, page);
    }
  }, [page]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // Prevent default form submission

    // Construct the search URL
    const searchUrl = `/search?q=${encodeURIComponent(searchValue)}`;
    setIsOpen(false); // Close the search bar

    // Navigate to the search URL using React Router's navigate function
    navigate(searchUrl);
  };

  return (
    <>
      <form
        data-focused={isFocused}
        className={`searchbarform relative flex xs:items-center w-full max-w-xl h-10 rounded-full border-0 outline-0 pl-8 ml-10 xs:absolute z-30 xs:bg-[var(--background)] xs:right-0 xs:left-0 xs:m-0 xs:px-2.5 xs:top-2 ${
          isOpen ? "xs:flex" : "xs:hidden"
        }`}
        onSubmit={handleSubmit} // Handle form submission
      >
        <div
          className={`${
            isOpen && window.innerWidth <= 600 ? "xs:!flex" : "xs:!hidden"
          } absolute top-0 right-0 left-0 bottom-0 bg-[var(--background)] z-30 hidden`}
        ></div>
        <span className="iconBtn searchBtn cursor-pointer hidden xs:flex xs:z-40">
          <svg
            className="svg-icon -rotate-90"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <polygon points="19.35,11.5 11.5,3.65 3.65,11.5 4.35,12.21 11,5.56 11,20 12,20 12,5.56 18.65,12.21"></polygon>
          </svg>
        </span>
        <div className="w-full flex items-center relative justify-between bg-transparent outline-none text-primary rounded-l-[40px] rounded-r-none border border-[var(--primary-border)] focus-within:border-[var(--secondary-border)] group xs:border-0 xs:bg-[var(--hover-color)] xs:rounded-r-[40px] xs:items-center xs:h-5/6 xs:z-40">
          <input
            autoComplete="off"
            placeholder="Search"
            id="search_input"
            type="text"
            name="q"
            className="w-full border-0 outline-0 text-[16px] p-[12px_25px] rounded-l-[40px] mr-[24px] bg-transparent text-Primary xs:m-0 xs:border-0 xs:text-sm xs:p-0 xs:pl-4"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setIsFocused(false)}
            ref={inputRef}
          />

          {searchValue && (
            <span
              onClick={handleClearSearch}
              style={{ display: searchValue ? "flex" : "none" }}
              className="cursor-pointer absolute right-0 iconBtn clearSearch clear_search xs:!w-5 xs:!h-5 xs:relative xs:mr-3 xs:ml-1"
              id="clear_search"
            >
              <CrossIcon />
            </span>
          )}
        </div>
        <button
          className="flex items-center justify-center border border-[var(--primary-border)] border-l-0 bg-[var(--hover-color)] outline-none w-full max-w-[64px] rounded-[0_40px_40px_0] xs:hidden"
          id="search_submit"
          type="submit"
        >
          <SearchIcon />
        </button>
        <div
          id="auto_suggest"
          className={`${
            isOpen && searchValue ? "block" : "hidden"
          } absolute bg-white dark:bg-[var(--hover-color)] w-full max-w-[34rem] top-[50px] z-20 rounded-lg py-4 max-h-[60dvh] overflow-auto border border-[#ccc] border-t-[#d9d9d9] shadow-[0_2px_4px_rgba(0,0,0,0.2)] dark:shadow-none dark:border-none xs:border-none xs:top-0 xs:rounded-[0px] xs:max-h-[100dvh] xs:shadow-none xs:!bg-transparent xs:w-full xs:left-0 xs:pt-10 `}
        >
          {results.map((result, index) => (
            <a
              key={index}
              className="relative flex justify-between items-center px-4 xs:px-2 text-Primary no-underline text-[14px] font-medium pr-0 hover:bg-[var(--hover-color)] dark:hover:bg-white/5 xs:hover:bg-transparent xs:dark:hover:bg-transparent"
              href={result.postLink}
            >
              <span className="w-full flex items-center overflow-hidden">
                <span className="iconBtn hover:!bg-transparent">
                  <svg viewBox="0 0 24 24">
                    <path d="m20.87 20.17-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path>
                  </svg>
                </span>
                <span className="w-4/4 ml-4 truncate">{result.title}</span>
              </span>
              <span className="iconBtn !w-full max-w-[64px] xs:!w-[40px] searchBtn cursor-pointer flex hover:!bg-transparent">
                <svg
                  className="svg-icon -rotate-45"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                >
                  <polygon points="19.35,11.5 11.5,3.65 3.65,11.5 4.35,12.21 11,5.56 11,20 12,20 12,5.56 18.65,12.21"></polygon>
                </svg>
              </span>
            </a>
          ))}
          {!results.length && searchValue && (
            <div className="no-more-data text-center text-gray-500">
              {hasMore ? "Loading..." : "No more data"}
            </div>
          )}
        </div>
      </form>
      <div
        className={`absolute top-0 bottom-0 right-0 left-0 bg-transparent xs:bg-[var(--background)] h-dvh z-20 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => (window.innerWidth > 600 ? setIsOpen(false) : "")}
      ></div>
    </>
  );
};

export default Form;
