# EventSync-WEB3-API

Backend API for **EventiGO** — an event management and live Q&A platform.

## Tech Stack

Node.js, TypeScript, Express, Socket.IO, Prisma, PostgreSQL, JWT, Zod

## Setup

```bash
git clone https://github.com/WeCode-WeNeverSleep/EventSync-WEB3-API.git
cd EventSync-WEB3-API
npm install
```

Create a `.env` file:

```env
DATABASE_URL=postgresql://...
JWT_SECRET=your_secret
```

```bash
npm run db:migrate
npm run db:generate
npm run dev
```

## Scripts

```bash
npm run dev
npm run build
npm start
npm run db:migrate
npm run db:generate
```

## API

### Public

| Method | Path                                 |
| ------ | ------------------------------------ |
| GET    | `/events`                            |
| GET    | `/events/:eventId`                   |
| GET    | `/events/:eventId/sessions`          |
| GET    | `/events/:eventId/sessions/:sessionId` |
| GET    | `/speakers`                          |
| GET    | `/speakers/:speakerId`               |
| GET    | `/rooms`                             |
| GET    | `/sessions/:sessionId/questions`     |
| POST   | `/sessions/:sessionId/questions`     |

### Admin (JWT required)

| Method | Path                                       |
| ------ | ------------------------------------------ |
| POST   | `/admin/login`                             |
| GET    | `/admin/events`                            |
| GET    | `/admin/events/:eventId`                   |
| POST   | `/admin/events`                            |
| PUT    | `/admin/events/:eventId`                   |
| DELETE | `/admin/events/:eventId`                   |
| GET    | `/admin/rooms`                             |
| GET    | `/admin/rooms/:roomId`                     |
| POST   | `/admin/rooms`                             |
| PUT    | `/admin/rooms/:roomId`                     |
| DELETE | `/admin/rooms/:roomId`                     |
| GET    | `/admin/speakers`                          |
| GET    | `/admin/speakers/:speakerId`               |
| POST   | `/admin/speakers`                          |
| PUT    | `/admin/speakers/:speakerId`               |
| DELETE | `/admin/speakers/:speakerId`               |
| GET    | `/admin/events/:eventId/sessions`          |
| GET    | `/admin/events/:eventId/sessions/:sessionId` |
| POST   | `/admin/events/:eventId/sessions`          |
| PUT    | `/admin/events/:eventId/sessions/:sessionId` |
| DELETE | `/admin/events/:eventId/sessions/:sessionId` |

### WebSocket (Socket.IO)

| Event              | Direction    | Description           |
| ------------------ | ------------ | --------------------- |
| `join_session`     | Client → Svr | Join a live session   |
| `post_question`    | Client → Svr | Post a question       |
| `upvote_question`  | Client → Svr | Upvote a question     |
| `new_question`     | Svr → Room   | Broadcast question    |
| `question_upvoted` | Svr → Room   | Update upvote count   |
| `session_started`  | Svr → Room   | Session went live     |
| `session_ended`    | Svr → Room   | Session ended         |

## Contributors

### Rindra — `STD24069` [`rindraniaina`](https://github.com/rindraniaina)
*Prisma schema, event routes, Socket.IO, build fixes, delete endpoints*
- Initial Prisma schema (6 models, migrations)
- Public event routes (`GET /events`, `GET /events/:eventId`)
- Socket.IO real-time setup (join_session, post_question, upvote_question)
- Session relations (rooms, speakers, questions)
- Delete endpoints (events, sessions, rooms, speakers)
- Production build fixes

### Jessy — `STD24004` [`jessyrand`](https://github.com/jessyrand)
*Project setup, auth, full CRUD, live monitoring*
- Project initialization (Express, tsconfig, Prisma config)
- JWT authentication (login, middleware, service)
- Zod validation schemas (event, session, room, speaker)
- Sessions CRUD (create, list by event, detail)
- Rooms CRUD (create, read, update)
- Speakers CRUD (create, list, update)
- Events CRUD (create, update, session count)
- Upvote model & migration
- Session live/ended monitoring
- Admin endpoints (rooms, speakers, events, sessions)
- WebSocket security (live session validation)
- Various fixes (timezone, TypeScript, build)

### Manda — `STD24083` [`Manda Tiavina`](https://github.com/MandaTiavina)
*Speaker routes, types & mappers, README*
- Public route `GET /speakers/:speakerId`
- Speaker types and response mapper
- Route alignment after merges
- Project README

### Mayah — `STD24156` [`mayahNeko`](https://github.com/mayahNeko)
*Q&A system, error handling*
- Question domain types and interfaces
- Question service (list, create, upvote)
- Question controller
- In-memory to Prisma migration
- Routing and error handling refactoring (QuestionError)
