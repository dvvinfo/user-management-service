# Тестирование API через Postman

## Подготовка

1. **Убедитесь, что сервер запущен:**
   ```bash
   docker-compose ps
   ```
   Должны быть запущены оба контейнера.

2. **Базовый URL:** `http://localhost:3000/api`

---

## 🔥 Шаги тестирования

### Шаг 1: Регистрация обычного пользователя

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/register`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "fullName": "Иван Иванов",
  "birthDate": "1990-01-15",
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Ожидаемый ответ (201):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-здесь",
      "fullName": "Иван Иванов",
      "email": "ivan@example.com",
      "role": "USER"
    }
  }
}
```

**✅ Сохраните токен!** Скопируйте значение `token` - он понадобится для следующих запросов.

---

### Шаг 2: Регистрация администратора

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/register`  
**Headers:**
```
Content-Type: application/json
```

**Body (JSON):**
```json
{
  "fullName": "Админ Системы",
  "birthDate": "1985-05-20",
  "email": "admin@example.com",
  "password": "admin123456"
}
```

**Ожидаемый ответ (201):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-здесь",
      "fullName": "Админ Системы",
      "email": "admin@example.com",
      "role": "USER"
    }
  }
}
```

**⚠️ ВАЖНО:** По умолчанию создается пользователь с ролью `USER`. Чтобы сделать его админом, выполните:

```bash
# Вариант 1: Через psql в контейнере
docker exec -it user_management_db psql -U postgres -d user_management -c "UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';"

# Вариант 2: Через Prisma Studio
docker exec -it user_management_backend npx prisma studio
# Откроется в браузере, найдите пользователя и измените role на ADMIN
```

После изменения роли заново авторизуйтесь (Шаг 3).

---

### Шаг 3: Авторизация

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/login`  
**Headers:**
```
Content-Type: application/json
```

**Body для обычного пользователя:**
```json
{
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Body для админа:**
```json
{
  "email": "admin@example.com",
  "password": "admin123456"
}
```

**Ожидаемый ответ (200):**
```json
{
  "status": "success",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "uuid-здесь",
      "fullName": "Админ Системы",
      "email": "admin@example.com",
      "role": "ADMIN"
    }
  }
}
```

**✅ Сохраните оба токена** (пользователя и админа) для тестирования прав доступа.

---

### Шаг 4: Получение своего профиля (USER)

**Method:** `GET`  
**URL:** `http://localhost:3000/api/users/{USER_ID}`  
Замените `{USER_ID}` на ID пользователя из ответа регистрации/авторизации.

**Headers:**
```
Authorization: Bearer YOUR_USER_TOKEN
```
Вставьте токен обычного пользователя.

**Ожидаемый ответ (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid-здесь",
      "fullName": "Иван Иванов",
      "birthDate": "1990-01-15T00:00:00.000Z",
      "email": "ivan@example.com",
      "role": "USER",
      "isActive": true,
      "createdAt": "2025-10-01T12:00:00.000Z",
      "updatedAt": "2025-10-01T12:00:00.000Z"
    }
  }
}
```

---

### Шаг 5: Попытка получить чужой профиль (должна быть ошибка)

**Method:** `GET`  
**URL:** `http://localhost:3000/api/users/{ADMIN_ID}`  
Используйте ID админа (из его токена).

**Headers:**
```
Authorization: Bearer YOUR_USER_TOKEN
```
Используйте токен обычного пользователя.

**Ожидаемый ответ (403):**
```json
{
  "status": "error",
  "message": "You do not have permission to access this user"
}
```

✅ **Это правильно!** Обычный пользователь не может смотреть чужие данные.

---

### Шаг 6: Получение списка всех пользователей (только ADMIN)

**Method:** `GET`  
**URL:** `http://localhost:3000/api/users`

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```
Используйте токен админа.

**Ожидаемый ответ (200):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "id": "uuid-1",
        "fullName": "Иван Иванов",
        "birthDate": "1990-01-15T00:00:00.000Z",
        "email": "ivan@example.com",
        "role": "USER",
        "isActive": true,
        "createdAt": "2025-10-01T12:00:00.000Z",
        "updatedAt": "2025-10-01T12:00:00.000Z"
      },
      {
        "id": "uuid-2",
        "fullName": "Админ Системы",
        "birthDate": "1985-05-20T00:00:00.000Z",
        "email": "admin@example.com",
        "role": "ADMIN",
        "isActive": true,
        "createdAt": "2025-10-01T12:00:00.000Z",
        "updatedAt": "2025-10-01T12:00:00.000Z"
      }
    ]
  }
}
```

---

### Шаг 7: Попытка получить список пользователей обычным USER (ошибка)

**Method:** `GET`  
**URL:** `http://localhost:3000/api/users`

**Headers:**
```
Authorization: Bearer YOUR_USER_TOKEN
```
Используйте токен обычного пользователя.

**Ожидаемый ответ (403):**
```json
{
  "status": "error",
  "message": "Access denied"
}
```

✅ **Это правильно!** Только админ может видеть список всех пользователей.

---

### Шаг 8: Блокировка самого себя (USER)

**Method:** `PATCH`  
**URL:** `http://localhost:3000/api/users/{USER_ID}/block`  
Используйте ID обычного пользователя.

**Headers:**
```
Authorization: Bearer YOUR_USER_TOKEN
```

**Ожидаемый ответ (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid-здесь",
      "fullName": "Иван Иванов",
      "email": "ivan@example.com",
      "isActive": false
    }
  }
}
```

✅ Пользователь теперь заблокирован (`isActive: false`).

---

### Шаг 9: Попытка авторизации заблокированным пользователем

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/login`

**Body:**
```json
{
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Ожидаемый ответ (403):**
```json
{
  "status": "error",
  "message": "User account is blocked"
}
```

✅ **Это правильно!** Заблокированный пользователь не может войти.

---

### Шаг 10: Админ блокирует другого пользователя

Создайте еще одного пользователя для теста:

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/register`

**Body:**
```json
{
  "fullName": "Петр Петров",
  "birthDate": "1992-03-10",
  "email": "petr@example.com",
  "password": "password123"
}
```

Затем админ блокирует его:

**Method:** `PATCH`  
**URL:** `http://localhost:3000/api/users/{PETR_ID}/block`

**Headers:**
```
Authorization: Bearer YOUR_ADMIN_TOKEN
```

**Ожидаемый ответ (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "uuid-петра",
      "fullName": "Петр Петров",
      "email": "petr@example.com",
      "isActive": false
    }
  }
}
```

---

## 🧪 Тестирование ошибок валидации

### Неверный формат email

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/register`

**Body:**
```json
{
  "fullName": "Тест",
  "birthDate": "1990-01-01",
  "email": "invalid-email",
  "password": "password123"
}
```

**Ожидаемый ответ (400):**
```json
{
  "status": "error",
  "message": "Valid email is required"
}
```

---

### Короткий пароль

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/register`

**Body:**
```json
{
  "fullName": "Тест",
  "birthDate": "1990-01-01",
  "email": "test@example.com",
  "password": "123"
}
```

**Ожидаемый ответ (400):**
```json
{
  "status": "error",
  "message": "Password is required and must be at least 6 characters"
}
```

---

### Дублирующийся email

Попробуйте зарегистрироваться с уже существующим email:

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/register`

**Body:**
```json
{
  "fullName": "Другой Иван",
  "birthDate": "1991-01-01",
  "email": "ivan@example.com",
  "password": "password123"
}
```

**Ожидаемый ответ (409):**
```json
{
  "status": "error",
  "message": "User with this email already exists"
}
```

---

### Неверный пароль при авторизации

**Method:** `POST`  
**URL:** `http://localhost:3000/api/auth/login`

**Body:**
```json
{
  "email": "admin@example.com",
  "password": "wrongpassword"
}
```

**Ожидаемый ответ (401):**
```json
{
  "status": "error",
  "message": "Invalid email or password"
}
```

---

### Запрос без токена

**Method:** `GET`  
**URL:** `http://localhost:3000/api/users`

**Headers:** (не добавляйте Authorization)

**Ожидаемый ответ (401):**
```json
{
  "status": "error",
  "message": "No token provided"
}
```

---

### Невалидный токен

**Method:** `GET`  
**URL:** `http://localhost:3000/api/users`

**Headers:**
```
Authorization: Bearer invalid-token-here
```

**Ожидаемый ответ (401):**
```json
{
  "status": "error",
  "message": "Invalid or expired token"
}
```

---

## 📊 Сводная таблица endpoints

| Метод | Endpoint | Доступ | Описание |
|-------|----------|--------|----------|
| POST | `/api/auth/register` | Публичный | Регистрация |
| POST | `/api/auth/login` | Публичный | Авторизация |
| GET | `/api/users/:id` | USER (свой) / ADMIN (любой) | Получить пользователя |
| GET | `/api/users` | ADMIN | Список пользователей |
| PATCH | `/api/users/:id/block` | USER (себя) / ADMIN (любого) | Блокировка |

---

## 💡 Полезные советы для Postman

### 1. Использование переменных окружения

Создайте Environment в Postman с переменными:
- `base_url` = `http://localhost:3000/api`
- `user_token` = токен обычного пользователя
- `admin_token` = токен админа
- `user_id` = ID пользователя
- `admin_id` = ID админа

Тогда в запросах можно использовать:
- URL: `{{base_url}}/users/{{user_id}}`
- Header: `Authorization: Bearer {{user_token}}`

### 2. Автоматическое сохранение токена

В разделе **Tests** для запроса регистрации/авторизации добавьте:

```javascript
if (pm.response.code === 200 || pm.response.code === 201) {
    var jsonData = pm.response.json();
    pm.environment.set("user_token", jsonData.data.token);
    pm.environment.set("user_id", jsonData.data.user.id);
}
```

### 3. Создание коллекции

Создайте коллекцию "User Management API" и добавьте туда все запросы в правильном порядке для быстрого тестирования.

---

## ✅ Чек-лист успешного тестирования

- [ ] Зарегистрирован обычный пользователь
- [ ] Зарегистрирован админ (и изменена роль в БД)
- [ ] Пользователь может авторизоваться
- [ ] Админ может авторизоваться
- [ ] Пользователь видит свой профиль
- [ ] Пользователь НЕ видит чужой профиль (403)
- [ ] Админ видит любой профиль
- [ ] Админ видит список всех пользователей
- [ ] Пользователь НЕ видит список всех (403)
- [ ] Пользователь может заблокировать себя
- [ ] Заблокированный не может авторизоваться
- [ ] Админ может заблокировать других
- [ ] Валидация email работает
- [ ] Валидация пароля работает
- [ ] Дублирующийся email отклоняется
- [ ] Без токена доступ запрещен
- [ ] С неверным токеном доступ запрещен

Если все пункты выполнены - API работает корректно! 🎉
