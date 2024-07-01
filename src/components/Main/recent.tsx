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
  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observer = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://production.yt-api.sujitdwivediii.workers.dev/recently-added/");
        const result = await response.json();
        setData(result);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const lazyLoad = useCallback((entries: IntersectionObserverEntry[]) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target as HTMLDivElement;
        img.style.backgroundImage = `url(${img.dataset.src})`;
        observer.current?.unobserve(img);
      }
    });
  }, []);

  useEffect(() => {
    observer.current = new IntersectionObserver(lazyLoad, {
      rootMargin: '0px',
      threshold: 0.1
    });
    imageRefs.current.forEach(img => {
      if (img) {
        observer.current?.observe(img);
      }
    });

    return () => {
      observer.current?.disconnect();
    };
  }, [data, lazyLoad]);

  return (
    <div className="content_grid w-full h-[calc(100vh_-_(2_*_var(--header-height)))] max-w-[calc(var(--ytd-rich-grid-content-max-width)_+_var(--ytd-rich-grid-item-margin))] pt-[var(--grid-padding)] pl-[16px] pr-[10px] flex flex-wrap overflow-auto xs:p-0 xs:m-0 xs:max-w-none">
      {loading
        ? Array.from({ length: 12 }).map((_, index) => (
          <div key={index} className="content_div flex flex-col relative ml-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mr-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mb-[40px] w-[calc(100%_/_var(--ytd-rich-grid-items-per-row)_-_var(--ytd-rich-grid-item-margin)_-_0.01px)] xs:rounded-none xs:p-0 xs:m-0 xs:w-full xs:max-w-none animate-pulse">
            <div className="img_cont lazy-bg aspect-[16/9] bg-cover bg-no-repeat bg-center rounded-lg xs:rounded-none bg-[var(--hover-color)]"></div>
            <div className="content_inside flex ">
              <div className="w-full">
                <div className="content_name text-Primary text-base font-medium overflow-hidden block max-h-16.4 clamp-[2] box-[vertical] text-ellipsis whitespace-normal my-[12px] mb-[4px] xs:text-sm xs:mb-[3px] xs:ml-[16px] bg-[var(--hover-color)] h-4 w-3/4"></div>
                <div className="content_info flex text-Secondary text-sm flex-nowrap">
                  <div className="content_ep bg-[var(--hover-color)] h-3 w-1/4"></div>
                  <span className="space_span mx-1.5"></span>
                
                </div>
              </div>
            </div>
          </div>
        ))
        : data.map((item, index) => (
          <div key={index} className="content_div flex flex-col relative ml-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mr-[calc(var(--ytd-rich-grid-item-margin)_/_2)] mb-[40px] w-[calc(100%_/_var(--ytd-rich-grid-items-per-row)_-_var(--ytd-rich-grid-item-margin)_-_0.01px)] xs:rounded-none xs:p-0 xs:m-0 xs:w-full xs:max-w-none">
            <div
              ref={(el) => (imageRefs.current[index] = el)}
              className="img_cont lazy-bg aspect-[16/9] bg-cover bg-no-repeat bg-center rounded-lg xs:rounded-none"
              data-src={item.imgURL}
              style={{ backgroundImage: 'none' }}
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
          </div>
        ))}
    </div>
  );
};

export default ContentItem;
