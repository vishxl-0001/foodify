import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Home, Building2 } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';

interface AddressFormProps {
  onAddressChange: (address: AddressDetails | null) => void;
  initialAddress?: AddressDetails;
}

export interface AddressDetails {
  houseNo: string;
  street: string;
  landmark: string;
  area: string;
  city: string;
  pincode: string;
  fullAddress: string;
  location?: {
    lat: number;
    lng: number;
  };
}

export function AddressForm({ onAddressChange, initialAddress }: AddressFormProps) {
  const [houseNo, setHouseNo] = useState(initialAddress?.houseNo || '');
  const [street, setStreet] = useState(initialAddress?.street || '');
  const [landmark, setLandmark] = useState(initialAddress?.landmark || '');
  const [area, setArea] = useState(initialAddress?.area || '');
  const [city, setCity] = useState(initialAddress?.city || '');
  const [pincode, setPincode] = useState(initialAddress?.pincode || '');
  const [location, setLocation] = useState<{ lat: number; lng: number } | undefined>(initialAddress?.location);
  const [gettingLocation, setGettingLocation] = useState(false);

  // Update parent component whenever address fields change
  useEffect(() => {
    if (houseNo && street && area && city && pincode) {
      const fullAddress = `${houseNo}, ${street}, ${landmark ? landmark + ', ' : ''}${area}, ${city} - ${pincode}`;
      
      onAddressChange({
        houseNo,
        street,
        landmark,
        area,
        city,
        pincode,
        fullAddress,
        location
      });
    } else {
      onAddressChange(null);
    }
  }, [houseNo, street, landmark, area, city, pincode, location, onAddressChange]);

  const getCurrentLocation = () => {
    setGettingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setLocation(loc);
          setGettingLocation(false);
          
          // Try to get address from coordinates using reverse geocoding
          // Note: In production, you would use Google Maps Geocoding API
          console.log('Location obtained:', loc);
        },
        (error) => {
          console.error('Error getting location:', error);
          setGettingLocation(false);
          alert('Unable to get location. Please ensure location permissions are enabled.');
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
      setGettingLocation(false);
    }
  };

  return (
    <form className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="houseNo">
            <div className="flex items-center gap-2">
              <Home className="w-4 h-4 text-orange-600" />
              House/Flat No.*
            </div>
          </Label>
          <Input
            id="houseNo"
            value={houseNo}
            onChange={(e) => setHouseNo(e.target.value)}
            placeholder="e.g., 123, A-Block"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="street">Street/Road*</Label>
          <Input
            id="street"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
            placeholder="e.g., MG Road"
            className="mt-2"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="landmark">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-orange-600" />
            Landmark (Optional)
          </div>
        </Label>
        <Input
          id="landmark"
          value={landmark}
          onChange={(e) => setLandmark(e.target.value)}
          placeholder="e.g., Near City Mall"
          className="mt-2"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="area">Area/Locality*</Label>
          <Input
            id="area"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g., Koramangala"
            className="mt-2"
            required
          />
        </div>

        <div>
          <Label htmlFor="city">City*</Label>
          <Input
            id="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="e.g., Mumbai"
            className="mt-2"
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="pincode">Pincode*</Label>
        <Input
          id="pincode"
          value={pincode}
          onChange={(e) => setPincode(e.target.value)}
          placeholder="e.g., 400001"
          pattern="[0-9]{6}"
          maxLength={6}
          className="mt-2"
          required
        />
      </div>

      <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2">
            <Navigation className="w-5 h-5 text-orange-600" />
            <div>
              <p className="text-sm text-gray-900">Enable Precise Location</p>
              <p className="text-xs text-gray-600 mt-1">
                Help delivery partners find you easily
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={getCurrentLocation}
            disabled={gettingLocation}
            size="sm"
            className="bg-orange-500 hover:bg-orange-600"
          >
            {gettingLocation ? 'Getting...' : location ? 'Update' : 'Get Location'}
          </Button>
        </div>
        
        {location && (
          <div className="mt-2 p-2 bg-white rounded text-xs text-gray-600">
            <p className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-green-600" />
              Location captured: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
            </p>
          </div>
        )}
      </div>
    </form>
  );
}