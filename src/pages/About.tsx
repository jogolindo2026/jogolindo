import React from 'react';
import { motion } from 'framer-motion';
import { Target, Users, Lightbulb, Trophy, Heart, Briefcase, TrendingUp } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-primary-600 text-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-black opacity-40"></div>
          <img 
            src="https://images.pexels.com/photos/3621104/pexels-photo-3621104.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Crianças jogando futebol"
            className="w-full h-full object-cover"
            loading="eager"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
              JOGO LINDO
            </h1>
            <p className="text-xl md:text-2xl max-w-4xl mx-auto">
              FABRICANDO E TRANSFORMANDO TALENTOS EM FUTEBOL ATRAVÉS DE CIDADANIA
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center mb-16">
            <p className="text-lg text-gray-600">
              O Jogo Lindo é uma plataforma inovadora que visa a inclusão de jovens e
              crianças em condição de exclusão social, proporcionando acesso a
              treinamentos e peneiras populares com professores e treinadores
              especializados. O projeto utiliza Inteligência Artificial para avaliação cinética
              do desempenho, criando um ecossistema digital para formação e descoberta
              de novos talentos no futebol profissional.
            </p>
          </div>

          {/* Problem and Solution */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-xl shadow-md p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">O Problema</h3>
              <p className="text-gray-600">
                Falta de acesso a treinamentos e oportunidades para jovens
                talentos do futebol em situação de exclusão social.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-xl shadow-md p-8"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Nossa Solução</h3>
              <p className="text-gray-600">
                Plataforma digital com treinamentos especializados, avaliação
                de desempenho por IA e peneira digital conectada a clubes
                profissionais.
              </p>
            </motion.div>
          </div>

          {/* Mission and Vision */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-xl shadow-md p-8"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Target className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Missão</h3>
              <p className="text-gray-600">
                Promover a inclusão de jovens no futebol profissional por meio de
                treinamentos especializados, tecnologia avançada de avaliação e um
                ecossistema de suporte que viabilize a inserção de atletas no mercado.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-xl shadow-md p-8"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Lightbulb className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Visão</h3>
              <p className="text-gray-600">
                Ser reconhecida até 2030 como a principal plataforma digital de
                formação de atletas do futebol, unindo tecnologia e inclusão social para
                transformar vidas e revelar talentos globalmente.
              </p>
            </motion.div>
          </div>

          {/* Social and Economic Impact */}
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Impacto Social e Econômico</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-xl shadow-md p-8"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Heart className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Inclusão Social</h3>
              <p className="text-gray-600">
                Democratização do acesso ao futebol profissional para jovens em
                situação de vulnerabilidade.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-xl shadow-md p-8"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <Briefcase className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Geração de Empregos</h3>
              <p className="text-gray-600">
                Criação de oportunidades para profissionais do esporte e tecnologia.
              </p>
            </motion.div>

            <motion.div 
              whileHover={{ y: -10 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white rounded-xl shadow-md p-8"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="h-6 w-6 text-primary-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Economia Esportiva</h3>
              <p className="text-gray-600">
                Fomento ao mercado do futebol com a formação de novos
                talentos brasileiros.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;