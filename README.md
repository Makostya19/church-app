Теперь обновим README с финальной информацией. Замени содержимое README.md в корне проекта на:
markdown# Church App

Full-stack web application for a church community built with React, Node.js, Express, and PostgreSQL.

## Tech Stack

- **Frontend:** React, React Router, Axios, React Toastify
- **Backend:** Node.js, Express, express-validator
- **Database:** PostgreSQL
- **Auth:** JWT, Google OAuth 2.0
- **AI:** Hugging Face (FLUX.1-schnell)
- **API Docs:** Swagger/OpenAPI

## Features

- User registration and login with JWT authentication
- Google SNS login
- Browse events, announcements, ministries and resources
- Save favorites
- Rating and reviews with star rating
- SNS Sharing (Telegram, WhatsApp, Facebook, Copy Link)
- Prayer requests for members
- Admin panel with full CRUD
- AI Image Generation for events and announcements
- Dashboard with real statistics
- Role-based access control (Guest / Member / Admin)
- User deactivation by admin
- Responsive design with mobile menu
- Swagger API documentation

## Requirements

- Node.js v18+
- PostgreSQL 18+

## Installation

### 1. Clone and setup

```bash
git clone
cd church-app
```

### 2. Backend setup

```bash
cd server
npm install
```

Create `.env` in `/server`:
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=church_app
DB_USER=postgres
DB_PASSWORD=your_password
JWT_SECRET=church_app_secret_key_2026
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
HF_TOKEN=your_huggingface_token

Create database and tables:

```bash
psql -U postgres -c "CREATE DATABASE church_app;"
psql -U postgres -d church_app -f src/config/schema.sql
```

Start server:

```bash
npm run dev
```

### 3. Frontend setup

```bash
cd client
npm install
npm start
```

## Demo Credentials

| Role   | Email                | Password    |
| ------ | -------------------- | ----------- |
| Admin  | test@test.com        | password123 |
| Member | Register new account | -           |

## API Documentation

After starting the server, visit:
http://localhost:5000/api/docs

## API Endpoints

| Method | URL                         | Access | Description              |
| ------ | --------------------------- | ------ | ------------------------ |
| POST   | /api/auth/register          | Public | Register                 |
| POST   | /api/auth/login             | Public | Login                    |
| POST   | /api/auth/sns/google        | Public | Google login             |
| GET    | /api/auth/me                | Member | Get current user         |
| GET    | /api/events                 | Public | Get events               |
| POST   | /api/events                 | Admin  | Create event             |
| PUT    | /api/events/:id             | Admin  | Update event             |
| DELETE | /api/events/:id             | Admin  | Delete event             |
| PATCH  | /api/events/:id/status      | Admin  | Change status            |
| GET    | /api/announcements          | Public | Get announcements        |
| POST   | /api/announcements          | Admin  | Create announcement      |
| GET    | /api/ministries             | Public | Get ministries           |
| POST   | /api/ministries             | Admin  | Create ministry          |
| GET    | /api/resources              | Public | Get resources            |
| POST   | /api/resources              | Admin  | Create resource          |
| GET    | /api/prayer-requests        | Member | Get prayer requests      |
| POST   | /api/prayer-requests        | Member | Create prayer request    |
| GET    | /api/favorites              | Member | Get favorites            |
| POST   | /api/favorites              | Member | Add favorite             |
| DELETE | /api/favorites              | Member | Remove favorite          |
| GET    | /api/reviews                | Public | Get reviews              |
| POST   | /api/reviews                | Member | Add review               |
| DELETE | /api/reviews/:id            | Member | Delete review            |
| GET    | /api/admin/dashboard        | Admin  | Dashboard stats          |
| GET    | /api/admin/users            | Admin  | List users               |
| PATCH  | /api/admin/users/:id/role   | Admin  | Update user role         |
| PATCH  | /api/admin/users/:id/status | Admin  | Activate/deactivate user |
| POST   | /api/ai/images              | Admin  | Generate AI image        |

## Database Schema

- **users** - User accounts with roles
- **events** - Church events with statuses
- **announcements** - Church announcements
- **ministries** - Church ministries
- **resources** - Church resources
- **prayer_requests** - Member prayer requests
- **favorites** - User favorites
- **reviews** - Ratings and reviews
