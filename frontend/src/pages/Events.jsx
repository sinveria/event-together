import { Link } from 'react-router-dom';
import Button from '../components/Button';
import arrowone from '../assets/img/arrowone.png';
import arrowtwo from '../assets/img/arrowtwo.png';

const Events = () => {
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
    </div>
  );
};

export default Events;