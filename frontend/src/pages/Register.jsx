import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import arrowleftlogin from '../assets/img/arrowleftlogin.png';
import arrowrightlogin from '../assets/img/arrowrightlogin.png';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    
    const { register, login } = useAuth();
    const navigate = useNavigate();

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Валидация
        if (formData.password.length < 6) {
            setError('Пароль должен содержать минимум 6 символов');
            setLoading(false);
            return;
        }

        const result = await register(formData);
        
        if (result.success) {
            const loginResult = await login(formData.email, formData.password);
            if (loginResult.success) {
                navigate('/');
            } else {
                navigate('/login');
            }
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        <div className="bg-white">
            <section className="pt-24 pb-12">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-6">
                            <div className="flex items-center justify-center gap-4 mb-6">
                                <img
                                    src={arrowleftlogin}
                                    alt="Декоративная стрелка"
                                    className="w-32 h-32 object-contain"
                                />

                                <h1 className="text-4xl md:text-5xl font-bold text-white">
                                    <span className="bg-[#327BF0] px-6 py-3 rounded-lg inline-block">Регистрация</span>
                                </h1>
                                
                                <img
                                    src={arrowrightlogin}
                                    alt="Декоративная стрелка"
                                    className="w-32 h-32 object-contain"
                                />
                            </div>

                            <p className="text-3xl md:text-4xl font-bold text-black leading-relaxed mb-6">
                                Зарегистрируйтесь, чтобы начать ходить на события вместе
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
                            {error && (
                                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                                    {error}
                                </div>
                            )}
                            
                            <div className="space-y-6 mb-6">
                                <FormInput
                                    label="Имя"
                                    placeholder="Введите свое имя"
                                    value={formData.name}
                                    onChange={handleInputChange('name')}
                                    type="text"
                                    required
                                />

                                <FormInput
                                    label="Почта"
                                    placeholder="Введите свою почту"
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    type="email"
                                    required
                                />

                                <FormInput
                                    label="Пароль"
                                    placeholder="Введите пароль (минимум 6 символов)"
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                    type="password"
                                    required
                                />
                            </div>

                            <div className="flex justify-between items-center mb-6">
                                <p className="text-lg text-gray-700">
                                    Есть учетная запись?{' '}
                                    <Link 
                                        to="/login" 
                                        className="text-[#323FF0] hover:text-[#2a35cc] font-medium underline"
                                    >
                                        Войти
                                    </Link>
                                </p>
                                
                                <Link 
                                    to="/forgot-password" 
                                    className="text-lg text-[#323FF0] hover:text-[#2a35cc] font-medium underline"
                                >
                                    Забыли пароль?
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 text-lg text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-lg ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Регистрация...' : 'Создать учетную запись'}
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Register;