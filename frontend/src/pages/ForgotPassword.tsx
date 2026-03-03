import { Link } from 'react-router-dom';
import Button from '../components/Button';
import FormInput from '../components/FormInput';
import arrowleftlogin from '../assets/img/arrowleftlogin.png';
import arrowrightlogin from '../assets/img/arrowrightlogin.png';
import { useState, ChangeEvent, FormEvent } from 'react';

interface ForgotPasswordFormData {
  email: string;
}

const ForgotPassword = () => {
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    email: ''
  });

  const handleInputChange = (field: keyof ForgotPasswordFormData) => (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('Восстановление пароля:', formData);
  };

  return (
    <div className="bg-white">
      <section className="pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center gap-4 mb-6">
                <img
                  src={arrowleftlogin}
                  alt="Декоративная стрелка"
                  className="w-32 h-32 object-contain"
                />

                <h1 className="text-4xl md:text-5xl font-bold text-white">
                  <div className="flex flex-col items-center gap-2">
                    <span className="bg-[#327BF0] px-6 py-3 rounded-lg inline-block">Восстановление</span>
                    <span className="bg-[#327BF0] px-6 py-3 rounded-lg inline-block">пароля</span>
                  </div>
                </h1>

                <img
                  src={arrowrightlogin}
                  alt="Декоративная стрелка"
                  className="w-32 h-32 object-contain"
                />
              </div>

              <p className="text-3xl md:text-4xl font-bold text-black leading-relaxed mb-6">
                Введите вашу почту, чтобы получить инструкции по восстановлению пароля
              </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg">
              <div className="mb-6">
                <FormInput
                  label="Почта"
                  placeholder="Введите свою почту"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  type="email"
                />
              </div>

              <div className="text-center mb-6">
                <p className="text-lg text-gray-700">
                  Вспомнили пароль?{' '}
                  <Link
                    to="/login"
                    className="text-[#323FF0] hover:text-[#2a35cc] font-medium underline"
                  >
                    Войти
                  </Link>
                </p>
              </div>

              <Button
                type="submit"
                className="w-full py-4 text-lg text-white bg-[#323FF0] hover:bg-[#2a35cc] rounded-lg"
              >
                Восстановить пароль
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ForgotPassword;