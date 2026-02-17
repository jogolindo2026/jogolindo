import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, Users } from 'lucide-react';
import { TryoutEvent } from '../types';
import { 
  generateTryoutData, 
  filterTryoutsByLocation, 
  filterTryoutsByRegion 
} from '../utils/tryoutData';
import TryoutCard from '../components/tryouts/TryoutCard';
import SearchFilters from '../components/tryouts/SearchFilters';
import NearbyTryouts from '../components/tryouts/NearbyTryouts';

const Tryouts: React.FC = () => {
  const [allTryouts, setAllTryouts] = useState<TryoutEvent[]>([]);
  const [filteredTryouts, setFilteredTryouts] = useState<TryoutEvent[]>([]);
  const [searchCity, setSearchCity] = useState('');
  const [searchState, setSearchState] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      const tryouts = generateTryoutData();
      setAllTryouts(tryouts);
      setFilteredTryouts(tryouts);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearch = () => {
    let filtered = [...allTryouts];

    // Apply location filter
    if (searchCity || searchState) {
      filtered = filterTryoutsByLocation(filtered, searchCity, searchState);
    }

    // Apply region filter
    if (selectedRegion !== 'all') {
      filtered = filterTryoutsByRegion(filtered, selectedRegion);
    }

    // Sort by date
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    setFilteredTryouts(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [allTryouts, selectedRegion]);

  const handleRegister = (tryoutId: string) => {
    // In a real app, this would handle registration logic
    alert(`Redirecionando para inscrição da peneira ${tryoutId}...`);
  };

  const getStatsOverview = () => {
    const activeTryouts = allTryouts.filter(t => t.isActive).length;
    const freeTryouts = allTryouts.filter(t => t.cost === 0).length;
    const totalSpots = allTryouts.reduce((sum, t) => sum + (t.maxParticipants - t.currentParticipants), 0);
    const upcomingTryouts = allTryouts.filter(t => new Date(t.date) > new Date()).length;

    return { activeTryouts, freeTryouts, totalSpots, upcomingTryouts };
  };

  const stats = getStatsOverview();
  const userLocation = searchCity && searchState ? `${searchCity}, ${searchState}` : searchCity || searchState;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando peneiras...</p>
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
            <Calendar size={48} className="text-primary-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Peneiras de Futebol</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Encontre oportunidades de peneiras e seletivas em clubes de todo o Brasil. 
            Sua chance de ser descoberto está aqui!
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
            <Trophy size={32} className="text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.activeTryouts}</div>
            <div className="text-sm text-gray-600">Peneiras Ativas</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Calendar size={32} className="text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.upcomingTryouts}</div>
            <div className="text-sm text-gray-600">Próximas Peneiras</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <Users size={32} className="text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalSpots}</div>
            <div className="text-sm text-gray-600">Vagas Disponíveis</div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <MapPin size={32} className="text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.freeTryouts}</div>
            <div className="text-sm text-gray-600">Peneiras Gratuitas</div>
          </div>
        </motion.div>

        {/* Search Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <SearchFilters
            searchCity={searchCity}
            searchState={searchState}
            selectedRegion={selectedRegion}
            onCityChange={setSearchCity}
            onStateChange={setSearchState}
            onRegionChange={setSelectedRegion}
            onSearch={handleSearch}
          />
        </motion.div>

        {/* Nearby Tryouts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <NearbyTryouts 
            tryouts={filteredTryouts} 
            userLocation={userLocation}
          />
        </motion.div>

        {/* Results header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Todas as Peneiras
              {(searchCity || searchState || selectedRegion !== 'all') && (
                <span className="text-lg font-normal text-gray-600 ml-2">
                  {userLocation && `em ${userLocation}`}
                  {selectedRegion !== 'all' && ` - Região ${selectedRegion}`}
                </span>
              )}
            </h2>
            <div className="text-sm text-gray-600">
              {filteredTryouts.length} peneira{filteredTryouts.length !== 1 ? 's' : ''} encontrada{filteredTryouts.length !== 1 ? 's' : ''}
            </div>
          </div>
        </motion.div>

        {/* Tryouts Grid */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredTryouts.length > 0 ? (
            filteredTryouts.map((tryout, index) => (
              <motion.div
                key={tryout.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <TryoutCard 
                  tryout={tryout} 
                  onRegister={handleRegister}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <Calendar size={48} className="text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Nenhuma peneira encontrada
              </h3>
              <p className="text-gray-600 mb-4">
                Não encontramos peneiras para os filtros selecionados.
              </p>
              <button
                onClick={() => {
                  setSearchCity('');
                  setSearchState('');
                  setSelectedRegion('all');
                  setFilteredTryouts(allTryouts);
                }}
                className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors"
              >
                Limpar Filtros
              </button>
            </div>
          )}
        </motion.div>

        {/* Load more button (for future pagination) */}
        {filteredTryouts.length >= 30 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 1.2 }}
            className="text-center mt-12"
          >
            <button className="px-6 py-3 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors">
              Carregar mais peneiras
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Tryouts;