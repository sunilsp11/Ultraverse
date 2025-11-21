import { Platform, PermissionsAndroid } from 'react-native';
import Geolocation from '@react-native-community/geolocation';

export type LocationData = {
  latitude: number;
  longitude: number;
  address?: string;
};
const getAddressFromCoordinates = async (
  latitude: number,
  longitude: number
): Promise<string> => {
  try {
    const response = await fetch(
      `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    );
    const data = await response.json();
    
    if (data.locality || data.city || data.countryName) {
      return [
        data.locality,
        data.city,
        data.principalSubdivision,
        data.countryName,
      ]
        .filter(Boolean)
        .join(', ');
    }
  } catch (error) {
    console.warn('Error getting address:', error);
  }

  return 'string';
};
export const requestLocationPermission = async (): Promise<boolean> => {
    if (Platform.OS === 'android') {
      try {
        const checkFineLocation = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
        );
        
        if (checkFineLocation) {
          return true;
        }

        const checkCoarseLocation = await PermissionsAndroid.check(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION
        );
        
        if (checkCoarseLocation) {
          return true;
        }

        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Ultraverse needs access to your location to provide location-based features.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        }

        const coarseGranted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Ultraverse needs access to your location to provide location-based features.',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          }
        );
        
        return coarseGranted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn('Error requesting location permission:', err);
        return false;
      }
    }
    return true;
};

export const getCurrentLocation = async (): Promise<LocationData> => {
    return new Promise((resolve, reject) => {
      Geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          const address = await getAddressFromCoordinates(latitude, longitude);
          resolve({ latitude, longitude, address });
        },
        (error) => {
          console.log('High accuracy location failed, trying with lower accuracy:', error);
          
          Geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              
              const address = await getAddressFromCoordinates(latitude, longitude);
              resolve({ latitude, longitude, address });
            },
            (fallbackError) => {
              console.error('Location request failed completely:', fallbackError);
              reject(fallbackError);
            },
            {
              enableHighAccuracy: false,
                timeout: 30000, 
              maximumAge: 60000, 
            }
          );
        },
        {
          enableHighAccuracy: true,
          timeout: 20000, 
          maximumAge: 60000, 
        }
      );
    });
};

export const formatCoordinate = (coordinate: number): string => {
  return Number(coordinate.toFixed(6)).toString();
};

export const getErrorMessage = (error: any): { title: string; message: string } => {
    const errorCode = error?.code;
    
    if (errorCode === 1 || errorCode === 'PERMISSION_DENIED' || error?.message?.includes('permission')) {
      return {
        title: 'Permission Denied',
        message: 'Location permission is required to enable location services. Please grant location permission in your device settings.',
      };
    }
    
    if (errorCode === 3 || errorCode === 'TIMEOUT' || error?.message?.includes('timeout') || error?.message?.includes('timed out')) {
      return {
        title: 'Location Timeout',
        message: 'Location request timed out. Please ensure location services are enabled and try again. You may also try moving to an area with better GPS signal.',
      };
    }
    
    if (errorCode === 2 || errorCode === 'POSITION_UNAVAILABLE') {
      return {
        title: 'Location Unavailable',
        message: 'Your location is currently unavailable. Please ensure location services are enabled on your device and try again.',
      };
    }
    
    return {
      title: 'Location Error',
      message: 'Unable to get your current location. Please try again.',
    };
};

