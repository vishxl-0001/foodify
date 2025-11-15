import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UtensilsCrossed, Trash2, Plus, Minus, ShoppingCart, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

interface CartProps {
  user: any;
  token: string | null;
  onLogout: () => void;
}

export function Cart({ user, token, onLogout }: CartProps) {
  const [cart, setCart] = useState<any[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

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

  const updateQuantity = (dishId: string, delta: number) => {
    const newCart = cart.map(item =>
      item.dishId === dishId
        ? { ...item, quantity: Math.max(1, item.quantity + delta) }
        : item
    );
    saveCart(newCart);
  };

  const removeItem = (dishId: string) => {
    const newCart = cart.filter(item => item.dishId !== dishId);
    saveCart(newCart);
  };

  const clearCart = () => {
    saveCart([]);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 200 ? 0 : 40;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

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
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="flex items-center justify-between mb-8">
          <h1 className="text-gray-900">Shopping Cart</h1>
          {cart.length > 0 && (
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-600 border-red-200 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="mb-2 text-gray-900">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Add some delicious items to get started!</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Browse Restaurants
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              {cart.map(item => (
                <div key={item.dishId} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-gray-900">{item.name}</h3>
                      <p className="text-sm text-gray-600">₹{item.price} each</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.dishId)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-orange-50 rounded-lg px-4 py-2">
                      <button
                        onClick={() => updateQuantity(item.dishId, -1)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-gray-900 w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.dishId, 1)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <span className="text-gray-900">₹{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="mb-4 text-gray-900">Order Summary</h3>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-900">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">GST (5%)</span>
                    <span className="text-gray-900">₹{tax.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                </div>

                {subtotal < 200 && (
                  <p className="text-sm text-orange-600 mb-4">
                    Add ₹{(200 - subtotal).toFixed(2)} more for free delivery!
                  </p>
                )}

                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
