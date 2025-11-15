import React from 'react';
import { Link } from 'react-router-dom';

const Card = ({ title, date, location, description, link, image }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {image && <img src={image} alt={title} className="w-full h-48 object-cover" />}
      <div className="p-4">
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        {date && <p className="text-gray-600 mb-1">{date}</p>}
        {location && <p className="text-gray-600 mb-2">{location}</p>}
        {description && <p className="text-gray-700 mb-4">{description}</p>}
        {link && (
          <Link to={link} className="text-blue-600 hover:underline">
            Подробнее →
          </Link>
        )}
      </div>
    </div>
  );
};

export default Card;