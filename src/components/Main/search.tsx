import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, Link } from "react-router-dom";

interface ContentItemType {
  imgURL: string;
  postLink: string;
  typeContent: string;
  title: string;
  time: string;
  episodeNumber: string;
}

const ContentItem: React.FC = () => {
  const [data, setData] = useState<ContentItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const isLoadingRef = useRef<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const displayedPages = useRef(new Set<number>());

  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q") || "";

  const fetchData = async (page: number) => {
    if (isLoadingRef.current) return;

    isLoadingRef.current = true;
    try {
      const response = await fetch(
        `https://yt-api.sujitdwivediii.workers.dev/search/${query}/${page}`
      );
      const newData = await response.json();

      if (newData.length > 0) {
        if (page === 1) {
          setData(newData); // Replace data with new results for the first page
          displayedPages.current.clear();
        } else {
          setData((prevData) => [...prevData, ...newData]); // Append results for subsequent pages
        }
        setLoading(false);
        displayedPages.current.add(page);
      } else {
        if (page === 1) {
          setData([]);
          setLoading(false);
        } else {
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    // Reset page to 1 whenever query changes
    setPage(1);
    setHasMore(true); // Reset hasMore to true when a new query is entered
    setLoading(true); // Set loading state to true when fetching new data
    setData([]); // Clear previous data when a new query is entered
    displayedPages.current.clear(); // Clear displayed pages for new query
  }, [query]);

  useEffect(() => {
    fetchData(page);
  }, [page, query]);

  useEffect(() => {
    const loadMoreObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreTriggerRef.current) {
      loadMoreObserver.observe(loadMoreTriggerRef.current);
    }

    return () => {
      if (loadMoreTriggerRef.current) {
        loadMoreObserver.unobserve(loadMoreTriggerRef.current);
      }
    };
  }, [hasMore]);

  const lazyLoad = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLDivElement;
        img.style.backgroundImage = `url(${img.dataset.src})`;
        observer.current?.unobserve(img);
      }
    });
  }, []);

  useEffect(() => {
    observer.current = new IntersectionObserver(lazyLoad, {
      rootMargin: "0px",
      threshold: 0.1,
    });
    data.forEach((_, index) => {
      const imgElement = document.getElementById(`img_${index}`);
      if (imgElement) {
        observer.current?.observe(imgElement);
      }
    });

    return () => {
      observer.current?.disconnect();
    };
  }, [data, lazyLoad]);

  return (
    <div
      className={`content_grid w-full h-[calc(100vh_-_(2_*_var(--header-height)))] max-w-[calc(var(--ytd-rich-grid-content-max-width)_+_var(--ytd-rich-grid-item-margin))] ${
        data.length === 0 ? "" : "py-[var(--grid-padding)]"
      } pl-[16px] pr-[10px] flex flex-wrap overflow-auto xs:pt-0 xs:pl-0 xs:pr-0 xs:m-0 xs:max-w-none`}
    >
      {loading && page === 1 ? (
        // Condition 1: Loading state
        Array.from({ length: 12 }).map((_, index) => (
          <div
            key={index}
            className="content_div flex flex-col relative ml-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mr-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mb-10 w-[calc(100%_/_var(--ytd-rich-grid-items-per-row)_-_var(--ytd-rich-grid-item-margin)_-_0.01px)] xs:rounded-none xs:p-0 xs:m-0 xs:mb-10 xs:w-full xs:max-w-none animate-pulse"
          >
            <div className="img_cont lazy-bg aspect-[16/9] bg-cover bg-no-repeat bg-center rounded-lg xs:rounded-none bg-[var(--hover-color)]"></div>
            <div className="content_inside flex">
              <div className="w-full">
                <div className="content_name rounded-full text-transparent text-base font-medium overflow-hidden block max-h-16.4 clamp-[2] box-[vertical] text-ellipsis whitespace-normal my-[12px] mb-1 xs:mb-[2px] xs:mx-3 bg-[var(--hover-color)] h-4 w-3/4">
                  Loading
                </div>
              </div>
            </div>
          </div>
        ))
      ) : data.length === 0 ? (
        // Condition 2: No data found
        <div className="not-found-text w-full h-full flex flex-col justify-center items-center gap-4">
          <img
            className="w-full max-w-28	 xs:max-w-24"
            src="./assets/monkey.png"
            alt="Not Found"
          />
          <div className="text-3xl xs:text-xl text-Primary font-bold">
            Not Found
          </div>
        </div>
      ) : (
        // Condition 3: Render data items
        data.map((item, index) => (
          <Link
            key={index}
            className="group content_div flex flex-col relative ml-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mr-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mb-5 w-[calc(100%_/_var(--ytd-rich-grid-items-per-row)_-_var(--ytd-rich-grid-item-margin)_-_0.01px)] xs:rounded-none xs:p-0 xs:m-0 xs:mb-10 xs:w-full xs:max-w-none"
            to={`${item.postLink.replace(/\.html$/, "")}`}
          >
            <div
              id={`img_${index}`}
              className="img_cont lazy-bg aspect-[16/9] bg-cover bg-no-repeat bg-center rounded-lg xs:rounded-none bg-[var(--hover-color)]"
              data-src={item.imgURL}
              style={{ backgroundImage: "none" }}
            ></div>
            <div className="content_inside flex mb-3 mx-4">
              <div>
                <div className="content_name text-Primary text-base font-medium overflow-hidden block max-h-16.4 clamp-[2] box-[vertical] text-ellipsis whitespace-normal my-[12px] mb-1 xs:mb-[2px] xs:text-sm">
                  {item.title}
                </div>
              </div>
            </div>
          </Link>
        ))
      )}

      <div
        ref={loadMoreTriggerRef}
        className={`content_grid w-full  max-w-[calc(var(--ytd-rich-grid-content-max-width)_+_var(--ytd-rich-grid-item-margin))] ${
          hasMore ? "pb-[var(--grid-padding)] " : ""
        } pl-[16px] pr-[10px] flex flex-wrap overflow-auto xs:pt-0 xs:pl-0 xs:pr-0 xs:m-0 xs:max-w-none`}
      >
        {hasMore && page >= 1 && <div className="loading-indicator"></div>}
      </div>
    </div>
  );
};

export default ContentItem;
