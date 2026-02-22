import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import GroupCard from '../components/GroupCard';
import { groupsAPI, Group as ApiGroup } from '../services/api';

interface TransformedGroup {
  id: number;
  name: string;
  membersCount: number;
  upcomingEvents: number;
  description: string;
  tags: string[];
  nextEventDate?: string;
  organizer: string;
  events: string[];
  activity: {
    messages: string;
    online: number;
  };
  is_open: boolean;
  max_members: number;
  current_user_is_member?: boolean;
}

const Groups = () => {
  const [groups, setGroups] = useState<ApiGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadGroups();
  }, []);

  const loadGroups = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);

      const response = await groupsAPI.getGroups();
      setGroups(response.data);
    } catch (err) {
      console.error('Ошибка загрузки групп:', err);
      setError('Не удалось загрузить список групп. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  const transformGroupData = (group: ApiGroup): TransformedGroup => ({
    id: group.id,
    name: group.name,
    membersCount: group.members_count || 1,
    upcomingEvents: 1,
    description: group.description || 'Без описания',
    tags: [
      group.is_open ? 'открытая' : 'закрытая',
      `макс. ${group.max_members} чел.`
    ],
    nextEventDate: 'Скоро',
    organizer: group.organizer_name || 'Организатор',
    events: [group.event?.title || 'Событие'],
    activity: {
      messages: '0',
      online: 0
    },
    is_open: group.is_open,
    max_members: group.max_members ?? 10
  });

  const handleGroupUpdate = (): void => {
    loadGroups();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <section className="bg-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
                <span className="bg-[#327BF0] px-6 py-3 rounded-lg inline-block">Группы по событиям</span>
              </h1>

              <p className="text-3xl md:text-4xl font-bold text-black leading-relaxed mb-6">
                Присоединяйтесь к группам и посещайте<br />
                мероприятия вместе с единомышленниками
              </p>
            </div>

            <div className="flex justify-center gap-4">
              <Button
                as={Link}
                to="/create-group"
                className="px-6 py-3 text-base text-white bg-[#327BF0] hover:bg-[#2a6ac9] rounded-full"
              >
                Создать группу
              </Button>
              <Button
                as={Link}
                to="/events"
                className="px-6 py-3 text-base text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-full"
              >
                Смотреть события
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Активные группы
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Выберите группу по интересам и присоединяйтесь к обсуждениям и мероприятиям
            </p>
          </div>

          {error && (
            <div className="text-center py-12 text-red-600">
              <p>{error}</p>
            </div>
          )}

          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-gray-500">Загрузка групп...</p>
            </div>
          ) : groups.length > 0 ? (
            <div className="space-y-6">
              {groups.map((group: ApiGroup) => (
                <GroupCard
                  key={group.id}
                  group={transformGroupData(group)}
                  onUpdate={handleGroupUpdate}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="max-w-md mx-auto">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Групп пока нет</h3>
                <p className="text-gray-600 mb-6">
                  Будьте первым, кто создаст группу для совместного посещения событий!
                </p>
                <Button
                  as={Link}
                  to="/create-group"
                  className="px-6 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
                >
                  Создать первую группу
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Groups;