# Tech Stack

## Backend

- **Runtime**: Node.js (>=20.0.0)
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io
- **Authentication**: JWT (jsonwebtoken) with bcryptjs for password hashing
- **File Uploads**: Cloudinary
- **Email**: Resend
- **Rate Limiting**: Arcjet
- **Module System**: ES Modules (`"type": "module"`)

## Frontend

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + DaisyUI
- **State Management**: Zustand
- **HTTP Client**: Axios
- **Routing**: React Router v7
- **Real-time**: Socket.io Client
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Common Commands

### Development

```bash
# Backend (from /backend)
npm run dev          # Start with nodemon (auto-reload)

# Frontend (from /frontend)
npm run dev          # Start Vite dev server (http://localhost:5173)
```

### Production

```bash
# From root directory
npm run build        # Install deps and build frontend
npm start            # Start backend production server
```

### Frontend Only

```bash
# From /frontend
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

## Environment Setup

Backend requires `.env` file in `/backend` directory. See `backend/.env.example` for required variables including MongoDB URI, JWT secret, Cloudinary credentials, Resend API key, and Arcjet key.
