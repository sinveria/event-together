import { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from '../components/Button';
import EventCard from '../components/EventCard';
import EventMap from '../components/EventMap';
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
  latitude?: number | null;
  longitude?: number | null;
}

const Events = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeFilter, setActiveFilter] = useState<string | number>('all');
  const [priceMin, setPriceMin] = useState<string>('');
  const [priceMax, setPriceMax] = useState<string>('');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');
  const [sortBy, setSortBy] = useState<'date' | 'price' | 'title' | 'created_at'>('date');
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [page, setPage] = useState<number>(1);
  const [limit] = useState<number>(10);
  const [total, setTotal] = useState<number>(0);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const pageParam = searchParams.get('page');
    const sortParam = searchParams.get('sort_by');
    const orderParam = searchParams.get('order');
    const searchParam = searchParams.get('search');
    const categoryParam = searchParams.get('category_id');
    const priceMinParam = searchParams.get('price_min');
    const priceMaxParam = searchParams.get('price_max');
    const dateFromParam = searchParams.get('date_from');
    const dateToParam = searchParams.get('date_to');

    if (pageParam) setPage(Number(pageParam));
    if (sortParam === 'date' || sortParam === 'price' || sortParam === 'title' || sortParam === 'created_at') {
      setSortBy(sortParam);
    }
    if (orderParam === 'asc' || orderParam === 'desc') {
      setOrder(orderParam);
    }
    if (searchParam) setSearchTerm(searchParam);
    if (categoryParam) setActiveFilter(Number(categoryParam));
    if (priceMinParam) setPriceMin(priceMinParam);
    if (priceMaxParam) setPriceMax(priceMaxParam);
    if (dateFromParam) setDateFrom(dateFromParam);
    if (dateToParam) setDateTo(dateToParam);
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAllEvents({
        skip: (page - 1) * limit,
        limit,
        search: searchTerm || undefined,
        category_id: activeFilter !== 'all' && activeFilter !== 'none' ? Number(activeFilter) : undefined,
        sort_by: sortBy,
        order,
        price_min: priceMin ? Number(priceMin) : undefined,
        price_max: priceMax ? Number(priceMax) : undefined,
        date_from: dateFrom || undefined,
        date_to: dateTo || undefined,
      });

      setEvents(response.data.items);
      setTotal(response.data.total);
      setError(null);
    } catch (err) {
      console.error('Ошибка при загрузке событий:', err);
      setError('Не удалось загрузить события. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [page, searchTerm, activeFilter, sortBy, order, priceMin, priceMax, dateFrom, dateTo]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (sortBy !== 'date') params.set('sort_by', sortBy);
    if (order !== 'asc') params.set('order', order);
    if (searchTerm) params.set('search', searchTerm);
    if (activeFilter !== 'all') params.set('category_id', activeFilter.toString());
    if (priceMin) params.set('price_min', priceMin);
    if (priceMax) params.set('price_max', priceMax);
    if (dateFrom) params.set('date_from', dateFrom);
    if (dateTo) params.set('date_to', dateTo);
    
    navigate(`?${params.toString()}`, { replace: true });
  }, [page, sortBy, order, searchTerm, activeFilter, priceMin, priceMax, dateFrom, dateTo, navigate]);

  const formatEventForCard = (event: ApiEvent): FormattedEvent => {
    const date = new Date(event.date);
    const formattedDate = date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' });
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
      category_name: event.category_name || null,
      latitude: event.latitude,
      longitude: event.longitude
    };
  };

  const handleSortChange = (newSortBy: 'date' | 'price' | 'title' | 'created_at') => {
    if (sortBy === newSortBy) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setOrder('asc');
    }
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    const totalPages = Math.ceil(total / limit);
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSearchChange = (value: string) => { setSearchTerm(value); setPage(1); };
  const handleFilterChange = (filter: string | number) => { setActiveFilter(filter); setPage(1); };
  const handlePriceMinChange = (value: string) => { setPriceMin(value); setPage(1); };
  const handlePriceMaxChange = (value: string) => { setPriceMax(value); setPage(1); };
  const handleDateFromChange = (value: string) => { setDateFrom(value); setPage(1); };
  const handleDateToChange = (value: string) => { setDateTo(value); setPage(1); };

  const handleResetFilters = () => {
    setSearchTerm('');
    setActiveFilter('all');
    setPriceMin('');
    setPriceMax('');
    setDateFrom('');
    setDateTo('');
    setPage(1);
  };

  const totalPages = Math.ceil(total / limit);

  const mapEvents = events
    .filter(e => e.latitude && e.longitude)
    .map(event => ({
      id: event.id,
      title: event.title,
      latitude: event.latitude ?? null,
      longitude: event.longitude ?? null,
      location: event.location || 'Адрес не указан'
    }));

  return (
    <div className="min-h-screen bg-white">
      <Helmet>
        <title>События | EventTogether</title>
        <meta 
          name="description" 
          content="Найдите интересные события и мероприятия в вашем городе. Присоединяйтесь к событиям и встречайте новых людей!"
        />
        <meta 
          name="keywords" 
          content="события, мероприятия, встречи, конференции, концерты, Москва, Санкт-Петербург"
        />
        
        <meta property="og:title" content="События | EventTogether" />
        <meta 
          property="og:description" 
          content="Найдите интересные события и мероприятия"
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://eventtogether.ru/events" />
        <meta property="og:image" content="https://eventtogether.ru/og-image.jpg" />
        
        <link rel="canonical" href="https://eventtogether.ru/events" />
      </Helmet>

      <section className="pt-32 pb-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-6 mb-12 relative">
              <img src={arrowone} alt="Стрелка" className="w-24 h-24 object-contain absolute left-0" />
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
              <img src={arrowtwo} alt="Стрелка" className="w-24 h-24 object-contain absolute right-0 -top-8" />
            </div>
            {canCreateEvent(user?.role) ? (
              <Button as={Link} to="/create-event" className="px-8 py-4 text-lg text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-full">
                Создать событие
              </Button>
            ) : (
              <Button as={Link} to="/login" className="px-8 py-4 text-lg text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-full">
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
              <SearchBar searchTerm={searchTerm} onSearchChange={handleSearchChange} />
            </div>
            <FilterButtons activeFilter={activeFilter} onFilterChange={handleFilterChange} />
            
            <div className="w-full max-w-4xl bg-gray-50 p-6 rounded-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-700">Расширенные фильтры</h3>
                <button onClick={handleResetFilters} className="text-sm text-[#323FF0] hover:text-[#2a35cc] font-medium">
                  Сбросить все
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Цена от (₽)</label>
                  <input type="number" min="0" value={priceMin} onChange={(e) => handlePriceMinChange(e.target.value)} placeholder="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#323FF0]" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Цена до (₽)</label>
                  <input type="number" min="0" value={priceMax} onChange={(e) => handlePriceMaxChange(e.target.value)} placeholder="10000" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#323FF0]" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Дата от</label>
                  <input type="date" value={dateFrom} onChange={(e) => handleDateFromChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#323FF0]" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-600">Дата до</label>
                  <input type="date" value={dateTo} onChange={(e) => handleDateToChange(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#323FF0]" />
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 mt-4">
              <span className="text-gray-600 font-medium">Сортировать:</span>
              <select value={sortBy} onChange={(e) => handleSortChange(e.target.value as 'date' | 'price' | 'title' | 'created_at')} className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#323FF0] bg-white">
                <option value="date">По дате</option>
                <option value="price">По цене</option>
                <option value="title">По названию</option>
                <option value="created_at">По дате создания</option>
              </select>
              <button onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition" title={order === 'asc' ? 'По возрастанию' : 'По убыванию'}>
                {order === 'asc' ? '↑' : '↓'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">
            События на карте
          </h2>
          {mapEvents.length > 0 ? (
            <EventMap events={mapEvents} height="500px" />
          ) : (
            <div className="text-center py-12 bg-white rounded-lg">
              <p className="text-gray-500">
                Нет событий с координатами для отображения на карте
              </p>
            </div>
          )}
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
            <>
              <div className="border-t border-gray-200">
                {events.map((event: ApiEvent) => (
                  <EventCard key={event.id} event={formatEventForCard(event)} />
                ))}
              </div>
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                  <button onClick={() => handlePageChange(page - 1)} disabled={page === 1} className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition">
                    ← Назад
                  </button>
                  <span className="px-4 py-2 text-gray-700 font-medium">
                    Страница {page} из {totalPages} (Всего: {total})
                  </span>
                  <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages} className="px-4 py-2 rounded-lg bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition">
                    Вперед →
                  </button>
                </div>
              )}
              {events.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-xl text-gray-500">
                    Мероприятия не найдены. {searchTerm ? 'Попробуйте изменить параметры поиска.' : 'Будьте первым, создайте событие!'}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <section className="pb-20 bg-white">
        <div className="mx-48">
          <div className="flex items-center gap-4 mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-black">Как это работает</h2>
            <img src={question} alt="Вопрос" className="w-24 h-24 object-contain" />
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