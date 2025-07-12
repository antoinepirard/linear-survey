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

export const preloadImageDimensions = async (images: string[]): Promise<Record<string, ImageDimensions>> => {
  const dimensions: Record<string, ImageDimensions> = {};
  
  await Promise.allSettled(
    images.map(async (src) => {
      try {
        const dims = await getImageDimensions(src);
        dimensions[src] = dims;
      } catch (error) {
        console.error(`Failed to get dimensions for ${src}:`, error);
      }
    })
  );
  
  return dimensions;
};