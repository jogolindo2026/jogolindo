import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Target, Activity, Heart, Play } from 'lucide-react';
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface ModuleCard {
  title: string;
  description: string;
  path: string;
  image: string;
  icon: React.ReactNode;
}

const modules: ModuleCard[] = [
  {
    title: 'Técnicas',
    description: 'Domine os fundamentos do futebol: controle de bola, passes, finalizações e dribles.',
    path: '/aulas/tecnicas',
    image: 'https://images.pexels.com/photos/50713/football-ball-sport-soccer-50713.jpeg',
    icon: <BookOpen className="w-6 h-6" />,
  },
  {
    title: 'Táticas',
    description: 'Aprenda sistemas táticos modernos, posicionamento e estratégias coletivas.',
    path: '/aulas/taticas',
    image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg',
    icon: <Target className="w-6 h-6" />,
  },
  {
    title: 'Saúde',
    description: 'Nutrição, preparação física e prevenção de lesões para máximo desempenho.',
    path: '/aulas/saude',
    image: 'https://images.pexels.com/photos/774321/pexels-photo-774321.jpeg',
    icon: <Heart className="w-6 h-6" />,
  },
  {
    title: 'Cidadania',
    description: 'Desenvolva valores éticos, fair play e trabalho em equipe através do futebol.',
    path: '/aulas/cidadania',
    image: 'https://images.pexels.com/photos/27642344/pexels-photo-27642344.jpeg',
    icon: <Activity className="w-6 h-6" />,
  },
];

const LessonsHub: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Daily Review Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Resenha do Dia</h2>
          <div className="relative aspect-video rounded-xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.pexels.com/photos/262524/pexels-photo-262524.jpeg"
              alt="Instrutor do dia"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="text-center">
                <div className="bg-white/10 backdrop-blur-sm rounded-full p-6 mb-4 inline-block">
                  <Play size={48} className="text-white" />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                  Novidades da Semana
                </h3>
                <p className="text-white/90 mb-6 max-w-2xl mx-auto px-4">
                  Confira as últimas atualizações, dicas especiais e novos conteúdos disponíveis na plataforma.
                </p>
                <Link to="/aulas/resenha">
                  <Button variant="secondary" size="lg">
                    Assistir Agora
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Módulos de Aula</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Escolha um módulo para começar sua jornada de aprendizado no futebol
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((module) => (
            <Link key={module.path} to={module.path}>
              <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
                <div className="relative h-48">
                  <img
                    src={module.image}
                    alt={module.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <div className="bg-white p-3 rounded-full">
                      {module.icon}
                    </div>
                  </div>
                </div>
                <CardBody>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{module.title}</h2>
                  <p className="text-gray-600">{module.description}</p>
                </CardBody>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LessonsHub;