import { create } from 'zustand';
import { VideoLesson, UserVideo, VideoRating } from '../types';
import { mockVideoLessons, mockUserVideos } from '../utils/mockData';

interface VideoState {
  lessons: VideoLesson[];
  userVideos: UserVideo[];
  isLoading: boolean;
  error: string | null;
  
  fetchLessons: () => Promise<void>;
  fetchUserVideos: () => Promise<void>;
  addUserVideo: (video: Partial<UserVideo>) => Promise<void>;
  rateVideo: (videoId: string, userId: string, rating: number) => Promise<void>;
  getUserVideoById: (id: string) => UserVideo | undefined;
  getLessonById: (id: string) => VideoLesson | undefined;
  getLessonsByModule: (module: string) => VideoLesson[];
}

export const useVideoStore = create<VideoState>((set, get) => ({
  lessons: [],
  userVideos: [],
  isLoading: false,
  error: null,
  
  fetchLessons: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ lessons: mockVideoLessons, isLoading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar aulas', isLoading: false });
    }
  },
  
  fetchUserVideos: async () => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      set({ userVideos: mockUserVideos, isLoading: false });
    } catch (error) {
      set({ error: 'Erro ao carregar vídeos', isLoading: false });
    }
  },
  
  addUserVideo: async (videoData) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const newVideo: UserVideo = {
        id: `${Date.now()}`,
        userId: videoData.userId!,
        title: videoData.title || 'Sem título',
        description: videoData.description || '',
        videoUrl: videoData.videoUrl || '',
        thumbnailUrl: videoData.thumbnailUrl || 'https://images.pexels.com/photos/274506/pexels-photo-274506.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
        createdAt: new Date().toISOString(),
        ratings: [],
        averageRating: 0,
      };
      
      set(state => ({
        userVideos: [...state.userVideos, newVideo],
        isLoading: false
      }));
    } catch (error) {
      set({ error: 'Erro ao adicionar vídeo', isLoading: false });
    }
  },
  
  rateVideo: async (videoId, userId, rating) => {
    set({ isLoading: true, error: null });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Update video rating
      set(state => {
        const updatedVideos = state.userVideos.map(video => {
          if (video.id === videoId) {
            // Check if user already rated this video
            const existingRatingIndex = video.ratings.findIndex(r => r.userId === userId);
            let updatedRatings = [...video.ratings];
            
            if (existingRatingIndex >= 0) {
              // Update existing rating
              updatedRatings[existingRatingIndex] = {
                ...updatedRatings[existingRatingIndex],
                rating,
              };
            } else {
              // Add new rating
              const newRating: VideoRating = {
                id: `${Date.now()}`,
                userId,
                videoId,
                rating,
                createdAt: new Date().toISOString(),
              };
              updatedRatings = [...updatedRatings, newRating];
            }
            
            // Calculate new average
            const sum = updatedRatings.reduce((acc, r) => acc + r.rating, 0);
            const averageRating = sum / updatedRatings.length;
            
            return {
              ...video,
              ratings: updatedRatings,
              averageRating,
            };
          }
          return video;
        });
        
        return { userVideos: updatedVideos, isLoading: false };
      });
    } catch (error) {
      set({ error: 'Erro ao avaliar vídeo', isLoading: false });
    }
  },
  
  getUserVideoById: (id) => {
    return get().userVideos.find(video => video.id === id);
  },
  
  getLessonById: (id) => {
    return get().lessons.find(lesson => lesson.id === id);
  },
  
  getLessonsByModule: (module) => {
    return get().lessons.filter(lesson => lesson.module === module);
  },
}));