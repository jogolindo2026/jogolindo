import React, { useState } from 'react';
import { RankingPlayer } from '../../types';
import { getPositionLabel } from '../../utils/rankingData';
import Card, { CardBody } from '../ui/Card';
import { 
  MapPin, 
  Calendar, 
  Target, 
  TrendingUp, 
  Users, 
  Award,
  Ruler,
  Weight,
  ChevronDown,
  ChevronUp,
  Star
} from 'lucide-react';

interface PlayerCardProps {
  player: RankingPlayer;
  rank: number;
}

const PlayerCard: React.FC<PlayerCardProps> = ({ player, rank }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getSkillColor = (value: number) => {
    if (value >= 4) return 'text-green-600 bg-green-100';
    if (value >= 3) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const getOverallRatingColor = (rating: number) => {
    if (rating >= 80) return 'text-green-600 bg-green-100';
    if (rating >= 70) return 'text-blue-600 bg-blue-100';
    if (rating >= 60) return 'text-yellow-600 bg-yellow-100';
    return 'text-red-600 bg-red-100';
  };

  const renderStars = (value: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${i < value ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
      />
    ));
  };

  return (
    <Card className="hover:shadow-lg transition-all duration-300">
      <CardBody className="p-0">
        {/* Header with basic info */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            {/* Rank badge */}
            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
              rank === 1 ? 'bg-yellow-100 text-yellow-800' :
              rank === 2 ? 'bg-gray-100 text-gray-800' :
              rank === 3 ? 'bg-orange-100 text-orange-800' :
              'bg-blue-100 text-blue-800'
            }`}>
              {rank}
            </div>

            {/* Player photo */}
            <div className="flex-shrink-0">
              <img
                src={player.profilePicture}
                alt={player.name}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
            </div>

            {/* Basic info */}
            <div className="flex-grow min-w-0">
              <h3 className="text-lg font-bold text-gray-900 truncate">{player.name}</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Calendar size={14} className="mr-1" />
                  {player.age} anos
                </div>
                <div className="flex items-center">
                  <Target size={14} className="mr-1" />
                  {getPositionLabel(player.position!)}
                </div>
              </div>
              <div className="flex items-center mt-1 text-sm text-gray-500">
                <MapPin size={14} className="mr-1" />
                {player.city}, {player.country}
              </div>
            </div>

            {/* Overall rating */}
            <div className="flex-shrink-0 text-center">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${getOverallRatingColor(player.stats.overallRating)}`}>
                {player.stats.overallRating}
              </div>
              <div className="text-xs text-gray-500 mt-1">Overall</div>
            </div>
          </div>

          {/* Quick stats */}
          <div className="mt-4 grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900">{player.stats.goals}</div>
              <div className="text-xs text-gray-500">Gols</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{player.stats.assists}</div>
              <div className="text-xs text-gray-500">Assistências</div>
            </div>
            <div>
              <div className="text-lg font-bold text-gray-900">{player.stats.matchesPlayed}</div>
              <div className="text-xs text-gray-500">Jogos</div>
            </div>
          </div>

          {/* Expand button */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full mt-4 flex items-center justify-center text-sm text-primary-600 hover:text-primary-700 transition-colors"
          >
            {isExpanded ? (
              <>
                <ChevronUp size={16} className="mr-1" />
                Ver menos
              </>
            ) : (
              <>
                <ChevronDown size={16} className="mr-1" />
                Ver detalhes
              </>
            )}
          </button>
        </div>

        {/* Expanded details */}
        {isExpanded && (
          <div className="p-4 space-y-6">
            {/* Physical attributes */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Ruler size={16} className="mr-2" />
                Atributos Físicos
              </h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Altura:</span>
                  <span className="font-medium">{player.height} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peso:</span>
                  <span className="font-medium">{player.weight} kg</span>
                </div>
              </div>
            </div>

            {/* Technical skills */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Award size={16} className="mr-2" />
                Habilidades Técnicas
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'Passe', value: player.stats.passing },
                  { label: 'Chute', value: player.stats.shooting },
                  { label: 'Domínio', value: player.stats.dribbling },
                  { label: 'Velocidade', value: player.stats.speed },
                  { label: 'Força', value: player.stats.strength },
                  { label: 'Impulsão', value: player.stats.jumping },
                ].map((skill) => (
                  <div key={skill.label} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{skill.label}:</span>
                    <div className="flex items-center space-x-2">
                      <div className="flex">{renderStars(skill.value)}</div>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSkillColor(skill.value)}`}>
                        {skill.value}/5
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Special stats for goalkeepers */}
            {player.position === 'goalkeeper' && player.stats.penaltySaves && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-3">Estatísticas de Goleiro</h4>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Defesas de Pênalti:</span>
                  <span className="font-medium">{player.stats.penaltySaves}</span>
                </div>
              </div>
            )}

            {/* Career info */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center">
                <Users size={16} className="mr-2" />
                Carreira
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-600">Clubes:</span>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {player.stats.clubs.map((club, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {club}
                      </span>
                    ))}
                  </div>
                </div>
                {player.stats.agent && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Empresário:</span>
                    <span className="font-medium">{player.stats.agent}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </CardBody>
    </Card>
  );
};

export default PlayerCard;