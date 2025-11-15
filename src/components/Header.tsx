import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, ShoppingCart, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface HeaderProps {
  user: any;
  token: string | null;
  onLogout: () => void;
}

export function Header({ user, token, onLogout }: HeaderProps) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    updateCartCount();
    
    // Listen for storage changes to update cart count
    const handleStorageChange = () => {
      updateCartCount();
    };
    
    window.addEventListener('storage', handleStorageChange);
    // Also listen for custom cart update event
    window.addEventListener('cartUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleStorageChange);
    };
  }, []);

  const updateCartCount = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const cart = JSON.parse(savedCart);
      const count = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
      setCartCount(count);
    } else {
      setCartCount(0);
    }
  };

  return (
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
                      className="border-orange-200 text-orange-600 hover:bg-orange-50 relative"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {cartCount > 0 && (
                        <Badge className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 bg-red-600 text-white text-xs">
                          {cartCount}
                        </Badge>
                      )}
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
  );
}
