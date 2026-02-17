import React, { useState, useEffect } from 'react';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { Heart, Trash2, Send, MessageCircle, User, Star } from 'lucide-react';
import Button from '../ui/Button';
import PlayerRatingModal from './PlayerRatingModal';

interface CommentsSectionProps {
  postId: string;
}

const CommentsSection: React.FC<CommentsSectionProps> = ({ postId }) => {
  const { user } = useAuthStore();
  const { 
    comments, 
    fetchComments, 
    addComment, 
    deleteComment, 
    likeComment, 
    unlikeComment 
  } = useSocialStore();
  
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedPlayer, setSelectedPlayer] = useState<any>(null);
  
  const postComments = comments[postId] || [];
  
  useEffect(() => {
    fetchComments(postId);
  }, [postId, fetchComments]);
  
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    setIsSubmitting(true);
    try {
      await addComment(postId, newComment.trim());
      setNewComment('');
    } catch (error) {
      console.error('Erro ao enviar comentário:', error);
    }
    setIsSubmitting(false);
  };
  
  const handleLikeComment = async (commentId: string, isLiked: boolean) => {
    try {
      if (isLiked) {
        await unlikeComment(commentId);
      } else {
        await likeComment(commentId);
      }
    } catch (error) {
      console.error('Erro ao curtir comentário:', error);
    }
  };
  
  const handleDeleteComment = async (commentId: string) => {
    if (window.confirm('Tem certeza que deseja excluir este comentário?')) {
      try {
        await deleteComment(commentId);
      } catch (error) {
        console.error('Erro ao excluir comentário:', error);
      }
    }
  };
  
  const handleOpenRatingModal = () => {
    // Para este exemplo, vamos pegar o autor do post como jogador a ser avaliado
    // Em uma implementação real, você poderia ter uma lista de jogadores no vídeo
    const { posts } = useSocialStore.getState();
    const currentPost = posts.find(p => p.id === postId);
    
    if (currentPost?.user && currentPost.user.id !== user?.id) {
      setSelectedPlayer(currentPost.user);
      setShowRatingModal(true);
    } else {
      alert('Você não pode avaliar a si mesmo!');
    }
  };
  
  const handleSubmitRating = async (ratings: any) => {
    const { submitPlayerRating } = useSocialStore.getState();
    
    try {
      await submitPlayerRating(selectedPlayer.id, postId, ratings);
      alert('Avaliação enviada com sucesso!');
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return diffInMinutes < 1 ? 'agora' : `${diffInMinutes}min`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h`;
    } else {
      return date.toLocaleDateString('pt-BR');
    }
  };
  
  return (
    <div className="p-4 space-y-4">
      {/* Botão para Avaliar Jogador */}
      <div className="flex justify-center pb-4 border-b">
        <Button
          variant="outline"
          size="sm"
          onClick={handleOpenRatingModal}
          leftIcon={<Star size={16} />}
        >
          Avaliar Jogador
        </Button>
      </div>
      
      {/* Formulário de Novo Comentário */}
      <form onSubmit={handleSubmitComment} className="flex space-x-3">
        <img
          src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=32&background=0A5F38&color=fff`}
          alt={user?.name}
          className="w-8 h-8 rounded-full object-cover flex-shrink-0"
        />
        <div className="flex-grow flex space-x-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Escreva um comentário..."
            className="flex-grow px-3 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            maxLength={500}
            disabled={isSubmitting}
          />
          <Button
            type="submit"
            variant="primary"
            size="sm"
            disabled={!newComment.trim() || isSubmitting}
          >
            <Send size={16} />
          </Button>
        </div>
      </form>
      
      {/* Lista de Comentários */}
      <div className="space-y-3">
        {postComments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <MessageCircle size={48} className="mx-auto mb-2 text-gray-300" />
            <p>Seja o primeiro a comentar!</p>
          </div>
        ) : (
          postComments.map((comment) => (
            <div key={comment.id} className="flex space-x-3">
              <img
                src={comment.user?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(comment.user?.name || 'User')}&size=32&background=0A5F38&color=fff`}
                alt={comment.user?.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
              
              <div className="flex-grow">
                <div className="bg-gray-100 rounded-lg px-3 py-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm text-gray-900">
                      {comment.user?.name}
                    </span>
                    <span className="text-xs text-gray-500">
                      {formatDate(comment.created_at)}
                    </span>
                  </div>
                  <p className="text-gray-800 text-sm">{comment.content}</p>
                </div>
                
                {/* Ações do Comentário */}
                <div className="flex items-center space-x-4 mt-1 ml-3">
                  <button
                    onClick={() => handleLikeComment(comment.id, comment.user_liked || false)}
                    className={`flex items-center space-x-1 text-xs transition-colors ${
                      comment.user_liked 
                        ? 'text-red-500 hover:text-red-600' 
                        : 'text-gray-500 hover:text-red-500'
                    }`}
                  >
                    <Heart 
                      size={14} 
                      className={comment.user_liked ? 'fill-current' : ''} 
                    />
                    <span>{comment.likes_count > 0 ? comment.likes_count : 'Curtir'}</span>
                  </button>
                  
                  {user?.id === comment.user_id && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="flex items-center space-x-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 size={14} />
                      <span>Excluir</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Modal de Avaliação */}
      {showRatingModal && selectedPlayer && (
        <PlayerRatingModal
          player={selectedPlayer}
          postId={postId}
          onClose={() => setShowRatingModal(false)}
          onSubmit={handleSubmitRating}
        />
      )}
    </div>
  );
};

export default CommentsSection;