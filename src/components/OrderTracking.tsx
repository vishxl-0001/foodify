import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { UtensilsCrossed, MapPin, Package, Truck, CheckCircle, Clock, Phone, ArrowLeft, User, LogOut, Navigation, Bike } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface OrderTrackingProps {
  user: any;
  token: string | null;
  onLogout: () => void;
}

export function OrderTracking({ user, token, onLogout }: OrderTrackingProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [restaurant, setRestaurant] = useState<any>(null);
  const [deliveryPartner, setDeliveryPartner] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000); // Poll every 5 seconds
    return () => clearInterval(interval);
  }, [id]);

  const fetchOrder = async () => {
    try {
      // Get order from localStorage
      const ordersData = localStorage.getItem('foodify_orders');
      if (!ordersData) {
        setLoading(false);
        return;
      }

      const allOrders = JSON.parse(ordersData);
      const foundOrder = allOrders.find((o: any) => o.id === id);
      
      if (foundOrder) {
        setOrder(foundOrder);
        
        // Get restaurant from mock data (restaurants are not stored in localStorage, they're in MOCK_RESTAURANTS)
        const restaurantsData = localStorage.getItem('foodify_restaurants');
        if (restaurantsData) {
          const restaurants = JSON.parse(restaurantsData);
          const foundRestaurant = restaurants.find((r: any) => r.id === foundOrder.restaurantId);
          setRestaurant(foundRestaurant);
        }
        
        // Get delivery partner if assigned
        if (foundOrder.deliveryPartnerId) {
          const usersData = localStorage.getItem('foodify_users');
          if (usersData) {
            const users = JSON.parse(usersData);
            const partner = users.find((u: any) => u.id === foundOrder.deliveryPartnerId);
            setDeliveryPartner(partner);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch order:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusSteps = () => {
    return [
      { key: 'pending', label: 'Order Placed', icon: Package },
      { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
      { key: 'preparing', label: 'Preparing', icon: UtensilsCrossed },
      { key: 'on_the_way', label: 'On the Way', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle }
    ];
  };

  const getStatusIndex = (status: string) => {
    const statusMap: any = {
      'pending': 0,
      'confirmed': 1,
      'preparing': 2,
      'on_the_way': 3,
      'delivered': 4,
      'cancelled': -1
    };
    return statusMap[status] || 0;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600">Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Order not found</p>
          <Button onClick={() => navigate('/orders')} className="mt-4">View All Orders</Button>
        </div>
      </div>
    );
  }

  const currentStatusIndex = getStatusIndex(order.status);
  const steps = getStatusSteps();

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate('/orders')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Orders
        </Button>

        <div className="space-y-6">
          {/* Order Status */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="mb-1 text-gray-900">Order #{order.id.substring(0, 8)}</h2>
                <p className="text-sm text-gray-600">
                  Placed on {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                </p>
              </div>
              {order.status === 'cancelled' ? (
                <Badge className="bg-red-600">Cancelled</Badge>
              ) : order.status === 'delivered' ? (
                <Badge className="bg-green-600">Delivered</Badge>
              ) : (
                <Badge className="bg-orange-600">In Progress</Badge>
              )}
            </div>

            {/* Status Timeline */}
            {order.status !== 'cancelled' && (
              <div className="relative">
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
                <div className="absolute left-6 top-0 w-0.5 bg-orange-500" style={{ height: `${(currentStatusIndex / (steps.length - 1)) * 100}%` }}></div>

                <div className="space-y-6">
                  {steps.map((step, index) => {
                    const StepIcon = step.icon;
                    const isCompleted = index <= currentStatusIndex;
                    const isCurrent = index === currentStatusIndex;

                    return (
                      <div key={step.key} className="flex items-center gap-4">
                        <div className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center ${
                          isCompleted ? 'bg-orange-500' : 'bg-gray-200'
                        }`}>
                          <StepIcon className={`w-6 h-6 ${isCompleted ? 'text-white' : 'text-gray-400'}`} />
                        </div>
                        <div className="flex-1">
                          <p className={`${isCurrent ? 'text-orange-600' : isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                            {step.label}
                          </p>
                          {isCurrent && (
                            <p className="text-sm text-gray-600 mt-1">
                              Your order is currently being {step.label.toLowerCase()}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Restaurant & Delivery Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="mb-4 text-gray-900">Restaurant</h3>
              {restaurant && (
                <div>
                  <p className="text-gray-900 mb-2">{restaurant.name}</p>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mt-0.5" />
                    <p>{restaurant.address}</p>
                  </div>
                </div>
              )}
            </div>

            {deliveryPartner && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="mb-4 text-gray-900">Delivery Partner</h3>
                <div className="space-y-3">
                  <p className="text-gray-900">{deliveryPartner.name}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="w-4 h-4" />
                    <p>{deliveryPartner.phone}</p>
                  </div>
                  {deliveryPartner.vehicleNumber && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Bike className="w-4 h-4" />
                      <p>{deliveryPartner.vehicleNumber}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Delivery Address */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="mb-4 text-gray-900">Delivery Address</h3>
            <div className="flex items-start gap-2 text-gray-600">
              <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                {typeof order.deliveryAddress === 'object' ? (
                  <div className="space-y-2">
                    <p className="text-gray-900">
                      {order.deliveryAddress.houseNo}, {order.deliveryAddress.street}
                    </p>
                    {order.deliveryAddress.landmark && (
                      <p className="text-sm text-gray-600">Landmark: {order.deliveryAddress.landmark}</p>
                    )}
                    <p className="text-sm text-gray-600">
                      {order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                    </p>
                    {order.deliveryAddress.location && (
                      <div className="mt-2 p-2 bg-green-50 rounded text-xs text-green-700 inline-flex items-center gap-1">
                        <Navigation className="w-3 h-3" />
                        Precise location shared
                      </div>
                    )}
                  </div>
                ) : (
                  <p>{order.deliveryAddress}</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="mb-4 text-gray-900">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                  <div>
                    <p className="text-gray-900">{item.name}</p>
                    <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-gray-900">₹{item.total.toFixed(2)}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Bill Details */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="mb-4 text-gray-900">Bill Details</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">₹{order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Delivery Fee</span>
                <span className="text-gray-900">₹{order.deliveryFee.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST (5%)</span>
                <span className="text-gray-900">₹{order.tax.toFixed(2)}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="text-gray-900">Total</span>
                <span className="text-gray-900">₹{order.total.toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Payment Method: <span className="text-gray-900 capitalize">{order.paymentMethod}</span></p>
              {order.paymentStatus && (
                <p className="text-sm text-gray-600 mt-1">Payment Status: <span className="text-green-600 capitalize">{order.paymentStatus}</span></p>
              )}
            </div>
          </div>

          {/* Estimated Delivery */}
          {order.status !== 'delivered' && order.status !== 'cancelled' && (
            <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-2">
                <Clock className="w-6 h-6" />
                <h3 className="text-white">Estimated Delivery</h3>
              </div>
              <p className="text-orange-50">
                {new Date(order.estimatedDelivery).toLocaleTimeString()} ({Math.round((new Date(order.estimatedDelivery).getTime() - Date.now()) / 60000)} minutes)
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}