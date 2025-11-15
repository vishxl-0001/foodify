import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { UtensilsCrossed, Users, Package, DollarSign, TrendingUp, ShoppingBag, User, LogOut } from 'lucide-react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';

interface AdminDashboardProps {
  user: any;
  token: string | null;
  onLogout: () => void;
}

export function AdminDashboard({ user, token, onLogout }: AdminDashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
    fetchOrders();
    fetchUsers();
  }, []);

  const fetchStats = async () => {
    try {
      // Calculate stats from localStorage
      const ordersData = localStorage.getItem('foodify_orders');
      const usersData = localStorage.getItem('foodify_users');
      const restaurantsData = localStorage.getItem('foodify_restaurants');
      
      const allOrders = ordersData ? JSON.parse(ordersData) : [];
      const allUsers = usersData ? JSON.parse(usersData) : [];
      const allRestaurants = restaurantsData ? JSON.parse(restaurantsData) : [];
      
      const totalRevenue = allOrders
        .filter((o: any) => o.status !== 'cancelled')
        .reduce((sum: number, o: any) => sum + o.total, 0);
      
      const activeOrders = allOrders.filter((o: any) => 
        o.status !== 'delivered' && o.status !== 'cancelled'
      ).length;
      
      setStats({
        totalOrders: allOrders.length,
        totalRevenue,
        activeOrders,
        totalUsers: allUsers.filter((u: any) => u.role === 'user' || u.role === 'customer').length,
        totalRestaurants: allRestaurants.length,
        totalDeliveryPartners: allUsers.filter((u: any) => u.role === 'delivery-partner').length
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      // Get all orders from localStorage
      const ordersData = localStorage.getItem('foodify_orders');
      if (!ordersData) return;
      
      const allOrders = JSON.parse(ordersData);
      // Sort by date (newest first)
      const sortedOrders = allOrders.sort((a: any, b: any) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      
      setOrders(sortedOrders);
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      // Get all users from localStorage
      const usersData = localStorage.getItem('foodify_users');
      if (!usersData) return;
      
      const allUsers = JSON.parse(usersData);
      // Filter out admin users
      const regularUsers = allUsers.filter((u: any) => u.role !== 'admin');
      
      setUsers(regularUsers);
    } catch (error) {
      console.error('Failed to fetch users:', error);
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
              <span className="text-orange-600">Foodify Admin</span>
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
        <h1 className="mb-8 text-gray-900">Admin Dashboard</h1>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-orange-500 border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            {stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Total Revenue</p>
                    <DollarSign className="w-8 h-8 text-green-600" />
                  </div>
                  <p className="text-gray-900">₹{stats.totalRevenue.toFixed(2)}</p>
                  <p className="text-xs text-gray-500 mt-1">All time</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Total Orders</p>
                    <Package className="w-8 h-8 text-blue-600" />
                  </div>
                  <p className="text-gray-900">{stats.totalOrders}</p>
                  <p className="text-xs text-gray-500 mt-1">{stats.activeOrders} active</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Total Users</p>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                  <p className="text-gray-900">{stats.totalUsers}</p>
                  <p className="text-xs text-gray-500 mt-1">Registered</p>
                </div>

                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-gray-600">Restaurants</p>
                    <UtensilsCrossed className="w-8 h-8 text-orange-600" />
                  </div>
                  <p className="text-gray-900">{stats.totalRestaurants}</p>
                  <p className="text-xs text-gray-500 mt-1">Active</p>
                </div>
              </div>
            )}

            {/* Tabs */}
            <Tabs defaultValue="orders" className="space-y-6">
              <TabsList className="bg-white">
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
              </TabsList>

              <TabsContent value="orders" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900">All Orders</h2>
                </div>

                {orders.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No orders yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {orders.map(order => (
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

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">Customer</p>
                            <p className="text-sm text-gray-900">User ID: {order.userId.substring(0, 8)}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Items</p>
                            <p className="text-sm text-gray-900">{order.items.length} items</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">Total</p>
                            <p className="text-sm text-gray-900">₹{order.total.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="border-t pt-4">
                          <p className="text-sm text-gray-600 mb-2">Items:</p>
                          <div className="space-y-1">
                            {order.items.map((item: any, index: number) => (
                              <p key={index} className="text-sm text-gray-900">
                                {item.name} x {item.quantity} - ₹{item.total.toFixed(2)}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="users" className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-gray-900">All Users</h2>
                </div>

                {users.length === 0 ? (
                  <div className="text-center py-12 bg-white rounded-xl">
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600">No users yet</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50 border-b">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs text-gray-500 uppercase tracking-wider">Joined</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-50">
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.phone}</td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <Badge className={
                                  user.role === 'admin' ? 'bg-purple-600' :
                                  user.role === 'delivery-partner' ? 'bg-blue-600' :
                                  'bg-gray-600'
                                }>
                                  {user.role}
                                </Badge>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                {new Date(user.createdAt).toLocaleDateString()}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </div>
  );
}