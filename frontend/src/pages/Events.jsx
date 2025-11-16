import { Link } from 'react-router-dom';
import Button from '../components/Button';
import EventCard from '../components/EventCard';
import SearchBar from '../components/SearchBar';
import FilterButtons from '../components/FilterButtons';
import arrowone from '../assets/img/arrowone.png';
import arrowtwo from '../assets/img/arrowtwo.png';
import question from '../assets/img/question.png';
import { useState, useMemo } from 'react';

const Events = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('all');

    // заглушки - данные событий для теста верстки
    const events = [
        {
            id: 1,
            title: "Встреча в Художественной галерее",
            date: "25 сентября",
            fullDate: "25 сентября 2026, 19:00",
            description: "Знакомство с современным искусством и обсуждение выставки с куратором",
            location: "Москва, Художественная галерея, ул. Тверская, 25",
            category: 'art'
        },
        {
            id: 2,
            title: "Воскресный поход",
            date: "28 сентября",
            fullDate: "28 сентября 2026, 10:00",
            description: "Пеший поход по живописным местам Подмосковья с пикником",
            location: "Подмосковье, старт от станции Перхушково",
            category: 'sport'
        },
        {
            id: 3,
            title: "Дегустация вина",
            date: "3 октября",
            fullDate: "3 октября 2026, 20:00",
            description: "Знакомство с винными регионами Италии и дегустация лучших сортов",
            location: "Москва, Винный бар 'Бочка', ул. Пятницкая, 42",
            category: 'food'
        },
        {
            id: 4,
            title: "Вечер в книжном клубе",
            date: "6 октября",
            fullDate: "6 октября 2026, 18:30",
            description: "Обсуждение романа 'Мастер и Маргарита' и встреча с литературным критиком",
            location: "Москва, Книжный магазин 'Читай-город', ул. Арбат, 15",
            category: 'education'
        },
        {
            id: 5,
            title: "Фильм на открытом воздухе",
            date: "10 октября",
            fullDate: "10 октября 2026, 21:00",
            description: "Показ классического кино под открытым небом с попкорном и напитками",
            location: "Москва, Парк Горького, летний кинотеатр",
            category: 'art'
        },
        {
            id: 6,
            title: "Фестиваль тайской кухни",
            date: "15 октября",
            fullDate: "15 октября 2026, 19:00",
            description: "Мастер-класс по приготовлению традиционных тайских блюд от шеф-повара",
            location: "Москва, Кулинарная студия 'Восток', ул. Большая Дорогомиловская, 8",
            category: 'food'
        }
    ];

    const filteredEvents = useMemo(() => {
        return events.filter(event => {
            const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                event.description.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesFilter = activeFilter === 'all' || event.category === activeFilter;
            
            return matchesSearch && matchesFilter;
        });
    }, [searchTerm, activeFilter, events]);

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

                        <Button
                            as={Link}
                            to="/create-event"
                            className="px-8 py-4 text-lg text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-full"
                        >
                            Создать событие
                        </Button>
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
                    <div className="border-t border-gray-200">
                        {filteredEvents.map(event => (
                            <EventCard key={event.id} event={event} />
                        ))}
                        
                        {filteredEvents.length === 0 && (
                            <div className="text-center py-12">
                                <p className="text-xl text-gray-500">
                                    Мероприятия не найдены. Попробуйте изменить параметры поиска.
                                </p>
                            </div>
                        )}
                    </div>
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