import Button from '../components/Button';
import FormInput from '../components/FormInput';
import createeventleft from '../assets/img/createeventleft.png';
import createeventright from '../assets/img/createeventright.png';
import { useState } from 'react';

const CreateEvent = () => {
    const [formData, setFormData] = useState({
        title: '',
        date: '',
        location: '',
        description: ''
    });

    const handleInputChange = (field) => (e) => {
        setFormData(prev => ({
            ...prev,
            [field]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Создаем событие:', formData);
    };

    return (
        <div className="min-h-screen bg-white">
            <section className="pt-32 pb-20 bg-white">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8">
                                <span className="bg-[#327BF0] px-6 py-3 rounded-lg inline-block">Создайте событие</span>
                            </h1>
                            
                            <p className="text-3xl md:text-4xl font-bold text-black leading-relaxed">
                                Создайте событие, чтобы к вашей компании<br />
                                присоединились
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg">
                            <div className="relative mb-4">
                                <FormInput
                                    label="Название"
                                    placeholder="Введите название события"
                                    value={formData.title}
                                    onChange={handleInputChange('title')}
                                />

                                <img
                                    src={createeventleft}
                                    alt="Декоративное изображение"
                                    className="absolute -left-24 -top-40 w-32 h-32 object-contain"
                                />

                                <img
                                    src={createeventright}
                                    alt="Декоративное изображение"
                                    className="absolute -right-24 -top-40 w-32 h-32 object-contain"
                                />
                            </div>

                            <FormInput
                                label="Дата"
                                placeholder="дд.мм.гггг, --:--"
                                value={formData.date}
                                onChange={handleInputChange('date')}
                                type="datetime-local"
                            />

                            <FormInput
                                label="Местоположение"
                                placeholder="Введите местоположение"
                                value={formData.location}
                                onChange={handleInputChange('location')}
                            />

                            <FormInput
                                label="Описание"
                                placeholder="Введите описание"
                                value={formData.description}
                                onChange={handleInputChange('description')}
                                isTextarea={true}
                            />

                            <Button
                                type="submit"
                                className="w-full py-4 text-lg text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-lg mt-6"
                            >
                                Создать событие
                            </Button>
                        </form>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default CreateEvent;