import React, { useEffect, useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";

interface ContentItemType {
  imgURL: string;
  postLink: string;
  typeContent: string;
  title: string;
  time: string;
  episodeNumber: string;
}

const ContentItem: React.FC = () => {
  document.title = "Recently Added - Dramatube";
  const [data, setData] = useState<ContentItemType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const isLoadingRef = useRef<boolean>(false);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);
  const displayedPages = useRef(new Set<number>());

  const fetchData = async (page: number) => {
    if (isLoadingRef.current) return;
    if (displayedPages.current.has(page)) return;

    isLoadingRef.current = true;
    try {
      const response = await fetch(
        `https://yt-api.sujitdwivediii.workers.dev/recently-added/${page}/`
      );
      const newData = await response.json();

      if (newData.length > 0) {
        setData((prevData) => [...prevData, ...newData]);
        setLoading(false);
        displayedPages.current.add(page);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

  useEffect(() => {
    const loadMoreObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
          console.log("showing recent added page", page + 1);
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
      if (document.getElementById(`img_${index}`)) {
        observer.current?.observe(document.getElementById(`img_${index}`)!);
      }
    });

    return () => {
      observer.current?.disconnect();
    };
  }, [data, lazyLoad]);

  return (
    <div className="content_grid w-full h-[calc(100vh_-_(2_*_var(--header-height)))] max-w-[calc(var(--ytd-rich-grid-content-max-width)_+_var(--ytd-rich-grid-item-margin))] py-[var(--grid-padding)] pl-[16px] pr-[10px] flex flex-wrap overflow-auto xs:pt-0 xs:pl-0 xs:pr-0 xs:m-0 xs:max-w-none">
      {loading && page === 1
        ? Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="content_div flex flex-col relative ml-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mr-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mb-10 w-[calc(100%_/_var(--ytd-rich-grid-items-per-row)_-_var(--ytd-rich-grid-item-margin)_-_0.01px)] xs:rounded-none xs:p-0 xs:m-0 xs:mb-10 xs:w-full xs:max-w-none animate-pulse "
            >
              <div className="img_cont lazy-bg aspect-[16/9] bg-cover bg-no-repeat bg-center rounded-lg xs:rounded-none bg-[var(--hover-color)]"></div>
              <div className="content_inside flex ">
                <div className="w-full">
                  <div className="content_name rounded-full text-transparent text-base font-medium overflow-hidden block max-h-16.4 clamp-[2] box-[vertical] text-ellipsis whitespace-normal my-[12px]  mb-1 xs:mb-[2px] xs:mx-3 bg-[var(--hover-color)] h-4 w-4/4">
                    Loading
                  </div>
                  <div className="content_info flex text-Secondary text-sm flex-nowrap">
                    <div className="content_ep text-transparent rounded-full bg-[var(--hover-color)] h-4 mt-2 w-3/4 xs:mx-3">
                      Loading
                    </div>
                    <span className="space_span mx-1.5"></span>
                  </div>
                </div>
              </div>
            </div>
          ))
        : data.map((item, index) => (
            <Link
              key={index}
              to={`watch${item.postLink.replace(/\.html$/, "")}`}
              className="group content_div flex flex-col relative ml-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mr-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mb-10 w-[calc(100%_/_var(--ytd-rich-grid-items-per-row)_-_var(--ytd-rich-grid-item-margin)_-_0.01px)] xs:rounded-none xs:p-0 xs:m-0 xs:mb-10 xs:w-full xs:max-w-none"
            >
              <div
                id={`img_${index}`}
                className="img_cont lazy-bg aspect-[16/9] bg-cover bg-no-repeat bg-center rounded-lg xs:rounded-none bg-[var(--hover-color)]"
                data-src={item.imgURL}
                style={{ backgroundImage: "none" }}
              ></div>
              <div className="content_inside flex mb-3 mx-4">
                <div>
                  <div className="content_name text-Primary text-base font-medium overflow-hidden block max-h-16.4 clamp-[2] box-[vertical] text-ellipsis whitespace-normal my-[12px]  mb-1 xs:mb-[2px]  xs:text-sm ">
                    {item.title}
                  </div>
                  <div className="content_info flex text-Secondary text-sm flex-nowrap">
                    <div className="content_ep">{item.episodeNumber}</div>
                    <span className="space_span mx-1.5">&#8226;</span>
                    <div className="content_time">
                      <span className="content_posted">{item.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
      <div
        ref={loadMoreTriggerRef}
        className={`content_grid w-full  max-w-[calc(var(--ytd-rich-grid-content-max-width)_+_var(--ytd-rich-grid-item-margin))] ${
          hasMore ? " " : "pb-[var(--grid-padding)]"
        } pl-[16px] pr-[10px] flex flex-wrap overflow-auto xs:pt-0 xs:pl-0 xs:pr-0 xs:m-0 xs:max-w-none`}
      >
        {hasMore &&
          page >= 1 &&
          Array.from({ length: window.innerWidth > 600 ? 4 : 1 }).map(
            (_, index) => (
              <div
                key={index}
                className="content_div flex flex-col relative ml-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mr-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mb-10 w-[calc(100%_/_var(--ytd-rich-grid-items-per-row)_-_var(--ytd-rich-grid-item-margin)_-_0.01px)] xs:rounded-none xs:p-0 xs:m-0 xs:mb-10 xs:w-full xs:max-w-none animate-pulse "
              >
                <div className="img_cont lazy-bg aspect-[16/9] bg-cover bg-no-repeat bg-center rounded-lg xs:rounded-none bg-[var(--hover-color)]"></div>
                <div className="content_inside flex ">
                  <div className="w-full">
                    <div className="content_name rounded-full text-transparent text-base font-medium overflow-hidden block max-h-16.4 clamp-[2] box-[vertical] text-ellipsis whitespace-normal my-[12px]  mb-1 xs:mb-[2px] xs:mx-3 bg-[var(--hover-color)] h-4 w-4/4">
                      Loading
                    </div>
                    <div className="content_info flex text-Secondary text-sm flex-nowrap">
                      <div className="content_ep text-transparent rounded-full bg-[var(--hover-color)] h-4 mt-2 w-3/4 xs:mx-3">
                        Loading
                      </div>
                      <span className="space_span mx-1.5"></span>
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default ContentItem;
