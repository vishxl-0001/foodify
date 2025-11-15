# Foodify - Full-Stack Food Delivery Platform

A comprehensive food delivery web application inspired by Swiggy/Zomato, built with React, Tailwind CSS, and Supabase backend.

## 🚀 Features

### User Features
- **Authentication System**
  - User signup/login with JWT authentication
  - Password recovery functionality
  - Secure session management
  
- **Restaurant Discovery**
  - Browse restaurants with beautiful cards
  - Advanced filtering (veg/non-veg, cuisine, price, rating)
  - Real-time search functionality
  - Multiple sorting options

- **Food Ordering**
  - View restaurant menus with detailed dish information
  - Shopping cart with quantity management
  - Smooth checkout process
  - Multiple payment options (Razorpay integration + COD)

- **Order Management**
  - Real-time order tracking
  - Order status updates (5 stages)
  - Order history
  - Estimated delivery time

### Admin Features
- **Dashboard**
  - Revenue and order statistics
  - User management
  - Restaurant management
  - Real-time metrics

- **Order Management**
  - View all orders
  - Monitor order statuses
  - Track deliveries

### Delivery Partner Features
- **Order Assignment**
  - View available orders
  - Accept delivery requests
  - Manage active deliveries

- **Status Updates**
  - Update order status in real-time
  - Mark orders as picked up/delivered

## 🛠 Tech Stack

### Frontend
- **React** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Router DOM** - Routing
- **Lucide React** - Icons
- **Shadcn/UI** - UI components

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database (KV store)
  - REST API
  - Real-time subscriptions
  - Authentication

- **Hono** - Web framework for Edge Functions
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT auth

### Payment Integration
- **Razorpay** - Payment gateway integration

## 📦 Project Structure

```
/
├── App.tsx                          # Main app with routing
├── components/
│   ├── Login.tsx                    # Login page
│   ├── Signup.tsx                   # Signup page
│   ├── PasswordRecovery.tsx         # Password recovery
│   ├── Home.tsx                     # Restaurant listing
│   ├── RestaurantDetail.tsx         # Restaurant menu
│   ├── Cart.tsx                     # Shopping cart
│   ├── Checkout.tsx                 # Checkout with payment
│   ├── OrderTracking.tsx            # Real-time order tracking
│   ├── MyOrders.tsx                 # Order history
│   ├── AdminDashboard.tsx           # Admin panel
│   ├── DeliveryPartnerDashboard.tsx # Delivery interface
│   ├── UserProfile.tsx              # User profile
│   └── SeedDataButton.tsx           # Demo data seeder
│   └── ui/                          # Shadcn UI components
├── supabase/functions/server/
│   └── index.tsx                    # Backend API server
├── styles/
│   └── globals.css                  # Global styles
└── utils/supabase/
    └── info.tsx                     # Supabase config
```

## 🗃 Database Schema

The application uses Supabase's KV (Key-Value) store with the following structure:

### Users
```typescript
user:{userId} = {
  id: string
  email: string
  password: string (hashed)
  name: string
  phone: string
  role: 'customer' | 'admin' | 'delivery-partner'
  address: string
  createdAt: string
}
```

### Restaurants
```typescript
restaurant:{restaurantId} = {
  id: string
  name: string
  image: string
  cuisines: string[]
  rating: number
  totalReviews: number
  deliveryTime: number
  avgPrice: number
  isVeg: boolean
  address: string
  location: { lat: number, lng: number }
  isOpen: boolean
}
```

### Dishes
```typescript
dish:{dishId} = {
  id: string
  restaurantId: string
  name: string
  description: string
  price: number
  image: string
  category: string
  cuisine: string
  isVeg: boolean
  rating: number
  isPopular: boolean
}
```

### Orders
```typescript
order:{orderId} = {
  id: string
  userId: string
  restaurantId: string
  items: Array<{
    dishId: string
    name: string
    price: number
    quantity: number
    total: number
  }>
  subtotal: number
  deliveryFee: number
  tax: number
  total: number
  deliveryAddress: string
  paymentMethod: string
  paymentStatus: string
  status: 'pending' | 'confirmed' | 'preparing' | 'on_the_way' | 'delivered' | 'cancelled'
  deliveryPartnerId?: string
  createdAt: string
  estimatedDelivery: string
}
```

## 🔌 API Endpoints

### Authentication
- `POST /auth/signup` - User registration
- `POST /auth/login` - User login
- `POST /auth/forgot-password` - Request password reset
- `POST /auth/reset-password` - Reset password

### Restaurants
- `GET /restaurants` - Get all restaurants (with filters)
- `GET /restaurants/:id` - Get restaurant details and menu

### Dishes
- `GET /dishes/search` - Search dishes

### Cart
- `GET /cart` - Get user cart
- `POST /cart` - Update cart
- `DELETE /cart` - Clear cart

### Orders
- `POST /orders` - Create new order
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details
- `PATCH /orders/:id/status` - Update order status

### Payments
- `POST /payment/create-order` - Create Razorpay order
- `POST /payment/verify` - Verify payment

### Delivery Partner
- `GET /delivery/available-orders` - Get available orders
- `POST /delivery/accept-order` - Accept delivery
- `GET /delivery/my-orders` - Get active deliveries

### Admin
- `GET /admin/orders` - Get all orders
- `GET /admin/users` - Get all users
- `POST /admin/restaurants` - Create/update restaurant
- `POST /admin/dishes` - Create/update dish
- `GET /admin/stats` - Get platform statistics

### Data Seeding
- `POST /seed-data` - Initialize demo data

## 🎨 Design Features

### Indian Theme
- Orange and red color scheme (#F97316, #EF4444)
- Gradient backgrounds
- Modern, clean UI
- Responsive design

### UX Features
- Smooth transitions and animations
- Loading states
- Error handling
- Real-time updates
- Mobile-responsive layout

## 🚦 Getting Started

### Prerequisites
- Node.js 16+ 
- Supabase account (auto-configured in Figma Make)

### Initial Setup

1. **Seed Demo Data**
   - Click the "Seed Demo Data" button on the home page
   - This will create:
     - 6 demo restaurants
     - 21+ dishes
     - Admin account
     - Delivery partner account

2. **Demo Credentials**
   ```
   Admin:
   Email: admin@foodify.com
   Password: admin123

   Delivery Partner:
   Email: partner@foodify.com
   Password: partner123

   Customer:
   Create your own account via signup
   ```

### Using the Application

#### As a Customer:
1. Sign up for a new account
2. Browse restaurants
3. Apply filters (veg, cuisine, price, rating)
4. Click on a restaurant to view menu
5. Add items to cart
6. Proceed to checkout
7. Enter delivery address
8. Choose payment method (Razorpay or COD)
9. Track your order in real-time

#### As an Admin:
1. Login with admin credentials
2. View dashboard statistics
3. Monitor all orders
4. Manage users
5. View platform metrics

#### As a Delivery Partner:
1. Login with partner credentials
2. View available orders
3. Accept delivery requests
4. Update order status (preparing → on the way → delivered)
5. Manage active deliveries

## 💳 Razorpay Integration

The application includes Razorpay payment gateway integration:

- **Test Mode**: Uses demo Razorpay key for testing
- **Production**: Configure `RAZORPAY_KEY_ID` and `RAZORPAY_KEY_SECRET` environment variables
- **Supported Methods**: UPI, Cards, Wallets, Net Banking

### Payment Flow:
1. User creates order
2. Server generates Razorpay order
3. Client opens Razorpay checkout
4. User completes payment
5. Server verifies payment signature
6. Order status updated to 'confirmed'

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Authentication**: Secure token-based auth
- **Protected Routes**: Middleware authentication
- **Role-Based Access**: Admin, customer, delivery partner roles
- **Input Validation**: Server-side validation
- **CORS**: Configured for security

## 📱 Responsive Design

- **Mobile**: Optimized for phones (320px+)
- **Tablet**: Responsive layout for tablets
- **Desktop**: Full experience on desktop
- **Adaptive**: UI adjusts based on screen size

## 🎯 Future Enhancements

- Google Maps API integration for live tracking
- Email notifications with Nodemailer
- Review and rating system (partially implemented)
- Restaurant owner dashboard
- Advanced analytics
- Push notifications
- Promotional codes/coupons
- Favorites/wishlists
- Multiple delivery addresses
- Order scheduling

## 🐛 Known Limitations

- Google Maps API mock (for demo purposes)
- Razorpay test mode (not production-ready)
- Email notifications not configured
- Limited to KV store (Supabase constraints)

## 📄 License

This is a demo application built for educational purposes.

## 🤝 Support

For issues or questions, please refer to the Figma Make documentation.

---

Built with ❤️ using React + Supabase
