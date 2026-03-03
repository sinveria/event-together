import { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import createeventleft from '../assets/img/createeventleft.png';
import createeventright from '../assets/img/createeventright.png';
import { groupsAPI, eventsAPI, Event } from '../services/api';

interface GroupFormData {
    name: string;
    description: string;
    event_id: string | number;
    max_members: number;
    is_open: boolean;
}

interface FormErrors {
    name?: string;
    description?: string;
    event_id?: string;
    max_members?: string;
    is_open?: string;
    submit?: string;
}

const CreateGroupPage = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();

    const [formData, setFormData] = useState<GroupFormData>({
        name: '',
        description: '',
        event_id: '',
        max_members: 10,
        is_open: true
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [loading, setLoading] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>('');
    const [events, setEvents] = useState<Event[]>([]);
    const [loadingEvents, setLoadingEvents] = useState<boolean>(true);

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        loadEvents();
    }, [isAuthenticated, navigate]);

    const loadEvents = async (): Promise<void> => {
        try {
            setLoadingEvents(true);
            const eventsResponse = await eventsAPI.getAllEvents();
            setEvents(eventsResponse.data);
        } catch (error) {
            console.error('Ошибка загрузки событий:', error);
            setErrors({ submit: 'Не удалось загрузить список событий' });
        } finally {
            setLoadingEvents(false);
        }
    };

    const handleInputChange = (field: keyof GroupFormData) => (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { value, type, checked } = e.target as HTMLInputElement;
        setFormData(prev => ({
            ...prev,
            [field]: type === 'checkbox' ? checked : value
        }));

        if (field !== 'is_open' && errors[field as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [field]: '' }));
        }
    };

    const handleNumberChange = (field: keyof GroupFormData) => (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const value = parseInt(e.target.value) || 0;
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSelectChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const value = e.target.value;
        setFormData(prev => ({
            ...prev,
            event_id: value
        }));
        if (errors.event_id) {
            setErrors(prev => ({ ...prev, event_id: '' }));
        }
    };

    const validateForm = (): FormErrors => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Введите название группы';
        } else if (formData.name.length < 3) {
            newErrors.name = 'Название должно быть не менее 3 символов';
        }

        if (!formData.event_id) {
            newErrors.event_id = 'Выберите событие';
        }

        if (formData.max_members < 2) {
            newErrors.max_members = 'Минимальное количество участников - 2';
        } else if (formData.max_members > 100) {
            newErrors.max_members = 'Максимальное количество участников - 100';
        }

        return newErrors;
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!isAuthenticated) {
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
            const groupData = {
                ...formData,
                event_id: parseInt(formData.event_id.toString()),
                max_members: parseInt(formData.max_members.toString())
            };

            const response = await groupsAPI.createGroup(groupData);

            if (response.status === 201 || response.status === 200) {
                setSuccessMessage('Группа успешно создана!');

                setFormData({
                    name: '',
                    description: '',
                    event_id: '',
                    max_members: 10,
                    is_open: true
                });

                setTimeout(() => {
                    navigate('/groups');
                }, 2000);
            }
        } catch (error) {
            console.error('Ошибка при создании группы:', error);

            const axiosError = error as { response?: { status?: number; data?: { detail?: string } } };

            if (axiosError.response?.status === 401) {
                navigate('/login');
            } else if (axiosError.response?.data?.detail) {
                setErrors({ submit: axiosError.response.data.detail });
            } else {
                setErrors({ submit: 'Ошибка при создании группы. Попробуйте еще раз.' });
            }
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Необходима авторизация</h2>
                    <p className="text-gray-600 mb-6">Для создания группы войдите в систему</p>
                    <Button
                        onClick={() => navigate('/login')}
                        className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                        Войти
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <section className="pt-32 pb-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
                                <span className="bg-[#327BF0] px-6 py-3 rounded-lg inline-block">
                                    Создайте группу
                                </span>
                            </h1>

                            <p className="text-3xl md:text-4xl font-bold text-black leading-relaxed">
                                Создайте группу, чтобы совместно посещать<br />
                                мероприятия с единомышленниками
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
                                    label="Название группы"
                                    placeholder="Введите название группы"
                                    value={formData.name}
                                    onChange={handleInputChange('name')}
                                    error={errors.name}
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
                                placeholder="Опишите цели группы и тематику"
                                value={formData.description}
                                onChange={handleInputChange('description')}
                                isTextarea={true}
                                error={errors.description}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <FormInput
                                    label="Событие для группы"
                                    placeholder="Выберите событие"
                                    value={formData.event_id.toString()}
                                    onChange={handleSelectChange}
                                    isSelect={true}
                                    options={events.map((event: Event) => ({
                                        id: event.id,
                                        value: event.id.toString(),
                                        name: `${event.title} (${event.date ? new Date(event.date).toLocaleDateString('ru-RU') : ''})`
                                    }))}
                                    error={errors.event_id}
                                    required
                                    disabled={loadingEvents}
                                />

                                <FormInput
                                    label="Максимум участников"
                                    placeholder="10"
                                    value={formData.max_members.toString()}
                                    onChange={handleNumberChange('max_members')}
                                    type="number"
                                    min="2"
                                    max="100"
                                    step="1"
                                    error={errors.max_members}
                                    required
                                />
                            </div>

                            <div className="mb-6">
                                <div className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id="is_open"
                                        checked={formData.is_open}
                                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                            handleInputChange('is_open')(e as unknown as ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>)
                                        }
                                        className="h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
                                    />
                                    <label htmlFor="is_open" className="ml-3 text-sm text-gray-700">
                                        Открытая группа (новые участники могут присоединяться)
                                    </label>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                disabled={loading || loadingEvents}
                                className={`w-full py-4 text-lg text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-lg mt-6 ${loading || loadingEvents ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                            >
                                {loading ? 'Создание...' : loadingEvents ? 'Загрузка событий...' : 'Создать группу'}
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

export default CreateGroupPage;