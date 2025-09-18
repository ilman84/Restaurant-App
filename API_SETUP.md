# API Setup Documentation

## Environment Variables

Buat file `.env.local` di root project dengan konfigurasi berikut:

```env
NEXT_PUBLIC_API_BASE_URL=https://berestaurantappformentee-production.up.railway.app
NEXT_PUBLIC_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIwLCJpYXQiOjE3NTc2OTc3NjYsImV4cCI6MTc1ODMwMjU2Nn0.HcIz5wyoCeRZW5_4RwgIIHkxJ-r9xY9KAJYwttgD9cQ
```

## API Configuration

### Base URL

- **Production**: `https://berestaurantappformentee-production.up.railway.app`
- **Swagger Documentation**: `https://berestaurantappformentee-production.up.railway.app/api-swagger`

### Authentication

- Token sudah dikonfigurasi untuk user ID: 20
- Token akan otomatis ditambahkan ke header Authorization

## Services Available

### 1. Authentication Service (`src/services/authService.ts`)

- `login(loginData)` - User login
- `register(registerData)` - User registration
- `logout()` - User logout
- `getProfile()` - Get user profile
- `updateProfile(updateData)` - Update user profile

### 2. Restaurant Service (`src/services/restaurantService.ts`)

- `getRestaurants()` - Get all restaurants
- `getRestaurantById(id)` - Get restaurant details
- `getRestaurantMenu(restaurantId)` - Get restaurant menu

### 3. Order Service (`src/services/orderService.ts`)

- `createOrder(orderData)` - Create new order
- `getUserOrders()` - Get user orders
- `getOrderById(id)` - Get order details
- `cancelOrder(id)` - Cancel order

## Usage Example

```typescript
import { authService } from '@/services/authService';
import { restaurantService } from '@/services/restaurantService';

// Login user
const loginData = {
  email: 'user@example.com',
  password: 'password123',
};
const loginResult = await authService.login(loginData);

// Get user profile
const profile = await authService.getProfile();

// Update profile
const updateData = {
  name: 'John Doe Updated',
  phone: '081234567891',
  currentPassword: 'oldpassword123',
  newPassword: 'newpassword123',
};
const updatedProfile = await authService.updateProfile(updateData);

// Get restaurants
const restaurants = await restaurantService.getRestaurants();
```

## Error Handling

Semua service sudah dilengkapi dengan error handling yang akan:

- Menampilkan pesan error yang sesuai
- Handle token expired (401)
- Handle forbidden access (403)
- Handle server errors (500+)
