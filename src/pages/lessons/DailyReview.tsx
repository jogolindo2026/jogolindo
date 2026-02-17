import React, { useEffect } from 'react';
import { useVideoStore } from '../../store/videoStore';
import Card, { CardBody } from '../../components/ui/Card';
import { Play } from 'lucide-react';

const DailyReview: React.FC = () => {
  const { lessons, fetchLessons, isLoading } = useVideoStore();
  
  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);
  
  // Get today's featured lesson (most recent)
  const featuredLesson = lessons[0];
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Resenha do Dia</h1>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : featuredLesson ? (
          <Card className="overflow-hidden">
            <div className="relative">
              <img 
                src={featuredLesson.thumbnailUrl} 
                alt={featuredLesson.title}
                className="w-full h-96 object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                <Play size={64} className="text-white opacity-80" />
              </div>
            </div>
            <CardBody>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{featuredLesson.title}</h2>
              <p className="text-gray-600 mb-4">{featuredLesson.description}</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>Duração: {featuredLesson.duration} minutos</span>
              </div>
            </CardBody>
          </Card>
        ) : (
          <div className="text-center text-gray-600">
            Nenhuma aula disponível no momento.
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyReview;