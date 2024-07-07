import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

// Utility functions for cookies
const setCookie = (name: string, value: string, daysToExpire: number) => {
  const expirationDate = new Date();
  expirationDate.setDate(expirationDate.getDate() + daysToExpire);
  const cookieString = `${name}=${value}; expires=${expirationDate.toUTCString()}; path=/`;
  document.cookie = cookieString;
};

const getCookie = (name: string) => {
  const cookies = document.cookie.split('; ');
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split('=');
    if (cookieName === name) {
      return cookieValue;
    }
  }
  return null;
};

interface VideoPlayerProps {
  url: string;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ url }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 550);
  const [currentQuality, setCurrentQuality] = useState('Auto');
  const [availableQualities, setAvailableQualities] = useState<string[]>([]);
  const [playedTime, setPlayedTime] = useState<number | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 550);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const hls = new Hls();
    const video = videoRef.current;

    if (!video) return;

    hls.attachMedia(video);
    hls.loadSource(url);

    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      setAvailableQualities(
        hls.levels.map((level) => level.name || `${level.width}x${level.height}`)
      );
    });

    hls.on(Hls.Events.LEVEL_SWITCHED, () => {
      const currentLevel = hls.levels[hls.currentLevel];
      setCurrentQuality(
        hls.autoLevelEnabled ? 'Auto' : currentLevel.name || `${currentLevel.width}x${currentLevel.height}`
      );
    });

    hls.on(Hls.Events.ERROR, (event, data) => {
      console.error(`HLS error: ${data.type} - ${data.details}`);
      if (data.fatal) {
        console.error('Fatal error occurred. Check the stream URL and manifest.');
      }
    });

    const savedPlayedTime = parseFloat(getCookie('played-time') || '0');
    if (!isNaN(savedPlayedTime)) {
      setPlayedTime(savedPlayedTime);
      video.currentTime = savedPlayedTime;
    }

    const handleLoadedData = () => setCookie('total-time', video.duration.toString(), 30);
    const handleTimeUpdate = () => {
      setCookie('played-time', video.currentTime.toString(), 30);
      setPlayedTime(video.currentTime);
    };

    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('timeupdate', handleTimeUpdate);

    return () => {
      hls.destroy();
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [url]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (video) {
      video.paused ? video.play() : video.pause();
    }
  };

  const toggleMute = () => {
    const video = videoRef.current;
    if (video) {
      video.muted = !video.muted;
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (video) {
      video.volume = parseFloat(e.target.value);
      video.muted = video.volume === 0;
    }
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (video) {
      if (!document.fullscreenElement) {
        video.requestFullscreen();
      } else {
        document.exitFullscreen();
      }
    }
  };

  const changeQuality = (level: number) => {
    const video = videoRef.current;
    if (video) {
      (video as any).hls.nextLevel = level;
    }
  };

  return (
    <div className={`player ${isMobile ? 'mobile' : ''} p-4`}>
      <video ref={videoRef} className="w-full max-w-md h-auto" controls>
        Your browser does not support the video tag.
      </video>
      <div className="controls flex flex-col sm:flex-row items-center mt-4 space-y-2 sm:space-y-0 sm:space-x-4">
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={togglePlayPause}>Play/Pause</button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={toggleMute}>Mute</button>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={handleFullscreen}>Fullscreen</button>
        <div className="quality-menu flex flex-wrap gap-2 mt-2 sm:mt-0">
          {availableQualities.map((quality, index) => (
            <button key={index} className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700" onClick={() => changeQuality(index)}>
              {quality}
            </button>
          ))}
        </div>
      </div>
      <div className="progress mt-4 w-full">
        <div className="progress-bar bg-blue-500 h-1 rounded mt-1" style={{ width: `${(playedTime || 0) / (videoRef.current?.duration || 1) * 100}%` }}></div>
      </div>
    </div>
  );
};

export default VideoPlayer;
