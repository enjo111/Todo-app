# Design Spec: Auth System, Landing Page, & Simplified API Client

## 1. Overview
This design introduces a complete authentication system and a high-converting landing page for **TaskFlow Pro** — a modern task management application built in React. It includes full authentication routes (Login, Register, Dashboard, Landing), HTTP Cookie-based session tracking with `AuthContext`, and a clean API client that issues standard `fetch` requests directly to `http://localhost:3000/api` with cookie credentials included.

## 2. Architecture & Components

```
src/
├── components/
│   ├── Header.tsx            # Navigation header with Auth links / User badge
│   ├── Footer.tsx            # Professional landing & app footer
│   └── ProtectedRoute.tsx    # Route guard redirecting unauthenticated users to /login
├── context/
│   └── authContext.tsx       # AuthProvider, state (user, isAuthenticated, isLoading), login/register/logout
├── hooks/
│   ├── useAuth.ts            # Hook for consuming AuthContext
│   └── useTodos.ts           # Hook for managing todo API requests & state
├── models/
│   ├── User.ts               # User interface (id, email, name)
│   └── Todo.ts               # Todo item interface
├── pages/
│   ├── Landing.tsx           # High-converting product selling landing page
│   ├── Login.tsx             # Professional login form page with validation & state
│   ├── Register.tsx          # User registration page with password strength indicator
│   └── Dashboard.tsx         # Main todo application dashboard (protected)
└── services/
    └── api-client.ts         # Simplified API client performing fetch to http://localhost:3000/api with credentials: 'include'
```

## 3. Key Functionalities

### A. API Client & HTTP Cookie Auth (`src/services/api-client.ts`)
- Base URL: `http://localhost:3000/api`.
- Native `fetch` wrapper configured with `credentials: 'include'` so HTTP cookies set by the backend server are automatically included with every request.
- Simplified helper methods: `client.get`, `client.post`, `client.put`, `client.delete`.
- Endpoints called:
  - `POST /auth/login` ({ email, password })
  - `POST /auth/register` ({ email, password, name })
  - `POST /auth/logout`
  - `GET /auth/me` (restores session on `useEffect` mount)

### B. Routing & Route Guards (`react-router-dom`)
- `/` -> Landing Page (Product pitch, feature showcase, testimonials, CTA).
- `/login` -> Login Page.
- `/register` -> Register Page.
- `/dashboard` -> Protected Todo Application Dashboard (redirects to `/login` if unauthenticated).

### C. Landing Page Design (Pro Seller Pitch)
- Headline: "Master Your Productivity with TaskFlow Pro"
- Features: Smart Categorization, Focus Mode, Real-Time Progress, Seamless Sync.
- Interactive stats banner & call to action cards.
- Sleek modern UI using Tailwind CSS with glassmorphism & gradients.

## 4. Error Handling & State Management
- Form inputs feature client-side validation (Email regex, Password length, Confirm Password match).
- API errors display dismissible, user-friendly alert badges.
- Auth context handles initialization loading state during session restoration on app load (`GET /auth/me`).

## 5. Verification Plan
- Verify clean build with `tsc -b && vite build`.
- Verify page routing (`/`, `/login`, `/register`, `/dashboard`).
- Verify API requests target `http://localhost:3000/api` with `credentials: 'include'`.
