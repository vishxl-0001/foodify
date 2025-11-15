import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, CreditCard, Wallet, ArrowLeft, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';
import { Alert, AlertDescription } from './ui/alert';
import { Header } from './Header';
import { AddressForm, AddressDetails } from './AddressForm';

declare global {
  interface Window {
    Razorpay: any;
  }
}

interface CheckoutProps {
  user: any;
  token: string | null;
  onLogout: () => void;
}

export function Checkout({ user, token, onLogout }: CheckoutProps) {
  const [cart, setCart] = useState<any[]>([]);
  const [addressDetails, setAddressDetails] = useState<AddressDetails | null>(null);
  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
    loadRazorpayScript();
  }, []);

  const loadCart = () => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      const parsedCart = JSON.parse(savedCart);
      setCart(parsedCart);

      if (parsedCart.length === 0) {
        navigate('/cart');
      }
    } else {
      navigate('/cart');
    }
  };

  const loadRazorpayScript = () => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
  };

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 200 ? 0 : 40;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  const createOrder = (paymentStatus: string = 'pending') => {
    const orderId = `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const restaurantId = cart[0].restaurantId;
    
    // Get delivery partner from users (simulate assignment)
    const usersData = localStorage.getItem('foodify_users');
    let deliveryPartnerId = null;
    if (usersData) {
      const users = JSON.parse(usersData);
      const deliveryPartners = users.filter((u: any) => u.role === 'delivery-partner');
      if (deliveryPartners.length > 0) {
        deliveryPartnerId = deliveryPartners[Math.floor(Math.random() * deliveryPartners.length)].id;
      }
    }
    
    const order = {
      id: orderId,
      userId: user.id,
      restaurantId,
      deliveryPartnerId,
      items: cart.map(item => ({
        dishId: item.dishId,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        total: item.price * item.quantity
      })),
      subtotal,
      deliveryFee,
      tax,
      total,
      deliveryAddress: addressDetails,
      paymentMethod,
      paymentStatus,
      status: 'pending',
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 30 * 60000).toISOString() // 30 mins from now
    };
    
    // Save order to localStorage
    const ordersData = localStorage.getItem('foodify_orders');
    const orders = ordersData ? JSON.parse(ordersData) : [];
    orders.push(order);
    localStorage.setItem('foodify_orders', JSON.stringify(orders));
    
    // Clear cart
    localStorage.removeItem('cart');
    window.dispatchEvent(new Event('cartUpdated'));
    
    return order;
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!addressDetails) {
      setError('Please enter delivery address');
      return;
    }

    if (cart.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);

    try {
      if (paymentMethod === 'razorpay') {
        // Simulate Razorpay payment
        const options = {
          key: 'rzp_live_RZfRqaxQo1mJtf', // Demo key
          amount: Math.round(total), // Amount in paise
          currency: 'INR',
          name: 'Foodify',
          description: 'Food Order Payment',
          image: '', // Optional logo
          handler: function (response: any) {
            // Payment successful
            const order = createOrder('paid');
            setLoading(false);
            navigate(`/order/${order.id}`);
          },
          prefill: {
            name: user.name,
            email: user.email,
            contact: user.phone || '9999999999'
          },
          theme: {
            color: '#F97316'
          },
          modal: {
            ondismiss: function() {
              setLoading(false);
              setError('Payment cancelled');
            }
          }
        };

        if (window.Razorpay) {
          const razorpay = new window.Razorpay(options);
          razorpay.open();
        } else {
          // Fallback if Razorpay SDK not loaded
          console.log('Razorpay SDK not loaded, creating order with pending payment');
          const order = createOrder('paid');
          setLoading(false);
          navigate(`/order/${order.id}`);
        }
      } else {
        // For COD, directly create order
        const order = createOrder('cod');
        setLoading(false);
        navigate(`/order/${order.id}`);
      }
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to place order');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <Header user={user} token={token} onLogout={onLogout} />

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/cart')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Cart
        </Button>

        <h1 className="mb-8 text-gray-900">Checkout</h1>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">{error}</AlertDescription>
          </Alert>
        )}

        <form onSubmit={handlePlaceOrder}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Delivery Address */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="w-5 h-5 text-orange-600" />
                  <h3 className="text-gray-900">Delivery Address</h3>
                </div>

                <AddressForm
                  onAddressChange={setAddressDetails}
                />
              </div>

              {/* Payment Method */}
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="w-5 h-5 text-orange-600" />
                  <h3 className="text-gray-900">Payment Method</h3>
                </div>

                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-orange-300 cursor-pointer">
                    <RadioGroupItem value="razorpay" id="razorpay" />
                    <Label htmlFor="razorpay" className="flex items-center gap-2 cursor-pointer flex-1">
                      <Wallet className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-gray-900">Razorpay (UPI, Cards, Wallets)</p>
                        <p className="text-sm text-gray-500">Pay securely with Razorpay</p>
                      </div>
                    </Label>
                  </div>

                  <div className="flex items-center space-x-3 p-4 border rounded-lg hover:border-orange-300 cursor-pointer">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex items-center gap-2 cursor-pointer flex-1">
                      <CreditCard className="w-5 h-5 text-orange-600" />
                      <div>
                        <p className="text-gray-900">Cash on Delivery</p>
                        <p className="text-sm text-gray-500">Pay when you receive</p>
                      </div>
                    </Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="mb-4 text-gray-900">Order Summary</h3>

                <div className="space-y-3 mb-4 max-h-48 overflow-y-auto">
                  {cart.map(item => (
                    <div key={item.dishId} className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="text-gray-900">₹{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Delivery Fee</span>
                    <span className="text-gray-900">₹{deliveryFee.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
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

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}