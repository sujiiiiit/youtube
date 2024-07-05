import React from 'react';
import VideoPlayer from '../player/player';

const App: React.FC = () => {
  const videoUrl = 'http://127.0.0.1:8000/things/master.m3u8';

  return (
    
      <VideoPlayer url={videoUrl} />
  );
};

export default App;
