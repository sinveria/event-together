import { Link } from 'react-router-dom';
import Button from '../components/Button';

import wetogetherImage from '../assets/img/wetogether.png';
import cardgroupimage from '../assets/img/cardgroupimage.png';
import cardjoingroupImage from '../assets/img/cardjoingroupimage.png'
import cardcommunicateimage from '../assets/img/cardcommunicateimage.png';
import thumbsupImage from '../assets/img/thumbsup.png';
import smileImage from '../assets/img/smileimage.png';
import flowerImage from '../assets/img/flowerimage.png';
import smilestarsImage from '../assets/img/smilestarsimage.png';
import fireworksImage from "../assets/img/fireworksimage.png";

const Home = () => {
  return (
    <div className="min-h-screen bg-white">
      <section
        className="min-h-[80vh] relative flex items-center justify-center"
        style={{
          backgroundImage: `url(${wetogetherImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <div className="relative z-10 text-center px-4 max-w-4xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-black leading-tight mb-8">
            Открывайте мероприятия.<br />
            Присоединяйтесь к группам.<br />
            Посещайте мероприятия вместе.
          </h1>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              as={Link}
              to="/events"
              className="px-6 py-3 text-base text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-full"
            >
              Присоединиться к событию
            </Button>

            <Button
              as={Link}
              to="/create-event"
              className="px-6 py-3 text-base text-white bg-[#327BF0] hover:bg-[#2a6ac9] rounded-full"
            >
              Создать событие
            </Button>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2">
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  <span className="bg-[#327BF0] px-4 py-2 rounded-lg inline-block">Список событий и</span>
                  <br />
                  <span className="bg-[#327BF0] px-4 py-2 rounded-lg inline-block mt-2">поиск</span>
                </h2>
                <div className="flex items-start gap-4">
                  <p className="text-xl text-gray-600 max-w-md leading-relaxed">
                    Просматривайте множество предстоящих мероприятий, чтобы найти свой следующий опыт.
                  </p>
                  <img
                    src={thumbsupImage}
                    alt="Палец вверх"
                    className="w-16 h-16 mt-1"
                  />
                </div>
              </div>
              <Button
                as={Link}
                to="/events"
                className="px-6 py-3 text-base text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-full"
              >
                Смотреть события
              </Button>
            </div>

            <div className="lg:w-1/2">
              <img
                src={cardgroupimage}
                alt="События и поиск"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2">
              <img
                src={cardjoingroupImage}
                alt="Присоединяйтесь к группам"
                className="w-full h-auto"
              />
            </div>

            <div className="lg:w-1/2">
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 text-right">
                  <span className="bg-[#327BF0] px-4 py-2 rounded-lg inline-block">Присоединяйтесь к группам</span>
                  <br />
                  <span className="bg-[#327BF0] px-4 py-2 rounded-lg inline-block mt-2">группам или</span>
                  <br />
                  <span className="bg-[#327BF0] px-4 py-2 rounded-lg inline-block mt-2">создавайте их</span>
                </h2>
                <div className="flex items-start gap-4 justify-end">
                  <img
                    src={smileImage}
                    alt="Улыбка"
                    className="w-16 h-16 mt-1"
                  />
                  <p className="text-xl text-gray-600 max-w-md leading-relaxed text-right">
                    Общайтесь с другими, присоединяясь к существующим группам или создавая новые.
                  </p>
                </div>
              </div>
              <div className="text-right">
                <Button
                  as={Link}
                  to="/groups"
                  className="px-6 py-3 text-base text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-full"
                >
                  Присоединиться к группе
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2">
              <div className="mb-8">
                <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
                  <span className="bg-[#327BF0] px-4 py-2 rounded-lg inline-block">Общайтесь и</span>
                  <br />
                  <span className="bg-[#327BF0] px-4 py-2 rounded-lg inline-block mt-2">координируйте</span>
                  <br />
                  <span className="bg-[#327BF0] px-4 py-2 rounded-lg inline-block mt-2">группы</span>
                  <br />
                  <span className="bg-[#327BF0] px-4 py-2 rounded-lg inline-block mt-2">или создайте новую</span>
                </h2>
                <div className="flex items-start gap-4">
                  <p className="text-xl text-gray-600 max-w-md leading-relaxed">
                    Используйте встроенный чат для планирования, обсуждения и поддержания связи с группой.
                  </p>
                  <img
                    src={flowerImage}
                    alt="Цветок"
                    className="w-16 h-16 mt-1"
                  />
                </div>
              </div>
              <Button
                as={Link}
                to="/chat"
                className="px-6 py-3 text-base text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-full"
              >
                Начать общение
              </Button>
            </div>

            <div className="lg:w-1/2">
              <img
                src={cardcommunicateimage}
                alt="Общение в группах"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="border-t border-gray-200 mx-48"></div>

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-12">
            <div>
              <img
                src={fireworksImage}
                alt="Фейерверк"
                className="w-24 h-24 object-contain"
              />
            </div>

            <div className="text-center max-w-2xl">
              <div className="mb-8">
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                  <span className="bg-[#327BF0] px-4 py-2 rounded-lg inline-block">Присоединяйтесь к</span>
                  <br />
                  <span className="bg-[#327BF0] px-4 py-2 rounded-lg inline-block mt-2">группе или создайте</span>
                  <br />
                  <span className="bg-[#327BF0] px-4 py-2 rounded-lg inline-block mt-2">ее прямо сейчас</span>
                </h2>
                <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                  Начните планировать<br />
                  свое следующее<br />
                  мероприятие уже<br />
                  сегодня.
                </p>
              </div>
              <Button
                as={Link}
                to="/register"
                className="px-8 py-3 text-lg text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-full"
              >
                Начать
              </Button>
            </div>

            <div>
              <img
                src={smilestarsImage}
                alt="Улыбка со звездами"
                className="w-24 h-24 object-contain"
              />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;