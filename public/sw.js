const CACHE_NAME = 'folio-video-cache-v1';
const VIDEO_CACHE_NAME = 'folio-videos-v1';
const THUMBNAIL_CACHE_NAME = 'folio-thumbnails-v1';

// Cache strategy for different file types
const CACHE_STRATEGIES = {
  videos: {
    maxSize: 100 * 1024 * 1024, // 100MB max for videos
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  },
  thumbnails: {
    maxSize: 50 * 1024 * 1024, // 50MB max for thumbnails
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  }
};

// Install event
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(() => {
      console.log('Service worker installed and cache opened');
    })
  );
  self.skipWaiting();
});

// Activate event
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== VIDEO_CACHE_NAME && cacheName !== THUMBNAIL_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Helper function to check if request is for video
function isVideoRequest(url) {
  return /\.(mp4|webm|mov|avi|mkv)(\?.*)?$/i.test(url);
}

// Helper function to check if request is for thumbnail/poster
function isThumbnailRequest(url) {
  return /\.(jpg|jpeg|png|webp|gif)(\?.*)?$/i.test(url) || url.includes('poster') || url.includes('thumbnail');
}

// Helper function to get cache size
async function getCacheSize(cacheName) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  let totalSize = 0;
  
  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const blob = await response.blob();
      totalSize += blob.size;
    }
  }
  
  return totalSize;
}

// Helper function to clean old cache entries
async function cleanOldCacheEntries(cacheName, maxAge) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  const now = Date.now();
  
  for (const key of keys) {
    const response = await cache.match(key);
    if (response) {
      const dateHeader = response.headers.get('date');
      if (dateHeader) {
        const cacheDate = new Date(dateHeader).getTime();
        if (now - cacheDate > maxAge) {
          await cache.delete(key);
        }
      }
    }
  }
}

// Helper function to manage cache size
async function manageCacheSize(cacheName, maxSize) {
  const cache = await caches.open(cacheName);
  const currentSize = await getCacheSize(cacheName);
  
  if (currentSize > maxSize) {
    const keys = await cache.keys();
    // Remove oldest entries first (simple FIFO)
    for (let i = 0; i < Math.ceil(keys.length * 0.2); i++) {
      await cache.delete(keys[i]);
    }
  }
}

// Fetch event handler
self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Handle video requests
  if (isVideoRequest(url)) {
    event.respondWith(
      caches.open(VIDEO_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Fetch from network
        const networkResponse = await fetch(event.request);
        
        // Only cache successful responses
        if (networkResponse.ok) {
          // Clean old entries and manage cache size
          await cleanOldCacheEntries(VIDEO_CACHE_NAME, CACHE_STRATEGIES.videos.maxAge);
          await manageCacheSize(VIDEO_CACHE_NAME, CACHE_STRATEGIES.videos.maxSize);
          
          // Cache the response
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      }).catch(() => {
        // Return cached version if network fails
        return caches.match(event.request);
      })
    );
  }
  
  // Handle thumbnail/poster requests
  else if (isThumbnailRequest(url)) {
    event.respondWith(
      caches.open(THUMBNAIL_CACHE_NAME).then(async (cache) => {
        const cachedResponse = await cache.match(event.request);
        
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Fetch from network
        const networkResponse = await fetch(event.request);
        
        // Only cache successful responses
        if (networkResponse.ok) {
          // Clean old entries and manage cache size
          await cleanOldCacheEntries(THUMBNAIL_CACHE_NAME, CACHE_STRATEGIES.thumbnails.maxAge);
          await manageCacheSize(THUMBNAIL_CACHE_NAME, CACHE_STRATEGIES.thumbnails.maxSize);
          
          // Cache the response
          cache.put(event.request, networkResponse.clone());
        }
        
        return networkResponse;
      }).catch(() => {
        // Return cached version if network fails
        return caches.match(event.request);
      })
    );
  }
  
  // For other requests, use default browser behavior
  else {
    event.respondWith(fetch(event.request));
  }
});

// Message event for cache management
self.addEventListener('message', (event) => {
  if (event.data.type === 'CLEAR_VIDEO_CACHE') {
    event.waitUntil(
      caches.delete(VIDEO_CACHE_NAME).then(() => {
        event.ports[0].postMessage({ success: true });
      })
    );
  }
  
  if (event.data.type === 'GET_CACHE_SIZE') {
    event.waitUntil(
      Promise.all([
        getCacheSize(VIDEO_CACHE_NAME),
        getCacheSize(THUMBNAIL_CACHE_NAME)
      ]).then(([videoSize, thumbnailSize]) => {
        event.ports[0].postMessage({
          videoSize,
          thumbnailSize,
          totalSize: videoSize + thumbnailSize
        });
      })
    );
  }
});