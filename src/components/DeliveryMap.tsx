import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Store, Home } from 'lucide-react';

interface DeliveryMapProps {
  order: any;
  restaurant: any;
  deliveryPartner: any;
}

export function DeliveryMap({ order, restaurant, deliveryPartner }: DeliveryMapProps) {
  const [deliveryPosition, setDeliveryPosition] = useState({ x: 20, y: 20 });

  // Simulate delivery partner movement
  useEffect(() => {
    if (order.status === 'on_the_way') {
      const interval = setInterval(() => {
        setDeliveryPosition(prev => {
          // Move towards destination (bottom right)
          const newX = Math.min(prev.x + 2, 80);
          const newY = Math.min(prev.y + 2, 80);
          return { x: newX, y: newY };
        });
      }, 1000);
      
      return () => clearInterval(interval);
    } else if (order.status === 'delivered') {
      setDeliveryPosition({ x: 80, y: 80 });
    }
  }, [order.status]);

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-orange-500 to-red-500">
        <h3 className="text-white flex items-center gap-2">
          <Navigation className="w-5 h-5" />
          Live Tracking
        </h3>
        <p className="text-sm text-orange-50 mt-1">
          {order.status === 'delivered' 
            ? 'Order delivered successfully!' 
            : 'Your delivery partner is on the way'}
        </p>
      </div>

      {/* Map Container */}
      <div className="relative w-full h-96 bg-gray-100 overflow-hidden">
        {/* Grid pattern to simulate map */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `
            linear-gradient(to right, #666 1px, transparent 1px),
            linear-gradient(to bottom, #666 1px, transparent 1px)
          `,
          backgroundSize: '20px 20px'
        }}></div>

        {/* Roads/paths */}
        <svg className="absolute inset-0 w-full h-full">
          <defs>
            <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
              <polygon points="0 0, 10 3, 0 6" fill="#F97316" />
            </marker>
          </defs>
          
          {/* Path from restaurant to delivery address */}
          <path
            d="M 20% 20%, Q 50% 30%, 80% 80%"
            stroke="#F97316"
            strokeWidth="3"
            fill="none"
            strokeDasharray="5,5"
            opacity="0.5"
            markerEnd="url(#arrowhead)"
          />
        </svg>

        {/* Restaurant Location (Top Left) */}
        <div 
          className="absolute flex flex-col items-center"
          style={{ left: '15%', top: '15%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white animate-pulse">
              <Store className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-8 bg-orange-500"></div>
            </div>
          </div>
          <div className="mt-6 bg-white px-3 py-1.5 rounded-lg shadow-lg border border-orange-200">
            <p className="text-xs text-orange-600 whitespace-nowrap">{restaurant?.name || 'Restaurant'}</p>
          </div>
        </div>

        {/* Delivery Address (Bottom Right) */}
        <div 
          className="absolute flex flex-col items-center"
          style={{ left: '80%', top: '80%', transform: 'translate(-50%, -50%)' }}
        >
          <div className="relative">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-4 border-white">
              <Home className="w-6 h-6 text-white" />
            </div>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
              <div className="w-1 h-8 bg-green-500"></div>
            </div>
          </div>
          <div className="mt-6 bg-white px-3 py-1.5 rounded-lg shadow-lg border border-green-200">
            <p className="text-xs text-green-600 whitespace-nowrap">Delivery Address</p>
          </div>
        </div>

        {/* Delivery Partner Location (Moving) */}
        {order.status !== 'delivered' ? (
          <div 
            className="absolute flex flex-col items-center transition-all duration-1000 ease-linear"
            style={{ 
              left: `${deliveryPosition.x}%`, 
              top: `${deliveryPosition.y}%`,
              transform: 'translate(-50%, -50%)'
            }}
          >
            <div className="relative">
              <div className="w-14 h-14 bg-blue-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white animate-bounce">
                <Navigation className="w-7 h-7 text-white" />
              </div>
              {/* Pulse effect */}
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-1 h-8 bg-blue-500"></div>
              </div>
            </div>
            <div className="mt-6 bg-white px-3 py-2 rounded-lg shadow-lg border-2 border-blue-500">
              <p className="text-xs text-blue-600 whitespace-nowrap">
                {deliveryPartner?.name || 'Delivery Partner'}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">
                {order.status === 'on_the_way' ? 'On the way' : 'Picking up'}
              </p>
            </div>
          </div>
        ) : null}

        {/* Delivered checkmark overlay */}
        {order.status === 'delivered' && (
          <div className="absolute inset-0 bg-green-500 bg-opacity-10 flex items-center justify-center">
            <div className="bg-white rounded-full p-6 shadow-2xl">
              <svg className="w-24 h-24 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              <span className="text-gray-600">Restaurant</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">Delivery Partner</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-600">Your Location</span>
            </div>
          </div>
          {order.status === 'on_the_way' && (
            <div className="text-orange-600">
              ETA: {Math.round((new Date(order.estimatedDelivery).getTime() - Date.now()) / 60000)} mins
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
