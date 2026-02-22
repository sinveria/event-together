import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { canAccessAdminPanel } from '../utils/permissions';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isProfilePage = location.pathname === '/profile';

  return (
    <header className="absolute top-0 left-0 right-0 z-20 p-4 bg-transparent">
      <div className="container mx-auto flex justify-between items-center">
        <nav>
          <ul className="flex space-x-6">
            <li><Link to="/" className="text-black hover:text-gray-600">Главная</Link></li>
            <li><Link to="/events" className="text-black hover:text-gray-600">События</Link></li>
            <li><Link to="/groups" className="text-black hover:text-gray-600">Группы</Link></li>
          </ul>
        </nav>
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {isProfilePage ? (
                <button
                  onClick={handleLogout}
                  className="text-black hover:text-gray-600"
                >
                  Выйти из профиля
                </button>
              ) : (
                <Link to="/profile" className="text-black hover:text-gray-600">Профиль</Link>
              )}
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              {canAccessAdminPanel(user?.role) && (
                <Link to="/admin" className="text-red-600 hover:text-red-800 font-medium">
                  Админ-панель
                </Link>
              )}
            </>
          ) : (
            <Link to="/login" className="text-black hover:text-gray-600">Авторизация</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;