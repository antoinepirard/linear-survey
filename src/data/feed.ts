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
    src: '/Assets/Images/feed/original-6957a16c963578f42d22a8d3d5c4b7a4.gif',
    name: 'Animation Demo',
    date: '2024',
    type: 'gif'
  },
  {
    id: 4,
    src: '/Assets/Images/feed/original-7fda3aa4c9a615ba69234cba6d64e772.webp',
    name: 'Design Mockup',
    date: '2024',
    type: 'image'
  },
  {
    id: 5,
    src: '/Assets/Videos/reporting-highquality.webm',
    name: 'Reporting Demo',
    date: '2024',
    type: 'video',
    duration: 15
  },
  {
    id: 6,
    src: '/Assets/Images/feed/Export-1718616313659.mp4',
    name: 'Product Export Demo',
    date: '2024',
    type: 'video',
    duration: 30
  },
  {
    id: 7,
    src: '/Assets/Images/feed/Upcoming Features video 1.mp4',
    name: 'Upcoming Features Preview',
    date: '2025',
    type: 'video',
    duration: 45
  },
  {
    id: 8,
    src: '/Assets/Images/feed/IMG_0092.jpeg',
    name: 'Recent Moment',
    date: '2025',
    type: 'image'
  },
  {
    id: 9,
    src: '/Assets/Images/feed/e53a65b0-e1c9-41d5-b472-8591803ecd07.jpeg',
    name: 'Latest Shot',
    date: '2025',
    type: 'image'
  },
];