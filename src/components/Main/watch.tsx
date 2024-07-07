import React, { useState, useEffect } from "react";
import "@vidstack/react/player/styles/default/theme.css";
import "@vidstack/react/player/styles/default/layouts/audio.css";
import "@vidstack/react/player/styles/default/layouts/video.css";

import { MediaPlayer, MediaProvider } from "@vidstack/react";
import {
  DefaultVideoLayout,
  defaultLayoutIcons,
} from "@vidstack/react/player/layouts/default";

interface VideoData {
  url: string;
  isM3U8: boolean;
}

const App: React.FC = () => {
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const path = location.pathname;
  const parts = path.split("/");
  const id = parts[2];

  useEffect(() => {
    const fetchVideoUrl = async () => {
      try {
        const response = await fetch(
          `https://yt-api.sujitdwivediii.workers.dev/server/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch video URL");
        }
        const data: VideoData[] = await response.json();

        if (data.length > 0 && data[0].url) {
          setVideoUrl(data[0].url);
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

  return (
    <>
      <div
        className={` ${
          videoUrl ? "" : "bg-[var(--hover-color)] animate-pulse aspect-[16/9]"
        } w-full max-w-3xl `}
      >
        {videoUrl ? (
          <MediaPlayer
            src={videoUrl}
            viewType="video"
            streamType="on-demand"
            logLevel="warn"
            crossOrigin
            playsInline
            title="Sprite Fight"
            poster="https://files.vidstack.io/sprite-fight/poster.webp"
          >
            <MediaProvider />
            <DefaultVideoLayout
              // thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt"
              icons={defaultLayoutIcons}
            />
          </MediaPlayer>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default App;
