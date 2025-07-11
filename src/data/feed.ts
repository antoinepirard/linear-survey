export interface FeedImage {
  id: number;
  src: string;
  name: string;
  date: string;
  type?: 'image' | 'gif' | 'video';
  thumbnail?: string;
  duration?: number;
}

export const feedImages: FeedImage[] = [
  {
    id: 1,
    src: '/Assets/Images/feed/original-1fc0c719fd42a9ad1b385195c43307e4.webp',
    name: 'Latest Capture',
    date: '2025',
    type: 'image'
  },
  {
    id: 2,
    src: '/Assets/Images/feed/original-d9c7f965f78c57318d87b4c2afaa968d.gif',
    name: 'Microsfot Ads via Iconic Matter',
    date: '2016',
    type: 'gif'
  },
  {
    id: 3,
    src: '/Assets/Videos/reporting-highquality.webm',
    name: 'Reporting Demo',
    date: '2024',
    type: 'video',
    duration: 15
  },
];