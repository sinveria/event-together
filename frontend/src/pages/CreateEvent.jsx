import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import createeventleft from '../assets/img/createeventleft.png';
import createeventright from '../assets/img/createeventright.png';
import { eventsAPI, categoriesAPI } from '../services/api';

const CreateEvent = () => {
    const navigate = useNavigate();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        location: '',
        price: 0,
        max_participants: 10,
        category_id: ''
    });

    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoadingCategories(true);
                const response = await categoriesAPI.getCategories();
                setCategories(response.data);
            } catch (error) {
                console.error('Ошибка загрузки категорий:', error);
            } finally {
                setLoadingCategories(false);
            }
        };

        loadCategories();
    }, []);

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleNumberChange = (field) => (e) => {
        const value = parseFloat(e.target.value) || 0;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleCategoryChange = (e) => {
        const value = e.target.value === '' ? null : parseInt(e.target.value);
        setFormData(prev => ({
            ...prev,
            category_id: value
        }));
        if (errors.category_id) {
            setErrors(prev => ({ ...prev, category_id: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.title.trim()) newErrors.title = 'Введите название события';
        if (!formData.description.trim()) newErrors.description = 'Введите описание';
        if (!formData.date) newErrors.date = 'Выберите дату и время';
        if (!formData.location.trim()) newErrors.location = 'Введите местоположение';
        if (formData.max_participants < 1) newErrors.max_participants = 'Минимум 1 участник';
        if (formData.price < 0) newErrors.price = 'Цена не может быть отрицательной';

        if (formData.date) {
            const eventDate = new Date(formData.date);
            const now = new Date();
            if (eventDate <= now) {
                newErrors.date = 'Дата должна быть в будущем';
            }
        }

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            alert('Для создания события необходимо войти в систему');
            navigate('/login');
            return;
        }

        const validationErrors = validateForm();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        try {
            const eventData = {
                ...formData,
                date: new Date(formData.date).toISOString(),
                price: parseFloat(formData.price) || 0,
                max_participants: parseInt(formData.max_participants) || 10,
                category_id: formData.category_id || null
            };

            const response = await eventsAPI.createEvent(eventData);

            if (response.status === 201 || response.status === 200) {
                setSuccessMessage('Событие успешно создано!');

                setFormData({
                    title: '',
                    description: '',
                    date: '',
                    location: '',
                    price: 0,
                    max_participants: 10,
                    category_id: ''
                });

                setTimeout(() => {
                    setSuccessMessage('');
                }, 5000);
            }
        } catch (error) {
            console.error('Ошибка при создании события:', error);

            if (error.response?.status === 401) {
                alert('Сессия истекла. Пожалуйста, войдите снова.');
                navigate('/login');
            } else if (error.response?.data?.detail) {
                setErrors({ submit: error.response.data.detail });
            } else {
                setErrors({ submit: 'Ошибка при создании события. Попробуйте еще раз.' });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            <section className="pt-32 pb-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
                                <span className="bg-[#327BF0] px-6 py-3 rounded-lg inline-block">
                                    Создайте событие
                                </span>
                            </h1>

                            <p className="text-3xl md:text-4xl font-bold text-black leading-relaxed">
                                Создайте событие, чтобы к вашей компании<br />
                                присоединились
                            </p>
                        </div>

                        {successMessage && (
                            <div className="mb-6 max-w-md mx-auto">
                                <div className="p-4 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium">{successMessage}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {errors.submit && (
                            <div className="mb-6 max-w-md mx-auto">
                                <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                                    <div className="flex items-center">
                                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                        </svg>
                                        <span className="font-medium">{errors.submit}</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg relative">
                            <div className="relative mb-4">
                                <FormInput
                                    label="Название события"
                                    placeholder="Введите название события"
                                    value={formData.title}
                                    onChange={handleInputChange('title')}
                                    error={errors.title}
                                    required
                                />

                                <img
                                    src={createeventleft}
                                    alt="Декоративное изображение"
                                    className="absolute -left-24 -top-40 w-32 h-32 object-contain hidden lg:block"
                                />

                                <img
                                    src={createeventright}
                                    alt="Декоративное изображение"
                                    className="absolute -right-24 -top-40 w-32 h-32 object-contain hidden lg:block"
                                />
                            </div>

                            <FormInput
                                label="Описание"
                                placeholder="Опишите ваше событие"
                                value={formData.description}
                                onChange={handleInputChange('description')}
                                isTextarea={true}
                                rows="4"
                                error={errors.description}
                                required
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <FormInput
                                    label="Дата и время"
                                    placeholder=""
                                    value={formData.date}
                                    onChange={handleInputChange('date')}
                                    type="datetime-local"
                                    error={errors.date}
                                    required
                                />

                                <FormInput
                                    label="Местоположение"
                                    placeholder="Где будет проходить событие?"
                                    value={formData.location}
                                    onChange={handleInputChange('location')}
                                    error={errors.location}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <FormInput
                                    label="Цена (₽)"
                                    placeholder="0.00"
                                    value={formData.price}
                                    onChange={handleNumberChange('price')}
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    error={errors.price}
                                />

                                <FormInput
                                    label="Максимум участников"
                                    placeholder="10"
                                    value={formData.max_participants}
                                    onChange={handleNumberChange('max_participants')}
                                    type="number"
                                    min="1"
                                    step="1"
                                    error={errors.max_participants}
                                    required
                                />
                            </div>

                            <FormInput
                                label="Категория (необязательно)"
                                placeholder="Выберите категорию..."
                                value={formData.category_id || ''}
                                onChange={handleCategoryChange}
                                isSelect={true}
                                options={categories.map(category => ({
                                    id: category.id,
                                    name: category.name
                                }))}
                                error={errors.category_id}
                                disabled={loadingCategories}
                            />

                            <Button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-4 text-lg text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-lg mt-6 ${
                                    loading ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                            >
                                {loading ? 'Создание...' : 'Создать событие'}
                            </Button>

                            <p className="text-sm text-gray-500 mt-4">
                                * Поля, обязательные для заполнения
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CreateEvent;