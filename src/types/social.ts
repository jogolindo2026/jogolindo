export interface Post {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number; // em segundos
  game_date: string; // formato YYYY-MM-DD
  created_at: string;
  updated_at: string;
  
  // Dados do usuário (join)
  user?: {
    id: string;
    name: string;
    profile_picture?: string;
    position?: string;
  };
  
  // Estatísticas
  likes_count: number;
  comments_count: number;
  average_rating: number;
  user_rating?: number; // rating do usuário atual
}

export interface PostLike {
  id: string;
  user_id: string;
  post_id: string;
  rating: number; // 1-5 bolas
  created_at: string;
}

export interface PostComment {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
  updated_at: string;
  
  // Dados do usuário (join)
  user?: {
    id: string;
    name: string;
    profile_picture?: string;
  };
  
  // Estatísticas
  likes_count: number;
  user_liked?: boolean; // se o usuário atual curtiu
}

export interface CommentLike {
  id: string;
  user_id: string;
  comment_id: string;
  created_at: string;
}

export interface PlayerRating {
  id: string;
  rater_user_id: string; // quem está avaliando
  rated_user_id: string; // quem está sendo avaliado
  post_id: string;
  // Habilidades técnicas (1-5)
  passing: number;
  shooting: number;
  dribbling: number;
  speed: number;
  strength: number;
  jumping: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePostData {
  title: string;
  description?: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number;
  game_date?: string;
}

export interface ShareOptions {
  type: 'email' | 'whatsapp' | 'direct_message';
  recipient?: string; // para email ou direct message
}