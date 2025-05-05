import axios from 'axios';
import config, { origin } from '../Api-requests/config';
export const fetchVehiclePrices = async (distance: number) => {
    try {
        const response = await axios({
            method: 'post',
            url: `${origin}/api/v1/vehicle-type/calculate-prices`, // Replace with your actual backend URL
            headers: {
                'Content-Type': 'application/json',
            },
            data: JSON.stringify({ distance }), // Send distance in the request body
        });
        return response.data; // Return the response data (vehicle prices)
    } catch (error: any) {
        console.error('Error in fetchVehiclePrices:', error.message);
        console.log('Error response:', error.response); // Log the error response
        return { error: error.response?.data?.message || 'An unknown error occurred' };
    }
};

// Post booking details to the backend
export const createBooking = async (data: any) => {
    const newData = JSON.stringify(data);
    try {
        const response = await axios({
            method: 'post',
            url: `${origin}/api/v1/vehicle-booking`, // Replace with your actual backend URL
            headers: {
                'Content-Type': 'application/json',
                // If the endpoint is protected and requires an auth token, you can add it here:
                // 'Authorization': `Bearer ${await getAuthToken()}`
            },
            data: newData,
        });
        return response.data;
    } catch (error: any) {
        console.error('Error in createBooking:', error.message);
        console.log('Error response:', error.response); // Log the error response
        return { error: error.response?.data?.message || 'An unknown error occurred' };
    }
};
