import React, { useState, useEffect, useRef } from "react";
import CrossIcon from "../../assets/icons/cross";
import SearchIcon from "../../assets/icons/search";
import BackIcon from "../../assets/icons/back";
import ExternalICon from "../../assets/icons/external";
import FilterIcon from "../../assets/icons/filter";
import debounce from "lodash.debounce";
import { useNavigate, Link, useLocation } from "react-router-dom";

interface FormProps{
  windowWidth:number;
}

const Form :React.FC<FormProps>= ({windowWidth}) => {
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
  const islocation = useLocation();
  const toggleBool = true ? false : true;

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
    const fetchWithRetry = (retryCount = 0) => {
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
        .catch((error) => {
          console.error("Error fetching data, retrying...", error);
          setTimeout(() => fetchWithRetry(retryCount + 1), 3000); // Retry after 1 second
        });
    };

    fetchWithRetry();
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
    inputRef.current?.blur();

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
        className={`searchbarform relative flex xs:items-center w-full max-w-xl h-10 rounded-full border-0 outline-0 pl-8 ml-10 xs:absolute z-30 xs:bg-[var(--background)] xs:right-0 xs:left-0 xs:m-0 xs:px-2.5 xs:h-[var(--header-height)] xs:top-0 xs:py-1.5
            ${
              isOpen || islocation.pathname.includes("/search")
                ? "xs:flex"
                : "xs:hidden"
            }`}
        onSubmit={handleSubmit} // Handle form submission
      >
        <div
          className={`${
            isOpen && windowWidth <= 600 ? "xs:!flex" : "xs:!hidden"
          } absolute top-0 right-0 left-0 bottom-0 bg-[var(--background)] z-30 hidden`}
        ></div>
        {islocation.pathname.includes("/search") ? (
          <>
            <Link
              to={"/"}
              className="iconBtn cursor-pointer hidden xs:flex xs:z-40"
              onClick={() => setIsOpen(toggleBool)}
            >
              <BackIcon />
            </Link>
          </>
        ) : (
          <>
            <span className="iconBtn searchBtn cursor-pointer hidden xs:flex xs:z-40">
              <BackIcon />
            </span>
          </>
        )}

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
        <button
          className={`hidden ${
            !isOpen && islocation.pathname.includes("/search")
              ? "xs:flex"
              : ""
          } iconBtn hover:bg-transparent z-40`}
        >
          <FilterIcon />
        </button>
        <div
          id="auto_suggest"
          className={`${
            isOpen && searchValue ? "block" : "hidden"
          } absolute bg-white dark:bg-[var(--hover-color)] w-full max-w-[34rem] top-[50px] z-20 rounded-lg py-4 max-h-[60dvh] overflow-auto border border-[#ccc] border-t-[#d9d9d9] shadow-[0_2px_4px_rgba(0,0,0,0.2)] dark:shadow-none dark:border-none xs:border-none xs:top-0 xs:rounded-[0px] xs:max-h-[100dvh] xs:shadow-none xs:!bg-transparent xs:w-full xs:left-0 xs:pt-10 `}
        >
          {results.map((result, index) => (
            <Link
              key={index}
              className="relative flex justify-between items-center px-4 xs:px-2 text-Primary no-underline text-[14px] font-medium pr-0 hover:bg-[var(--hover-color)] dark:hover:bg-white/5 xs:hover:bg-transparent xs:dark:hover:bg-transparent"
              to={result.postLink}
              onClick={() => setIsOpen(false)}
            >
              <span className="w-full flex items-center overflow-hidden">
                <span className="iconBtn hover:!bg-transparent">
                  <SearchIcon />
                </span>
                <span className="w-4/4 ml-4 truncate">{result.title}</span>
              </span>
              <span className="iconBtn !w-full max-w-[64px] xs:!w-[40px] searchBtn cursor-pointer flex hover:!bg-transparent">
                <ExternalICon />
              </span>
            </Link>
          ))}
          {!results.length &&
            searchValue &&
            Array.from({ length: windowWidth > 600 ? 4 : 20 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="relative flex justify-between items-center px-4 xs:px-2 text-Primary no-underline text-[14px] font-medium pr-0 "
                >
                  {hasMore ? (
                    <>
                      <span className="w-full flex items-center overflow-hidden">
                        <span className="iconBtn hover:!bg-transparent flex items-center">
                          <SearchIcon />
                        </span>
                        <span className="w-full text-transparent ml-4 bg-[var(--hover-color)]  dark:bg-white/5 xs:dark:bg-[var(--hover-color)] animate-pulse rounded-full h-4">
                          Loading
                        </span>
                      </span>
                      <span className="iconBtn !w-full max-w-[64px] xs:!w-[40px] searchBtn cursor-pointer flex hover:!bg-transparent">
                        <ExternalICon />
                      </span>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              )
            )}
        </div>
      </form>
      <div
        className={`absolute top-0 bottom-0 right-0 left-0 bg-transparent xs:bg-[var(--background)] h-dvh z-20 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={() => (windowWidth > 600 ? setIsOpen(false) : "")}
      ></div>
    </>
  );
};

export default Form;
