'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon, ArrowsPointingOutIcon } from '@heroicons/react/24/outline';
import { formatDuration } from '@/utils/videoThumbnail';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';
import { useNetworkQuality } from '@/hooks/useNetworkQuality';

interface VideoPlayerProps {
  src: string;
  className?: string;
  autoplay?: boolean;
  poster?: string;
  enableLazyLoading?: boolean;
}

export default function VideoPlayer({ src, className = '', autoplay = false, poster, enableLazyLoading = true }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [shouldLoad, setShouldLoad] = useState(!enableLazyLoading);
  const [loadProgress, setLoadProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const [touchStartTime, setTouchStartTime] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const { isIntersecting } = useIntersectionObserver(containerRef, {
    rootMargin: '100px',
    threshold: 0.1
  });
  
  const { quality, saveData } = useNetworkQuality();
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (enableLazyLoading && isIntersecting && !shouldLoad) {
      setShouldLoad(true);
    }
  }, [isIntersecting, enableLazyLoading, shouldLoad]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || !shouldLoad) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      setHasError(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };
    
    const handleProgress = () => {
      if (video.buffered.length > 0) {
        const bufferedEnd = video.buffered.end(video.buffered.length - 1);
        const duration = video.duration;
        if (duration > 0) {
          setLoadProgress((bufferedEnd / duration) * 100);
        }
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('error', handleError);
    video.addEventListener('progress', handleProgress);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('error', handleError);
      video.removeEventListener('progress', handleProgress);
    };
  }, [shouldLoad]);

  const togglePlayPause = useCallback(() => {
    if (!videoRef.current) return;

    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
  }, [isPlaying]);
  
  const handleTouchStart = () => {
    setTouchStartTime(Date.now());
  };
  
  const handleTouchEnd = () => {
    const touchDuration = Date.now() - touchStartTime;
    if (touchDuration < 300) {
      togglePlayPause();
    }
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!videoRef.current) return;

    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * duration;
    
    videoRef.current.currentTime = newTime;
  };

  const toggleMute = useCallback(() => {
    if (!videoRef.current) return;

    if (isMuted) {
      videoRef.current.volume = volume;
      setIsMuted(false);
    } else {
      videoRef.current.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
      setIsMuted(newVolume === 0);
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;

    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      videoRef.current.requestFullscreen();
    }
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;
  
  const handleRetry = () => {
    if (retryCount < 3) {
      setRetryCount(prev => prev + 1);
      setHasError(false);
      setIsLoading(true);
      if (videoRef.current) {
        videoRef.current.load();
      }
    }
  };
  
  const getVideoSrc = () => {
    if (quality === 'slow' || saveData) {
      return src.replace(/\.(mp4|webm|mov)$/i, '_low.$1');
    }
    return src;
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!videoRef.current) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          videoRef.current.currentTime = Math.max(0, videoRef.current.currentTime - 10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          videoRef.current.currentTime = Math.min(duration, videoRef.current.currentTime + 10);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [duration, togglePlayPause, toggleMute]);

  return (
    <div 
      ref={containerRef}
      className={`relative group ${className}`}
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      {!shouldLoad && poster && (
        <div className="relative">
          <Image
            src={poster}
            alt="Video thumbnail"
            width={800}
            height={450}
            className="max-w-full max-h-full object-contain"
            style={{ 
              maxWidth: '100%', 
              maxHeight: '80vh',
              width: 'auto',
              height: 'auto'
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
            <button
              onClick={() => setShouldLoad(true)}
              className="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-4 transition-all"
            >
              <PlayIcon className="w-8 h-8 text-white" />
            </button>
          </div>
        </div>
      )}
      
      {shouldLoad && (
        <video
          ref={videoRef}
          src={getVideoSrc()}
          className="max-w-full max-h-full object-contain"
          onClick={isMobile ? undefined : togglePlayPause}
          onTouchStart={isMobile ? handleTouchStart : undefined}
          onTouchEnd={isMobile ? handleTouchEnd : undefined}
          autoPlay={autoplay}
          poster={poster}
          preload={saveData ? "none" : "metadata"}
          playsInline
          muted={isMobile}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '80vh',
            width: 'auto',
            height: 'auto'
          }}
        />
      )}

      {isLoading && shouldLoad && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center space-y-2">
            <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin" />
            {loadProgress > 0 && (
              <div className="w-32 h-1 bg-white/30 rounded overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-300"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
            )}
            <span className="text-white text-sm">
              {quality === 'slow' || saveData ? 'Loading optimized...' : 'Loading...'}
            </span>
            {saveData && (
              <span className="text-white/70 text-xs">Data saver mode</span>
            )}
          </div>
        </div>
      )}
      
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="flex flex-col items-center space-y-4 text-white text-center px-4">
            <div className="text-red-400">
              <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <p className="text-sm">Failed to load video</p>
            {retryCount < 3 && (
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded transition-colors text-sm"
              >
                Retry ({3 - retryCount} attempts left)
              </button>
            )}
            {retryCount >= 3 && (
              <p className="text-xs text-white/60">Please check your connection and try again later</p>
            )}
          </div>
        </div>
      )}

      {showControls && !isLoading && !hasError && shouldLoad && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-4">
          {/* Progress Bar */}
          <div 
            className="w-full h-1 bg-white/30 rounded cursor-pointer mb-3"
            onClick={handleSeek}
          >
            <div 
              className="h-full bg-white rounded transition-all duration-150"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <button 
                onClick={togglePlayPause}
                className="p-1 hover:bg-white/20 rounded transition-colors"
              >
                {isPlaying ? <PauseIcon className="w-5 h-5" /> : <PlayIcon className="w-5 h-5" />}
              </button>

              <div className="flex items-center space-x-2">
                <button 
                  onClick={toggleMute}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  {isMuted ? <SpeakerXMarkIcon className="w-4 h-4" /> : <SpeakerWaveIcon className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-white/30 rounded appearance-none cursor-pointer"
                />
              </div>

              <span className="text-sm font-mono">
                {formatDuration(currentTime)} / {formatDuration(duration)}
              </span>
            </div>

            <button 
              onClick={toggleFullscreen}
              className="p-1 hover:bg-white/20 rounded transition-colors"
            >
              <ArrowsPointingOutIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}