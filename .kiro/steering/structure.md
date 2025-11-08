# Project Structure

## Monorepo Layout

```
/
├── backend/          # Node.js/Express API server
├── frontend/         # React/Vite client application
└── package.json      # Root-level build scripts
```

## Backend Architecture (`/backend/src`)

Follows MVC pattern with clear separation of concerns:

```
src/
├── controllers/      # Request handlers (auth, message)
├── routes/           # Express route definitions
├── models/           # Mongoose schemas (User, Message)
├── middleware/       # Auth, Arcjet rate-limiting
├── lib/              # External service configs (db, socket, cloudinary, resend, arcjet)
├── emails/           # Email templates and handlers
└── server.js         # Application entry point
```

### Backend Conventions

- Use ES modules (import/export)
- Controllers handle business logic
- Middleware for authentication and rate-limiting
- Centralized service configuration in `/lib`
- Socket.io setup in `lib/socket.js`

## Frontend Architecture (`/frontend/src`)

Component-based React application:

```
src/
├── components/       # Reusable UI components
├── pages/            # Route-level page components (Login, SignUp, Chat)
├── store/            # Zustand state stores (auth, chat)
├── hooks/            # Custom React hooks
├── lib/              # Axios configuration
├── App.jsx           # Main app component with routing
└── main.jsx          # Application entry point
```

### Frontend Conventions

- Use `.jsx` extension for React components
- Zustand stores for global state management
- Tailwind CSS + DaisyUI for styling
- Axios instance configured in `lib/axios.js`
- Page components in `/pages`, reusable components in `/components`

## Configuration Files

- **Backend**: `.env` for environment variables (see `.env.example`)
- **Frontend**: `vite.config.js`, `tailwind.config.js`, `eslint.config.js`
- **Root**: `package.json` with build/start scripts for both apps
