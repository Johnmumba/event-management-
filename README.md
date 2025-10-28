<<<<<<< HEAD
# software-design
 assignment 1 and 2
- Design patterns - Singleton
- 2410039 - Mwape Bwalya BSE Year 2 S2
- 2420949 - John Bwalya Mumba BSE Year 2 S1
- 2410050 - Fortune Jere BSE Year 2 S2
# Event Management App

A full-stack event management application built with Elysia.js, Bun, and PostgreSQL.

## 📋 Features

### Authentication
- User registration with email validation
- Password hashing with bcrypt
- JWT token-based authentication
- Welcome email via Ethereal
- User profile with organized events and RSVPs

### User Roles
- **ATTENDEE**: Can view approved events and RSVP
- **ORGANIZER**: Can create and manage own events
- **ADMIN**: Can approve events and manage all content

### Event Management
- Create, read, update, delete events
- Event approval workflow (admin only)
- Date validation (must be in future)
- Organizer ownership tracking

### RSVP System
- RSVP to approved events
- Three status options: GOING, MAYBE, NOT_GOING
- Update existing RSVPs
- View RSVPs per event
- Unique constraint prevents duplicate RSVPs

### Realtime Updates
- WebSocket connection at `/ws`
- Live broadcasts for:
  - Event created/updated/deleted/approved
  - RSVP created/updated
- All connected clients receive updates instantly

## 🏗️ Architecture & Design Principles

This application builds upon previous event system designs and applies key software design principles:

### SOLID Principles Applied:
- **Single Responsibility**: Controllers handle specific business logic
- **Open/Closed**: Extensible through middleware and services
- **Liskov Substitution**: Consistent interfaces across services
- **Interface Segregation**: Focused middleware for specific concerns
- **Dependency Inversion**: Dependency injection through constructor patterns

### Design Patterns from Previous Work:
- **Observer Pattern**: Real-time notifications via WebSocket subscriptions
- **Singleton Pattern**: Database and service instances
- **Middleware Pattern**: Authentication and validation chains
- **Repository Pattern**: Data access through Prisma client

## 🛠️ Tech Stack

- **Backend:** Elysia.js, Bun, Prisma ORM
- **Frontend:** Vanilla JavaScript, HTML5, CSS3
- **Authentication:** JWT with role-based access
- **Database:** PostgreSQL (Neon)
- **Real-time:** WebSockets
- **Deployment:** Render

## Local Development

1. Clone the repository
2. Install dependencies: `npm install`
3. Setup database: `npx prisma db push`
4. Start development server: `npm run dev`
5. Open http://localhost:3000


## 📚 API Documentation
### Key Endpoints

#### Authentication
- `POST /auth/signup` - Register new user
- `POST /auth/login` - Login and get JWT token
- `GET /auth/profile` - Get user profile (authenticated)

#### Events
- `GET /events` - List all events
- `GET /events/:id` - Get event details
- `POST /events` - Create event (organizer/admin)
- `PUT /events/:id` - Update event (admin)
- `DELETE /events/:id` - Delete event (admin)
- `PUT /events/:id/approve` - Approve event (admin only)

#### RSVPs
- `POST /events/:id/rsvp` - RSVP to event
- `GET /events/:id/rsvps` - Get event RSVPs
- `DELETE /events/:id/rsvp` - Remove RSVP

#### WebSocket
- `WS /ws` - Connect for realtime updates

## 🧪 Testing with Insomnia

1. **Import Swagger JSON**
   - Visit `http://localhost:3000/swagger`
   - Download the OpenAPI spec
   - Import into Insomnia

2. **Test Authentication Flow**
   \`\`\`
   1. POST /auth/signup with email, password, role
   2. Copy the returned token
   3. Add "Authorization: Bearer <token>" header to subsequent requests
   \`\`\`

3. **Test Event Creation**
   \`\`\`
   1. Login as ORGANIZER or ADMIN
   2. POST /events with event details
   3. Verify event appears in GET /events
   \`\`\`

## Deployment

This app is deployed on Render and uses Neon PostgreSQL database.

## 🐛 Challenges

- Frontend Can't Connect to Backend
- Database Connection lssues (verify ' DATABASE_URL' is corrent)
- Check backend is running on the specified port
- Ensure CORS is enabled in backend (already configured)
- setting up Prisma and .env
- Verify backend WebSocket endpoint is accessible
- Check browser console for connection errors
- Check Neon project is active
- Verify `JWT_SECRET` is set
- Check token format: `Bearer <token>`
- Ensure token hasn't expired

## 🙏 Acknowledgments

- Built with AI assistance (ChatGPT, jules.google,Deepseek)
   1. This assisted us with backend devlopment
   2. what commands to run in the terminal to install whats needed
   3. bug fixes
   4. How to connect neon db
- Elysia.js for excellent TypeScript support
- Prisma for type-safe database access
- Neon for serverless PostgreSQL
- Render for easy deployment

---

**Submission URL**

**Live Demo**: [https://event-management-0gqh.onrender.com/]

**Video Demo**: [https://www.loom.com/share/c09d30ac8f5a430f9886ba53fd5de429]


=======
# event-management-
Full-stack event management application with Elysia.js, Bun, and PostgreSQL
>>>>>>> 3916de8657f8099cffb9b75df5016b106f8e7000
