import axios from 'axios';
import { origin } from './config'; 
import { jwtDecode, JwtPayload } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CustomJwtPayload extends JwtPayload {
  id: number;
}

export const fetchPassengerLuggageByUserId = async () => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    if (!token) throw new Error('Token not found');

    const decoded = jwtDecode<CustomJwtPayload>(token);
    const userId = decoded.id;

    const response = await axios.get(`${origin}/api/v1/PassengerLuggage/${userId}`);
    return response.data.data;
  } catch (error: any) {
    console.error('Error fetching passenger luggage:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch passenger luggage');
  }
};

export const postPassengerRegistration = async (formData: FormData): Promise<any> => {
    try {
      const response = await axios.post(`${origin}/api/v1/passengers`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Submit error:", error);
      throw new Error(error.response?.data?.message || "Registration failed. Please try againn.");
    }
  };

  export const submitLuggageCapacity = async (
    passengerId: number,
    luggageKg: number,
    userId: number
  ) => {
    const data = {
      passengerId,
      luggageCapacityKg: luggageKg, 
      userId,
    };
  
    try {
      const response = await axios({
        method: 'post',
        url: `${origin}/api/v1/PassengerLuggage`,
        headers: {
          'Content-Type': 'application/json',
        },
        data: JSON.stringify(data),
      });
  
      return response.data;
    } catch (error: any) {
      console.error('Luggage capacity submission error:', error);
      throw new Error(
        error.response?.data?.message || 'Luggage capacity submission failed.'
      );
    }
  };
  