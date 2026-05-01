# Frontend - Customer Application

React + Tailwind CSS Customer-facing e-commerce application

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/   # Reusable components
│   ├── pages/        # Page components
│   ├── context/      # Zustand stores (auth, cart)
│   ├── services/     # API client
│   ├── styles/       # CSS files
│   ├── App.jsx       # Root component
│   └── main.jsx      # Entry point
├── vite.config.js    # Vite configuration
└── package.json
```

## Pages

- **Home** - Landing page with featured products
- **Products** - Product catalog with search & filters
- **ProductDetail** - Individual product page
- **Cart** - Shopping cart management
- **Checkout** - Order creation & payment
- **Orders** - User's order history
- **Profile** - User profile & address management
- **Chat** - AI chatbot for customer support
- **Login** - User login
- **Register** - User registration

## Components

- **Header** - Navigation bar
- **Footer** - Footer section
- **ProductCard** - Product display card
- **ProtectedRoute** - Auth-protected routes

## Key Features

- ✅ Product browsing with filters
- ✅ Shopping cart (local storage)
- ✅ User authentication
- ✅ Checkout flow
- ✅ Multiple payment methods (VNPay, MoMo, COD)
- ✅ Order tracking
- ✅ AI chatbot integration
- ✅ User profile management
- ✅ Responsive design (mobile-first)
- ✅ Modern UI with Tailwind CSS

## State Management

- **Auth Store** (Zustand) - User authentication state
- **Cart Store** (Zustand) - Shopping cart state

## Available Scripts

- `npm run dev` - Development server (port 3000)
- `npm run build` - Production build
- `npm run preview` - Preview production build
