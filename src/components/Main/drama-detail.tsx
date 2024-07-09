import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import AddPlayListIcon from "../../assets/icons/add_playlist";
import ShareIcon from "../../assets/icons/share";
import PlayIcon from "../../assets/icons/play";
import DownloadIcon from "../../assets/icons/download";
import NotFound from "./notfound";
import { handleShare } from "../utils/share.ts";

interface Episode {
  postLink: string;
  typeContent: string;
  title: string;
  time: string;
}

interface DramaData {
  imgURL: string;
  director: string;
  title: string;
  description: string;
  genres: string[];
  episode: Episode[];
}

const DramaDetail: React.FC = () => {
  const [data, setData] = useState<DramaData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const isLoadingRef = useRef<boolean>(false);
  const location = useLocation();
  const path = location.pathname;
  const parts = path.split("/");
  const keyword = parts[2];
  // console.log(keyword);

  const fetchData = async (keyword: string) => {
    if (isLoadingRef.current) return;
    isLoadingRef.current = true;

    try {
      const response = await fetch(
        `https://yt-api.sujitdwivediii.workers.dev/drama-detail/${keyword}/`
      );
      const newData: DramaData = await response.json();

      setData(newData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    } finally {
      isLoadingRef.current = false;
    }
  };

  useEffect(() => {
    if (keyword) {
      fetchData(keyword);
    }
  }, [keyword]);

  loading || !data
    ? (document.title = "Loading...")
    : (document.title = "Detail : " + data.title);

  if (loading || !data) {
    return (
      <div className="loading-indicator w-full h-full flex justify-center items-center">
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
    );
  }

  const reversedEpisodes = data.episode.slice().reverse();

  const dataCondition =
    data.imgURL == null ||
    data.director == null ||
    data.title == null ||
    data.description == null ||
    data.genres == null ||
    data.episode == null;

  if (!dataCondition) {
    return (
      <div className="w-full  flex flex-row gap-4 xs:gap-2 xs:flex-col px-4 xs:p-0 overflow-auto my-6 xs:m-0">
        <div className="flex h-full max-h-[calc(100dvh_-_var(--header-height))] flex-col sticky top-0 xs:relative xs:top-none z-20 box-border w-full max-w-sm xs:max-w-none rounded-2xl xs:rounded-none">
          <div className="absolute   left-0 right-0 w-full flex-1 p-6 rounded-16 mb-6 rounded-2xl xs:rounded-none overflow-hidden flex">
            <div className="h-full z-30 img_shadow opacity-70 blur-[30px] flex justify-center">
              <img className="w-full " src={data.imgURL} alt="demo" />
              <div
                className="absolute z-[31] top-0 right-0 bottom-0 left-0"
                style={{ background: "var(--detail-gradient)" }}
              ></div>
            </div>
          </div>
          <div className="relative z-[32] rounded-xl p-4">
            <img
              className="aspect-[16/9] object-cover w-full rounded-xl"
              src={data.imgURL}
              alt="demo"
            />
          </div>
          <div className="relative z-[32] m-6 xs:m-4 !mt-0">
            <div className="main_title text-Primary font-bold text-xl line-clamp-2">
              {data.title}
            </div>
            <div className="xs:flex xs:justify-between">
              <div className="w-full mb-3">
                <div className="mt-4 text-sm font-normal line-clamp-1 text-Primary mb-1">
                  {data.director && (
                    <>
                      By {data.director}
                      <span className="mx-1">&#x2022;</span>
                    </>
                  )}
                  {data.episode.length} videos
                </div>
                <div className="text-xs font-normal line-clamp-2 text-Secondary dark:text-white/70">
                  {data.genres.join(", ")}
                </div>
              </div>
              <div className="w-full xs:w-auto my-4 flex gap-2">
                <button className="group z-[32] relative detailBtn iconBtn hover:!bg-transparent">
                  <div className="absolute z-[1] top-0 left-0 bottom-0 right-0 opacity-10 group-hover:opacity-15 bg-Primary rounded-full"></div>
                  <AddPlayListIcon className="z-[2]" />
                </button>
                <button
                  className="group z-[32] relative detailBtn iconBtn hover:!bg-transparent"
                  onClick={()=>handleShare(window.location.href)}
                >
                  <div className="absolute z-[1] top-0 left-0 bottom-0 right-0 opacity-10 group-hover:opacity-15 bg-Primary rounded-full"></div>
                  <ShareIcon className="z-[2]" />
                </button>
              </div>
            </div>
            <div className="desc text-Secondary text-sm line-clamp-2">
              {data.description}
            </div>
            <div className="w-full flex flex-nowrap relative z-[32] gap-2 my-4">
              <Link
                to={"#"}
                className="group w-full h-10 outline-0 border-0 relative rounded-full flex flex-nowrap items-center justify-center"
              >
                <div className="absolute top-0 left-0 right-0 bottom-0  bg-Primary rounded-3xl z-[1]"></div>
                <div className="dark:text-black h-10 text-white z-[2] flex justify-center items-center gap-1 text-sm px-4 rounded-3xl">
                  <span className="flex mb-[1.5px] items-center">
                    <PlayIcon className="fill-white dark:fill-black" />
                  </span>
                  <span className="flex h-10 items-center flex-nowrap text-nowrap whitespace-nowrap">
                    Play All
                  </span>
                </div>
              </Link>
              <Link
                to={"#"}
                className="group w-full h-10 outline-0 border-0 bg-transparent relative rounded-full flex flex-nowrap items-center justify-center"
              >
                <div className="absolute top-0 left-0 right-0 bottom-0 opacity-10 group-hover:opacity-15 bg-Primary rounded-3xl z-[1]"></div>
                <div className="text-Primary flex justify-center items-center gap-1 text-sm px-4 rounded-3xl">
                  <span className="flex h-10 items-center">
                    <DownloadIcon className="" />
                  </span>
                  <span className="flex h-10 items-center flex-nowrap text-nowrap whitespace-nowrap">
                    Download
                  </span>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div className="w-full list_div relative z-[21]  pb-4">
          {reversedEpisodes.map((ep, index) => (
            <Link
              key={ep.postLink} // Ensure each episode has a unique key
              to={`${window.location.origin}/watch${ep.postLink.replace(
                /\.html$/,
                ""
              )}`}
              className="group flex flex-row flex-nowrap hover:bg-[var(--hover-color)] p-3 xs:px-4 gap-4 rounded-xl xs:rounded-none"
            >
              <div className="img aspect-[16/9] w-full min-w-40 max-w-52">
                <img
                  src={data.imgURL}
                  alt="demo"
                  className="aspect-[16/9] object-cover rounded-xl xs:rounded-lg"
                />
              </div>
              <div className="list_title text-base xs:text-sm xs:font-normal font-bold text-Primary flex flex-col">
                <span className="line-clamp-2 mb-1">{ep.title}</span>
                <span className="text-Secondary text-xs font-normal">
                  Episode {index + 1} &#x2022; {ep.typeContent}
                </span>
                <span className="text-Secondary text-xs font-normal text-nowrap">
                  {ep.time}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  } else {
    return <NotFound />;
  }
};

export default DramaDetail;
