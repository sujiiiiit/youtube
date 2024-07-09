import React, { useState, useEffect, useRef } from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";
import { Link } from "react-router-dom";

interface VideoSource {
  url: string;
  isM3U8: boolean;
}

interface DramaData {
  drama: string;
  sources: VideoSource[];
}

interface Episode {
  postLink: string;
  typeContent: string;
  title: string;
  time: string;
}

interface DramaDetail {
  imgURL: string;
  director: string;
  title: string;
  description: string;
  genres: string[];
  episode: Episode[];
}

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [dramaName, setDramaName] = useState<string>("");
  const [detailLoading, setDetailLoading] = useState<boolean>(true);
  const [detailData, setDetailData] = useState<DramaDetail | null>(null);

  const isDetailLoadingRef = useRef<boolean>(false);
  const id = location.pathname.split("/")[2];

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await fetch(
          `https://yt-api.sujitdwivediii.workers.dev/server/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch video URL");
        }
        const data: DramaData = await response.json();

        if (data.sources.length > 0 && data.sources[0].url) {
          setVideoUrl(data.sources[0].url);
          setDramaName(data.drama);
        } else {
          throw new Error("Empty or invalid response from server");
        }
      } catch (error) {
        console.error("Error fetching video URL:", error);
        setVideoUrl(null); // Reset videoUrl state
      }
    };

    fetchVideoUrl();
  }, [id]);

  useEffect(() => {
    const fetchDramaDetail = async (keyword: string) => {
      if (isDetailLoadingRef.current) return;
      isDetailLoadingRef.current = true;

      try {
        const response = await fetch(
          `https://yt-api.sujitdwivediii.workers.dev${keyword}/`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch drama detail");
        }
        const newData: DramaDetail = await response.json();

        setDetailData(newData);
        console.log(newData);
        setDetailLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setDetailLoading(false);
      } finally {
        isDetailLoadingRef.current = false;
      }
    };

    if (dramaName) {
      fetchDramaDetail(dramaName);
    }
  }, [dramaName]);

  const reversedEpisodes = detailData?.episode.slice().reverse() || [];

  return (
    <div className="flex gap-3 w-full flex-row mdd:flex-col p-6 mdd:p-0">
      <div className="w-3/5 mdd:w-full sticky top-0">
        <div
          className={`${
            videoUrl
              ? ""
              : "bg-[var(--hover-color)] animate-pulse aspect-[16/9]"
          } w-full`}
        >
          {videoUrl && (
            <MediaPlayer
              src={videoUrl}
              viewType="video"
              streamType="on-demand"
              logLevel="warn"
              crossOrigin
              playsInline
              title="DramaTube"
              autoPlay={true}
              poster=""
            >
              <MediaProvider />
              <DefaultVideoLayout
                // thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
                icons={defaultLayoutIcons}
              />
            </MediaPlayer>
          )}
        </div>
      </div>
      <div
        className={`w-2/5 mdd:w-full h-[calc(100dvh_-_var(--header-height))] `}
      >
        {reversedEpisodes.length > 0 &&
          reversedEpisodes.map((ep, index) => (
            <Link
              key={ep.postLink} // Ensure each episode has a unique key
              to={`${window.location.origin}/watch${ep.postLink.replace(
                /\.html$/,
                ""
              )}`}
              className="group flex flex-row flex-nowrap hover:bg-[var(--hover-color)] p-3 xs:px-4 gap-4 rounded-xl xs:rounded-none"
            >
              <div className="img aspect-[16/9] w-full min-w-30 max-w-40">
                <img
                  src={detailData?.imgURL}
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
};

export default App;
