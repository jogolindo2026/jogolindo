import React, { useEffect, useState } from 'react';
import { useVideoStore } from '../../store/videoStore';
import { LessonModule, VideoLesson } from '../../types';
import Card, { CardBody } from '../../components/ui/Card';
import { Play } from 'lucide-react';

interface LessonListProps {
  module: LessonModule;
  title: string;
  description: string;
}

interface TopicGroup {
  topic: string;
  lessons: VideoLesson[];
}

const LessonList: React.FC<LessonListProps> = ({ module, title, description }) => {
  const { lessons, fetchLessons, isLoading } = useVideoStore();
  const [groupedLessons, setGroupedLessons] = useState<TopicGroup[]>([]);
  
  useEffect(() => {
    fetchLessons();
  }, [fetchLessons]);
  
  useEffect(() => {
    const moduleLessons = lessons.filter(lesson => lesson.module === module);
    
    // Group lessons by topic
    const groups = moduleLessons.reduce((acc: TopicGroup[], lesson) => {
      const existingGroup = acc.find(group => group.topic === lesson.topic);
      if (existingGroup) {
        existingGroup.lessons.push(lesson);
      } else {
        acc.push({ topic: lesson.topic, lessons: [lesson] });
      }
      return acc;
    }, []);
    
    // Sort lessons within each group by date
    groups.forEach(group => {
      group.lessons.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });
    
    setGroupedLessons(groups);
  }, [lessons, module]);
  
  // Get the most recent lesson for the featured section
  const featuredLesson = lessons
    .filter(lesson => lesson.module === module)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())[0];
  
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{title}</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">{description}</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
          </div>
        ) : (
          <>
            {/* Featured Lesson */}
            {featuredLesson && (
              <div className="mb-12">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Aula em Destaque</h2>
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
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{featuredLesson.title}</h3>
                    <p className="text-gray-600 mb-4">{featuredLesson.description}</p>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>Tópico: {featuredLesson.topic}</span>
                      <span>Duração: {featuredLesson.duration} minutos</span>
                    </div>
                  </CardBody>
                </Card>
              </div>
            )}
            
            {/* Lesson Groups by Topic */}
            <div className="space-y-12">
              {groupedLessons.map(group => (
                <div key={group.topic}>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">{group.topic}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {group.lessons.map(lesson => (
                      <Card key={lesson.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img 
                            src={lesson.thumbnailUrl} 
                            alt={lesson.title}
                            className="w-full h-48 object-cover"
                          />
                          <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                            <Play size={48} className="text-white" />
                          </div>
                        </div>
                        <CardBody>
                          <h3 className="text-xl font-bold text-gray-900 mb-2">{lesson.title}</h3>
                          <p className="text-gray-600 mb-4 line-clamp-2">{lesson.description}</p>
                          <div className="flex items-center justify-between text-sm text-gray-500">
                            <span>Duração: {lesson.duration} minutos</span>
                          </div>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LessonList;