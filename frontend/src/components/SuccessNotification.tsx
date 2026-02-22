import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SuccessNotification = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/');
    }, 3000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-lg max-w-md mx-4">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Регистрация успешна!</h3>
          <p className="text-gray-600 mb-4">Вы успешно зарегистрировались в системе.</p>
          <p className="text-sm text-gray-500">Перенаправление на главную страницу...</p>
        </div>
      </div>
    </div>
  );
};

export default SuccessNotification;