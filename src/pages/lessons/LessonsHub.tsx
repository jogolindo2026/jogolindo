import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Target, Activity, Heart, Play, Lock } from 'lucide-react'; // Adicionado Lock
import { useAuthStore } from '../../store/authStore'; // Adicionado hook
import Card, { CardBody } from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { motion } from 'framer-motion';

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
    icon: <BookOpen className="w-6 h-6 text-primary-600" />,
  },
  {
    title: 'Táticas',
    description: 'Aprenda sistemas táticos modernos, posicionamento e estratégias coletivas.',
    path: '/aulas/taticas',
    image: 'https://images.pexels.com/photos/274422/pexels-photo-274422.jpeg',
    icon: <Target className="w-6 h-6 text-primary-600" />,
  },
  {
    title: 'Saúde',
    description: 'Nutrição, preparação física e prevenção de lesões para máximo desempenho.',
    path: '/aulas/saude',
    image: 'https://images.pexels.com/photos/774321/pexels-photo-774321.jpeg',
    icon: <Heart className="w-6 h-6 text-primary-600" />,
  },
  {
    title: 'Cidadania',
    description: 'Desenvolva valores éticos, fair play e trabalho em equipe através do futebol.',
    path: '/aulas/cidadania',
    image: 'https://images.pexels.com/photos/27642344/pexels-photo-27642344.jpeg',
    icon: <Activity className="w-6 h-6 text-primary-600" />,
  },
];

const LessonsHub: React.FC = () => {
  const { isAuthenticated } = useAuthStore(); // Hook para verificar login

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BANNER DE AVISO PARA VISITANTES */}
        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary-100 border-l-4 border-secondary-500 p-6 mb-12 rounded-r-xl shadow-lg flex flex-col md:flex-row items-center justify-between border-2 border-dashed border-secondary-300"
          >
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-secondary-500 p-3 rounded-full mr-4 text-primary-900 shadow-md">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-primary-900 font-bold text-lg uppercase tracking-tighter">Área de Visitante</h3>
                <p className="text-primary-800 text-sm">
                  A <strong>Resenha do Dia</strong> é aberta a todos. Cadastre-se para liberar os módulos de <strong>Técnica e Tática</strong>!
                </p>
              </div>
            </div>
            <Link to="/cadastro">
              <button className="bg-primary-600 text-white px-8 py-3 rounded-md font-bold hover:bg-primary-700 transition-all shadow-md uppercase text-sm tracking-widest">
                Liberar Aulas Gratuitas
              </button>
            </Link>
          </motion.div>
        )}

        {/* Daily Review Section - SEMPRE ABERTA */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 uppercase tracking-tighter italic border-b-2 border-primary-500 inline-block">Resenha do Dia</h2>
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl group">
            <img 
              src="https://images.pexels.com/photos/262524/pexels-photo-262524.jpeg"
              alt="Instrutor do dia"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex items-center justify-center">
              <div className="text-center p-6">
                <Link to="/aulas/resenha">
                  <div className="bg-secondary-500/90 backdrop-blur-md rounded-full p-6 mb-6 inline-block hover:scale-110 transition-transform cursor-pointer shadow-xl">
                    <Play size={48} className="text-primary-900 fill-primary-900" />
                  </div>
                </Link>
                <h3 className="text-2xl md:text-4xl font-black text-white mb-4 uppercase italic">
                  Novidades da Semana
                </h3>
                <p className="text-white/90 mb-8 max-w-2xl mx-auto font-medium">
                  Confira as últimas dicas táticas e atualizações do Jogo Lindo. Aberto para toda a comunidade!
                </p>
                <Link to="/aulas/resenha">
                  <Button variant="secondary" size="lg" className="font-bold px-10 py-4 text-lg">
                    ASSISTIR AGORA
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4 uppercase tracking-tighter">Módulos Técnicos</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Acesso exclusivo para atletas cadastrados na nossa plataforma de desenvolvimento.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {modules.map((module) => (
            <Link key={module.path} to={module.path}>
              <Card className="h-full hover:shadow-2xl transition-all overflow-hidden border-none group relative">
                <div className="relative h-56">
                  <img
                    src={module.image}
                    alt={module.title}
                    className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-primary-900/40 group-hover:bg-primary-900/20 transition-colors flex items-center justify-center">
                    <div className="bg-white p-4 rounded-full shadow-lg group-hover:scale-110 transition-transform">
                      {module.icon}
                    </div>
                  </div>
                  {!isAuthenticated && (
                    <div className="absolute top-4 right-4 bg-secondary-500 text-primary-900 p-2 rounded-full shadow-lg">
                      <Lock size={16} />
                    </div>
                  )}
                </div>
                <CardBody className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-3 uppercase tracking-tight">{module.title}</h2>
                  <p className="text-gray-600 leading-relaxed">{module.description}</p>
                  <div className="mt-6 flex items-center text-primary-600 font-bold text-sm uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    {isAuthenticated ? 'Acessar Módulo' : 'Liberar Conteúdo'} ➔
                  </div>
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