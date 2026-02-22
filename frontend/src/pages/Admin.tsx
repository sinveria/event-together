import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import FormInput from '../components/FormInput';
import { adminAPI, User, Event, Group, UserRole } from '../services/api';
import AdminCategories from '../components/AdminCategories';

type ActiveTab = 'users' | 'events' | 'groups' | 'categories';

const Admin = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<ActiveTab>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [dataLoading, setDataLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);

  const filteredUsers = useMemo(() => {
    return users.filter((user) =>
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  const filteredEvents = useMemo(() => {
    return events.filter((event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.organizer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [events, searchTerm]);

  const filteredGroups = useMemo(() => {
    return groups.filter((group) =>
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.organizer_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [groups, searchTerm]);

  useEffect(() => {
    if (authLoading) {
      return;
    }

    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'admin' && user?.role !== 'moderator') {
      navigate('/');
      return;
    }

    loadData();
  }, [user, isAuthenticated, authLoading, navigate, activeTab]);

  const loadData = async (): Promise<void> => {
    try {
      setDataLoading(true);

      if (activeTab === 'users' && user?.role === 'admin') {
        const response = await adminAPI.getUsers();
        setUsers(response.data);
      } else if (activeTab === 'events') {
        const response = await adminAPI.getEvents();
        setEvents(response.data);
      } else if (activeTab === 'groups') {
        const response = await adminAPI.getGroups();
        setGroups(response.data);
      }
    } catch (error) {
      const axiosError = error as { response?: { data?: { detail?: string } }; message?: string };
      alert('Ошибка загрузки данных: ' + (axiosError.response?.data?.detail || axiosError.message || 'Неизвестная ошибка'));
    } finally {
      setDataLoading(false);
    }
  };

  const handleToggleUserActive = async (userId: number): Promise<void> => {
    if (!window.confirm('Вы уверены?')) return;

    try {
      await adminAPI.toggleUserActive(userId);
      loadData();
    } catch (error) {
      alert('Ошибка изменения статуса пользователя');
    }
  };

  const handleDeleteUser = async (userId: number): Promise<void> => {
    if (!window.confirm('Удалить пользователя?')) return;

    try {
      await adminAPI.deleteUser(userId);
      loadData();
    } catch (error) {
      alert('Ошибка удаления пользователя');
    }
  };

  const handleUpdateUserRole = async (userId: number, newRole: UserRole): Promise<void> => {
    try {
      await adminAPI.updateUserRole(userId, newRole);
      loadData();
    } catch (error) {
      alert('Ошибка изменения роли');
    }
  };

  const handleDeleteEvent = async (eventId: number): Promise<void> => {
    if (!window.confirm('Удалить событие?')) return;

    try {
      await adminAPI.deleteEvent(eventId);
      loadData();
    } catch (error) {
      alert('Ошибка удаления события');
    }
  };

  const handleToggleGroupStatus = async (groupId: number): Promise<void> => {
    if (!window.confirm('Изменить статус группы?')) return;

    try {
      await adminAPI.toggleGroupStatus(groupId);
      loadData();
    } catch (error) {
      alert('Ошибка изменения статуса группы');
    }
  };

  const handleDeleteGroup = async (groupId: number): Promise<void> => {
    if (!window.confirm('Удалить группу?')) return;

    try {
      await adminAPI.deleteGroup(groupId);
      loadData();
    } catch (error) {
      alert('Ошибка удаления группы');
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Проверка авторизации...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (user?.role !== 'admin' && user?.role !== 'moderator') {
    return (
      <div className="min-h-screen bg-white pt-20 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Доступ запрещен</h2>
          <p className="text-gray-600">У вас нет прав для доступа к этой странице.</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            На главную
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pt-20">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Административная панель</h1>

        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          {user?.role === 'admin' && (
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-2 px-4 ${activeTab === 'users' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
            >
              Пользователи
            </button>
          )}
          <button
            onClick={() => setActiveTab('events')}
            className={`pb-2 px-4 ${activeTab === 'events' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            События
          </button>
          <button
            onClick={() => setActiveTab('groups')}
            className={`pb-2 px-4 ${activeTab === 'groups' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Группы
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-2 px-4 ${activeTab === 'categories' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
          >
            Категории
          </button>
        </div>

        <div className="mb-6">
          <FormInput
            placeholder="Поиск..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {dataLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-500">Загрузка данных...</p>
          </div>
        ) : (
          <>
            {activeTab === 'users' && user?.role === 'admin' && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Роль</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredUsers.length > 0 ? (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <select
                                value={user.role}
                                onChange={(e) => handleUpdateUserRole(user.id, e.target.value as UserRole)}
                                className="border border-gray-300 rounded px-2 py-1 text-sm"
                                disabled={user.role === 'admin'}
                              >
                                <option value="user">User</option>
                                <option value="moderator">Moderator</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.is_active ? 'Активен' : 'Неактивен'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => handleToggleUserActive(user.id)}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                {user.is_active ? 'Деактивировать' : 'Активировать'}
                              </button>
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900"
                                >
                                  Удалить
                                </button>
                              )}
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                            Пользователи не найдены
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'events' && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Описание</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Место</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Организатор</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredEvents.length > 0 ? (
                        filteredEvents.map((event) => (
                          <tr key={event.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{event.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{event.title}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                              {event.description || 'Нет описания'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {event.date ? new Date(event.date).toLocaleDateString('ru-RU') : '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.location || '—'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{event.organizer_name || '—'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => setEditingEvent(event)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Изменить
                              </button>
                              <button
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Удалить
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                            События не найдены
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'groups' && (
              <div className="bg-white rounded-lg border border-gray-200">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Название</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Описание</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Участников</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Организатор</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата создания</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredGroups.length > 0 ? (
                        filteredGroups.map((group) => (
                          <tr key={group.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{group.id}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{group.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 max-w-xs truncate">
                              {group.description || 'Нет описания'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {group.members_count || 0}/{group.max_members || '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                group.is_open ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {group.is_open ? 'Открытая' : 'Закрытая'}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{group.organizer_name || '—'}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {group.created_at ? new Date(group.created_at).toLocaleDateString('ru-RU') : '—'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                              <button
                                onClick={() => setEditingGroup(group)}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Изменить
                              </button>
                              <button
                                onClick={() => handleToggleGroupStatus(group.id)}
                                className="text-yellow-600 hover:text-yellow-900"
                              >
                                {group.is_open ? 'Закрыть' : 'Открыть'}
                              </button>
                              <button
                                onClick={() => handleDeleteGroup(group.id)}
                                className="text-red-600 hover:text-red-900"
                              >
                                Удалить
                              </button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                            Группы не найдены
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <AdminCategories />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Admin;