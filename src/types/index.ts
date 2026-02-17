// 1. Definições de Tipos Base
export type UserRole = 'atleta' | 'empresario';
export type PlayerPosition = 'goleiro' | 'zagueiro' | 'lateral' | 'meio' | 'atacante';
export type Gender = 'masculino' | 'feminino';
export type AgeCategory = 'sub-15' | 'sub-17' | 'sub-20' | 'profissional';
export type LessonModule = 'technique' | 'tactics' | 'health' | 'citizenship';

// 2. Interface de Usuário Principal (Sincronizada com Supabase)
export interface User {
  id: string;
  email: string;
  name?: string;
  role?: UserRole;
  phone?: string;
  gender?: string;
  birth_date?: string; 
  country?: string;
  city?: string;
  position?: string;
  profile_picture?: string; 
  company?: string;
  is_profile_public?: boolean;
  height?: number;
  weight?: number;
  created_at?: string;
}

// 3. Sistema de Videoaulas e Conteúdo
export interface VideoLesson {
  id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  module: LessonModule;
  topic: string;
  duration: number;
  created_at: string;
}

export interface UserVideo {
  id: string;
  user_id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  created_at: string;
  average_rating: number;
}

// 4. Estatísticas Técnicas e Ranking (O Coração do BI)
export interface PlayerStats {
  // Habilidades técnicas (1-5)
  passing: number;
  shooting: number;
  dribbling: number;
  speed: number;
  strength: number;
  jumping: number;
  
  // Performance
  goals: number;
  assists: number;
  matches_played: number;
  penalty_saves?: number; // Exclusivo para goleiros
  
  // Carreira
  clubs: string[];
  agent?: string;
  overall_rating: number; // Escala 0-100
}

export interface RankingPlayer extends User {
  stats: PlayerStats;
  age: number;
}

export interface RankingCategory {
  id: string;
  name: string;
  gender: Gender;
  age_category: AgeCategory;
  players: RankingPlayer[];
}

// 5. Gestão de Peneiras / Tryouts (Detalhado)
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
  age_range: string;
  positions: PlayerPosition[];
  max_participants: number;
  current_participants: number;
  registration_deadline: string;
  requirements: string[];
  contact: {
    name: string;
    phone: string;
    email: string;
  };
  cost: number;
  is_active: boolean;
  image_url: string;
}

// 6. E-commerce / Produtos (Para as camisas sublimadas e e-books)
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image_url: string;
  category: string;
  in_stock: boolean;
}