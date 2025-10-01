# User Management Service

Сервис управления пользователями с аутентификацией на Node.js + TypeScript + Express + Prisma + PostgreSQL.

## Технологический стек

- **Runtime**: Node.js
- **Язык**: TypeScript
- **Framework**: Express.js
- **СУБД**: PostgreSQL
- **ORM**: Prisma
- **Аутентификация**: JWT (JSON Web Tokens)
- **Хеширование паролей**: bcrypt
- **Контейнеризация**: Docker (для PostgreSQL)

## Требования

- Node.js 16+ 
- Docker Desktop (для запуска PostgreSQL)
- npm или yarn

## Установка и запуск

У вас есть **два варианта** запуска проекта:

### 🐳 Вариант 1: Полная контейнеризация (рекомендуется для production)

Весь стек (PostgreSQL + Backend) запускается в Docker контейнерах.

```bash
# Запустить все сервисы
docker-compose up -d

# Посмотреть логи
docker-compose logs -f

# Остановить все сервисы
docker-compose down

# Остановить с удалением данных
docker-compose down -v
```

Сервер будет доступен на `http://localhost:3000`

**Преимущества:**
- ✅ Единообразное окружение
- ✅ Легкое развертывание
- ✅ Автоматическое применение миграций
- ✅ Изоляция зависимостей

---

### 💻 Вариант 2: Локальная разработка

Только PostgreSQL в Docker, Node.js приложение запускается локально.

#### 1. Установка зависимостей

```bash
npm install
```

#### 2. Настройка переменных окружения

Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

Отредактируйте `.env` файл:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/user_management?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="24h"
PORT=3000
NODE_ENV="development"
```

#### 3. Запуск только PostgreSQL

```bash
docker-compose -f docker-compose.dev.yml up -d
```

#### 4. Применение миграций базы данных

```bash
npm run prisma:migrate
```

#### 5. Запуск приложения

**Режим разработки** (с hot-reload):
```bash
npm run dev
```

**Production режим**:
```bash
npm run build
npm start
```

Сервер запустится на `http://localhost:3000`

**Преимущества:**
- ✅ Быстрая перезагрузка (hot-reload)
- ✅ Удобная отладка
- ✅ Прямой доступ к файлам

## Структура проекта

```
├── prisma/
│   ├── schema.prisma          # Prisma схема БД
│   └── migrations/            # Миграции БД
├── src/
│   ├── config/                # Конфигурация приложения
│   │   ├── database.ts        # Prisma client
│   │   └── env.ts             # Переменные окружения
│   ├── controllers/           # Контроллеры
│   │   ├── authController.ts
│   │   └── userController.ts
│   ├── middlewares/           # Middleware
│   │   ├── auth.ts            # Аутентификация и авторизация
│   │   └── errorHandler.ts    # Обработка ошибок
│   ├── routes/                # Маршруты
│   │   ├── authRoutes.ts
│   │   └── userRoutes.ts
│   ├── services/              # Бизнес-логика
│   │   ├── authService.ts
│   │   └── userService.ts
│   ├── types/                 # TypeScript типы
│   │   └── index.ts
│   ├── utils/                 # Утилиты
│   │   └── asyncHandler.ts
│   ├── validators/            # Валидация
│   │   └── authValidator.ts
│   └── index.ts               # Точка входа
├── .env                       # Переменные окружения (не в Git)
├── .env.example               # Пример переменных окружения
├── docker-compose.yml         # Docker конфигурация
├── package.json
├── tsconfig.json              # TypeScript конфигурация
└── README.md
```

## API Endpoints

### Базовый URL
```
http://localhost:3000/api
```

### 1. Регистрация пользователя

**POST** `/api/auth/register`

**Body:**
```json
{
  "fullName": "Иван Иванов",
  "birthDate": "1990-01-15",
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Response (201):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "fullName": "Иван Иванов",
      "email": "ivan@example.com",
      "role": "USER"
    }
  }
}
```

### 2. Авторизация пользователя

**POST** `/api/auth/login`

**Body:**
```json
{
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid",
      "fullName": "Иван Иванов",
      "email": "ivan@example.com",
      "role": "USER"
    }
  }
}
```

### 3. Получение пользователя по ID

**GET** `/api/users/:id`

**Headers:**
```
Authorization: Bearer <token>
```

**Правила доступа:**
- Админ может получить любого пользователя
- Пользователь может получить только свои данные

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "Иван Иванов",
      "birthDate": "1990-01-15T00:00:00.000Z",
      "email": "ivan@example.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "2024-01-01T12:00:00.000Z",
      "updatedAt": "2024-01-01T12:00:00.000Z"
    }
  }
}
```

### 4. Получение списка всех пользователей

**GET** `/api/users`

**Headers:**
```
Authorization: Bearer <token>
```

**Правила доступа:**
- Только для администраторов

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "uuid",
        "fullName": "Иван Иванов",
        "birthDate": "1990-01-15T00:00:00.000Z",
        "email": "ivan@example.com",
        "role": "USER",
        "isActive": true,
        "createdAt": "2024-01-01T12:00:00.000Z",
        "updatedAt": "2024-01-01T12:00:00.000Z"
      }
    ]
  }
}
```

### 5. Блокировка пользователя

**PATCH** `/api/users/:id/block`

**Headers:**
```
Authorization: Bearer <token>
```

**Правила доступа:**
- Админ может заблокировать любого пользователя
- Пользователь может заблокировать только себя

**Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid",
      "fullName": "Иван Иванов",
      "email": "ivan@example.com",
      "isActive": false
    }
  }
}
```

## Модель User

```typescript
{
  id: string (UUID)           // Уникальный идентификатор
  fullName: string            // ФИО
  birthDate: DateTime         // Дата рождения
  email: string (unique)      // Email (уникальный)
  password: string            // Хешированный пароль
  role: 'USER' | 'ADMIN'      // Роль пользователя
  isActive: boolean           // Статус активности
  createdAt: DateTime         // Дата создания
  updatedAt: DateTime         // Дата обновления
}
```

## Примеры использования (curl)

### Регистрация
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Иван Иванов",
    "birthDate": "1990-01-15",
    "email": "ivan@example.com",
    "password": "password123"
  }'
```

### Авторизация
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "ivan@example.com",
    "password": "password123"
  }'
```

### Получение пользователя
```bash
curl -X GET http://localhost:3000/api/users/{USER_ID} \
  -H "Authorization: Bearer {TOKEN}"
```

### Получение всех пользователей (только admin)
```bash
curl -X GET http://localhost:3000/api/users \
  -H "Authorization: Bearer {ADMIN_TOKEN}"
```

### Блокировка пользователя
```bash
curl -X PATCH http://localhost:3000/api/users/{USER_ID}/block \
  -H "Authorization: Bearer {TOKEN}"
```

## Коды ошибок

- `200` - Успешный запрос
- `201` - Ресурс успешно создан
- `400` - Неверный запрос (ошибка валидации)
- `401` - Не авторизован (нет токена или токен невалиден)
- `403` - Доступ запрещен (нет прав)
- `404` - Ресурс не найден
- `409` - Конфликт (например, email уже существует)
- `500` - Внутренняя ошибка сервера

## Безопасность

- ✅ Пароли хешируются с помощью bcrypt (salt rounds: 10)
- ✅ JWT токены для аутентификации
- ✅ Валидация всех входных данных
- ✅ Защита от SQL-инъекций (через Prisma ORM)
- ✅ CORS настроен
- ✅ Пароли не возвращаются в API responses

## Лучшие практики

- **Слоистая архитектура**: Controllers → Services → Database
- **Разделение ответственности**: каждый модуль отвечает за свою часть
- **Обработка ошибок**: централизованная обработка с кастомными ошибками
- **TypeScript**: строгая типизация для предотвращения ошибок
- **Async/Await**: современный подход к асинхронному коду
- **Environment variables**: чувствительные данные в .env файле
- **Миграции БД**: версионирование структуры базы данных через Prisma

## Управление Docker контейнерами

### Production (полный стек)

```bash
# Запуск всех сервисов (PostgreSQL + Backend)
docker-compose up -d

# Пересборка образов при изменении кода
docker-compose up -d --build

# Просмотр логов всех сервисов
docker-compose logs -f

# Просмотр логов конкретного сервиса
docker-compose logs -f backend
docker-compose logs -f postgres

# Остановка всех сервисов
docker-compose down

# Остановка с удалением данных (volume)
docker-compose down -v

# Просмотр статуса контейнеров
docker-compose ps
```

### Development (только PostgreSQL)

```bash
# Запуск только БД
docker-compose -f docker-compose.dev.yml up -d

# Остановка БД
docker-compose -f docker-compose.dev.yml down

# Просмотр логов БД
docker-compose -f docker-compose.dev.yml logs -f
```

### Подключение к базе данных

```bash
# Через psql в контейнере
docker exec -it user_management_db psql -U postgres -d user_management

# Или через любой PostgreSQL клиент:
# Host: localhost
# Port: 5433
# Database: user_management
# User: postgres
# Password: postgres
```

## Разработка

### Полезные команды

```bash
# Генерация Prisma Client
npm run prisma:generate

# Создание новой миграции
npm run prisma:migrate

# Открыть Prisma Studio (GUI для БД)
npm run prisma:studio

# Компиляция TypeScript
npm run build

# Запуск в dev режиме
npm run dev
```

## Создание первого администратора

После первого запуска приложения создайте пользователя через `/api/auth/register`, затем вручную измените его роль в базе данных:

```sql
UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
```

Или через Prisma Studio:
```bash
npm run prisma:studio
```

## Лицензия

ISC

