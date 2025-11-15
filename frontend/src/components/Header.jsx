import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="bg-blue-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold">EventTogether</Link>
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/">Главная</Link></li>
            <li><Link to="/groups">Группы</Link></li>
            <li><Link to="/events">События</Link></li>
            <li><Link to="/login">Авторизация</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;