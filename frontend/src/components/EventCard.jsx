import React, { useState } from 'react';

const EventCard = ({ event }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      <div className="w-full">
        <div 
          className="cursor-pointer hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between py-6 w-full"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex justify-start">
            <span className="bg-[#323FF0] text-white px-4 py-2 rounded-lg text-lg font-medium">
              {event.title}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-lg text-gray-700">{event.date}</span>
            <button className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition-colors">
              <span className="text-lg font-bold">+</span>
            </button>
          </div>
        </div>

        {isExpanded && (
          <div className="bg-blue-50 p-6 rounded-lg mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Описание:</h4>
                <p className="text-gray-700">{event.description}</p>
              </div>
              <div>
                <h4 className="font-bold text-gray-900 mb-2">Место проведения:</h4>
                <p className="text-gray-700">{event.location}</p>
                <h4 className="font-bold text-gray-900 mt-4 mb-2">Дата проведения:</h4>
                <p className="text-gray-700">{event.fullDate}</p>
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