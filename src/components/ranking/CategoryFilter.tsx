import React from 'react';
import { Gender, AgeCategory } from '../../types';
import { getCategoryLabel } from '../../utils/rankingData';

interface CategoryFilterProps {
  selectedGender: Gender | 'all';
  selectedAge: AgeCategory | 'all';
  onGenderChange: (gender: Gender | 'all') => void;
  onAgeChange: (age: AgeCategory | 'all') => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  selectedGender,
  selectedAge,
  onGenderChange,
  onAgeChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filtrar por Categoria</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Gender filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Gênero
          </label>
          <select
            value={selectedGender}
            onChange={(e) => onGenderChange(e.target.value as Gender | 'all')}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="all">Todos</option>
            <option value="male">Masculino</option>
            <option value="female">Feminino</option>
          </select>
        </div>

        {/* Age category filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Categoria de Idade
          </label>
          <select
            value={selectedAge}
            onChange={(e) => onAgeChange(e.target.value as AgeCategory | 'all')}
            className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
          >
            <option value="all">Todas</option>
            <option value="sub-15">Sub-15</option>
            <option value="sub-17">Sub-17</option>
            <option value="sub-20">Sub-20</option>
            <option value="profissional">Profissional</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;