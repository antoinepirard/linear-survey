export interface ImageDimensions {
  width: number;
  height: number;
}

export const getImageDimensions = (src: string): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight
      });
    };
    
    img.onerror = () => {
      reject(new Error(`Failed to load image: ${src}`));
    };
    
    img.src = src;
  });
};

export const getVideoDimensions = (src: string): Promise<ImageDimensions> => {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video');
    
    video.onloadedmetadata = () => {
      resolve({
        width: video.videoWidth,
        height: video.videoHeight
      });
    };
    
    video.onerror = () => {
      reject(new Error(`Failed to load video: ${src}`));
    };
    
    video.src = src;
  });
};

export const getMediaDimensions = (src: string, type: 'image' | 'gif' | 'video' = 'image'): Promise<ImageDimensions> => {
  if (type === 'video') {
    return getVideoDimensions(src);
  }
  return getImageDimensions(src);
};

