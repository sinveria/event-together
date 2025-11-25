import { Link } from 'react-router-dom';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import arrowleftlogin from '../assets/img/arrowleftlogin.png';
import arrowrightlogin from '../assets/img/arrowrightlogin.png';
import { useState } from 'react';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Вход:', formData);
    };

    return (
        <div className="bg-white">
            <section className="pt-24">
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
                                    <span className="bg-[#327BF0] px-6 py-3 rounded-lg inline-block">Войти в аккаунт</span>
                                </h1>
                                
                                <img
                                    src={arrowrightlogin}
                                    alt="Декоративная стрелка"
                                    className="w-32 h-32 object-contain"
                                />
                            </div>

                            <p className="text-3xl md:text-4xl font-bold text-black leading-relaxed mb-6">
                                Войдите в свою учетную запись, чтобы получить доступ к событиям, группам и чатам
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <FormInput
                                    label="Почта"
                                    placeholder="Введите почту"
                                    value={formData.email}
                                    onChange={handleInputChange('email')}
                                    type="email"
                                />

                                <FormInput
                                    label="Пароль"
                                    placeholder="Введите пароль"
                                    value={formData.password}
                                    onChange={handleInputChange('password')}
                                    type="password"
                                />
                            </div>

                            <div className="text-center mb-6">
                                <p className="text-lg text-gray-700">
                                    Нет аккаунта?{' '}
                                    <Link 
                                        to="/register" 
                                        className="text-[#323FF0] hover:text-[#2a35cc] font-medium underline"
                                    >
                                        Зарегистрируйтесь
                                    </Link>
                                </p>
                            </div>

                            <Button
                                type="submit"
                                className="w-full py-4 text-lg text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-lg"
                            >
                                Войти в аккаунт
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Login;