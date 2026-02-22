Запуск проекта
Бэкенд (Backend)

    Настройка виртуального окружения:
    python -m venv venv
    venv\Scripts\activate  # Windows
    source venv/bin/activate  # Mac/Linux

    Установка зависимостей:
    pip install -r requirements.txt

    Настройка базы данных PostgreSQL:
    Установите PostgreSQL
    Создайте базу данных
    Настройте подключение в файле .env

    Запуск миграций:
    alembic upgrade head

    Запуск сервера:
    uvicorn app.main:app --reload
    Сервер будет доступен по адресу: http://localhost:8000

Фронтенд (Frontend)

    Установка зависимостей:
    npm install

    Запуск в режиме разработки:
    npm run dev
    Приложение будет доступно по адресу: http://localhost:5173

Переменные окружения

    Создайте файл .env в корне проекта: 

    DATABASE_URL=postgresql://user:password@localhost/dbname
    SECRET_KEY=your-secret-key-here

Доступ к API

    Swagger документация: http://localhost:8000/docs
    Redoc документация: http://localhost:8000/redoc
