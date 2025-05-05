import React, { useRef, useState } from 'react';
import { View, Text, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import * as Location from 'expo-location';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import config from '../../Api-requests/config';

// Define types
type PickupLocation = {
  name: string;
  latitude: number;
  longitude: number;
} | null;

export default function PickupLocationScreen() {
  const navigation = useNavigation<any>();
  const googlePlacesRef = useRef<any>(null);
  const [pickupLocation, setPickupLocation] = useState<PickupLocation>(null);

  // Function to get current location
  const getCurrentLocation = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required.');
        return;
      }

      const { coords } = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = coords;

      const googleGeocodingUrl = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${config.GOOGLE_API_KEY}`;
      const response = await axios.get(googleGeocodingUrl);
      const results = response.data.results;

      if (results && results.length > 0) {
        const detailedAddress = results[0].formatted_address;

        googlePlacesRef.current?.setAddressText(detailedAddress);

        const currentLocation = {
          name: detailedAddress,
          latitude,
          longitude,
        };

        setPickupLocation(currentLocation);
        navigation.navigate('SenderDetailsScreen', { location: currentLocation });
      } else {
        Alert.alert('Error', 'Failed to fetch a detailed address.');
      }
    } catch (error) {
      console.error('Error fetching current location:', error);
      Alert.alert('Error', 'Failed to get current location.');
    }
  };

  // Function to handle place selection
  const handlePlaceSelect = (data: any, details: any) => {
    if (details && details.geometry) {
      const { lat, lng } = details.geometry.location;
      const selectedLocation = {
        name: data.description,
        latitude: lat,
        longitude: lng,
      };
      setPickupLocation(selectedLocation);
      navigation.navigate('SenderDetailsScreen', { location: selectedLocation });
    } else {
      Alert.alert('Error', 'Unable to fetch location details');
    }
  };

  return (
    <View style={styles.container}>
      <GooglePlacesAutocomplete
        ref={googlePlacesRef}
        placeholder="Enter pickup location"
        fetchDetails={true}
        onPress={handlePlaceSelect}
        query={{
          key: config.GOOGLE_API_KEY,
          language: 'en',
        }}
        styles={{
          textInput: styles.textInput,
          container: styles.autocompleteContainer,
        }}
      />

      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#fcba03' }]}
          onPress={getCurrentLocation}
        >
          <Icon name="my-location" size={24} color="#fff" />
          <Text style={styles.buttonText}>Current Location</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: '#fcba03' }]}
          onPress={() => navigation.navigate('SelectPickupOnMapScreen')}
        >
          <Icon name="location-on" size={24} color="#fff" />
          <Text style={styles.buttonText}>Locate on Map</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#000',
    borderTopColor:"white",
    borderWidth:1,
  },
  autocompleteContainer: {
    flex: 1,
    width: '100%',
    zIndex: 1,
  },
  textInput: {
    fontSize: 16,
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFF',
    color: '#000',
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  button: {
    flex: 1,
    marginHorizontal: 8,
    paddingVertical: 12,
    borderRadius: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: 8,
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
