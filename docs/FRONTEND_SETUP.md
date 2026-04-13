# Frontend Setup Guide

## Overview

The frontend is a **React 18** application built with **TypeScript**, **Vite**, **Tailwind CSS**, and **Redux Toolkit**. It communicates with the Spring Boot backend API at `/api/v1`.

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.x | UI framework |
| TypeScript | 5.x | Type safety |
| Vite | 5.x | Build tool |
| Tailwind CSS | 3.x | Styling |
| Redux Toolkit | 2.x | State management |
| React Router | 6.x | Navigation |
| Axios | 1.x | HTTP client |
| Stripe.js | 3.x | Payment processing |
| Recharts | 2.x | Charts (admin dashboard) |
| React Toastify | 10.x | Toast notifications |

## Project Structure

```
frontend/
├── src/
│   ├── components/shared/      # Reusable components
│   ├── pages/                  # Route pages
│   │   ├── auth/
│   │   ├── products/
│   │   ├── cart/
│   │   ├── orders/
│   │   ├── checkout/
│   │   ├── profile/
│   │   └── admin/
│   ├── services/               # Axios API services
│   ├── store/slices/           # Redux Toolkit slices
│   ├── types/                  # TypeScript types
│   ├── App.tsx                 # Router configuration
│   └── main.tsx                # Entry point
├── .env.example
├── Dockerfile
├── nginx.conf
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Local Development

### Prerequisites
- Node.js 20+
- Backend running on port 8080

```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with your Stripe key
npm run dev
```

App runs at `http://localhost:5173`.

### Scripts
```bash
npm run dev       # Development server with hot reload
npm run build     # Production build
npm run preview   # Preview production build
npm run lint      # ESLint
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_BASE_URL` | Backend API URL (default: `http://localhost:8080/api/v1`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

## Key Features

- **JWT Authentication** – tokens stored in localStorage, auto-attached via Axios interceptor
- **Dark Mode** – `dark:` Tailwind variants, toggled via Navbar button
- **Redux Toolkit** – 5 slices: auth, product, cart, order, admin
- **Stripe Payment** – CardElement with payment intent flow
- **Protected Routes** – ProtectedRoute and AdminRoute HOCs
- **Toast Notifications** – react-toastify for success/error messages

## Production Build

```bash
cd frontend && npm run build
# Output in frontend/dist/
```

## Docker

```bash
docker build -t ecommerce-frontend ./frontend
docker run -p 3000:80 ecommerce-frontend
```
