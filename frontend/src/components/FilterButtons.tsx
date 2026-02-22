import React, { useState, useEffect } from 'react';
import { categoriesAPI, Category } from '../services/api';

interface FilterButtonsProps {
  activeFilter: string | number;
  onFilterChange: (filter: string | number) => void;
}

const FilterButtons: React.FC<FilterButtonsProps> = ({ activeFilter, onFilterChange }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async (): Promise<void> => {
    try {
      const response = await categoriesAPI.getCategories();
      setCategories(response.data);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-4">
        <button className="px-6 py-3 text-lg font-medium rounded-full bg-gray-200 text-gray-700">
          Загрузка...
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => onFilterChange('all')}
        className={`px-6 py-3 text-lg font-medium rounded-full transition-colors ${
          activeFilter === 'all'
            ? 'bg-[#323FF0] text-white'
            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
        }`}
      >
        Все мероприятия
      </button>

      {categories.map((category: Category) => (
        <button
          key={category.id}
          onClick={() => onFilterChange(category.id)}
          className={`px-6 py-3 text-lg font-medium rounded-full transition-colors ${
            activeFilter === category.id
              ? 'bg-[#323FF0] text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};

export default FilterButtons;