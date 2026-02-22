import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/Button';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import FilterButtons from '../components/FilterButtons';
import arrowone from '../assets/img/arrowone.png';
import arrowtwo from '../assets/img/arrowtwo.png';
import question from '../assets/img/question.png';
import { eventsAPI, Event as ApiEvent } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { canCreateEvent } from '../utils/permissions';

interface FormattedEvent {
  id: number;
  title: string;
  date: string;
  fullDate: string;
  description: string;
  location: string;
  price: number;
  maxParticipants: number;
  organizer: string;
  category_id: number | null;
  category_name: string | null;
}

const Events = () => {
  const { user } = useAuth();
  
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string | number>('all');
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await eventsAPI.getAllEvents();
        setEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Ошибка при загрузке событий:', err);
        setError('Не удалось загрузить события. Попробуйте позже.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  const formatEventForCard = (event: ApiEvent): FormattedEvent => {
    const date = new Date(event.date);
    const formattedDate = date.toLocaleDateString('ru-RU', {
      day: 'numeric',
      month: 'long'
    });

    const fullDate = date.toLocaleString('ru-RU', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return {
      id: event.id,
      title: event.title,
      date: formattedDate,
      fullDate: fullDate,
      description: event.description || 'Описание отсутствует',
      location: event.location || 'Место не указано',
      price: event.price || 0,
      maxParticipants: event.max_participants || 0,
      organizer: event.organizer_name || event.organizer || 'Неизвестно',
      category_id: event.category_id || null,
      category_name: event.category_name || null
    };
  };

  const filteredEvents: FormattedEvent[] = events
    .map(formatEventForCard)
    .filter((event: FormattedEvent) => {
      const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter = activeFilter === 'all' ||
        (activeFilter === 'none' && !event.category_name) ||
        event.category_id === activeFilter;

      return matchesSearch && matchesFilter;
    });

  return (
    <div className="min-h-screen bg-white">
      <section className="pt-32 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-6 mb-12 relative">
              <img
                src={arrowone}
                alt="Стрелка"
                className="w-24 h-24 object-contain absolute left-0"
              />

              <h1 className="text-4xl md:text-5xl font-bold text-white">
                <span className="bg-[#327BF0] px-6 py-3 rounded-lg inline-block">Предстоящие события</span>
              </h1>
            </div>

            <div className="flex items-center justify-center gap-6 mb-8 relative">
              <p className="text-3xl md:text-4xl font-bold text-black leading-relaxed">
                Просматривайте мероприятия<br />
                и присоединяйтесь к ним<br />
                или создайте свое событие
              </p>

              <img
                src={arrowtwo}
                alt="Стрелка"
                className="w-24 h-24 object-contain absolute right-0 -top-8"
              />
            </div>

            {canCreateEvent(user?.role) ? (
              <Button
                as={Link}
                to="/create-event"
                className="px-8 py-4 text-lg text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-full"
              >
                Создать событие
              </Button>
            ) : (
              <Button
                as={Link}
                to="/login"
                className="px-8 py-4 text-lg text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full"
              >
                Войдите для создания
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="pb-12 bg-white">
        <div className="mx-48">
          <div className="flex flex-col items-center gap-6">
            <div className="max-w-md w-full">
              <SearchBar
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
              />
            </div>

            <FilterButtons
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="mx-48">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-500">Загрузка событий...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-xl text-red-500">{error}</p>
            </div>
          ) : (
            <div className="border-t border-gray-200">
              {filteredEvents.map((event: FormattedEvent) => (
                <EventCard key={event.id} event={event} />
              ))}

              {filteredEvents.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-500">
                    Мероприятия не найдены. {searchTerm ? 'Попробуйте изменить параметры поиска.' : 'Будьте первым, создайте событие!'}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="mx-48">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black">
              Как это работает
            </h2>
            <img
              src={question}
              alt="Вопрос"
              className="w-24 h-24 object-contain"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg text-gray-700 leading-relaxed">
                Присоединяйтесь к любому мероприятию, нажав на его название, и посмотрите, кто еще его посещает. Пригласите друзей или познакомьтесь с новыми людьми с общими интересами.
              </p>
            </div>
            <div>
              <p className="text-lg text-gray-700 leading-relaxed">
                На всех мероприятиях отображаются важные детали, такие как дата, местоположение и краткое описание, которые помогут вам выбрать то, что подходит именно вам.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Events;