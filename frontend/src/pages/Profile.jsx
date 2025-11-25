import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import exclamationIcon from '../assets/img/exclamation.png';
import emailIcon from '../assets/img/emailimg.png';
import penIcon from '../assets/img/pen.png';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const [isEditingName, setIsEditingName] = useState(false);
    const [isEditingAbout, setIsEditingAbout] = useState(false);
    const [name, setName] = useState(user?.name || '');
    const [about, setAbout] = useState(user?.about || 'we live in a society');

    const [visitedEvents, setVisitedEvents] = useState([
        {
            id: 1,
            title: "Ежегодная конференция руководителей",
            date: "18 сентября, 2025",
        },
        {
            id: 2,
            title: "Встреча технологических новаторов",
            date: "12 июля, 2025",
        }
    ]);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const handleNameSave = () => {
        setIsEditingName(false);
        console.log('Новое имя:', name);
    };

    const handleAboutSave = () => {
        setIsEditingAbout(false);
        console.log('Новое описание:', about);
    };

    const handlePhotoUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            console.log('Загружаем фото:', file);
        }
    };

    return (
        <div className="min-h-screen bg-white pt-20">
            <div className="container mx-auto py-8">

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-4xl font-bold text-white">
                                    <span className="bg-[#327BF0] px-6 py-3 rounded-lg inline-block">
                                        Информация об аккаунте
                                    </span>
                                </h2>
                                <img src={exclamationIcon} alt="Info" className="w-12 h-12" />
                            </div>

                            <div className="space-y-6">
                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Имя</label>
                                    {isEditingName ? (
                                        <div className="flex gap-2 items-center">
                                            <input
                                                type="text"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                                onKeyPress={(e) => e.key === 'Enter' && handleNameSave()}
                                                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#327BF0]"
                                                autoFocus
                                            />
                                            <button
                                                onClick={handleNameSave}
                                                className="bg-[#327BF0] text-white px-4 py-2 rounded-lg hover:bg-[#2a35cc]"
                                            >
                                                ✓
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center justify-between w-full">
                                                <p className="text-lg text-gray-900">{name}</p>
                                                <button
                                                    onClick={() => setIsEditingName(true)}
                                                    className="hover:opacity-70 transition-opacity ml-4"
                                                >
                                                    <img src={penIcon} alt="Редактировать" className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="relative">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Почта</label>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center justify-between w-full">
                                            <p className="text-lg text-gray-900">{user?.email}</p>
                                            <button
                                                onClick={() => { }}
                                                className="hover:opacity-70 transition-opacity ml-4"
                                            >
                                                <img src={penIcon} alt="Редактировать" className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-6">
                            <div className="flex items-center gap-3 mb-6">
                                <h2 className="text-4xl font-bold text-white">
                                    <span className="bg-[#327BF0] px-6 py-3 rounded-lg inline-block">
                                        О себе
                                    </span>
                                </h2>
                                <img src={emailIcon} alt="About" className="w-12 h-12" />
                            </div>

                            {isEditingAbout ? (
                                <div className="space-y-3">
                                    <textarea
                                        value={about}
                                        onChange={(e) => setAbout(e.target.value)}
                                        rows="4"
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#327BF0]"
                                        autoFocus
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleAboutSave}
                                            className="bg-[#327BF0] text-white px-4 py-2 rounded-lg hover:bg-[#2a35cc]"
                                        >
                                            Сохранить
                                        </button>
                                        <button
                                            onClick={() => setIsEditingAbout(false)}
                                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start justify-between w-full">
                                        <p className="text-lg text-gray-700 flex-1">{about}</p>
                                        <button
                                            onClick={() => setIsEditingAbout(true)}
                                            className="hover:opacity-70 transition-opacity ml-4 mt-1"
                                        >
                                            <img src={penIcon} alt="Редактировать" className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white rounded-lg p-6 text-center">
                            <div className="w-48 h-48 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center">
                                {user?.avatar_url ? (
                                    <img
                                        src={user.avatar_url}
                                        alt="Profile"
                                        className="w-48 h-48 rounded-full object-cover"
                                    />
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                    </svg>
                                )}
                            </div>

                            <label className="block">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handlePhotoUpload}
                                    className="hidden"
                                />
                                <span className="border-2 border-[#323FF0] text-[#323FF0] px-6 py-3 rounded-lg cursor-pointer hover:bg-[#323FF0] hover:text-white transition-colors inline-block">
                                    Загрузить фото
                                </span>
                            </label>
                            <p className="text-sm text-gray-500 mt-2">JPG, PNG до 5MB</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12">

                    {visitedEvents.length > 0 ? (
                        <div className="space-y-0">
                            {visitedEvents.map((event, index) => (
                                <div key={event.id} className="w-full">
                                    <div className="hover:bg-gray-50 transition-colors duration-200 flex items-center justify-between py-6 px-4">
                                        <div className="flex justify-start">
                                            <span className="bg-[#323FF0] text-white px-4 py-2 rounded-lg text-lg font-medium">
                                                {event.title}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-lg text-gray-700">{event.date}</span>
                                        </div>
                                    </div>
                                    {/* Добавляем разделительную линию между событиями */}
                                    {index < visitedEvents.length - 1 && (
                                        <div className="border-t border-gray-200"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-gray-50 rounded-lg">
                            <div className="max-w-md mx-auto">
                                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Вы еще не посетили ни одно событие</h3>
                                <p className="text-gray-600 mb-4">Присоединяйтесь к событиям и встречайте новых людей!</p>
                                <Link
                                    to="/events"
                                    className="bg-[#323FF0] text-white px-6 py-3 rounded-lg hover:bg-[#2a35cc] transition-colors inline-block"
                                >
                                    Перейти к событиям
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;