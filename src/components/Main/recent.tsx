import React, { useEffect, useState, useRef, useCallback } from "react";

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
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastContentRef = useRef<HTMLAnchorElement | null>(null);

  const fetchData = async (page: number) => {
    try {
      const response = await fetch(
        `https://yt-api.sujitdwivediii.workers.dev/recently-added/${page}/`
      );
      const result = await response.json();
      if (result.length > 0) {
        setData((prevData) => [...prevData, ...result]);
        setLoading(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setTimeout(() => fetchData(page), 3000); // Retry after 3 seconds
    }
  };

  useEffect(() => {
    fetchData(page);
  }, [page]);

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
    imageRefs.current.forEach((img) => {
      if (img) {
        observer.current?.observe(img);
      }
    });

    return () => {
      observer.current?.disconnect();
    };
  }, [data, lazyLoad]);

  useEffect(() => {
    if (!loading && hasMore) {
      const options = {
        root: null,
        rootMargin: "0px",
        threshold: 1.0,
      };

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      }, options);

      if (lastContentRef.current) {
        observer.observe(lastContentRef.current);
      }

      return () => {
        if (lastContentRef.current) {
          observer.unobserve(lastContentRef.current);
        }
      };
    }
  }, [loading, hasMore]);

  return (
    <div className="content_grid w-full h-[calc(100vh_-_(2_*_var(--header-height)))] max-w-[calc(var(--ytd-rich-grid-content-max-width)_+_var(--ytd-rich-grid-item-margin))] pt-[var(--grid-padding)] pl-[16px] pr-[10px] flex flex-wrap overflow-auto xs:p-0 xs:m-0 xs:max-w-none">
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
            <a
              key={index}
              className="group content_div flex flex-col relative ml-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mr-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mb-10 w-[calc(100%_/_var(--ytd-rich-grid-items-per-row)_-_var(--ytd-rich-grid-item-margin)_-_0.01px)] xs:rounded-none xs:p-0 xs:m-0 xs:mb-10 xs:w-full xs:max-w-none"
              href={`watch${item.postLink.replace(/\.html$/, "")}`}
              ref={index === data.length - 1 ? lastContentRef : null}
            >
              <div
                ref={(el) => (imageRefs.current[index] = el)}
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
            </a>
          ))}
      {loading && page > 1 && (
        <div className="loading-indicator">Loading more...</div>
      )}
    </div>
  );
};

export default ContentItem;
