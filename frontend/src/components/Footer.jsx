import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white p-4 mt-10">
      <div className="container mx-auto">
        <div className="flex justify-between">
          <div>
            <h3>Сайт</h3>
            <ul>
              <li><Link to="/events">События</Link></li>
              <li><Link to="/groups">Группы</Link></li>
              <li><Link to="/join">Присоединиться</Link></li>
            </ul>
          </div>
          <div>
            <h3>Поддержка</h3>
            <ul>
              <li><Link to="/faq">FAQ</Link></li>
              <li><Link to="/help">Помощь</Link></li>
              <li><Link to="/contact">Контакты</Link></li>
            </ul>
          </div>
        </div>
        <p className="mt-4 text-center">&copy; 2025 EventTogether. Все права защищены.</p>
      </div>
    </footer>
  );
};

export default Footer;