import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, TrendingUp, Award } from 'lucide-react';
import { RankingPlayer, Gender, AgeCategory } from '../types';
import { generateRankingData, categorizePlayersByAge, getCategoryLabel } from '../utils/rankingData';
import PlayerCard from '../components/ranking/PlayerCard';
import CategoryFilter from '../components/ranking/CategoryFilter';

const Ranking: React.FC = () => {
  const [allPlayers, setAllPlayers] = useState<RankingPlayer[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<RankingPlayer[]>([]);
  const [selectedGender, setSelectedGender] = useState<Gender | 'all'>('all');
  const [selectedAge, setSelectedAge] = useState<AgeCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
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

    // Filter by gender
    if (selectedGender !== 'all') {
      filtered = filtered.filter(player => player.gender === selectedGender);
    }

    // Filter by age category
    if (selectedAge !== 'all') {
      filtered = filtered.filter(player => {
        if (selectedAge === 'sub-15') return player.age <= 15;
        if (selectedAge === 'sub-17') return player.age <= 17 && player.age > 15;
        if (selectedAge === 'sub-20') return player.age <= 20 && player.age > 17;
        if (selectedAge === 'profissional') return player.age > 20;
        return true;
      });
    }

    // Sort by overall rating
    filtered.sort((a, b) => b.stats.overallRating - a.stats.overallRating);

    setFilteredPlayers(filtered);
  }, [allPlayers, selectedGender, selectedAge]);

  const getStatsOverview = () => {
    const totalPlayers = allPlayers.length;
    const malePlayers = allPlayers.filter(p => p.gender === 'male').length;
    const femalePlayers = allPlayers.filter(p => p.gender === 'female').length;
    const avgRating = allPlayers.length > 0 
      ? Math.round(allPlayers.reduce((sum, p) => sum + p.stats.overallRating, 0) / allPlayers.length)
      : 0;

    return { totalPlayers, malePlayers, femalePlayers, avgRating };
  };

  const stats = getStatsOverview();

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
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="flex justify-center mb-4">
            <Trophy size={48} className="text-primary-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Ranking de Jogadores</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Descubra os melhores talentos do futebol brasileiro organizados por categoria e desempenho
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users size={32} className="text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalPlayers}</div>
            <div className="text-sm text-gray-600">Total de Atletas</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users size={32} className="text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.malePlayers}</div>
            <div className="text-sm text-gray-600">Masculino</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users size={32} className="text-pink-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.femalePlayers}</div>
            <div className="text-sm text-gray-600">Feminino</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Award size={32} className="text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.avgRating}</div>
            <div className="text-sm text-gray-600">Rating Médio</div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <CategoryFilter
            selectedGender={selectedGender}
            selectedAge={selectedAge}
            onGenderChange={setSelectedGender}
            onAgeChange={setSelectedAge}
          />
        </motion.div>

        {/* Results header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              {selectedGender === 'all' && selectedAge === 'all' 
                ? 'Todos os Atletas'
                : `${selectedGender !== 'all' ? (selectedGender === 'male' ? 'Masculino' : 'Feminino') : 'Todos'} ${
                    selectedAge !== 'all' ? `- ${getCategoryLabel('male', selectedAge).split(' ')[1]}` : ''
                  }`
              }
            </h2>
            <div className="text-sm text-gray-600">
              {filteredPlayers.length} atleta{filteredPlayers.length !== 1 ? 's' : ''} encontrado{filteredPlayers.length !== 1 ? 's' : ''}
            </div>
          </div>
        </motion.div>

        {/* Players Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          {filteredPlayers.length > 0 ? (
            filteredPlayers.map((player, index) => (
              <motion.div
                key={player.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <PlayerCard player={player} rank={index + 1} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <TrendingUp size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhum atleta encontrado
              </h3>
              <p className="text-gray-600">
                Tente ajustar os filtros para encontrar atletas nesta categoria.
              </p>
            </div>
          )}
        </motion.div>

        {/* Load more button (for future pagination) */}
        {filteredPlayers.length >= 30 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1 }}
            className="text-center mt-12"
          >
            <button className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
              Carregar mais atletas
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Ranking;