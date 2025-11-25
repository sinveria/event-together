import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <>
      <div className="border-t border-gray-200 w-full"></div>
      
      <footer className="bg-white text-black p-8">
        <div className="container mx-auto">
          <div className="flex justify-between">
            <div>
              <h3 className="font-bold text-lg mb-4">Сайт</h3>
              <ul className="space-y-2">
                <li><Link to="/events" className="hover:text-gray-600">События</Link></li>
                <li><Link to="/groups" className="hover:text-gray-600">Группы</Link></li>
                <li><Link to="/join" className="hover:text-gray-600">Присоединиться</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-lg mb-4">Связаться с нами</h3>
              <ul className="space-y-2">
                <li><Link to="/faq" className="hover:text-gray-600">FAQ</Link></li>
                <li><Link to="/help" className="hover:text-gray-600">Помощь</Link></li>
                <li><Link to="/contact" className="hover:text-gray-600">Контакты</Link></li>
              </ul>
            </div>
          </div>
          <p className="mt-8 text-center text-gray-600">&copy; 2025 EventTogether. Все права защищены.</p>
        </div>
      </footer>
    </>
  );
};

export default Footer;