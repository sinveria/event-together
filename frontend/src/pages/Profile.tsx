import { useState, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import exclamationIcon from '../assets/img/exclamation.png';
import emailIcon from '../assets/img/emailimg.png';
import penIcon from '../assets/img/pen.png';
import { userAPI, User } from '../services/api';

interface VisitedEvent {
  id: number;
  title: string;
  date: string;
}

const Profile = () => {
  const { user, logout, updateUser } = useAuth();
  const navigate = useNavigate();

  const [isEditingName, setIsEditingName] = useState<boolean>(false);
  const [isEditingAbout, setIsEditingAbout] = useState<boolean>(false);
  const [name, setName] = useState<string>('');
  const [about, setAbout] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadingAvatar, setUploadingAvatar] = useState<boolean>(false);

  const [visitedEvents, setVisitedEvents] = useState<VisitedEvent[]>([
    { id: 1, title: "Ежегодная конференция руководителей", date: "18 сентября, 2025" },
    { id: 2, title: "Встреча технологических новаторов", date: "12 июля, 2025" }
  ]);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setAbout((user as User & { about?: string }).about || 'Расскажите о себе...');
    }
  }, [user]);

  const handleLogout = (): void => {
    logout();
    navigate('/login');
  };

  const handleNameSave = async (): Promise<void> => {
    if (!name.trim()) {
      setError('Имя не может быть пустым');
      return;
    }
    try {
      setIsSaving(true);
      setError(null);
      await userAPI.updateProfile({ name: name.trim() });
      if (updateUser) updateUser({ name: name.trim() });
      setIsEditingName(false);
    } catch (err: any) {
      setError('Ошибка: ' + (err.response?.data?.detail || err.message || 'Неизвестная ошибка'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleAboutSave = async (): Promise<void> => {
    try {
      setIsSaving(true);
      setError(null);
      await userAPI.updateProfile({ about: about.trim() });
      if (updateUser) updateUser({ about: about.trim() });
      setIsEditingAbout(false);
    } catch (err: any) {
      setError('Ошибка: ' + (err.response?.data?.detail || err.message || 'Неизвестная ошибка'));
    } finally {
      setIsSaving(false);
    }
  };

  const handlePhotoUpload = async (event: ChangeEvent<HTMLInputElement>): Promise<void> => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setError('Разрешены только JPG, PNG, WebP');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Максимальный размер файла — 5MB');
      return;
    }

    try {
      setUploadingAvatar(true);
      setError(null);
      
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await userAPI.uploadAvatar(formData);
      
      if (updateUser) {
        updateUser({ avatar_url: response.data.avatar_url });
      }
    } catch (err: any) {
      setError('Ошибка загрузки: ' + (err.response?.data?.detail || err.message || 'Неизвестная ошибка'));
    } finally {
      setUploadingAvatar(false);
      event.target.value = '';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <p className="text-gray-600">Загрузка профиля...</p>
      </div>
    );
  }

  const avatarUrl = (user as User & { avatar_url?: string }).avatar_url;

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto py-8">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

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
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                        onKeyDown={(e: KeyboardEvent<HTMLInputElement>) => e.key === 'Enter' && handleNameSave()}
                        className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#327BF0]"
                        autoFocus
                        disabled={isSaving}
                      />
                      <button
                        onClick={handleNameSave}
                        disabled={isSaving}
                        className="bg-[#327BF0] text-white px-4 py-2 rounded-lg hover:bg-[#2a35cc] disabled:opacity-50"
                      >
                        {isSaving ? '...' : '✓'}
                      </button>
                      <button
                        onClick={() => setIsEditingName(false)}
                        disabled={isSaving}
                        className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                      >
                        ✗
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between">
                      <p className="text-lg text-gray-900">{name || 'Не указано'}</p>
                      <button
                        onClick={() => setIsEditingName(true)}
                        disabled={isSaving}
                        className="hover:opacity-70 transition-opacity ml-4"
                      >
                        <img src={penIcon} alt="Редактировать" className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Почта</label>
                  <div className="flex items-center justify-between">
                    <p className="text-lg text-gray-900">{user.email || 'Не указана'}</p>
                    <span className="text-sm text-gray-500 ml-4">(изменить нельзя)</span>
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
                    onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setAbout(e.target.value)}
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#327BF0]"
                    autoFocus
                    disabled={isSaving}
                    placeholder="Расскажите о себе..."
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={handleAboutSave}
                      disabled={isSaving}
                      className="bg-[#327BF0] text-white px-4 py-2 rounded-lg hover:bg-[#2a35cc] disabled:opacity-50"
                    >
                      {isSaving ? 'Сохранение...' : 'Сохранить'}
                    </button>
                    <button
                      onClick={() => setIsEditingAbout(false)}
                      disabled={isSaving}
                      className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 disabled:opacity-50"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-start justify-between">
                  <p className="text-lg text-gray-700 flex-1">
                    {about || 'Расскажите о себе...'}
                  </p>
                  <button
                    onClick={() => setIsEditingAbout(true)}
                    disabled={isSaving}
                    className="hover:opacity-70 transition-opacity ml-4 mt-1"
                  >
                    <img src={penIcon} alt="Редактировать" className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 text-center">
              <div className="w-48 h-48 bg-gray-300 rounded-full mx-auto mb-6 flex items-center justify-center overflow-hidden">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/default-avatar.png';
                    }}
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
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handlePhotoUpload}
                  className="hidden"
                  disabled={uploadingAvatar}
                />
                <span className={`border-2 px-6 py-3 rounded-lg cursor-pointer transition-colors inline-block ${
                  uploadingAvatar 
                    ? 'border-gray-400 text-gray-400 cursor-not-allowed' 
                    : 'border-[#323FF0] text-[#323FF0] hover:bg-[#323FF0] hover:text-white'
                }`}>
                  {uploadingAvatar ? 'Загрузка...' : 'Загрузить фото'}
                </span>
              </label>
              <p className="text-sm text-gray-500 mt-2">JPG, PNG, WebP до 5MB</p>
            </div>
          </div>
        </div>

        <div className="mt-12">
          {visitedEvents.length > 0 ? (
            <div className="space-y-0">
              {visitedEvents.map((event: VisitedEvent, index: number) => (
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