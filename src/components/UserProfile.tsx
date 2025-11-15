import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UtensilsCrossed, User, Mail, Phone, MapPin, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface UserProfileProps {
  user: any;
  token: string | null;
  onLogout: () => void;
}

export function UserProfile({ user, token, onLogout }: UserProfileProps) {
  const navigate = useNavigate();

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

            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="border-orange-200 text-orange-600 hover:bg-orange-50"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="mb-8 text-gray-900">My Profile</h1>

        <div className="bg-white rounded-xl p-8 shadow-sm">
          <div className="flex items-center justify-center mb-8">
            <div className="w-24 h-24 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center">
              <User className="w-12 h-12 text-white" />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="text-sm text-gray-600">Full Name</label>
              <div className="flex items-center gap-3 mt-2 p-3 bg-gray-50 rounded-lg">
                <User className="w-5 h-5 text-gray-400" />
                <p className="text-gray-900">{user.name}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Email</label>
              <div className="flex items-center gap-3 mt-2 p-3 bg-gray-50 rounded-lg">
                <Mail className="w-5 h-5 text-gray-400" />
                <p className="text-gray-900">{user.email}</p>
              </div>
            </div>

            <div>
              <label className="text-sm text-gray-600">Phone</label>
              <div className="flex items-center gap-3 mt-2 p-3 bg-gray-50 rounded-lg">
                <Phone className="w-5 h-5 text-gray-400" />
                <p className="text-gray-900">{user.phone}</p>
              </div>
            </div>

            {user.address && (
              <div>
                <label className="text-sm text-gray-600">Address</label>
                <div className="flex items-center gap-3 mt-2 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-gray-400" />
                  <p className="text-gray-900">{user.address}</p>
                </div>
              </div>
            )}

            <div>
              <label className="text-sm text-gray-600">Account Type</label>
              <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                <p className="text-gray-900 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t">
            <Button
              onClick={onLogout}
              variant="outline"
              className="w-full border-red-200 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
