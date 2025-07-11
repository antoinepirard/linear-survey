export const generateVideoThumbnail = (videoSrc: string, timeSeconds: number = 1): Promise<string> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Unable to get canvas context'));
      return;
    }

    video.addEventListener('loadedmetadata', () => {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
    });

    video.addEventListener('seeked', () => {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const thumbnailDataUrl = canvas.toDataURL('image/jpeg', 0.8);
      resolve(thumbnailDataUrl);
    });

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'));
    });

    video.crossOrigin = 'anonymous';
    video.currentTime = timeSeconds;
    video.src = videoSrc;
    video.load();
  });
};

export const getVideoDuration = (videoSrc: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');

    video.addEventListener('loadedmetadata', () => {
      resolve(video.duration);
    });

    video.addEventListener('error', () => {
      reject(new Error('Failed to load video'));
    });

    video.crossOrigin = 'anonymous';
    video.src = videoSrc;
    video.load();
  });
};

export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};