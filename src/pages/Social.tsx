import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useSocialStore } from '../store/socialStore';
import { useAuthStore } from '../store/authStore';
import { Plus, Video, TrendingUp, Users, Play } from 'lucide-react';
import Button from '../components/ui/Button';
import PostCard from '../components/social/PostCard';
import CreatePostModal from '../components/social/CreatePostModal';

const Social: React.FC = () => {
  const { user } = useAuthStore();
  const { posts, fetchPosts, isLoading, error } = useSocialStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);
  
  const getStats = () => {
    const totalPosts = posts.length;
    const totalLikes = posts.reduce((sum, post) => sum + post.likes_count, 0);
    const totalComments = posts.reduce((sum, post) => sum + post.comments_count, 0);
    const avgRating = posts.length > 0 
      ? posts.reduce((sum, post) => sum + post.average_rating, 0) / posts.length 
      : 0;
    
    return { totalPosts, totalLikes, totalComments, avgRating };
  };
  
  const stats = getStats();
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <Video size={48} className="text-primary-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Rede Social</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Compartilhe suas melhores jogadas, descubra novos talentos e conecte-se com a comunidade do futebol
          </p>
        </motion.div>
        
        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Video size={24} className="text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalPosts}</div>
            <div className="text-sm text-gray-600">Jogadas</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <TrendingUp size={24} className="text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalLikes}</div>
            <div className="text-sm text-gray-600">Curtidas</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Users size={24} className="text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalComments}</div>
            <div className="text-sm text-gray-600">Comentários</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-4 text-center">
            <Play size={24} className="text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.avgRating.toFixed(1)}</div>
            <div className="text-sm text-gray-600">Avaliação Média</div>
          </div>
        </motion.div>
        
        {/* Create Post Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mb-8"
        >
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-4">
              <img
                src={user?.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=48&background=0A5F38&color=fff`}
                alt={user?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-grow">
                <Button
                  variant="outline"
                  fullWidth
                  onClick={() => setShowCreateModal(true)}
                  leftIcon={<Plus size={20} />}
                  className="justify-start text-gray-500 hover:text-gray-700"
                >
                  Compartilhe sua melhor jogada...
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
        
        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md"
          >
            {error}
          </motion.div>
        )}
        
        {/* Posts Feed */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="space-y-6"
        >
          {isLoading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <Video size={64} className="text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Nenhuma jogada compartilhada ainda
              </h3>
              <p className="text-gray-600 mb-6">
                Seja o primeiro a compartilhar uma jogada incrível!
              </p>
              <Button
                variant="primary"
                onClick={() => setShowCreateModal(true)}
                leftIcon={<Plus size={20} />}
              >
                Compartilhar Jogada
              </Button>
            </div>
          ) : (
            posts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PostCard post={post} />
              </motion.div>
            ))
          )}
        </motion.div>
        
        {/* Load More Button (for future pagination) */}
        {posts.length >= 10 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mt-8"
          >
            <Button variant="outline" size="lg">
              Carregar mais jogadas
            </Button>
          </motion.div>
        )}
      </div>
      
      {/* Create Post Modal */}
      {showCreateModal && (
        <CreatePostModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default Social;