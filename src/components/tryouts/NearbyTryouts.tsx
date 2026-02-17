import React from 'react';
import { TryoutEvent } from '../../types';
import { formatDate } from '../../utils/tryoutData';
import { Calendar, MapPin, Users, Clock } from 'lucide-react';

interface NearbyTryoutsProps {
  tryouts: TryoutEvent[];
  userLocation?: string;
}

const NearbyTryouts: React.FC<NearbyTryoutsProps> = ({ tryouts, userLocation }) => {
  // Get next 5 upcoming tryouts
  const upcomingTryouts = tryouts
    .filter(tryout => tryout.isActive && new Date(tryout.date) > new Date())
    .slice(0, 5);

  if (upcomingTryouts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          🎯 Próximas Peneiras {userLocation && `em ${userLocation}`}
        </h2>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-2">
            <Calendar size={48} className="mx-auto" />
          </div>
          <p className="text-gray-600">
            Nenhuma peneira encontrada para sua região no momento.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Tente expandir sua busca para outras regiões.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-900 mb-6">
        🎯 Próximas Peneiras {userLocation && `em ${userLocation}`}
      </h2>
      
      <div className="space-y-4">
        {upcomingTryouts.map((tryout, index) => (
          <div 
            key={tryout.id}
            className={`p-4 rounded-lg border-l-4 transition-all duration-300 hover:shadow-md ${
              index === 0 
                ? 'border-l-primary-500 bg-primary-50' 
                : 'border-l-gray-300 bg-gray-50'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-grow">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-bold text-gray-900">{tryout.title}</h3>
                  {index === 0 && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800">
                      Mais próxima
                    </span>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar size={14} className="mr-2 text-primary-500" />
                    <span>{formatDate(tryout.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock size={14} className="mr-2 text-primary-500" />
                    <span>{tryout.time}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-2 text-primary-500" />
                    <span>{tryout.city}, {tryout.state}</span>
                  </div>
                  <div className="flex items-center">
                    <Users size={14} className="mr-2 text-primary-500" />
                    <span>{tryout.ageRange}</span>
                  </div>
                </div>
              </div>
              
              <div className="text-right ml-4">
                <div className="text-sm font-medium text-gray-900">
                  {tryout.maxParticipants - tryout.currentParticipants} vagas
                </div>
                <div className="text-xs text-gray-500">
                  {tryout.cost === 0 ? 'Gratuita' : `R$ ${tryout.cost}`}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Veja todas as peneiras disponíveis abaixo para mais opções.
        </p>
      </div>
    </div>
  );
};

export default NearbyTryouts;