import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useSocialStore } from '../store/socialStore';
import { useAuthStore } from '../store/authStore';
import { Plus, Video, TrendingUp, Users, Play, Lock } from 'lucide-react';
import Button from '../components/ui/Button';
import PostCard from '../components/social/PostCard';
import CreatePostModal from '../components/social/CreatePostModal';

const Social: React.FC = () => {
  const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
  const { posts, fetchPosts, isLoading } = useSocialStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  useEffect(() => {
    document.title = "Rede Social | Jogo Lindo";
    
    // 🛡️ Aguarda o carregamento do auth para não dar erro de "não autenticado" no console
    if (!authLoading) {
      fetchPosts();
    }
  }, [fetchPosts, authLoading]);
  
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
        
        {/* BANNER DE AVISO PARA VISITANTES */}
        {!isAuthenticated && !authLoading && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-secondary-100 border-l-4 border-secondary-500 p-6 mb-8 rounded-r-xl shadow-lg flex flex-col md:flex-row items-center justify-between"
          >
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-secondary-500 p-3 rounded-full mr-4 text-primary-900 shadow-sm">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-primary-900 font-bold text-lg uppercase tracking-tight italic">Modo de Visualização</h3>
                <p className="text-primary-800 text-sm">
                  Quer <strong>postar seus vídeos e receber notas</strong> da comunidade? Cadastre-se agora!
                </p>
              </div>
            </div>
            <Link to="/cadastro">
              <button className="bg-primary-600 text-white px-8 py-2 rounded-md font-bold hover:bg-primary-700 transition-all shadow-md uppercase text-sm italic">
                Fazer Cadastro Grátis
              </button>
            </Link>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <Video size={48} className="text-primary-500" />
          </div>
          <h1 className="text-4xl font-black text-gray-900 mb-2 uppercase tracking-tighter italic">Rede Social</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto italic">
            "Sua jogada merece ser vista pelo mundo inteiro."
          </p>
        </motion.div>
        
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border-b-4 border-primary-500">
            <Video size={20} className="text-primary-500 mx-auto mb-2" />
            <div className="text-xl font-black text-gray-900">{stats.totalPosts}</div>
            <div className="text-xs text-gray-500 uppercase font-black italic">Jogadas</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border-b-4 border-blue-500">
            <TrendingUp size={20} className="text-blue-500 mx-auto mb-2" />
            <div className="text-xl font-black text-gray-900">{stats.totalLikes}</div>
            <div className="text-xs text-gray-500 uppercase font-black italic">Curtidas</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border-b-4 border-green-500">
            <Users size={20} className="text-green-500 mx-auto mb-2" />
            <div className="text-xl font-black text-gray-900">{stats.totalComments}</div>
            <div className="text-xs text-gray-500 uppercase font-black italic">Comentários</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border-b-4 border-secondary-500">
            <Play size={20} className="text-yellow-500 mx-auto mb-2" />
            <div className="text-xl font-black text-gray-900">{stats.avgRating.toFixed(1)}</div>
            <div className="text-xs text-gray-500 uppercase font-black italic">Média</div>
          </div>
        </div>
        
        {/* Create Post Button (Condicional) */}
        {isAuthenticated ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="bg-white rounded-lg shadow-md p-6 border-2 border-primary-100">
              <div className="flex items-center space-x-4">
                <img
                  // 🛡️ CORREÇÃO DA LINHA 109: Agora usa profile_picture
                  src={user?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'User')}&size=48&background=0A5F38&color=fff`}
                  className="w-12 h-12 rounded-full border-2 border-secondary-500 object-cover shadow-sm"
                  alt={user?.name}
                />
                <div className="flex-grow">
                  <Button
                    variant="outline"
                    fullWidth
                    onClick={() => setShowCreateModal(true)}
                    leftIcon={<Plus size={20} />}
                    className="justify-start text-gray-500 hover:text-primary-600 font-bold uppercase italic tracking-wider"
                  >
                    Postar nova jogada agora...
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          !authLoading && (
            <div className="text-center mb-12 py-10 bg-gray-100 rounded-[2rem] border-2 border-dashed border-gray-300">
               <p className="text-gray-500 font-black uppercase italic tracking-widest">Faça login para compartilhar suas jogadas!</p>
            </div>
          )
        )}
        
        {/* Posts Feed */}
        <div className="space-y-6">
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
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
        </div>
      </div>
      
      {showCreateModal && (
        <CreatePostModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default Social;