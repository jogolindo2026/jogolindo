import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, TrendingUp, Lock } from 'lucide-react'; // Adicionado Lock
import { Link } from 'react-router-dom'; // Adicionado Link
import { useAuthStore } from '../store/authStore'; // Adicionado useAuthStore
import { RankingPlayer, Gender, AgeCategory } from '../types';
import { generateRankingData } from '../utils/rankingData';
import PlayerCard from '../components/ranking/PlayerCard';
import CategoryFilter from '../components/ranking/CategoryFilter';

const Ranking: React.FC = () => {
  const { isAuthenticated } = useAuthStore(); // Hook de autenticação
  const [allPlayers, setAllPlayers] = useState<RankingPlayer[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<RankingPlayer[]>([]);
  const [selectedGender, setSelectedGender] = useState<Gender | 'all'>('all');
  const [selectedAge, setSelectedAge] = useState<AgeCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Ranking de Talentos | Jogo Lindo";
    const timer = setTimeout(() => {
      const players = generateRankingData();
      setAllPlayers(players);
      setFilteredPlayers(players);
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = [...allPlayers];
    if (selectedGender !== 'all') {
      filtered = filtered.filter(player => player.gender === selectedGender);
    }
    if (selectedAge !== 'all') {
      filtered = filtered.filter(player => {
        if (selectedAge === 'sub-15') return player.age <= 15;
        if (selectedAge === 'sub-17') return player.age <= 17 && player.age > 15;
        if (selectedAge === 'sub-20') return player.age <= 20 && player.age > 17;
        if (selectedAge === 'profissional') return player.age > 20;
        return true;
      });
    }
    // 🛡️ Ajustado para overall_rating (Snake Case)
filtered.sort((a, b) => b.stats.overall_rating - a.stats.overall_rating);
    setFilteredPlayers(filtered);
  }, [allPlayers, selectedGender, selectedAge]);

  const stats = {
    totalPlayers: allPlayers.length,
    malePlayers: allPlayers.filter(p => p.gender === 'male').length,
    femalePlayers: allPlayers.filter(p => p.gender === 'female').length,
    // 🛡️ Substitua a linha do avgRating por esta:
avgRating: allPlayers.length > 0 
  ? Math.round(allPlayers.reduce((sum, p) => sum + p.stats.overall_rating, 0) / allPlayers.length)
  : 0
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando ranking...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* BANNER DE AVISO PARA VISITANTES */}
        {!isAuthenticated && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-secondary-100 border-l-4 border-secondary-500 p-6 mb-12 rounded-r-xl shadow-lg flex flex-col md:flex-row items-center justify-between"
          >
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-secondary-500 p-3 rounded-full mr-4 text-primary-900">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-primary-900 font-bold text-lg uppercase">Área de Visitante</h3>
                <p className="text-primary-800 text-sm">
                  Você está vendo o ranking público. Para <strong>avaliar atletas ou postar seus vídeos</strong>, cadastre-se!
                </p>
              </div>
            </div>
            <Link to="/cadastro">
              <button className="bg-primary-600 text-white px-6 py-2 rounded-md font-bold hover:bg-primary-700 transition-all shadow-md">
                QUERO ME CADASTRAR
              </button>
            </Link>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <Trophy size={48} className="text-primary-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 uppercase">Ranking de Talentos</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto italic">
            "Acompanhe o desenvolvimento dos futuros craques do futebol brasileiro."
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border-b-4 border-blue-500">
            <div className="text-xl font-bold text-gray-900">{stats.totalPlayers}</div>
            <div className="text-xs text-gray-500 uppercase font-bold">Atletas</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border-b-4 border-blue-400">
            <div className="text-xl font-bold text-gray-900">{stats.malePlayers}</div>
            <div className="text-xs text-gray-500 uppercase font-bold">Masculino</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border-b-4 border-pink-400">
            <div className="text-xl font-bold text-gray-900">{stats.femalePlayers}</div>
            <div className="text-xs text-gray-500 uppercase font-bold">Feminino</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-4 text-center border-b-4 border-secondary-500">
            <div className="text-xl font-bold text-gray-900">{stats.avgRating}</div>
            <div className="text-xs text-gray-500 uppercase font-bold">Rating Médio</div>
          </div>
        </div>

        {/* Category Filter */}
        <CategoryFilter
          selectedGender={selectedGender}
          selectedAge={selectedAge}
          onGenderChange={setSelectedGender}
          onAgeChange={setSelectedAge}
        />

        {/* Results Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player, index) => (
              <PlayerCard key={player.id} player={player} rank={index + 1} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhum atleta encontrado nesta categoria.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Ranking;