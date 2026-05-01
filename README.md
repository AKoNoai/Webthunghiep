# E-Commerce & Customer Service Management Platform

A complete, production-ready full-stack e-commerce and customer service management platform built with modern technologies.

## 🏗️ Project Structure

```
webthunghiep/
├── backend/          # Node.js + Express API
├── frontend/         # React + Tailwind CSS (Customer App)
└── admin/           # React + Tailwind CSS (Admin Dashboard)
```

## 🚀 Features

### Core E-Commerce Features
- ✅ Product catalog with search, filter, and pagination
- ✅ Shopping cart management
- ✅ Complete checkout flow
- ✅ Order tracking and management
- ✅ Customer profile management

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Secure password hashing (bcrypt)
- ✅ Role-based access control (Admin/User)
- ✅ Protected routes

### Payment Integration
- ✅ VNPay payment gateway
- ✅ MoMo digital wallet
- ✅ Cash on Delivery (COD)
- ✅ Complete payment flow with callbacks
- ✅ Payment verification and order status update

### Intelligent Chatbot
- ✅ ChatGPT API integration
- ✅ Real-time conversation support
- ✅ Chat history storage in MongoDB
- ✅ Intent and context handling

### Admin Dashboard
- ✅ Comprehensive statistics and analytics
- ✅ Product management (CRUD)
- ✅ Order management with status updates
- ✅ User management
- ✅ Revenue tracking
- ✅ Interactive charts and graphs

## 💻 Technology Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **Axios** - HTTP client

### Frontend (Customer)
- **React 18** - UI library
- **React Router** - Navigation
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Vite** - Build tool
- **Lucide Icons** - Icon library

### Admin Dashboard
- **React 18** - UI library
- **React Router** - Navigation
- **Zustand** - State management
- **Tailwind CSS** - Styling
- **Recharts** - Data visualization
- **Vite** - Build tool

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ installed
- MongoDB Atlas account or local MongoDB
- Git

### 1. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure environment variables
# Update MONGODB_URI, JWT_SECRET, API keys, etc.

# Start development server
npm run dev
```

#### Required Environment Variables (.env)
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/ecommerce
JWT_SECRET=your_jwt_secret_key_here
CHATGPT_API_KEY=your_chatgpt_api_key
VNPAY_TMN_CODE=your_vnpay_code
VNPAY_HASH_SECRET=your_vnpay_secret
MOMO_ACCESS_KEY=your_momo_access_key
MOMO_SECRET_KEY=your_momo_secret_key
MOMO_PARTNER_CODE=your_momo_partner_code
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
ADMIN_URL=http://localhost:3001
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure API URL
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev

# Build for production
npm run build
```

### 3. Admin Dashboard Setup

```bash
cd admin

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure API URL
# VITE_API_URL=http://localhost:5000/api

# Start development server
npm run dev

# Build for production
npm run build
```

## 📋 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products` - Get all products (with filters)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/:id` - Update product (admin only)
- `DELETE /api/products/:id` - Delete product (admin only)

### Order Endpoints
- `POST /api/orders` - Create order
- `GET /api/orders/user/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order details
- `GET /api/orders` - Get all orders (admin only)
- `PATCH /api/orders/:id/status` - Update order status (admin only)
- `PATCH /api/orders/:id/cancel` - Cancel order

### Payment Endpoints
- `POST /api/payments/vnpay/create` - Create VNPay payment
- `POST /api/payments/momo/create` - Create MoMo payment
- `POST /api/payments/cod/create` - Create COD payment
- `GET /api/payments/vnpay/callback` - VNPay callback
- `POST /api/payments/momo/callback` - MoMo callback
- `GET /api/payments/:id` - Get payment details

### Chat Endpoints
- `GET /api/chat/session` - Get or create chat session
- `POST /api/chat/send` - Send message
- `GET /api/chat/history` - Get chat history
- `PATCH /api/chat/:chatId/close` - Close chat session

### Dashboard Endpoints
- `GET /api/dashboard/stats` - Get dashboard statistics (admin only)
- `GET /api/dashboard/top-products` - Get top products
- `GET /api/dashboard/recent-users` - Get recent users (admin only)

## 🔐 Default Admin Credentials

To login to the admin panel, create an admin user or use:
- **Email**: admin@example.com
- **Password**: admin123

*Note: Change these credentials after first login!*

## 🚢 Deployment to Vercel

### Backend Deployment

1. Create a Vercel account at vercel.com
2. Install Vercel CLI: `npm i -g vercel`
3. Configure MongoDB Atlas for production
4. Deploy:
   ```bash
   cd backend
   vercel
   ```

### Frontend Deployment

```bash
cd frontend
# Update VITE_API_URL to production backend URL
vercel
```

### Admin Deployment

```bash
cd admin
# Update VITE_API_URL to production backend URL
vercel
```

## 📊 Database Models

### User
- fullName, email, phone, password
- address (street, city, state, zipCode, country)
- role (admin/user), status (active/inactive/blocked)
- totalSpent, createdAt, updatedAt

### Product
- name, description, price, discountPrice
- category, image, images[]
- stock, rating, reviewCount
- sku, status, createdAt, updatedAt

### Order
- orderNumber, user (ref)
- items[] (product ref, quantity, price)
- totalAmount, shippingAddress
- paymentMethod, paymentStatus, orderStatus
- notes, createdAt, updatedAt

### Payment
- order (ref), transactionId
- paymentMethod, amount, status
- paymentDetails, redirectUrl
- createdAt, updatedAt

### Chat
- user (ref), messages[]
- conversationId, status (active/closed)
- createdAt, updatedAt

## 🧪 Testing the Application

### Create Test Product
```javascript
// Via Admin Dashboard
1. Login with admin credentials
2. Go to Products page
3. Click "Add Product"
4. Fill in details and submit
```

### Test Payment Flow
```
1. Login as customer
2. Add products to cart
3. Go to checkout
4. Choose payment method (VNPay/MoMo/COD)
5. Complete payment
6. Check order status in Orders page
```

### Test Chatbot
```
1. Login as customer
2. Click Chat button
3. Type a message
4. AI chatbot responds
5. Chat history saved in MongoDB
```

## 🛠️ Troubleshooting

### MongoDB Connection Error
- Ensure MongoDB Atlas IP whitelist includes your IP
- Check MONGODB_URI format in .env
- Verify database credentials

### Payment Integration Issues
- Verify API keys and secret keys
- Check callback URLs are correctly configured
- Ensure payment gateway accounts are active

### CORS Issues
- Backend CORS should allow frontend domains
- Check Access-Control-Allow-Origin headers

### Chatbot Not Responding
- Verify ChatGPT API key is valid
- Check API usage limits
- Ensure API account has credits

## 📚 Additional Resources

- [Express.js Documentation](https://expressjs.com/)
- [React Documentation](https://react.dev/)
- [MongoDB Documentation](https://docs.mongodb.com/)
- [VNPay Integration Guide](https://sandbox.vnpayment.vn/)
- [OpenAI API Documentation](https://platform.openai.com/docs/)

## 📝 License

This project is open source and available under the MIT License.

## 👥 Support

For questions or issues:
1. Check the troubleshooting section
2. Review API documentation
3. Check console logs for errors
4. Contact support team

---

**Happy coding! 🎉**
