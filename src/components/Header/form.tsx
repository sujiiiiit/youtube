import { RefObject, useEffect, useRef, useState } from "react";
import CrossIcon from "../../assets/icons/cross";
import SearchIcon from "../../assets/icons/search";

const Form = () => {
  const [searchValue, setSearchValue] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const inputRef: RefObject<HTMLInputElement> = useRef(null);
  const searchBarForm: RefObject<HTMLFormElement> = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<{ postLink: string; title: string }[]>(
    []
  );

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

  useEffect(() => {
    if (searchValue) {
      fetch(`https://yt-api.sujitdwivediii.workers.dev/search/${searchValue}`)
        .then((response) => response.json())
        .then((data) => setResults(data))
        .catch((error) => console.error("Error fetching data:", error));
    } else {
      setResults([]);
    }
  }, [searchValue]);

  return (
    <>
      <form
        ref={searchBarForm}
        className={`searchbarform relative flex xs:items-center w-full max-w-xl h-10 rounded-full border-0 outline-0 pl-8 ml-10 xs:absolute xs:z-30 xs:bg-[var(--background)] xs:right-0 xs:left-0 xs:m-0 xs:px-2.5  ${
          isOpen ? "xs:flex" : "xs:hidden"
        }`}
        action="/search"
        method="GET"
      >
        <span className="iconBtn searchBtn cursor-pointer hidden xs:flex">
          <svg
            className="svg-icon -rotate-90"
            height="24"
            viewBox="0 0 24 24"
            width="24"
          >
            <polygon points="19.35,11.5 11.5,3.65 3.65,11.5 4.35,12.21 11,5.56 11,20 12,20 12,5.56 18.65,12.21"></polygon>
          </svg>
        </span>
        <div className="w-full flex items-center relative justify-between bg-transparent outline-none text-primary rounded-l-[40px] rounded-r-none border border-[var(--primary-border)] focus-within:border-[var(--secondary-border)] group xs:border-0 xs:bg-[var(--hover-color)] xs:rounded-r-[40px] xs:items-center xs:h-5/6	">
          <input
            autoComplete="off"
            placeholder="Search"
            id="search_input"
            type="text"
            name="q"
            className="w-full border-0 outline-0 text-[16px] p-[12px_25px] rounded-l-[40px] mr-[24px] bg-transparent text-Primary  xs:m-0 xs:border-0 xs:text-sm xs:p-0 xs:pl-4"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
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
          className={` ${
            isFocused || searchValue ? "block" : "hidden"
          } block absolute bg-white dark:bg-[var(--hover-color)] w-full max-w-[34rem] top-[50px] z-30 rounded-[10px] py-4 max-h-[60dvh] overflow-auto border border-[#ccc] border-t-[#d9d9d9] shadow-[0_2px_4px_rgba(0,0,0,0.2)] dark:shadow-none dark:border-none xs:border-none xs:top-10 xs:rounded-[0px] xs:max-h-[100dvh] xs:shadow-none xs:!bg-transparent xs:w-full xs:left-0 `}
        >
            {results.map((result, index) => (
           
                <a key={index}
                  className="relative flex justify-between items-center px-4  xs:px-2 text-Primary no-underline text-[14px] font-medium pr-0 hover:bg-[var(--hover-color)] dark:hover:bg-white/5 xs:hover:bg-transparent xs:dark:hover:bg-transparent"
                  href={result.postLink}
                >
                  <span className="flex items-center ">
                    <span className="iconBtn ">
                      <svg viewBox="0 0 24 24">
                        <path d="m20.87 20.17-5.59-5.59C16.35 13.35 17 11.75 17 10c0-3.87-3.13-7-7-7s-7 3.13-7 7 3.13 7 7 7c1.75 0 3.35-.65 4.58-1.71l5.59 5.59.7-.71zM10 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"></path>
                      </svg>
                    </span>
                    <span className="pl-4">{result.title}</span>
                  </span>
                  <span className="iconBtn !w-full max-w-[64px] xs:!w-[40px] searchBtn cursor-pointer flex">
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
          </div>
      </form>
      <div
        className={`${
          isOpen ? "flex" : "hidden"
        } absolute top-0 bottom-0 right-0 left-0 bg-[var(--background)] h-dvh z-20`}
      ></div>
    </>
  );
};

export default Form;
