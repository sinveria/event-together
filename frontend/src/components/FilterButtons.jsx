const FilterButtons = ({ activeFilter, onFilterChange }) => {
    const filters = [
        { key: 'all', label: 'Все мероприятия' },
        { key: 'art', label: 'Искусство' },
        { key: 'sport', label: 'Спорт' },
        { key: 'food', label: 'Еда' },
        { key: 'education', label: 'Образование' }
    ];

    return (
        <div className="flex flex-wrap gap-4">
            {filters.map((filter) => (
                <button
                    key={filter.key}
                    onClick={() => onFilterChange(filter.key)}
                    className={`px-6 py-3 text-lg font-medium rounded-full transition-colors ${
                        activeFilter === filter.key
                            ? 'bg-[#323FF0] text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                    {filter.label}
                </button>
            ))}
        </div>
    );
};

export default FilterButtons;