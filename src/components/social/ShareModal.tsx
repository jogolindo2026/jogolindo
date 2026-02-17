import React, { useState } from 'react';
import { Post, ShareOptions } from '../../types/social';
import { useSocialStore } from '../../store/socialStore';
import { X, Mail, MessageCircle, Share2 } from 'lucide-react';
import Button from '../ui/Button';

interface ShareModalProps {
  post: Post;
  onClose: () => void;
}

const ShareModal: React.FC<ShareModalProps> = ({ post, onClose }) => {
  const { sharePost } = useSocialStore();
  const [email, setEmail] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  
  const handleShare = async (options: ShareOptions) => {
    setIsSharing(true);
    await sharePost(post, options);
    setIsSharing(false);
    onClose();
  };
  
  const handleEmailShare = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    await handleShare({
      type: 'email',
      recipient: email.trim()
    });
  };
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Compartilhar Jogada</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        {/* Preview do Post */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3 mb-3">
            <img
              src={post.user?.profile_picture || `https://ui-avatars.com/api/?name=${encodeURIComponent(post.user?.name || 'User')}&size=40&background=0A5F38&color=fff`}
              alt={post.user?.name}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <h4 className="font-semibold text-gray-900">{post.user?.name}</h4>
              <p className="text-sm text-gray-600">{post.title}</p>
            </div>
          </div>
          
          {post.thumbnail_url && (
            <img
              src={post.thumbnail_url}
              alt={post.title}
              className="w-full h-32 object-cover rounded-lg"
            />
          )}
        </div>
        
        {/* Opções de Compartilhamento */}
        <div className="p-4 space-y-4">
          {/* WhatsApp */}
          <Button
            variant="outline"
            fullWidth
            onClick={() => handleShare({ type: 'whatsapp' })}
            disabled={isSharing}
            leftIcon={
              <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle size={12} className="text-white" />
              </div>
            }
          >
            Compartilhar no WhatsApp
          </Button>
          
          {/* Email */}
          <form onSubmit={handleEmailShare} className="space-y-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite o email do destinatário"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Button
              type="submit"
              variant="outline"
              fullWidth
              disabled={!email.trim() || isSharing}
              leftIcon={<Mail size={16} />}
            >
              Enviar por Email
            </Button>
          </form>
          
          {/* Mensagem Direta (Futuro) */}
          <Button
            variant="outline"
            fullWidth
            disabled
            leftIcon={<Share2 size={16} />}
          >
            Mensagem Direta (Em breve)
          </Button>
        </div>
        
        {/* Footer */}
        <div className="p-4 border-t bg-gray-50 rounded-b-lg">
          <p className="text-xs text-gray-500 text-center">
            Ao compartilhar, você está ajudando a divulgar o talento do futebol brasileiro!
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;