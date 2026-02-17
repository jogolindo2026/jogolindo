import { create } from 'zustand';
import { User, PlayerPosition } from '../types';
import { mockUsers } from '../utils/mockData';
import { useVideoStore } from './videoStore';

interface PlayerRanking {
  user: User;
  averageRating: number;
  totalVideos: number;
  totalRatings: number;
}

interface RankingState {
  rankings: PlayerRanking[];
  isLoading: boolean;
  error: string | null;
  
  fetchRankings: () => Promise<void>;
  getRankingsByPosition: (position: PlayerPosition) => PlayerRanking[];
  getTopPlayers: (limit?: number) => PlayerRanking[];
}

export const useRankingStore = create<RankingState>((set, get) => ({
  rankings: [],
  isLoading: false,
  error: null,
  
  fetchRankings: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get all player users
      const players = mockUsers.filter(user => user.role === 'player');
      
      // Get all user videos from video store
      const { userVideos } = useVideoStore.getState();
      
      // Calculate rankings
      const rankings: PlayerRanking[] = players.map(player => {
        // Get videos for this player
        const playerVideos = userVideos.filter(video => video.userId === player.id);
        
        // Calculate total ratings and average
        const totalVideos = playerVideos.length;
        const totalRatings = playerVideos.reduce(
          (acc, video) => acc + video.ratings.length, 
          0
        );
        
        // Calculate average rating across all videos
        let averageRating = 0;
        if (totalVideos > 0) {
          const sum = playerVideos.reduce(
            (acc, video) => acc + (video.averageRating || 0), 
            0
          );
          averageRating = sum / totalVideos;
        }
        
        return {
          user: player,
          averageRating,
          totalVideos,
          totalRatings
        };
      });
      
      // Sort by average rating (descending)
      rankings.sort((a, b) => b.averageRating - a.averageRating);
      
      set({ rankings, isLoading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar rankings', isLoading: false });
    }
  },
  
  getRankingsByPosition: (position) => {
    return get().rankings.filter(ranking => ranking.user.position === position);
  },
  
  getTopPlayers: (limit = 10) => {
    return get().rankings.slice(0, limit);
  }
}));