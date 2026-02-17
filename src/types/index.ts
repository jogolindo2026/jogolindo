export type UserRole = 'player' | 'businessman';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  // Player specific fields
  height?: number;
  weight?: number;
  shoeSize?: number;
  position?: PlayerPosition;
  // Common optional fields
  phone?: string;
  gender?: string;
  birthDate?: string;
  country?: string;
  city?: string;
  // Businessman specific fields
  company?: string; // For businessmen - company or club they represent
  isProfilePublic?: boolean; // For businessmen - whether profile is visible to others
  profilePicture?: string;
  createdAt: string;
}

export type PlayerPosition = 'goalkeeper' | 'defender' | 'midfielder' | 'forward';

export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  module: LessonModule;
  topic: string;
  duration: number;
  createdAt: string;
}

export type LessonModule = 'technique' | 'tactics' | 'health' | 'citizenship';

export interface UserVideo {
  id: string;
  userId: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  createdAt: string;
  ratings: VideoRating[];
  averageRating: number;
}

export interface VideoRating {
  id: string;
  userId: string;
  videoId: string;
  rating: number;
  createdAt: string;
}

// New interfaces for ranking system
export interface PlayerStats {
  // Technical skills (1-5)
  passing: number;
  shooting: number;
  dribbling: number;
  speed: number;
  strength: number;
  jumping: number;
  
  // Performance stats
  goals: number;
  penaltySaves?: number; // Only for goalkeepers
  assists: number;
  matchesPlayed: number;
  
  // Career info
  clubs: string[];
  agent?: string;
  overallRating: number;
}

export interface RankingPlayer extends User {
  stats: PlayerStats;
  age: number;
  profilePicture: string;
}

export type AgeCategory = 'sub-15' | 'sub-17' | 'sub-20' | 'profissional';
export type Gender = 'male' | 'female';

export interface RankingCategory {
  id: string;
  name: string;
  gender: Gender;
  ageCategory: AgeCategory;
  players: RankingPlayer[];
}

// Tryout/Peneira interfaces
export interface TryoutEvent {
  id: string;
  title: string;
  description: string;
  club: string;
  date: string;
  time: string;
  location: string;
  address: string;
  city: string;
  state: string;
  region: string;
  ageRange: string;
  positions: PlayerPosition[];
  maxParticipants: number;
  currentParticipants: number;
  registrationDeadline: string;
  requirements: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  cost: number;
  isActive: boolean;
  imageUrl: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  inStock: boolean;
}