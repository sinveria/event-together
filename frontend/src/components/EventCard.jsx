// components/EventCard.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleJoinClick = (e) => {
    e.stopPropagation();
    
    if (!isAuthenticated) {
      alert('Для присоединения к событию необходимо войти в систему');
      navigate('/login');
      return;
    }

    console.log(`Присоединяемся к событию ${event.id}`);
    alert(`Вы присоединились к событию "${event.title}"`);
  };

  const hasDescription = event.description && event.description.trim() !== '';
  const hasPrice = event.price !== undefined && event.price !== null && event.price > 0;
  const hasCategory = event.category_name && event.category_name.trim() !== '';

  return (
    <>
      <div className="w-full">
        <div 
          className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between py-6 w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center gap-4">
            <span className="bg-[#323FF0] text-white px-4 py-2 rounded-lg text-lg font-medium">
              {event.title}
            </span>
            {hasCategory && (
              <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {event.category_name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4">
            <span className="text-lg text-gray-700">{event.date}</span>
            <button 
              onClick={handleJoinClick}
              className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
              title="Присоединиться к событию"
            >
              <span className="text-lg font-bold">+</span>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="bg-blue-50 p-6 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                {hasDescription ? (
                  <>
                    <h4 className="font-bold text-gray-900 mb-2">Описание:</h4>
                    <p className="text-gray-700">{event.description}</p>
                  </>
                ) : (
                  <p className="text-gray-500 italic">Описание отсутствует</p>
                )}
                
                {hasPrice && (
                  <p className="text-lg font-bold text-gray-900 mt-4">
                    Цена: {event.price} ₽
                  </p>
                )}
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Место проведения:</h4>
                <p className="text-gray-700">{event.location || 'Не указано'}</p>
                
                <h4 className="font-bold text-gray-900 mt-4 mb-2">Дата проведения:</h4>
                <p className="text-gray-700">{event.fullDate || 'Не указана'}</p>
                
                <h4 className="font-bold text-gray-900 mt-4 mb-2">Организатор:</h4>
                <p className="text-gray-700">{event.organizer || 'Не указан'}</p>
                
                {hasCategory && (
                  <>
                    <h4 className="font-bold text-gray-900 mt-4 mb-2">Категория:</h4>
                    <p className="text-gray-700">{event.category_name}</p>
                  </>
                )}
                
                {event.maxParticipants && (
                  <>
                    <h4 className="font-bold text-gray-900 mt-4 mb-2">Максимум участников:</h4>
                    <p className="text-gray-700">{event.maxParticipants}</p>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
        
        <div className="border-t border-gray-200"></div>
      </div>
    </>
  );
};

export default EventCard;