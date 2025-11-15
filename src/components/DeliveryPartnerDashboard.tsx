import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { UtensilsCrossed, Package, MapPin, Phone, CheckCircle, Truck, User, LogOut, AlertCircle, Navigation } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Alert, AlertDescription } from './ui/alert';

interface DeliveryPartnerDashboardProps {
  user: any;
  token: string | null;
  onLogout: () => void;
}

export function DeliveryPartnerDashboard({ user, token, onLogout }: DeliveryPartnerDashboardProps) {
  const [availableOrders, setAvailableOrders] = useState<any[]>([]);
  const [myOrders, setMyOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      // Get all orders from localStorage
      const ordersData = localStorage.getItem('foodify_orders');
      if (!ordersData) {
        setLoading(false);
        return;
      }
      
      const allOrders = JSON.parse(ordersData);
      
      // Filter available orders (confirmed status, no delivery partner assigned)
      const available = allOrders.filter((order: any) => 
        order.status === 'confirmed' && !order.deliveryPartnerId
      );
      setAvailableOrders(available);
      
      // Filter my orders (assigned to current delivery partner)
      const myAssigned = allOrders.filter((order: any) => 
        order.deliveryPartnerId === user.id
      ).sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setMyOrders(myAssigned);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId: string) => {
    setError('');
    try {
      // Get orders from localStorage
      const ordersData = localStorage.getItem('foodify_orders');
      if (!ordersData) {
        throw new Error('No orders found');
      }
      
      const allOrders = JSON.parse(ordersData);
      const orderIndex = allOrders.findIndex((o: any) => o.id === orderId);
      
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }
      
      // Check if order is still available
      if (allOrders[orderIndex].deliveryPartnerId) {
        throw new Error('Order already assigned to another delivery partner');
      }
      
      // Assign order to current delivery partner and update status
      allOrders[orderIndex].deliveryPartnerId = user.id;
      allOrders[orderIndex].status = 'preparing';
      
      // Save back to localStorage
      localStorage.setItem('foodify_orders', JSON.stringify(allOrders));
      
      // Refresh orders
      fetchOrders();
    } catch (err: any) {
      setError(err.message || 'Failed to accept order');
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setError('');
    try {
      // Get orders from localStorage
      const ordersData = localStorage.getItem('foodify_orders');
      if (!ordersData) {
        throw new Error('No orders found');
      }
      
      const allOrders = JSON.parse(ordersData);
      const orderIndex = allOrders.findIndex((o: any) => o.id === orderId);
      
      if (orderIndex === -1) {
        throw new Error('Order not found');
      }
      
      // Update order status
      allOrders[orderIndex].status = status;
      
      // Save back to localStorage
      localStorage.setItem('foodify_orders', JSON.stringify(allOrders));
      
      // Refresh orders
      fetchOrders();
    } catch (err: any) {
      setError(err.message || 'Failed to update order status');
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      'preparing': { label: 'Preparing', className: 'bg-purple-600' },
      'on_the_way': { label: 'On the Way', className: 'bg-orange-600' },
      'delivered': { label: 'Delivered', className: 'bg-green-600' }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-600' };
    return <Badge className={config.className}>{config.label}</Badge>;
  };

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
              <span className="text-orange-600">Foodify Delivery</span>
            </Link>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                View Site
              </Button>
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

      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="mb-8 text-gray-900">Delivery Dashboard</h1>

        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-600">{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Available Orders */}
            <div>
              <h2 className="mb-4 text-gray-900">Available Orders</h2>

              {availableOrders.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No available orders at the moment</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {availableOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-gray-900 mb-1">Order #{order.id.substring(0, 8)}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        <Badge className="bg-blue-600">New</Badge>
                      </div>

                      <div className="mb-4 space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Delivery Address</p>
                            {typeof order.deliveryAddress === 'object' ? (
                              <div className="space-y-1">
                                <p className="text-sm text-gray-900">
                                  {order.deliveryAddress.houseNo}, {order.deliveryAddress.street}
                                </p>
                                {order.deliveryAddress.landmark && (
                                  <p className="text-xs text-gray-600">Landmark: {order.deliveryAddress.landmark}</p>
                                )}
                                <p className="text-xs text-gray-600">
                                  {order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                                </p>
                                {order.deliveryAddress.location && (
                                  <div className="mt-1 p-1.5 bg-green-50 rounded text-xs text-green-700 inline-flex items-center gap-1">
                                    <Navigation className="w-3 h-3" />
                                    GPS: {order.deliveryAddress.location.lat.toFixed(4)}, {order.deliveryAddress.location.lng.toFixed(4)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-900">{order.deliveryAddress}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 pb-4 border-b">
                        <p className="text-sm text-gray-600 mb-2">{order.items.length} items</p>
                        <p className="text-gray-900">Total: ₹{order.total.toFixed(2)}</p>
                      </div>

                      <Button
                        onClick={() => acceptOrder(order.id)}
                        className="w-full bg-orange-500 hover:bg-orange-600"
                      >
                        Accept Order
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* My Active Orders */}
            <div>
              <h2 className="mb-4 text-gray-900">My Active Deliveries</h2>

              {myOrders.length === 0 ? (
                <div className="bg-white rounded-xl p-8 text-center">
                  <Truck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">No active deliveries</p>
                  <p className="text-sm text-gray-500 mt-2">Accept orders to start delivering</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {myOrders.map(order => (
                    <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-gray-900 mb-1">Order #{order.id.substring(0, 8)}</h3>
                          <p className="text-sm text-gray-600">
                            {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                          </p>
                        </div>
                        {getStatusBadge(order.status)}
                      </div>

                      <div className="mb-4 space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                          <div className="flex-1">
                            <p className="text-sm text-gray-600">Delivery Address</p>
                            {typeof order.deliveryAddress === 'object' ? (
                              <div className="space-y-1">
                                <p className="text-sm text-gray-900">
                                  {order.deliveryAddress.houseNo}, {order.deliveryAddress.street}
                                </p>
                                {order.deliveryAddress.landmark && (
                                  <p className="text-xs text-gray-600">Landmark: {order.deliveryAddress.landmark}</p>
                                )}
                                <p className="text-xs text-gray-600">
                                  {order.deliveryAddress.area}, {order.deliveryAddress.city} - {order.deliveryAddress.pincode}
                                </p>
                                {order.deliveryAddress.location && (
                                  <div className="mt-1 p-1.5 bg-green-50 rounded text-xs text-green-700 inline-flex items-center gap-1">
                                    <Navigation className="w-3 h-3" />
                                    GPS: {order.deliveryAddress.location.lat.toFixed(4)}, {order.deliveryAddress.location.lng.toFixed(4)}
                                  </div>
                                )}
                              </div>
                            ) : (
                              <p className="text-sm text-gray-900">{order.deliveryAddress}</p>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="mb-4 pb-4 border-b">
                        <p className="text-sm text-gray-600 mb-1">{order.items.length} items</p>
                        <p className="text-gray-900">Total: ₹{order.total.toFixed(2)}</p>
                      </div>

                      {/* Status Actions */}
                      <div className="space-y-2">
                        {order.status === 'preparing' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'on_the_way')}
                            className="w-full bg-orange-500 hover:bg-orange-600"
                          >
                            <Truck className="w-4 h-4 mr-2" />
                            Start Delivery
                          </Button>
                        )}

                        {order.status === 'on_the_way' && (
                          <Button
                            onClick={() => updateOrderStatus(order.id, 'delivered')}
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Mark as Delivered
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}