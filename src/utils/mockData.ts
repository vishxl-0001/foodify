// Mock data for the application to work without backend

export const MOCK_RESTAURANTS = [
  { 
    id: 'rest-1', 
    name: 'Punjabi Dhaba', 
    image: 'https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800', 
    cuisines: ['North Indian', 'Punjabi', 'Tandoor'], 
    rating: 4.3, 
    totalReviews: 2500, 
    deliveryTime: 30, 
    avgPrice: 300, 
    isVeg: false, 
    address: 'Connaught Place, New Delhi', 
    location: { lat: 28.6304, lng: 77.2177 }, 
    isOpen: true 
  },
  { 
    id: 'rest-2', 
    name: 'Spice Garden', 
    image: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800', 
    cuisines: ['South Indian', 'Kerala', 'Vegetarian'], 
    rating: 4.5, 
    totalReviews: 1800, 
    deliveryTime: 25, 
    avgPrice: 250, 
    isVeg: true, 
    address: 'Koramangala, Bangalore', 
    location: { lat: 12.9352, lng: 77.6245 }, 
    isOpen: true 
  },
  { 
    id: 'rest-3', 
    name: 'Biryani Paradise', 
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800', 
    cuisines: ['Hyderabadi', 'Biryani', 'Mughlai'], 
    rating: 4.6, 
    totalReviews: 3200, 
    deliveryTime: 35, 
    avgPrice: 350, 
    isVeg: false, 
    address: 'Banjara Hills, Hyderabad', 
    location: { lat: 17.4239, lng: 78.4738 }, 
    isOpen: true 
  },
  { 
    id: 'rest-4', 
    name: 'Coastal Curry', 
    image: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800', 
    cuisines: ['Coastal', 'Seafood', 'Goan'], 
    rating: 4.4, 
    totalReviews: 1500, 
    deliveryTime: 40, 
    avgPrice: 400, 
    isVeg: false, 
    address: 'Bandra West, Mumbai', 
    location: { lat: 19.0596, lng: 72.8295 }, 
    isOpen: true 
  },
  { 
    id: 'rest-5', 
    name: 'Rajasthani Rasoi', 
    image: 'https://images.unsplash.com/photo-1559329007-40df8a9345d8?w=800', 
    cuisines: ['Rajasthani', 'Thali', 'Vegetarian'], 
    rating: 4.2, 
    totalReviews: 980, 
    deliveryTime: 28, 
    avgPrice: 280, 
    isVeg: true, 
    address: 'Pink City, Jaipur', 
    location: { lat: 26.9124, lng: 75.7873 }, 
    isOpen: true 
  },
  { 
    id: 'rest-6', 
    name: 'Bengal Bites', 
    image: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800', 
    cuisines: ['Bengali', 'Fish', 'Sweets'], 
    rating: 4.3, 
    totalReviews: 1200, 
    deliveryTime: 32, 
    avgPrice: 320, 
    isVeg: false, 
    address: 'Park Street, Kolkata', 
    location: { lat: 22.5726, lng: 88.3639 }, 
    isOpen: true 
  }
];

export const MOCK_DISHES: Record<string, any[]> = {
  'rest-1': [
    { id: 'dish-1', restaurantId: 'rest-1', name: 'Butter Chicken', description: 'Creamy tomato curry with tender chicken pieces', price: 320, image: 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=400', category: 'Main Course', cuisine: 'North Indian', isVeg: false, rating: 4.5, isPopular: true },
    { id: 'dish-2', restaurantId: 'rest-1', name: 'Paneer Tikka', description: 'Grilled cottage cheese marinated in spices', price: 280, image: 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400', category: 'Main Course', cuisine: 'North Indian', isVeg: true, rating: 4.3 },
    { id: 'dish-3', restaurantId: 'rest-1', name: 'Dal Makhani', description: 'Black lentils cooked in butter and cream', price: 240, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', category: 'Main Course', cuisine: 'North Indian', isVeg: true, rating: 4.4 },
    { id: 'dish-4', restaurantId: 'rest-1', name: 'Tandoori Roti', description: 'Whole wheat bread from clay oven', price: 30, image: 'https://images.unsplash.com/photo-1619871709568-5b45a04f9775?w=400', category: 'Breads', cuisine: 'North Indian', isVeg: true, rating: 4.2 },
    { id: 'dish-5', restaurantId: 'rest-1', name: 'Chicken Tikka', description: 'Grilled chicken pieces in yogurt marinade', price: 300, image: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400', category: 'Starters', cuisine: 'North Indian', isVeg: false, rating: 4.6, isPopular: true }
  ],
  'rest-2': [
    { id: 'dish-6', restaurantId: 'rest-2', name: 'Masala Dosa', description: 'Crispy rice crepe with spiced potato filling', price: 120, image: 'https://images.unsplash.com/photo-1694758752155-cbbb1f9b1f15?w=400', category: 'Breakfast', cuisine: 'South Indian', isVeg: true, rating: 4.6, isPopular: true },
    { id: 'dish-7', restaurantId: 'rest-2', name: 'Idli Sambar', description: 'Steamed rice cakes with lentil soup', price: 100, image: 'https://images.unsplash.com/photo-1630383249896-424e482df921?w=400', category: 'Breakfast', cuisine: 'South Indian', isVeg: true, rating: 4.5 },
    { id: 'dish-8', restaurantId: 'rest-2', name: 'Kerala Thali', description: 'Traditional Kerala meal platter', price: 300, image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400', category: 'Thali', cuisine: 'South Indian', isVeg: true, rating: 4.7, isPopular: true },
    { id: 'dish-9', restaurantId: 'rest-2', name: 'Uttapam', description: 'Thick rice pancake with vegetables', price: 130, image: 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=400', category: 'Breakfast', cuisine: 'South Indian', isVeg: true, rating: 4.4 },
    { id: 'dish-10', restaurantId: 'rest-2', name: 'Filter Coffee', description: 'Traditional South Indian coffee', price: 50, image: 'https://images.unsplash.com/photo-1511920170033-f8396924c348?w=400', category: 'Beverages', cuisine: 'South Indian', isVeg: true, rating: 4.8 }
  ],
  'rest-3': [
    { id: 'dish-11', restaurantId: 'rest-3', name: 'Chicken Biryani', description: 'Fragrant basmati rice with tender chicken', price: 350, image: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400', category: 'Biryani', cuisine: 'Hyderabadi', isVeg: false, rating: 4.8, isPopular: true },
    { id: 'dish-12', restaurantId: 'rest-3', name: 'Mutton Biryani', description: 'Slow-cooked mutton with aromatic rice', price: 400, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=400', category: 'Biryani', cuisine: 'Hyderabadi', isVeg: false, rating: 4.7, isPopular: true },
    { id: 'dish-13', restaurantId: 'rest-3', name: 'Veg Biryani', description: 'Mixed vegetable biryani with raita', price: 280, image: 'https://images.unsplash.com/photo-1642821373181-696a54913e93?w=400', category: 'Biryani', cuisine: 'Hyderabadi', isVeg: true, rating: 4.4 },
    { id: 'dish-14', restaurantId: 'rest-3', name: 'Mirchi Ka Salan', description: 'Spicy pepper curry', price: 180, image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=400', category: 'Curry', cuisine: 'Hyderabadi', isVeg: true, rating: 4.3 },
    { id: 'dish-15', restaurantId: 'rest-3', name: 'Double Ka Meetha', description: 'Bread pudding dessert', price: 120, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', category: 'Desserts', cuisine: 'Hyderabadi', isVeg: true, rating: 4.5 }
  ],
  'rest-4': [
    { id: 'dish-16', restaurantId: 'rest-4', name: 'Goan Fish Curry', description: 'Coconut-based fish curry', price: 380, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400', category: 'Seafood', cuisine: 'Goan', isVeg: false, rating: 4.6, isPopular: true },
    { id: 'dish-17', restaurantId: 'rest-4', name: 'Prawn Balchao', description: 'Spicy prawn pickle curry', price: 420, image: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b2?w=400', category: 'Seafood', cuisine: 'Goan', isVeg: false, rating: 4.5 },
    { id: 'dish-18', restaurantId: 'rest-4', name: 'Chicken Xacuti', description: 'Chicken in coconut curry', price: 350, image: 'https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=400', category: 'Curry', cuisine: 'Goan', isVeg: false, rating: 4.4 },
    { id: 'dish-19', restaurantId: 'rest-4', name: 'Bebinca', description: 'Traditional layered pudding', price: 150, image: 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=400', category: 'Desserts', cuisine: 'Goan', isVeg: true, rating: 4.3 }
  ],
  'rest-5': [
    { id: 'dish-20', restaurantId: 'rest-5', name: 'Rajasthani Thali', description: 'Traditional Rajasthani meal platter', price: 350, image: 'https://images.unsplash.com/photo-1606491956689-2ea866880c84?w=400', category: 'Thali', cuisine: 'Rajasthani', isVeg: true, rating: 4.7, isPopular: true },
    { id: 'dish-21', restaurantId: 'rest-5', name: 'Dal Baati Churma', description: 'Lentils with baked wheat balls', price: 280, image: 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=400', category: 'Main Course', cuisine: 'Rajasthani', isVeg: true, rating: 4.6 },
    { id: 'dish-22', restaurantId: 'rest-5', name: 'Gatte Ki Sabzi', description: 'Gram flour dumplings curry', price: 220, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', category: 'Curry', cuisine: 'Rajasthani', isVeg: true, rating: 4.4 },
    { id: 'dish-23', restaurantId: 'rest-5', name: 'Ghevar', description: 'Sweet honeycomb dessert', price: 130, image: 'https://images.unsplash.com/photo-1621303837174-89787a7d4729?w=400', category: 'Desserts', cuisine: 'Rajasthani', isVeg: true, rating: 4.5 }
  ],
  'rest-6': [
    { id: 'dish-24', restaurantId: 'rest-6', name: 'Macher Jhol', description: 'Traditional Bengali fish curry', price: 340, image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=400', category: 'Fish', cuisine: 'Bengali', isVeg: false, rating: 4.6, isPopular: true },
    { id: 'dish-25', restaurantId: 'rest-6', name: 'Prawn Malai Curry', description: 'Prawns in coconut milk', price: 390, image: 'https://images.unsplash.com/photo-1633504581786-316c8002b1b2?w=400', category: 'Fish', cuisine: 'Bengali', isVeg: false, rating: 4.7 },
    { id: 'dish-26', restaurantId: 'rest-6', name: 'Aloo Posto', description: 'Potatoes in poppy seed paste', price: 180, image: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400', category: 'Vegetarian', cuisine: 'Bengali', isVeg: true, rating: 4.3 },
    { id: 'dish-27', restaurantId: 'rest-6', name: 'Mishti Doi', description: 'Sweet yogurt dessert', price: 80, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', category: 'Sweets', cuisine: 'Bengali', isVeg: true, rating: 4.8 },
    { id: 'dish-28', restaurantId: 'rest-6', name: 'Rosogolla', description: 'Spongy cottage cheese balls in syrup', price: 100, image: 'https://images.unsplash.com/photo-1606312619070-d48b4cdd7bf7?w=400', category: 'Sweets', cuisine: 'Bengali', isVeg: true, rating: 4.9, isPopular: true }
  ]
};

export const DEMO_USERS = {
  customer: { id: 'user-1', email: 'demo@foodify.com', password: 'demo123', name: 'Demo User', phone: '9876543210', role: 'customer', address: '123 Main Street, Mumbai' },
  admin: { id: 'admin-1', email: 'admin@foodify.com', password: 'admin123', name: 'Admin User', phone: '9999999999', role: 'admin' },
  deliveryPartner: { id: 'partner-1', email: 'partner@foodify.com', password: 'partner123', name: 'Delivery Partner', phone: '8888888888', role: 'delivery-partner' }
};

// Delivery partner pool with Indian names and random phone numbers
export const DELIVERY_PARTNERS = [
  { id: 'partner-1', email: 'partner@foodify.com', password: 'partner123', name: 'Rajesh Kumar', phone: '9876543210', role: 'delivery-partner', vehicleNumber: 'MH-01-AB-1234' },
  { id: 'partner-2', email: 'amit@foodify.com', password: 'partner123', name: 'Amit Singh', phone: '9765432109', role: 'delivery-partner', vehicleNumber: 'DL-03-CD-5678' },
  { id: 'partner-3', email: 'priya@foodify.com', password: 'partner123', name: 'Priya Sharma', phone: '9654321098', role: 'delivery-partner', vehicleNumber: 'KA-05-EF-9012' },
  { id: 'partner-4', email: 'vijay@foodify.com', password: 'partner123', name: 'Vijay Patel', phone: '9543210987', role: 'delivery-partner', vehicleNumber: 'GJ-07-GH-3456' },
  { id: 'partner-5', email: 'deepa@foodify.com', password: 'partner123', name: 'Deepa Reddy', phone: '9432109876', role: 'delivery-partner', vehicleNumber: 'TS-09-IJ-7890' }
];

// Initialize demo data in localStorage
export function initializeDemoData() {
  if (!localStorage.getItem('foodify_initialized')) {
    localStorage.setItem('foodify_users', JSON.stringify([
      DEMO_USERS.customer,
      DEMO_USERS.admin,
      ...DELIVERY_PARTNERS
    ]));
    localStorage.setItem('foodify_orders', JSON.stringify([]));
    localStorage.setItem('foodify_restaurants', JSON.stringify(MOCK_RESTAURANTS));
    localStorage.setItem('foodify_initialized', 'true');
  }
}

export function authenticateUser(email: string, password: string) {
  const users = JSON.parse(localStorage.getItem('foodify_users') || '[]');
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (user) {
    const { password: _, ...userWithoutPassword } = user;
    const token = btoa(JSON.stringify({ userId: user.id, timestamp: Date.now() }));
    return { user: userWithoutPassword, token };
  }
  
  return null;
}

export function registerUser(email: string, password: string, name: string, phone: string) {
  const users = JSON.parse(localStorage.getItem('foodify_users') || '[]');
  
  if (users.find((u: any) => u.email === email)) {
    throw new Error('User already exists');
  }
  
  const newUser = {
    id: `user-${Date.now()}`,
    email,
    password,
    name,
    phone,
    role: 'customer',
    address: '',
    createdAt: new Date().toISOString()
  };
  
  users.push(newUser);
  localStorage.setItem('foodify_users', JSON.stringify(users));
  
  const { password: _, ...userWithoutPassword } = newUser;
  const token = btoa(JSON.stringify({ userId: newUser.id, timestamp: Date.now() }));
  return { user: userWithoutPassword, token };
}

export function getOrders(userId: string) {
  const orders = JSON.parse(localStorage.getItem('foodify_orders') || '[]');
  return orders.filter((o: any) => o.userId === userId).sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getAllOrders() {
  const orders = JSON.parse(localStorage.getItem('foodify_orders') || '[]');
  return orders.sort((a: any, b: any) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function createOrder(userId: string, items: any[], restaurantId: string, deliveryAddress: string, paymentMethod: string) {
  const orders = JSON.parse(localStorage.getItem('foodify_orders') || '[]');
  
  const newOrder = {
    id: `order-${Date.now()}`,
    userId,
    restaurantId,
    items,
    subtotal: items.reduce((sum, item) => sum + item.total, 0),
    deliveryFee: items.reduce((sum, item) => sum + item.total, 0) > 200 ? 0 : 40,
    tax: items.reduce((sum, item) => sum + item.total, 0) * 0.05,
    total: 0,
    deliveryAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'razorpay' ? 'paid' : 'pending',
    status: 'pending',
    createdAt: new Date().toISOString(),
    estimatedDelivery: new Date(Date.now() + 40 * 60 * 1000).toISOString()
  };
  
  newOrder.total = newOrder.subtotal + newOrder.deliveryFee + newOrder.tax;
  
  orders.push(newOrder);
  localStorage.setItem('foodify_orders', JSON.stringify(orders));
  
  return newOrder;
}

export function updateOrderStatus(orderId: string, status: string, location?: any) {
  const orders = JSON.parse(localStorage.getItem('foodify_orders') || '[]');
  const orderIndex = orders.findIndex((o: any) => o.id === orderId);
  
  if (orderIndex !== -1) {
    orders[orderIndex].status = status;
    orders[orderIndex].updatedAt = new Date().toISOString();
    if (location) {
      orders[orderIndex].deliveryLocation = location;
    }
    if (status === 'delivered') {
      orders[orderIndex].deliveredAt = new Date().toISOString();
    }
    localStorage.setItem('foodify_orders', JSON.stringify(orders));
    return orders[orderIndex];
  }
  
  return null;
}

export function assignDeliveryPartner(orderId: string, partnerId: string) {
  const orders = JSON.parse(localStorage.getItem('foodify_orders') || '[]');
  const orderIndex = orders.findIndex((o: any) => o.id === orderId);
  
  if (orderIndex !== -1) {
    orders[orderIndex].deliveryPartnerId = partnerId;
    orders[orderIndex].status = 'preparing';
    orders[orderIndex].acceptedAt = new Date().toISOString();
    localStorage.setItem('foodify_orders', JSON.stringify(orders));
    return orders[orderIndex];
  }
  
  return null;
}