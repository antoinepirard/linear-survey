export interface FeedImage {
  id: number;
  src: string;
  name: string;
  date: string;
  type?: 'image' | 'gif' | 'video';
  width?: number;
  height?: number;
  videoUrl?: string;
}

const rawFeedImages = [
  // 2025 - Most recent
  {
    src: '/Assets/Images/feed/company-logos-navigation.jpg',
    name: 'Inbox - Conversation List',
    date: '2024',
    type: 'image' as const
  },
  {
    src: '/Assets/Images/feed/button-in-composer.png',
    name: 'Composer Button',
    date: '2024',
    type: 'image' as const
  },
  {
    src: '/Assets/Images/feed/drawing-face.png',
    name: 'Experimenting with Illustration styles during COVID',
    date: '2021',
    type: 'image' as const
  },
  {
    src: '/Assets/Images/feed/antoine6843_A_meeting_room_in_a_glass_room_in_a_modern_art_muse_3428029a-194b-4ae1-8f46-978801118ccd 1.png',
    name: 'AI Generated',
    date: '2024',
    type: 'image' as const
  },
  {
    src: '/Assets/Images/feed/antoine6843_art_museum_face_plaster_--chaos_30_--ar_34_--profil_a28da99b-cef6-40e1-acb4-50fda6566718 1.png',
    name: 'AI Generated',
    date: '2024',
    type: 'image' as const
  },
  {
    src: '/Assets/Images/feed/antoine6843_dream_--chaos_50_--ar_34_--profile_4p24qfr_--styliz_deaf4e60-d71b-45b3-a79a-7bce975cb438 1.png',
    name: 'AI Generated',
    date: '2024',
    type: 'image' as const
  },
  {
    src: '/Assets/Images/feed/antoine6843_red_wine_bottle_with_a_flower_in_it_--ar_34_--sref__13e70d3e-99b7-4418-9f53-ca621c0a98d1 1.png',
    name: 'AI Generated',
    date: '2024',
    type: 'image' as const
  },
  {
    src: '/Assets/Images/feed/antoine6843_war_battle_Vietnam_blood_red_flowers_movie_still_--_5686b083-83e8-4053-ba27-295899ea61e8 1.png',
    name: 'AI Generated',
    date: '2024',
    type: 'image' as const
  },
  // 2024 - Older
  {
    src: '/Assets/Images/feed/original-6957a16c963578f42d22a8d3d5c4b7a4.gif',
    name: 'GoVocal - Customisable Citizen Participation Platform',
    date: '2019',
    type: 'gif' as const
  },
  {
    src: '/Assets/Images/feed/original-7fda3aa4c9a615ba69234cba6d64e772.webp',
    name: 'Experimenting with Illustration styles during COVID',
    date: '2021',
    type: 'image' as const
  },
  // 2016 - Oldest
  {
    src: '/Assets/Images/feed/original-d9c7f965f78c57318d87b4c2afaa968d.gif',
    name: 'Microsfot Ads via Iconic Matter',
    date: '2014',
    type: 'gif' as const
  },
  // 2014 - Oldest videos
  {
    src: '/Assets/Images/feed/thumbnail-video-showreel.png',
    name: 'Showreel 2014',
    date: '2014',
    type: 'video' as const,
    videoUrl: '/Assets/Images/feed/Showreel_2014.webm'
  },
  {
    src: '/Assets/Images/feed/thumbnail-video-optician.png',
    name: 'Optician Interview (French) for CentralApp',
    date: '2015',
    type: 'video' as const,
    videoUrl: '/Assets/Images/feed/Optician_Interview.webm'
  },
];

export const feedImages: FeedImage[] = rawFeedImages.map((item, index) => ({
  ...item,
  id: index + 1
}));