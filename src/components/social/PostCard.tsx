import React, { useState } from 'react';
import { Post } from '../../types/social';
import { useSocialStore } from '../../store/socialStore';
import { useAuthStore } from '../../store/authStore';
import { 
  Play, 
  Heart, 
  MessageCircle, 
  Share2, 
  MoreHorizontal,
  Calendar,
  Clock,
  Target,
  Trash2
} from 'lucide-react';
import Card, { CardBody } from '../ui/Card';
import Button from '../ui/Button';
import BallRating from '../ui/BallRating';
import ShareModal from './ShareModal';
import CommentsSection from './CommentsSection';

interface PostCardProps {
  post: Post;
}

const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const { user } = useAuthStore();
  const { likePost, unlikePost, deletePost } = useSocialStore();
  const [showComments, setShowComments] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  
  const isOwner = user?.id === post.user_id;
  
  const handleRating = async (rating: number) => {
    if (post.user_rating === rating) {
      // Se já tem a mesma avaliação, remove
      await unlikePost(post.id);
    } else {
      // Adiciona ou atualiza avaliação
      await likePost(post.id, rating);
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      await deletePost(post.id);
    }
    setShowMenu(false);
  };
  
  const formatDuration = (seconds: number) => {
    if (seconds < 60) {
      return `${seconds}s`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };
  
  const getPositionLabel = (position?: string) => {
    const positions = {
      goalkeeper: 'Goleiro',
      defender: 'Defensor',
      midfielder: 'Meio-campo',
      forward: 'Atacante'
    };
    return position ? positions[position as keyof typeof positions] || position : '';
  };
  
  return (
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow">
        {/* Header do Post */}
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src={post.user?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.name || 'User')}&size=40&background=0A5F38&color=fff`}
                alt={post.user?.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-900">{post.user?.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  {post.user?.position && (
                    <div className="flex items-center">
                      <Target size={12} className="mr-1" />
                      {getPositionLabel(post.user.position)}
                    </div>
                  )}
                  <div className="flex items-center">
                    <Calendar size={12} className="mr-1" />
                    {formatDate(post.game_date)}
                  </div>
                </div>
              </div>
            </div>
            
            {isOwner && (
              <div className="relative">
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <MoreHorizontal size={20} className="text-gray-500" />
                </button>
                
                {showMenu && (
                  <div className="absolute right-0 top-full mt-1 bg-white border rounded-lg shadow-lg z-10 min-w-[120px]">
                    <button
                      onClick={handleDelete}
                      className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <Trash2 size={16} className="mr-2" />
                      Excluir
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Título e Descrição */}
        <CardBody className="pb-0">
          <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
          {post.description && (
            <p className="text-gray-600 mb-4">{post.description}</p>
          )}
        </CardBody>
        
        {/* Vídeo */}
        <div className="relative">
          {post.thumbnail_url ? (
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-64 object-cover"
            />
          ) : (
            <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
              <Play size={48} className="text-gray-400" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
              <Play size={32} className="text-white" />
            </div>
          </div>
          
          {/* Duração */}
          <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm flex items-center">
            <Clock size={12} className="mr-1" />
            {formatDuration(post.duration)}
          </div>
        </div>
        
        {/* Estatísticas */}
        <CardBody className="pt-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>{post.likes_count} curtida{post.likes_count !== 1 ? 's' : ''}</span>
              <span>{post.comments_count} comentário{post.comments_count !== 1 ? 's' : ''}</span>
              {post.average_rating > 0 && (
                <span>⭐ {post.average_rating.toFixed(1)}</span>
              )}
            </div>
          </div>
          
          {/* Ações */}
          <div className="flex items-center justify-between border-t pt-4">
            {/* Sistema de Curtidas com Bolas */}
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600">Avaliar:</span>
              <BallRating
                rating={post.user_rating || 0}
                maxRating={5}
                size="md"
                onChange={handleRating}
              />
            </div>
            
            {/* Botões de Ação */}
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowComments(!showComments)}
                leftIcon={<MessageCircle size={16} />}
              >
                {showComments ? 'Ocultar' : 'Comentar'}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowShareModal(true)}
                leftIcon={<Share2 size={16} />}
              >
                Compartilhar
              </Button>
            </div>
          </div>
        </CardBody>
        
        {/* Seção de Comentários */}
        {showComments && (
          <div className="border-t">
            <CommentsSection postId={post.id} />
          </div>
        )}
      </Card>
      
      {/* Modal de Compartilhamento */}
      {showShareModal && (
        <ShareModal
          post={post}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
};

export default PostCard;