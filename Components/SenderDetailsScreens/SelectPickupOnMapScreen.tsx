import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import MapView, { Region } from 'react-native-maps';
import * as Location from 'expo-location';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import config from '../../Api-requests/config';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootParamList } from '../../types';

type NavigationProp = StackNavigationProp<RootParamList, 'SelectPickupOnMapScreen'>;


type SelectedLocation = {
  latitude: number;
  longitude: number;
};

const SelectPickupOnMapScreen = () => {
  const navigation = useNavigation<NavigationProp>();

  const [region, setRegion] = useState<Region | null>(null);
  const [address, setAddress] = useState('Fetching location...');
  const [locationTitle, setLocationTitle] = useState('Location Title');
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null);

  const fetchAddress = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${config.GOOGLE_API_KEY}`
      );
      const json = await response.json();
      if (json.results && json.results.length > 0) {
        setAddress(json.results[0].formatted_address);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchNearbyPlaces = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&key=${config.GOOGLE_API_KEY}`
      );
      const json = await response.json();
      if (json.results && json.results.length > 0) {
        let foundTitle = 'Unknown Location';
        json.results.forEach((place: { name: string; types: string[] }) => {
          if (place.types.includes('sublocality') && foundTitle === 'Unknown Location') {
            foundTitle = place.name;
          } else if (place.types.includes('administrative_area_level_2') && foundTitle === 'Unknown Location') {
            foundTitle = place.name;
          } else if (place.types.includes('locality') && foundTitle === 'Unknown Location') {
            foundTitle = place.name;
          }
        });
        setLocationTitle(foundTitle);
      } else {
        setLocationTitle('Unknown Location');
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.error('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = location.coords;

      const initialRegion: Region = {
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };

      setRegion(initialRegion);
      setSelectedLocation({ latitude, longitude });
      fetchAddress(latitude, longitude);
      fetchNearbyPlaces(latitude, longitude);
    };

    getLocation();
  }, []);

  const handleRegionChangeComplete = (newRegion: Region) => {
    setRegion(newRegion);
    setSelectedLocation({ latitude: newRegion.latitude, longitude: newRegion.longitude });
    fetchAddress(newRegion.latitude, newRegion.longitude);
    fetchNearbyPlaces(newRegion.latitude, newRegion.longitude);
  };

  const handleConfirmLocation = () => {
    if (!selectedLocation) return;

    navigation.navigate('SenderDetailsScreen', {
      location: {
        name: address,
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      },
    } as never);
  };

  return (
    <View style={styles.container}>
      {region && (
        <MapView
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={handleRegionChangeComplete}
        />
      )}

      {/* Fixed center pin */}
      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <View style={styles.centerPin}>
          <Icon name="location-pin" size={40} color="red" />
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Your goods will be picked from here</Text>
        <Text style={styles.locationTitle}>{locationTitle}</Text>
        <Text style={styles.address}>{address}</Text>
        <Button title="Confirm Pickup Location" onPress={handleConfirmLocation} color="#fcba03" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    
  },
  map: {
    flex: 1,
  },
  centerPin: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
    zIndex: 10,
  },
  card: {
    position: 'absolute',
    bottom: 20,
    left: 10,
    right: 10,
    backgroundColor: 'black',
    padding: 15,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 2,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
    color:"#FFD700"
  },
  locationTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    marginBottom: 5,
    color: '#FFD700',
  },
  address: {
    marginBottom: 10,
    color: '#FFD700',
  },

});

export default SelectPickupOnMapScreen;
