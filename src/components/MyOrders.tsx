import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { UtensilsCrossed, Package, Eye, User, LogOut, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';

interface MyOrdersProps {
  user: any;
  token: string | null;
  onLogout: () => void;
}

export function MyOrders({ user, token, onLogout }: MyOrdersProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      // Get orders from localStorage for current user
      const ordersData = localStorage.getItem('foodify_orders');
      if (!ordersData) {
        setLoading(false);
        return;
      }

      const allOrders = JSON.parse(ordersData);
      // Filter orders for current user and sort by date (newest first)
      const userOrders = allOrders
        .filter((order: any) => order.userId === user.id)
        .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setOrders(userOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig: any = {
      'pending': { label: 'Pending', className: 'bg-yellow-600' },
      'confirmed': { label: 'Confirmed', className: 'bg-blue-600' },
      'preparing': { label: 'Preparing', className: 'bg-purple-600' },
      'on_the_way': { label: 'On the Way', className: 'bg-orange-600' },
      'delivered': { label: 'Delivered', className: 'bg-green-600' },
      'cancelled': { label: 'Cancelled', className: 'bg-red-600' }
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
              <span className="text-orange-600">Foodify</span>
            </Link>

            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => navigate('/')}
                className="border-orange-200 text-orange-600 hover:bg-orange-50"
              >
                Browse Restaurants
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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="mb-8 text-gray-900">My Orders</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading orders...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl">
            <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h2 className="mb-2 text-gray-900">No orders yet</h2>
            <p className="text-gray-600 mb-6">Start ordering delicious food from your favorite restaurants!</p>
            <Button
              onClick={() => navigate('/')}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600"
            >
              Browse Restaurants
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map(order => (
              <div key={order.id} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-gray-900 mb-1">Order #{order.id.substring(0, 8)}</h3>
                    <p className="text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString()}
                    </p>
                  </div>
                  {getStatusBadge(order.status)}
                </div>

                <div className="mb-4 pb-4 border-b">
                  <p className="text-sm text-gray-600 mb-2">Items:</p>
                  <div className="space-y-1">
                    {order.items.slice(0, 3).map((item: any, index: number) => (
                      <p key={index} className="text-sm text-gray-900">
                        {item.name} x {item.quantity}
                      </p>
                    ))}
                    {order.items.length > 3 && (
                      <p className="text-sm text-gray-600">+{order.items.length - 3} more items</p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="text-gray-900">₹{order.total.toFixed(2)}</p>
                  </div>

                  <Button
                    onClick={() => navigate(`/order/${order.id}`)}
                    className="bg-orange-500 hover:bg-orange-600"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Track Order
                  </Button>
                </div>

                {order.status !== 'delivered' && order.status !== 'cancelled' && (
                  <div className="mt-4 p-3 bg-orange-50 rounded-lg flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <p className="text-sm text-orange-600">
                      Estimated delivery: {new Date(order.estimatedDelivery).toLocaleTimeString()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}