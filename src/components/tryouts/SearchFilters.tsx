import React from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import { getRegions } from '../../utils/tryoutData';

interface SearchFiltersProps {
  searchCity: string;
  searchState: string;
  selectedRegion: string;
  onCityChange: (city: string) => void;
  onStateChange: (state: string) => void;
  onRegionChange: (region: string) => void;
  onSearch: () => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({
  searchCity,
  searchState,
  selectedRegion,
  onCityChange,
  onStateChange,
  onRegionChange,
  onSearch
}) => {
  const regions = getRegions();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch();
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="flex items-center mb-4">
        <Search size={24} className="text-primary-500 mr-2" />
        <h2 className="text-xl font-bold text-gray-900">Encontre Peneiras na Sua Região</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* City Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin size={16} className="inline mr-1" />
              Cidade
            </label>
            <input
              type="text"
              value={searchCity}
              onChange={(e) => onCityChange(e.target.value)}
              placeholder="Digite sua cidade..."
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          {/* State Search */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <input
              type="text"
              value={searchState}
              onChange={(e) => onStateChange(e.target.value)}
              placeholder="Digite seu estado..."
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            />
          </div>

          {/* Region Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Filter size={16} className="inline mr-1" />
              Região
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange(e.target.value)}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
            >
              <option value="all">Todas as regiões</option>
              {regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            Buscar Peneiras
          </button>
        </div>
      </form>

      <div className="mt-4 p-4 bg-blue-50 rounded-md">
        <h3 className="text-sm font-medium text-blue-900 mb-2">💡 Dica de Busca</h3>
        <p className="text-sm text-blue-700">
          Digite sua cidade e estado para encontrar peneiras próximas a você. 
          Use os filtros de região para explorar oportunidades em outras áreas do Brasil.
        </p>
      </div>
    </div>
  );
};

export default SearchFilters;