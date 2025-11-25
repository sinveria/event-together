import { Link } from 'react-router-dom';
import Button from '../components/Button';
import GroupCard from '../components/GroupCard';

const Groups = () => {
    // данные групп по событиям
    const groups = [
        {
            id: 1,
            name: "Арт-сообщество Москвы",
            membersCount: 47,
            upcomingEvents: 3,
            description: "Группа для посещения выставок, вернисажей и арт-мероприятий в Москве. Обсуждаем современное искусство и встречаемся с художниками.",
            tags: ["искусство", "выставки", "москва", "культура"],
            nextEventDate: "28 сент",
            organizer: "Анна Петрова",
            events: [
                "Выставка современного искусства - 28 сентября",
                "Встреча с куратором - 5 октября",
                "Экскурсия в Третьяковку - 12 октября"
            ],
            activity: {
                messages: "1.2к",
                online: 12
            }
        },
        {
            id: 2,
            name: "Активный отдых Подмосковье",
            membersCount: 32,
            upcomingEvents: 2,
            description: "Организуем пешие походы, велопрогулки и пикники в Подмосковье. Подходит для начинающих и опытных туристов.",
            tags: ["походы", "природа", "спорт", "отдых"],
            nextEventDate: "1 окт",
            organizer: "Иван Сидоров",
            events: [
                "Поход в лесопарк - 1 октября",
                "Велопрогулка по набережной - 8 октября"
            ],
            activity: {
                messages: "856",
                online: 8
            }
        },
        {
            id: 3,
            name: "Винный клуб Дегустации",
            membersCount: 28,
            upcomingEvents: 1,
            description: "Регулярные дегустации вин из разных регионов мира. Учимся разбираться в винах и находим новые вкусы.",
            tags: ["вино", "дегустации", "гастрономия", "вкус"],
            nextEventDate: "5 окт",
            organizer: "Мария Козлова",
            events: [
                "Итальянские вина - 5 октября"
            ],
            activity: {
                messages: "432",
                online: 5
            }
        }
    ];

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

                    <div className="space-y-6">
                        {groups.map(group => (
                            <GroupCard key={group.id} group={group} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-12">
                            Почему группы?
                        </h2>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Сообщество</h3>
                                <p className="text-gray-600">
                                    Находите людей с общими интересами и делитесь опытом
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">События</h3>
                                <p className="text-gray-600">
                                    Участвуйте в мероприятиях, организованных специально для группы
                                </p>
                            </div>
                            
                            <div className="text-center">
                                <h3 className="text-xl font-bold text-gray-900 mb-3">Общение</h3>
                                <p className="text-gray-600">
                                    Обсуждайте темы, делитесь впечатлениями и планируйте встречи
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Groups;