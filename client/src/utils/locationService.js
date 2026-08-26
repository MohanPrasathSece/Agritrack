// Location Service for GPS detection and address resolution
export const locationService = {
  // Get current GPS coordinates
  getCurrentPosition: () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000 // Cache for 1 minute
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy
          });
        },
        (error) => {
          let errorMessage = 'Location access denied';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
            default:
              errorMessage = 'An unknown error occurred';
              break;
          }
          reject(new Error(errorMessage));
        },
        options
      );
    });
  },

  // Reverse geocoding using OpenStreetMap Nominatim API (free alternative to Google Maps)
  reverseGeocode: async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
        {
          headers: {
            'User-Agent': 'CropConnect-App'
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch address');
      }

      const data = await response.json();
      
      if (!data || !data.address) {
        throw new Error('No address found for these coordinates');
      }

      const address = data.address;
      
      return {
        fullAddress: data.display_name,
        village: address.village || address.hamlet || address.suburb || '',
        district: address.county || address.state_district || '',
        state: address.state || '',
        pincode: address.postcode || '',
        country: address.country || 'India',
        coordinates: {
          latitude,
          longitude
        }
      };
    } catch (error) {
      console.error('Reverse geocoding error:', error);
      throw new Error('Failed to get address from coordinates');
    }
  },

  // Get location and address in one call
  getLocationWithAddress: async () => {
    try {
      const coordinates = await locationService.getCurrentPosition();
      const address = await locationService.reverseGeocode(
        coordinates.latitude,
        coordinates.longitude
      );
      
      return {
        ...address,
        accuracy: coordinates.accuracy
      };
    } catch (error) {
      throw error;
    }
  },

  // Check if location permission is granted
  checkLocationPermission: async () => {
    if (!navigator.permissions) {
      return 'unsupported';
    }

    try {
      const permission = await navigator.permissions.query({ name: 'geolocation' });
      return permission.state; // 'granted', 'denied', or 'prompt'
    } catch (error) {
      return 'unsupported';
    }
  }
};

export default locationService;
