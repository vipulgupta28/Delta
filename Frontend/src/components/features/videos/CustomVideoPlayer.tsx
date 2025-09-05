import { useRef, useState, useEffect, useCallback } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, RotateCcw, RotateCw, Settings } from "lucide-react";

const CustomVideoPlayer = ({ src }: { src: string }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [prevVolume, setPrevVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);

  const hideControlsTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  // Auto-hide controls
  const resetHideControlsTimer = useCallback(() => {
    setShowControls(true);
    if (hideControlsTimeoutRef.current) {
      clearTimeout(hideControlsTimeoutRef.current);
    }
    if (isPlaying) {
      hideControlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  }, [isPlaying]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => {
      setDuration(video.duration);
      setIsLoading(false);
    };
    const handleLoadStart = () => setIsLoading(true);
    const handleCanPlay = () => setIsLoading(false);

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("loadstart", handleLoadStart);
    video.addEventListener("canplay", handleCanPlay);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("loadstart", handleLoadStart);
      video.removeEventListener("canplay", handleCanPlay);
    };
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!videoRef.current) return;
      
      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          skip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          skip(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          adjustVolume(0.1);
          break;
        case 'ArrowDown':
          e.preventDefault();
          adjustVolume(-0.1);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, []);

  // Mouse movement detection
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleMouseMove = () => resetHideControlsTimer();
    const handleMouseLeave = () => {
      if (isPlaying) {
        setShowControls(false);
      }
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [resetHideControlsTimer, isPlaying]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
    resetHideControlsTimer();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const toggleMute = () => {
    if (volume > 0) {
      setPrevVolume(volume);
      setVolume(0);
      if (videoRef.current) videoRef.current.volume = 0;
    } else {
      setVolume(prevVolume);
      if (videoRef.current) videoRef.current.volume = prevVolume;
    }
  };

  const adjustVolume = (delta: number) => {
    const newVolume = Math.max(0, Math.min(1, volume + delta));
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    if (videoRef.current) {
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      videoRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    
    if (!isFullscreen) {
      containerRef.current.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const changePlaybackRate = (rate: number) => {
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
      setPlaybackRate(rate);
      setShowSpeedMenu(false);
    }
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;
  const volumePercentage = volume * 100;

  return (
    <div 
      ref={containerRef}
      className="w-full max-w-4xl mx-auto relative group cursor-pointer"
      onClick={togglePlay}
    >
      <div className="relative bg-black aspect-video rounded-xl overflow-hidden shadow-2xl">
        <video 
          ref={videoRef} 
          src={src} 
          className="w-full h-full object-cover"
          onLoadStart={() => setIsLoading(true)}
          onCanPlay={() => setIsLoading(false)}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
        )}

        {/* Play/Pause Overlay */}
        {!isPlaying && !isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 transition-opacity duration-200">
            <div className="w-20 h-20 bg-white bg-opacity-90 rounded-full flex items-center justify-center shadow-lg hover:bg-opacity-100 transition-all duration-200 hover:scale-110">
              <Play className="w-8 h-8 text-black ml-1" />
            </div>
          </div>
        )}

        {/* Custom Controls */}
        <div 
          className={`absolute bottom-0 left-0 w-full transition-all duration-300 ${
            showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Progress Bar */}
          <div className="px-4 pb-2">
            <div className="relative group/progress">
              <div className="h-1 bg-white bg-opacity-30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-150"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              <input
                type="range"
                min={0}
                max={duration}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
                className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer -top-1.5"
              />
              <div 
                className="absolute top-1/2 w-3 h-3 bg-blue-500 rounded-full transform -translate-y-1/2 transition-all duration-150 opacity-0 group-hover/progress:opacity-100 shadow-lg"
                style={{ left: `calc(${progressPercentage}% - 6px)` }}
              />
            </div>
          </div>

          {/* Controls Bar */}
          <div className="bg-gradient-to-t from-black via-black/80 to-transparent px-4 pb-4 pt-6">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                {/* Play/Pause */}
                <button 
                  onClick={togglePlay}
                  className="w-10 h-10 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                >
                  {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
                </button>

                {/* Skip buttons */}
                <button 
                  onClick={() => skip(-10)}
                  className="w-8 h-8 flex items-center justify-center text-white hover:bg-zinc-900 hover:bg-opacity-20 rounded-full transition-all duration-200"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => skip(10)}
                  className="w-8 h-8 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                {/* Volume Control */}
                <div 
                  className="flex items-center gap-2 relative"
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <button 
                    onClick={toggleMute}
                    className="w-8 h-8 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                  >
                    {volume > 0 ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                  </button>
                  
                  <div className={`transition-all duration-200 overflow-hidden ${showVolumeSlider ? 'w-20 opacity-100' : 'w-0 opacity-0'}`}>
                    <div className="relative">
                      <div className="h-1 bg-white bg-opacity-30 rounded-full">
                        <div 
                          className="h-full bg-white rounded-full transition-all duration-150"
                          style={{ width: `${volumePercentage}%` }}
                        />
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={1}
                        step={0.01}
                        value={volume}
                        onChange={handleVolumeChange}
                        className="absolute inset-0 w-full h-4 opacity-0 cursor-pointer -top-1.5"
                      />
                    </div>
                  </div>
                </div>

                {/* Time Display */}
                <span className="text-white text-sm font-mono min-w-max">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {/* Playback Speed */}
                <div className="relative">
                  <button 
                    onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                    className="w-8 h-8 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  
                  {showSpeedMenu && (
                    <div className="absolute bottom-10 right-0 bg-black bg-opacity-90 rounded-lg p-2 min-w-max">
                      {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                        <button
                          key={rate}
                          onClick={() => changePlaybackRate(rate)}
                          className={`block w-full text-left px-3 py-1 text-sm rounded transition-colors duration-150 ${
                            playbackRate === rate ? 'bg-blue-600 text-white' : 'text-white hover:bg-white hover:bg-opacity-20'
                          }`}
                        >
                          {rate}x
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Fullscreen */}
                <button 
                  onClick={toggleFullscreen}
                  className="w-8 h-8 flex items-center justify-center text-white hover:bg-white hover:bg-opacity-20 rounded-full transition-all duration-200"
                >
                  <Maximize className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts Hint */}
      <div className="mt-2 text-xs text-gray-500 text-center">
        Space: Play/Pause • ←/→: Skip 10s • ↑/↓: Volume • M: Mute • F: Fullscreen
      </div>
    </div>
  );
};

function formatTime(time: number) {
  if (isNaN(time)) return "0:00";
  const hours = Math.floor(time / 3600);
  const minutes = Math.floor((time % 3600) / 60);
  const seconds = Math.floor(time % 60);
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export default CustomVideoPlayer;