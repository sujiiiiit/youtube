import React, { useEffect, useState, useRef, useCallback } from "react";
import { useLocation } from "react-router-dom";

interface ContentItemType {
  imgURL: string;
  postLink: string;
  typeContent: string;
  title: string;
  shadeColor?: string; // Add this property

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

  const generateShadeColor = (
    src: string,
    callback: (color: string) => void
  ) => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;

      let r = 0,
        g = 0,
        b = 0;
      const pixelCount = data.length / 4;

      for (let i = 0; i < data.length; i += 4) {
        r += data[i];
        g += data[i + 1];
        b += data[i + 2];
      }

      r = Math.floor(r / pixelCount);
      g = Math.floor(g / pixelCount);
      b = Math.floor(b / pixelCount);

      callback(`rgb(${r}, ${g}, ${b})`);
    };
  };

  const fetchData = async (page: number) => {
    if (isLoadingRef.current) return;
    if (displayedPages.current.has(page)) return;

    isLoadingRef.current = true;
    try {
      const response = await fetch(
        `https://yt-api.sujitdwivediii.workers.dev/search/${query}/${page}`
      );
      const newData: ContentItemType[] = await response.json();

      if (newData.length > 0) {
        const updatedData = await Promise.all(
          newData.map(async (item) => {
            return new Promise<ContentItemType>((resolve) => {
              generateShadeColor(item.imgURL, (color) => {
                item["shadeColor"] = color;
                resolve(item);
              });
            });
          })
        );
        setData((prevData) => [...prevData, ...updatedData]);
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
    <div className="content_grid w-full h-[calc(100vh_-_(2_*_var(--header-height)))] max-w-[calc(var(--ytd-rich-grid-content-max-width)_+_var(--ytd-rich-grid-item-margin))] py-[var(--grid-padding)] pl-[16px] pr-[10px] flex flex-wrap overflow-auto  xs:pl-0 xs:pr-0 xs:m-0 xs:max-w-none">
      {loading && page === 1
        ? Array.from({ length: 12 }).map((_, index) => (
            <div
              key={index}
              className="group content_div flex flex-col relative mx-[calc(var(--ytd-rich-grid-item-margin)_/_2)]  mb-10 w-[calc(100%_/_var(--ytd-rich-grid-items-per-row)_-_var(--ytd-rich-grid-item-margin)_-_0.01px)] animate-pulse "
            >
              <div className="relative">
                <div
                  className={`imgoverlay aspect-[16/9] z-[11] bg-[var(--hover-color)] opacity-50 absolute top-[-8px] w-[calc(100%_-_24px)] h-full left-[12px] right-[12px] rounded-xl`}
                ></div>
                <div
                  className={`imgoverlay aspect-[16/9] z-[11] bg-[var(--hover-color)] opacity-80 absolute top-[-4px] w-[calc(100%_-_16px)] h-full left-[8px] right-[8px] rounded-[12px]`}
                ></div>
                <div className="img_cont lazy-bg aspect-[16/9] bg-cover bg-no-repeat bg-center rounded-lg xs:rounded-none bg-[var(--hover-color)]"></div>
              </div>

              <div className="content_inside flex ">
                <div className="w-full">
                  <div className="content_name rounded-full text-transparent text-base font-medium overflow-hidden block max-h-16.4 clamp-[2] box-[vertical] text-ellipsis whitespace-normal my-[12px]  mb-1 xs:mb-[2px] xs:mx-3 bg-[var(--hover-color)] h-4 w-4/4">
                    Loading
                  </div>
                </div>
              </div>
            </div>
          ))
        : data.map((item, index) => (
            <a
              className="group content_div flex flex-col relative mx-[calc(var(--ytd-rich-grid-item-margin)_/_2)]  mb-10 w-[calc(100%_/_var(--ytd-rich-grid-items-per-row)_-_var(--ytd-rich-grid-item-margin)_-_0.01px)] "
              href={`watch${item.postLink.replace(/\.html$/, "")}`}
              key={index}
            >
              <div className="relative">
                <div
                  className={`imgoverlay aspect-[16/9] z-[11] opacity-50 absolute top-[-8px] w-[calc(100%_-_24px)] h-full left-[12px] right-[12px] rounded-xl`}
                  style={{ backgroundColor: item.shadeColor }}
                ></div>
                <div
                  className={`imgoverlay aspect-[16/9] z-[11] absolute top-[-4px] w-[calc(100%_-_16px)] h-full left-[8px] right-[8px] rounded-[12px]`}
                  style={{ backgroundColor: item.shadeColor }}
                ></div>
                <div
                  className="img_cont lazy-bg aspect-[16/9] z-[12] relative bg-cover bg-no-repeat bg-center rounded-xl  bg-[var(--hover-color)]"
                  data-src={item.imgURL}
                  style={{ backgroundImage: "none" }}
                ></div>
              </div>
              <div className="content_inside flex mb-3 mx-4">
                <div>
                  <div className="content_name text-Primary text-base font-medium overflow-hidden block max-h-16.4 clamp-[2] box-[vertical] text-ellipsis whitespace-normal my-[12px]  mb-1 xs:mb-[2px]  xs:text-sm ">
                    {item.title}
                  </div>
                </div>
              </div>
            </a>
          ))}
      <div
        ref={page >1?loadMoreTriggerRef:null }
        className="w-full h-10 flex justify-center items-center"
      >
        {hasMore && page >1 ? (
          <div className="loading-indicator w-full h-10 flex justify-center items-center">
            <svg className="w-14 h-14" viewBox="0 0 100 100">
              <path
                fill="var(--txtblue)"
                d="M73,50c0-12.7-10.3-23-23-23S27,37.3,27,50 M30.9,50c0-10.5,8.5-19.1,19.1-19.1S69.1,39.5,69.1,50"
              >
                <animateTransform
                  attributeName="transform"
                  attributeType="XML"
                  type="rotate"
                  dur="1s"
                  from="0 50 50"
                  to="360 50 50"
                  repeatCount="indefinite"
                />
              </path>
            </svg>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default ContentItem;
