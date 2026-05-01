# Backend API Server

Node.js + Express REST API for E-Commerce & Customer Service Platform

## Quick Start

```bash
# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# Then start the server
npm run dev
```

## Project Structure

```
backend/
├── config/           # Database configuration
├── models/          # Mongoose schemas
├── controllers/     # Request handlers
├── routes/          # API routes
├── middleware/      # Auth, error handling
├── utils/           # Helper functions
├── server.js        # Entry point
└── package.json
```

## API Routes

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/products` - Product management
- `/api/orders` - Order management
- `/api/payments` - Payment processing
- `/api/chat` - Chatbot service
- `/api/dashboard` - Admin dashboard stats

## Environment Variables

```
MONGODB_URI=           # MongoDB connection string
JWT_SECRET=            # JWT secret key
CHATGPT_API_KEY=       # OpenAI API key
VNPAY_TMN_CODE=        # VNPay terminal code
VNPAY_HASH_SECRET=     # VNPay secret
MOMO_ACCESS_KEY=       # MoMo access key
MOMO_SECRET_KEY=       # MoMo secret
MOMO_PARTNER_CODE=     # MoMo partner code
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

## Key Features

- ✅ JWT Authentication
- ✅ Role-based Authorization (Admin/User)
- ✅ Product CRUD with search & filtering
- ✅ Order management with status tracking
- ✅ VNPay & MoMo payment integration
- ✅ ChatGPT-powered chatbot
- ✅ MongoDB data persistence
- ✅ RESTful API design
- ✅ Error handling middleware
- ✅ CORS support

## Database Models

- **User** - Customer & admin accounts
- **Product** - Product catalog
- **Order** - Customer orders
- **Payment** - Payment transactions
- **Chat** - Chat conversations

## Available Scripts

- `npm start` - Production server
- `npm run dev` - Development with nodemon
