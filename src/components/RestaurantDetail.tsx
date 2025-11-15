import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UtensilsCrossed, Star, Clock, MapPin, ArrowLeft, ShoppingCart, Plus, Minus, Leaf, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MOCK_RESTAURANTS, MOCK_DISHES } from '../utils/mockData';

interface RestaurantDetailProps {
  user: any;
  token: string | null;
  onLogout: () => void;
}

export function RestaurantDetail({ user, token, onLogout }: RestaurantDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [dishes, setDishes] = useState<any[]>([]);
  const [filteredDishes, setFilteredDishes] = useState<any[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ veg: false, category: '', search: '' });

  useEffect(() => {
    fetchRestaurantDetail();
    loadCart();
  }, [id]);

  useEffect(() => {
    applyFilters();
  }, [filter, dishes]);

  const fetchRestaurantDetail = async () => {
    try {
      const foundRestaurant = MOCK_RESTAURANTS.find(r => r.id === id);
      const restaurantDishes = MOCK_DISHES[id || ''] || [];
      
      if (foundRestaurant) {
        setRestaurant(foundRestaurant);
        setDishes(restaurantDishes);
      } else {
        console.error('Restaurant not found');
      }
    } catch (error) {
      console.error('Failed to fetch restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  };

  const saveCart = (newCart: any[]) => {
    setCart(newCart);
    localStorage.setItem('cart', JSON.stringify(newCart));
  };

  const applyFilters = () => {
    let filtered = [...dishes];

    if (filter.veg) {
      filtered = filtered.filter(d => d.isVeg);
    }

    if (filter.category) {
      filtered = filtered.filter(d => d.category === filter.category);
    }

    if (filter.search) {
      const query = filter.search.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(query) ||
        d.description.toLowerCase().includes(query)
      );
    }

    setFilteredDishes(filtered);
  };

  const addToCart = (dish: any) => {
    if (!user) {
      navigate('/login');
      return;
    }

    const existingItem = cart.find(item => item.dishId === dish.id);

    if (existingItem) {
      const newCart = cart.map(item =>
        item.dishId === dish.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      saveCart(newCart);
    } else {
      const newCart = [...cart, {
        dishId: dish.id,
        name: dish.name,
        price: dish.price,
        quantity: 1,
        restaurantId: dish.restaurantId,
        isVeg: dish.isVeg
      }];
      saveCart(newCart);
    }
  };

  const updateQuantity = (dishId: string, delta: number) => {
    const existingItem = cart.find(item => item.dishId === dishId);

    if (existingItem) {
      const newQuantity = existingItem.quantity + delta;

      if (newQuantity === 0) {
        const newCart = cart.filter(item => item.dishId !== dishId);
        saveCart(newCart);
      } else {
        const newCart = cart.map(item =>
          item.dishId === dishId
            ? { ...item, quantity: newQuantity }
            : item
        );
        saveCart(newCart);
      }
    }
  };

  const getItemQuantity = (dishId: string) => {
    const item = cart.find(item => item.dishId === dishId);
    return item ? item.quantity : 0;
  };

  const categories = Array.from(new Set(dishes.map(d => d.category)));
  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!restaurant) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Restaurant not found</p>
          <Button onClick={() => navigate('/')} className="mt-4">Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6 text-white" />
              </div>
              <span className="text-orange-600">Foodify</span>
            </Link>

            <div className="flex items-center gap-4">
              {user && (
                <>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{user.name}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Restaurant Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex gap-6">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-32 h-32 object-cover rounded-xl"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="mb-2 text-gray-900">{restaurant.name}</h1>
                  <p className="text-gray-600 mb-3">{restaurant.cuisines.join(', ')}</p>

                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1 text-green-600">
                      <Star className="w-4 h-4 fill-current" />
                      <span>{restaurant.rating}</span>
                      <span className="text-gray-400">({restaurant.totalReviews})</span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>{restaurant.deliveryTime} mins</span>
                    </div>

                    <div className="flex items-center gap-1 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{restaurant.address}</span>
                    </div>
                  </div>
                </div>

                {restaurant.isVeg && (
                  <Badge className="bg-green-600">
                    <Leaf className="w-3 h-3 mr-1" />
                    Pure Veg
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <Input
              type="text"
              placeholder="Search dishes..."
              value={filter.search}
              onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
              className="max-w-xs"
            />

            <Button
              variant={filter.veg ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(prev => ({ ...prev, veg: !prev.veg }))}
              className={filter.veg ? "bg-green-600 hover:bg-green-700" : ""}
            >
              <Leaf className="w-4 h-4 mr-1" />
              Veg Only
            </Button>

            <Select value={filter.category} onValueChange={(value) => setFilter(prev => ({ ...prev, category: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Categories</SelectItem>
                {categories.map(cat => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <h2 className="mb-6 text-gray-900">Menu</h2>

            {filteredDishes.length === 0 ? (
              <p className="text-gray-600">No dishes found</p>
            ) : (
              <div className="space-y-4">
                {filteredDishes.map(dish => {
                  const quantity = getItemQuantity(dish.id);

                  return (
                    <div key={dish.id} className="bg-white rounded-xl p-4 shadow-sm flex gap-4">
                      <img
                        src={dish.image}
                        alt={dish.name}
                        className="w-24 h-24 object-cover rounded-lg"
                      />

                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h3 className="text-gray-900 flex items-center gap-2">
                              {dish.name}
                              {dish.isVeg ? (
                                <span className="w-4 h-4 border-2 border-green-600 flex items-center justify-center">
                                  <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                                </span>
                              ) : (
                                <span className="w-4 h-4 border-2 border-red-600 flex items-center justify-center">
                                  <span className="w-2 h-2 bg-red-600 rounded-full"></span>
                                </span>
                              )}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">{dish.description}</p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          <span className="text-gray-900">₹{dish.price}</span>

                          {quantity === 0 ? (
                            <Button
                              size="sm"
                              onClick={() => addToCart(dish)}
                              className="bg-orange-500 hover:bg-orange-600"
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add
                            </Button>
                          ) : (
                            <div className="flex items-center gap-3 bg-orange-500 text-white rounded-lg px-3 py-1.5">
                              <button onClick={() => updateQuantity(dish.id, -1)}>
                                <Minus className="w-4 h-4" />
                              </button>
                              <span>{quantity}</span>
                              <button onClick={() => updateQuantity(dish.id, 1)}>
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Cart Summary */}
          {cart.length > 0 && (
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="mb-4 text-gray-900">Cart ({cartCount} items)</h3>

                <div className="space-y-3 mb-4">
                  {cart.map(item => (
                    <div key={item.dishId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-gray-900">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{cartTotal}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-900">₹{cartTotal > 200 ? 0 : 40}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{cartTotal + (cartTotal > 200 ? 0 : 40)}</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}