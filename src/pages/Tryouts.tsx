import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trophy, Users, Lock } from 'lucide-react'; // Adicionado Lock
import { Link } from 'react-router-dom'; // Adicionado Link
import { useAuthStore } from '../store/authStore'; // Adicionado hook de autenticação
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
  const { isAuthenticated } = useAuthStore(); // Verifica se o usuário é um visitante
  const [allTryouts, setAllTryouts] = useState<TryoutEvent[]>([]);
  const [filteredTryouts, setFilteredTryouts] = useState<TryoutEvent[]>([]);
  const [searchCity, setSearchCity] = useState('');
  const [searchState, setSearchState] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.title = "Peneiras de Futebol | Jogo Lindo";
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
    if (searchCity || searchState) {
      filtered = filterTryoutsByLocation(filtered, searchCity, searchState);
    }
    if (selectedRegion !== 'all') {
      filtered = filterTryoutsByRegion(filtered, selectedRegion);
    }
    filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    setFilteredTryouts(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [allTryouts, selectedRegion]);

  const handleRegister = (tryoutId: string) => {
    if (!isAuthenticated) {
      alert("Você precisa estar logado para se inscrever em uma peneira!");
      return;
    }
    alert(`Redirecionando para inscrição da peneira ${tryoutId}...`);
  };

  const stats = {
    activeTryouts: allTryouts.filter(t => t.isActive).length,
    freeTryouts: allTryouts.filter(t => t.cost === 0).length,
    totalSpots: allTryouts.reduce((sum, t) => sum + (t.maxParticipants - t.currentParticipants), 0),
    upcomingTryouts: allTryouts.filter(t => new Date(t.date) > new Date()).length
  };

  const userLocation = searchCity && searchState ? `${searchCity}, ${searchState}` : searchCity || searchState;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 font-bold uppercase tracking-wider text-sm">Buscando seletivas...</p>
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
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary-100 border-l-4 border-secondary-500 p-6 mb-12 rounded-r-xl shadow-lg flex flex-col md:flex-row items-center justify-between border-2 border-dashed border-secondary-500"
          >
            <div className="flex items-center mb-4 md:mb-0">
              <div className="bg-secondary-500 p-3 rounded-full mr-4 text-primary-900 shadow-md">
                <Lock size={24} />
              </div>
              <div>
                <h3 className="text-primary-900 font-bold text-lg uppercase">Oportunidades Exclusivas</h3>
                <p className="text-primary-800 text-sm">
                  Visitantes podem visualizar as peneiras, mas a <strong>inscrição direta</strong> é exclusiva para atletas cadastrados.
                </p>
              </div>
            </div>
            <Link to="/cadastro">
              <button className="bg-primary-600 text-white px-8 py-3 rounded-md font-bold hover:bg-primary-700 transition-all shadow-md uppercase text-sm tracking-widest">
                Cadastre-se Agora
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
            <Calendar size={48} className="text-primary-500" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4 uppercase tracking-tighter italic">Peneiras e Seletivas</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            "Onde os sonhos encontram as oportunidades. Conectando você aos maiores clubes do Brasil."
          </p>
        </motion.div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-5 text-center border-t-4 border-primary-500">
            <Trophy size={24} className="text-primary-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.activeTryouts}</div>
            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Ativas</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5 text-center border-t-4 border-blue-500">
            <Calendar size={24} className="text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.upcomingTryouts}</div>
            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Próximas</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5 text-center border-t-4 border-green-500">
            <Users size={24} className="text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.totalSpots}</div>
            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Vagas</div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-5 text-center border-t-4 border-secondary-500">
            <MapPin size={24} className="text-yellow-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">{stats.freeTryouts}</div>
            <div className="text-xs text-gray-500 uppercase font-bold tracking-widest">Gratuitas</div>
          </div>
        </div>

        {/* Filters */}
        <SearchFilters
          searchCity={searchCity}
          searchState={searchState}
          selectedRegion={selectedRegion}
          onCityChange={setSearchCity}
          onStateChange={setSearchState}
          onRegionChange={setSelectedRegion}
          onSearch={handleSearch}
        />

        {/* Map View/Nearby - Apenas se houver localização */}
        {(searchCity || searchState) && (
          <NearbyTryouts tryouts={filteredTryouts} userLocation={userLocation} />
        )}

        {/* Grid de Peneiras */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredTryouts.length > 0 ? (
            filteredTryouts.map((tryout, index) => (
              <motion.div
                key={tryout.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <TryoutCard 
                  tryout={tryout} 
                  onRegister={() => handleRegister(tryout.id)}
                />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">Nenhuma peneira encontrada para esta região.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Tryouts;