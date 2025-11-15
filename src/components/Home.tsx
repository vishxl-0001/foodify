import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, Search, Star, Clock, MapPin, ShoppingCart, User, LogOut, Filter, Leaf, DollarSign } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { MOCK_RESTAURANTS, initializeDemoData } from '../utils/mockData';

interface HomeProps {
  user: any;
  token: string | null;
  onLogout: () => void;
}

export function Home({ user, token, onLogout }: HomeProps) {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    veg: false,
    cuisine: '',
    minRating: '',
    maxPrice: '',
    sort: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    initializeDemoData();
    setRestaurants(MOCK_RESTAURANTS);
    setLoading(false);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, filters, restaurants]);

  const applyFilters = () => {
    let filtered = [...restaurants];

    // Search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(r =>
        r.name.toLowerCase().includes(query) ||
        r.cuisines.some((c: string) => c.toLowerCase().includes(query))
      );
    }

    // Veg filter
    if (filters.veg) {
      filtered = filtered.filter(r => r.isVeg);
    }

    // Cuisine filter
    if (filters.cuisine) {
      filtered = filtered.filter(r => r.cuisines.includes(filters.cuisine));
    }

    // Rating filter
    if (filters.minRating) {
      filtered = filtered.filter(r => r.rating >= parseFloat(filters.minRating));
    }

    // Price filter
    if (filters.maxPrice) {
      filtered = filtered.filter(r => r.avgPrice <= parseFloat(filters.maxPrice));
    }

    // Sort
    if (filters.sort === 'rating') {
      filtered.sort((a, b) => b.rating - a.rating);
    } else if (filters.sort === 'price-low') {
      filtered.sort((a, b) => a.avgPrice - b.avgPrice);
    } else if (filters.sort === 'price-high') {
      filtered.sort((a, b) => b.avgPrice - a.avgPrice);
    } else if (filters.sort === 'delivery') {
      filtered.sort((a, b) => a.deliveryTime - b.deliveryTime);
    }

    setFilteredRestaurants(filtered);
  };

  const cuisines = Array.from(new Set(restaurants.flatMap(r => r.cuisines)));

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
              {user ? (
                <>
                  {user.role === 'admin' && (
                    <Button
                      variant="outline"
                      onClick={() => navigate('/admin')}
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      Admin Dashboard
                    </Button>
                  )}
                  {user.role === 'delivery-partner' && (
                    <Button
                      variant="outline"
                      onClick={() => navigate('/delivery-partner')}
                      className="border-orange-200 text-orange-600 hover:bg-orange-50"
                    >
                      Partner Dashboard
                    </Button>
                  )}
                  {user.role === 'customer' && (
                    <>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/orders')}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        My Orders
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => navigate('/cart')}
                        className="border-orange-200 text-orange-600 hover:bg-orange-50"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </Button>
                    </>
                  )}
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
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => navigate('/login')}
                    className="border-orange-200 text-orange-600 hover:bg-orange-50"
                  >
                    Login
                  </Button>
                  <Button
                    onClick={() => navigate('/signup')}
                    className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="mb-4 text-white">Order food from your favorite restaurants</h1>
          <p className="mb-8 text-orange-50">Fast delivery • Fresh food • Best prices</p>

          <div className="max-w-2xl">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-14 bg-white border-0"
                placeholder="Search for restaurants or cuisines..."
              />
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm text-gray-700">Filters:</span>
            </div>

            <Button
              variant={filters.veg ? "default" : "outline"}
              size="sm"
              onClick={() => setFilters(prev => ({ ...prev, veg: !prev.veg }))}
              className={filters.veg ? "bg-green-600 hover:bg-green-700" : "border-gray-300"}
            >
              <Leaf className="w-4 h-4 mr-1" />
              Veg Only
            </Button>

            <Select value={filters.cuisine} onValueChange={(value) => setFilters(prev => ({ ...prev, cuisine: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Cuisine" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">All Cuisines</SelectItem>
                {cuisines.map(cuisine => (
                  <SelectItem key={cuisine} value={cuisine}>{cuisine}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filters.minRating} onValueChange={(value) => setFilters(prev => ({ ...prev, minRating: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Any Rating</SelectItem>
                <SelectItem value="4">4★ & above</SelectItem>
                <SelectItem value="4.2">4.2★ & above</SelectItem>
                <SelectItem value="4.5">4.5★ & above</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.maxPrice} onValueChange={(value) => setFilters(prev => ({ ...prev, maxPrice: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Price" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Any Price</SelectItem>
                <SelectItem value="200">Under ₹200</SelectItem>
                <SelectItem value="300">Under ₹300</SelectItem>
                <SelectItem value="400">Under ₹400</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filters.sort} onValueChange={(value) => setFilters(prev => ({ ...prev, sort: value }))}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value=" ">Default</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="delivery">Fastest Delivery</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>

            {(filters.veg || filters.cuisine || filters.minRating || filters.maxPrice || filters.sort) && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setFilters({ veg: false, cuisine: '', minRating: '', maxPrice: '', sort: '' })}
                className="text-orange-600"
              >
                Clear Filters
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Restaurant Grid */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading restaurants...</p>
          </div>
        ) : filteredRestaurants.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No restaurants found. Try adjusting your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRestaurants.map(restaurant => (
              <Link
                key={restaurant.id}
                to={`/restaurant/${restaurant.id}`}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={restaurant.image}
                    alt={restaurant.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {restaurant.isVeg && (
                    <Badge className="absolute top-3 right-3 bg-green-600">
                      <Leaf className="w-3 h-3 mr-1" />
                      Pure Veg
                    </Badge>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="mb-2 text-gray-900">{restaurant.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {restaurant.cuisines.join(', ')}
                  </p>

                  <div className="flex items-center justify-between text-sm">
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
                      <DollarSign className="w-4 h-4" />
                      <span>₹{restaurant.avgPrice}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-gray-500 mt-2">
                    <MapPin className="w-4 h-4" />
                    <span className="truncate">{restaurant.address}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}