import React, { useState } from 'react';
import { X, Star, Target, Zap, Dumbbell, TrendingUp, Users } from 'lucide-react';
import Button from '../ui/Button';
import { User } from '../../types';

interface PlayerRatingModalProps {
  player: User;
  postId: string;
  onClose: () => void;
  onSubmit: (ratings: PlayerRatings) => Promise<void>;
}

interface PlayerRatings {
  passing: number;
  shooting: number;
  dribbling: number;
  speed: number;
  strength: number;
  jumping: number;
}

const PlayerRatingModal: React.FC<PlayerRatingModalProps> = ({
  player,
  postId,
  onClose,
  onSubmit
}) => {
  const [ratings, setRatings] = useState<PlayerRatings>({
    passing: 0,
    shooting: 0,
    dribbling: 0,
    speed: 0,
    strength: 0,
    jumping: 0
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const skills = [
    {
      key: 'passing' as keyof PlayerRatings,
      label: 'Passe',
      icon: <Target size={20} />,
      description: 'Precisão e qualidade dos passes'
    },
    {
      key: 'shooting' as keyof PlayerRatings,
      label: 'Finalização',
      icon: <Star size={20} />,
      description: 'Capacidade de finalizar e fazer gols'
    },
    {
      key: 'dribbling' as keyof PlayerRatings,
      label: 'Drible',
      icon: <Users size={20} />,
      description: 'Habilidade para superar adversários'
    },
    {
      key: 'speed' as keyof PlayerRatings,
      label: 'Velocidade',
      icon: <Zap size={20} />,
      description: 'Rapidez e agilidade em campo'
    },
    {
      key: 'strength' as keyof PlayerRatings,
      label: 'Força',
      icon: <Dumbbell size={20} />,
      description: 'Força física e resistência'
    },
    {
      key: 'jumping' as keyof PlayerRatings,
      label: 'Impulsão',
      icon: <TrendingUp size={20} />,
      description: 'Capacidade de salto e jogo aéreo'
    }
  ];
  
  const handleRatingChange = (skill: keyof PlayerRatings, rating: number) => {
    setRatings(prev => ({ ...prev, [skill]: rating }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Verificar se pelo menos uma habilidade foi avaliada
    const hasRatings = Object.values(ratings).some(rating => rating > 0);
    if (!hasRatings) {
      alert('Por favor, avalie pelo menos uma habilidade.');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onSubmit(ratings);
      onClose();
    } catch (error) {
      console.error('Erro ao enviar avaliação:', error);
      alert('Erro ao enviar avaliação. Tente novamente.');
    }
    setIsSubmitting(false);
  };
  
  const renderStarRating = (skill: keyof PlayerRatings) => {
    const currentRating = ratings[skill];
    
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => handleRatingChange(skill, star)}
            className={`p-1 transition-colors ${
              star <= currentRating 
                ? 'text-yellow-400 hover:text-yellow-500' 
                : 'text-gray-300 hover:text-yellow-300'
            }`}
          >
            <Star 
              size={24} 
              className={star <= currentRating ? 'fill-current' : ''} 
            />
          </button>
        ))}
        <span className="ml-2 text-sm text-gray-600 min-w-[60px]">
          {currentRating > 0 ? `${currentRating}/5` : 'Não avaliado'}
        </span>
      </div>
    );
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-4">
            <img
              src={player.profilePicture || `https://ui-avatars.com/api/?name=${encodeURIComponent(player.name)}&size=48&background=0A5F38&color=fff`}
              alt={player.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-900">Avaliar Jogador</h2>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <span className="font-medium">{player.name}</span>
                {player.position && (
                  <>
                    <span>•</span>
                    <span>{getPositionLabel(player.position)}</span>
                  </>
                )}
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Avalie as Habilidades Técnicas
            </h3>
            <p className="text-sm text-gray-600">
              Baseie-se no desempenho mostrado no vídeo para avaliar cada habilidade de 1 a 5 estrelas.
            </p>
          </div>
          
          {/* Skills Rating */}
          <div className="space-y-6">
            {skills.map((skill) => (
              <div key={skill.key} className="border-b border-gray-100 pb-4 last:border-b-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3 flex-grow">
                    <div className="flex-shrink-0 w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-600">
                      {skill.icon}
                    </div>
                    <div className="flex-grow">
                      <h4 className="font-medium text-gray-900">{skill.label}</h4>
                      <p className="text-sm text-gray-600">{skill.description}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {renderStarRating(skill.key)}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
            <h4 className="text-sm font-medium text-blue-900 mb-2">
              💡 Como Avaliar:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• <strong>1 estrela:</strong> Muito fraco</li>
              <li>• <strong>2 estrelas:</strong> Fraco</li>
              <li>• <strong>3 estrelas:</strong> Regular</li>
              <li>• <strong>4 estrelas:</strong> Bom</li>
              <li>• <strong>5 estrelas:</strong> Excelente</li>
            </ul>
          </div>
          
          {/* Buttons */}
          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Enviando...' : 'Enviar Avaliação'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlayerRatingModal;