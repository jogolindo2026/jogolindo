import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Post, PostComment, CreatePostData, ShareOptions, PlayerRating } from '../types/social';

interface SocialState {
  posts: Post[];
  comments: { [postId: string]: PostComment[] };
  playerRatings: { [userId: string]: PlayerRating[] };
  isLoading: boolean;
  error: string | null;
  
  // Posts
  fetchPosts: () => Promise<void>;
  createPost: (postData: CreatePostData) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;
  
  // Likes
  likePost: (postId: string, rating: number) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  
  // Comments
  fetchComments: (postId: string) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  likeComment: (commentId: string) => Promise<void>;
  unlikeComment: (commentId: string) => Promise<void>;
  
  // Player Ratings
  submitPlayerRating: (ratedUserId: string, postId: string, ratings: any) => Promise<void>;
  fetchPlayerRatings: (userId: string) => Promise<void>;
  getPlayerAverageRatings: (userId: string) => any;
  
  // Share
  sharePost: (post: Post, options: ShareOptions) => Promise<void>;
  
  // Utils
  clearError: () => void;
}

export const useSocialStore = create<SocialState>((set, get) => ({
  posts: [],
  comments: {},
  playerRatings: {},
  isLoading: false,
  error: null,
  
  clearError: () => set({ error: null }),
  
  fetchPosts: async () => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      
      // Buscar posts com dados do usuário e estatísticas
      const { data: postsData, error: postsError } = await supabase
        .from('posts')
        .select(`
          *,
          user:users(id, name, profile_picture, position)
        `)
        .order('created_at', { ascending: false });
      
      if (postsError) throw postsError;
      
      // Buscar estatísticas de cada post
      const postsWithStats = await Promise.all(
        (postsData || []).map(async (post) => {
          // Contar curtidas e calcular média
          const { data: likesData } = await supabase
            .from('post_likes')
            .select('rating')
            .eq('post_id', post.id);
          
          // Contar comentários
          const { data: commentsData } = await supabase
            .from('post_comments')
            .select('id')
            .eq('post_id', post.id);
          
          // Verificar se usuário atual curtiu
          const { data: userLike } = await supabase
            .from('post_likes')
            .select('rating')
            .eq('post_id', post.id)
            .eq('user_id', user.id)
            .single();
          
          const likes = likesData || [];
          const averageRating = likes.length > 0 
            ? likes.reduce((sum, like) => sum + like.rating, 0) / likes.length 
            : 0;
          
          return {
            ...post,
            likes_count: likes.length,
            comments_count: (commentsData || []).length,
            average_rating: Math.round(averageRating * 10) / 10,
            user_rating: userLike?.rating || undefined,
          };
        })
      );
      
      set({ posts: postsWithStats, isLoading: false });
    } catch (error: any) {
      console.error('Erro ao buscar posts:', error);
      set({ error: error.message || 'Erro ao carregar posts', isLoading: false });
    }
  },
  
  createPost: async (postData) => {
    set({ isLoading: true, error: null });
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('posts')
        .insert([{
          user_id: user.id,
          ...postData,
          game_date: postData.game_date || new Date().toISOString().split('T')[0]
        }]);
      
      if (error) throw error;
      
      // Recarregar posts
      await get().fetchPosts();
      set({ isLoading: false });
    } catch (error: any) {
      console.error('Erro ao criar post:', error);
      set({ error: error.message || 'Erro ao criar post', isLoading: false });
    }
  },
  
  deletePost: async (postId) => {
    set({ isLoading: true, error: null });
    
    try {
      const { error } = await supabase
        .from('posts')
        .delete()
        .eq('id', postId);
      
      if (error) throw error;
      
      // Remover post do estado local
      set(state => ({
        posts: state.posts.filter(post => post.id !== postId),
        isLoading: false
      }));
    } catch (error: any) {
      console.error('Erro ao deletar post:', error);
      set({ error: error.message || 'Erro ao deletar post', isLoading: false });
    }
  },
  
  likePost: async (postId, rating) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      
      // Inserir ou atualizar curtida
      const { error } = await supabase
        .from('post_likes')
        .upsert([{
          user_id: user.id,
          post_id: postId,
          rating
        }]);
      
      if (error) throw error;
      
      // Atualizar estado local
      set(state => ({
        posts: state.posts.map(post => {
          if (post.id === postId) {
            const wasLiked = post.user_rating !== undefined;
            const newLikesCount = wasLiked ? post.likes_count : post.likes_count + 1;
            
            // Recalcular média (aproximação)
            const newAverage = wasLiked 
              ? ((post.average_rating * post.likes_count) - (post.user_rating || 0) + rating) / post.likes_count
              : ((post.average_rating * post.likes_count) + rating) / newLikesCount;
            
            return {
              ...post,
              likes_count: newLikesCount,
              average_rating: Math.round(newAverage * 10) / 10,
              user_rating: rating
            };
          }
          return post;
        })
      }));
    } catch (error: any) {
      console.error('Erro ao curtir post:', error);
      set({ error: error.message || 'Erro ao curtir post' });
    }
  },
  
  unlikePost: async (postId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('post_likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Atualizar estado local
      set(state => ({
        posts: state.posts.map(post => {
          if (post.id === postId && post.user_rating) {
            const newLikesCount = post.likes_count - 1;
            const newAverage = newLikesCount > 0
              ? ((post.average_rating * post.likes_count) - post.user_rating) / newLikesCount
              : 0;
            
            return {
              ...post,
              likes_count: newLikesCount,
              average_rating: Math.round(newAverage * 10) / 10,
              user_rating: undefined
            };
          }
          return post;
        })
      }));
    } catch (error: any) {
      console.error('Erro ao descurtir post:', error);
      set({ error: error.message || 'Erro ao descurtir post' });
    }
  },
  
  fetchComments: async (postId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      
      const { data: commentsData, error } = await supabase
        .from('post_comments')
        .select(`
          *,
          user:users(id, name, profile_picture)
        `)
        .eq('post_id', postId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      
      // Buscar curtidas dos comentários
      const commentsWithLikes = await Promise.all(
        (commentsData || []).map(async (comment) => {
          const { data: likesData } = await supabase
            .from('comment_likes')
            .select('id')
            .eq('comment_id', comment.id);
          
          const { data: userLike } = await supabase
            .from('comment_likes')
            .select('id')
            .eq('comment_id', comment.id)
            .eq('user_id', user.id)
            .single();
          
          return {
            ...comment,
            likes_count: (likesData || []).length,
            user_liked: !!userLike
          };
        })
      );
      
      set(state => ({
        comments: {
          ...state.comments,
          [postId]: commentsWithLikes
        }
      }));
    } catch (error: any) {
      console.error('Erro ao buscar comentários:', error);
      set({ error: error.message || 'Erro ao carregar comentários' });
    }
  },
  
  addComment: async (postId, content) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('post_comments')
        .insert([{
          user_id: user.id,
          post_id: postId,
          content
        }]);
      
      if (error) throw error;
      
      // Recarregar comentários
      await get().fetchComments(postId);
      
      // Atualizar contador de comentários no post
      set(state => ({
        posts: state.posts.map(post => 
          post.id === postId 
            ? { ...post, comments_count: post.comments_count + 1 }
            : post
        )
      }));
    } catch (error: any) {
      console.error('Erro ao adicionar comentário:', error);
      set({ error: error.message || 'Erro ao adicionar comentário' });
    }
  },
  
  deleteComment: async (commentId) => {
    try {
      const { error } = await supabase
        .from('post_comments')
        .delete()
        .eq('id', commentId);
      
      if (error) throw error;
      
      // Remover comentário do estado local
      set(state => {
        const newComments = { ...state.comments };
        Object.keys(newComments).forEach(postId => {
          newComments[postId] = newComments[postId].filter(comment => comment.id !== commentId);
        });
        return { comments: newComments };
      });
    } catch (error: any) {
      console.error('Erro ao deletar comentário:', error);
      set({ error: error.message || 'Erro ao deletar comentário' });
    }
  },
  
  likeComment: async (commentId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('comment_likes')
        .insert([{
          user_id: user.id,
          comment_id: commentId
        }]);
      
      if (error) throw error;
      
      // Atualizar estado local
      set(state => {
        const newComments = { ...state.comments };
        Object.keys(newComments).forEach(postId => {
          newComments[postId] = newComments[postId].map(comment => 
            comment.id === commentId
              ? { ...comment, likes_count: comment.likes_count + 1, user_liked: true }
              : comment
          );
        });
        return { comments: newComments };
      });
    } catch (error: any) {
      console.error('Erro ao curtir comentário:', error);
      set({ error: error.message || 'Erro ao curtir comentário' });
    }
  },
  
  unlikeComment: async (commentId) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      
      const { error } = await supabase
        .from('comment_likes')
        .delete()
        .eq('comment_id', commentId)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Atualizar estado local
      set(state => {
        const newComments = { ...state.comments };
        Object.keys(newComments).forEach(postId => {
          newComments[postId] = newComments[postId].map(comment => 
            comment.id === commentId
              ? { ...comment, likes_count: comment.likes_count - 1, user_liked: false }
              : comment
          );
        });
        return { comments: newComments };
      });
    } catch (error: any) {
      console.error('Erro ao descurtir comentário:', error);
      set({ error: error.message || 'Erro ao descurtir comentário' });
    }
  },
  
  submitPlayerRating: async (ratedUserId, postId, ratings) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuário não autenticado');
      
      if (user.id === ratedUserId) {
        throw new Error('Você não pode avaliar a si mesmo');
      }
      
      const { error } = await supabase
        .from('player_ratings')
        .upsert([{
          rater_user_id: user.id,
          rated_user_id: ratedUserId,
          post_id: postId,
          passing: ratings.passing || 0,
          shooting: ratings.shooting || 0,
          dribbling: ratings.dribbling || 0,
          speed: ratings.speed || 0,
          strength: ratings.strength || 0,
          jumping: ratings.jumping || 0
        }]);
      
      if (error) throw error;
      
      // Recarregar avaliações do jogador
      await get().fetchPlayerRatings(ratedUserId);
      
    } catch (error: any) {
      console.error('Erro ao enviar avaliação:', error);
      set({ error: error.message || 'Erro ao enviar avaliação' });
      throw error;
    }
  },
  
  fetchPlayerRatings: async (userId) => {
    try {
      const { data: ratingsData, error } = await supabase
        .from('player_ratings')
        .select(`
          *,
          rater:users!rater_user_id(id, name, profile_picture)
        `)
        .eq('rated_user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      set(state => ({
        playerRatings: {
          ...state.playerRatings,
          [userId]: ratingsData || []
        }
      }));
      
    } catch (error: any) {
      console.error('Erro ao buscar avaliações:', error);
      set({ error: error.message || 'Erro ao carregar avaliações' });
    }
  },
  
  getPlayerAverageRatings: (userId) => {
    const ratings = get().playerRatings[userId] || [];
    
    if (ratings.length === 0) {
      return {
        passing: 0,
        shooting: 0,
        dribbling: 0,
        speed: 0,
        strength: 0,
        jumping: 0,
        totalRatings: 0,
        overallRating: 0
      };
    }
    
    const totals = ratings.reduce((acc, rating) => ({
      passing: acc.passing + rating.passing,
      shooting: acc.shooting + rating.shooting,
      dribbling: acc.dribbling + rating.dribbling,
      speed: acc.speed + rating.speed,
      strength: acc.strength + rating.strength,
      jumping: acc.jumping + rating.jumping
    }), { passing: 0, shooting: 0, dribbling: 0, speed: 0, strength: 0, jumping: 0 });
    
    const count = ratings.length;
    const averages = {
      passing: Math.round((totals.passing / count) * 10) / 10,
      shooting: Math.round((totals.shooting / count) * 10) / 10,
      dribbling: Math.round((totals.dribbling / count) * 10) / 10,
      speed: Math.round((totals.speed / count) * 10) / 10,
      strength: Math.round((totals.strength / count) * 10) / 10,
      jumping: Math.round((totals.jumping / count) * 10) / 10,
      totalRatings: count
    };
    
    // Calcular overall rating (média das habilidades)
    const skillSum = averages.passing + averages.shooting + averages.dribbling + 
                    averages.speed + averages.strength + averages.jumping;
    averages.overallRating = Math.round((skillSum / 6) * 20); // Converter para escala 0-100
    
    return averages;
  },
  
  sharePost: async (post, options) => {
    try {
      const postUrl = `${window.location.origin}/social/post/${post.id}`;
      const shareText = `Confira esta jogada incrível de ${post.user?.name}: ${post.title}`;
      
      switch (options.type) {
        case 'whatsapp':
          const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${postUrl}`)}`;
          window.open(whatsappUrl, '_blank');
          break;
          
        case 'email':
          const emailSubject = `Jogada incrível: ${post.title}`;
          const emailBody = `${shareText}\n\nAssista aqui: ${postUrl}`;
          const emailUrl = `mailto:${options.recipient || ''}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
          window.location.href = emailUrl;
          break;
          
        case 'direct_message':
          // Implementar sistema de mensagens diretas no futuro
          console.log('Direct message não implementado ainda');
          break;
      }
    } catch (error: any) {
      console.error('Erro ao compartilhar post:', error);
      set({ error: error.message || 'Erro ao compartilhar post' });
    }
  }
}));