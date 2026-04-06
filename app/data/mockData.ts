import { MediaItem } from '@/services/mediaService';

export const mockMovies: MediaItem[] = [
  {
    id: 1,
    title: "Dune: Part Two",
    image: "https://images.unsplash.com/photo-1594908900066-3f47337549d8?w=500&h=300&fit=crop",
    rating: 8.2,
    creator: "Denis Villeneuve",
    description: "Paul Atreides unites with Chani and the Fremen while on a warpath of revenge.",
    type: 'movie'
  },
  {
    id: 2,
    title: "Oppenheimer",
    image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7144?w=500&h=300&fit=crop",
    rating: 8.5,
    creator: "Christopher Nolan",
    description: "The story of American scientist J. Robert Oppenheimer and the atomic bomb.",
    type: 'movie'
  },
  {
    id: 3,
    title: "The Batman",
    image: "https://images.unsplash.com/photo-1576869831296-c6476b4fe2bf?w=500&h=300&fit=crop",
    rating: 7.8,
    creator: "Matt Reeves",
    description: "A thrilling neo-noir take on the Batman universe.",
    type: 'movie'
  },
  {
    id: 4,
    title: "Everything Everywhere All at Once",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=500&h=300&fit=crop",
    rating: 8.9,
    creator: "Daniel Kwan, Daniel Scheinert",
    description: "An imaginative and emotional multiverse adventure.",
    type: 'movie'
  },
  {
    id: 5,
    title: "Interstellar",
    image: "https://images.unsplash.com/photo-1535016120754-fd58615602c5?w=500&h=300&fit=crop",
    rating: 8.6,
    creator: "Christopher Nolan",
    description: "Explorers travel through a wormhole to ensure humanity's survival.",
    type: 'movie'
  },
  {
    id: 6,
    title: "Inception",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&h=300&fit=crop",
    rating: 8.8,
    creator: "Christopher Nolan",
    description: "A skilled thief who steals corporate secrets through dream-sharing technology.",
    type: 'movie'
  },
];

export const mockBooks: MediaItem[] = [
  {
    id: 1,
    title: "The Great Gatsby",
    image: "https://images.unsplash.com/photo-1543002588-d83cedbc4baf?w=300&h=400&fit=crop",
    rating: 7.5,
    creator: "F. Scott Fitzgerald",
    description: "A classic novel about wealth and love in the Jazz Age.",
    type: 'book'
  },
  {
    id: 2,
    title: "To Kill a Mockingbird",
    image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop",
    rating: 8.7,
    creator: "Harper Lee",
    description: "A gripping tale of racial injustice and childhood innocence.",
    type: 'book'
  },
  {
    id: 3,
    title: "1984",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8f?w=300&h=400&fit=crop",
    rating: 8.3,
    creator: "George Orwell",
    description: "A dystopian social science fiction novel about totalitarianism.",
    type: 'book'
  },
  {
    id: 4,
    title: "Pride and Prejudice",
    image: "https://images.unsplash.com/photo-1502494793896-f5df769eecfa?w=300&h=400&fit=crop",
    rating: 8.1,
    creator: "Jane Austen",
    description: "A romantic novel of manners and marriage.",
    type: 'book'
  },
  {
    id: 5,
    title: "The Catcher in the Rye",
    image: "https://images.unsplash.com/photo-1507842217343-583f20270319?w=300&h=400&fit=crop",
    rating: 7.8,
    creator: "J.D. Salinger",
    description: "A controversial novel about teenage rebellion and alienation.",
    type: 'book'
  },
  {
    id: 6,
    title: "Atomic Habits",
    image: "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop",
    rating: 8.9,
    creator: "James Clear",
    description: "Transform your life through small, consistent habits.",
    type: 'book'
  },
];

export const mockMusic: MediaItem[] = [
  {
    id: 1,
    title: "Midnight Echoes",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    rating: 7.8,
    creator: "Luna Wave",
    description: "A groundbreaking electronic album with ambient soundscapes.",
    type: 'music'
  },
  {
    id: 2,
    title: "Urban Beats",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    rating: 8.1,
    creator: "DJ Flow",
    description: "High-energy hip hop tracks with innovative production.",
    type: 'music'
  },
  {
    id: 3,
    title: "Classical Harmony",
    image: "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=300&h=300&fit=crop",
    rating: 9.0,
    creator: "Symphony Orchestra",
    description: "Masterful orchestral compositions for timeless enjoyment.",
    type: 'music'
  },
  {
    id: 4,
    title: "Jazz Nights",
    image: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
    rating: 8.4,
    creator: "Jazz Quartet",
    description: "Smooth jazz compositions with improvisation and elegance.",
    type: 'music'
  },
  {
    id: 5,
    title: "Velvet Skies",
    image: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
    rating: 8.2,
    creator: "Miles Chen Trio",
    description: "Sophisticated jazz trio with stunning vocal performances.",
    type: 'music'
  },
  {
    id: 6,
    title: "Neon Dreams",
    image: "https://images.unsplash.com/photo-1514613535308-eb5405ed5999?w=300&h=300&fit=crop",
    rating: 7.9,
    creator: "Synth Wave",
    description: "Retro-futuristic electronic sound with pulsing beats.",
    type: 'music'
  },
];
