# Admin Dashboard

React + Tailwind CSS + Recharts Admin management interface

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
admin/
├── src/
│   ├── components/   # Admin components
│   ├── pages/        # Admin pages
│   ├── context/      # Auth store
│   ├── services/     # API client
│   ├── styles/       # CSS files
│   ├── App.jsx       # Root component
│   └── main.jsx      # Entry point
├── vite.config.js    # Vite configuration
└── package.json
```

## Pages

- **Login** - Admin login
- **Dashboard** - Statistics & analytics
- **Products** - Product management (CRUD)
- **Orders** - Order management & status updates
- **Users** - User management & status control

## Components

- **AdminLayout** - Main layout with sidebar
- **ProtectedRoute** - Auth-protected routes

## Key Features

- ✅ Admin authentication
- ✅ Dashboard with statistics
- ✅ Product management (Create, Read, Update, Delete)
- ✅ Order tracking & status updates
- ✅ User management & status control
- ✅ Charts & analytics (Recharts)
- ✅ Responsive sidebar navigation
- ✅ Role-based access control
- ✅ Modern admin UI

## Admin Dashboard Features

### Statistics
- Total Users count
- Total Products count
- Total Orders count
- Total Revenue
- Monthly revenue chart
- Order status breakdown pie chart

### Product Management
- View all products with pagination
- Add new products
- Edit existing products
- Delete products
- Search and filter

### Order Management
- View all orders
- Update order status
- Filter by status
- Track payment status

### User Management
- View all users
- Change user status (active/inactive/blocked)
- Delete users
- View user details

## Available Scripts

- `npm run dev` - Development server (port 3001)
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Default Admin Login

Email: admin@example.com
Password: admin123

*Change these immediately after first login!*
