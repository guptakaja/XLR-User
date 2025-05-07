import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation, RouteProp, useRoute } from '@react-navigation/native';
import { RootParamList } from '../types';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { submitLuggageCapacity } from '../Api-requests/PassengerRegistrationApi';

type RouteParams = RouteProp<RootParamList, 'LuggageCapacityScreen'>;

interface CustomJwtPayload extends JwtPayload {
  id: number;
}

const LuggageCapacityScreen = () => {
  const route = useRoute<RouteParams>();
  const navigation = useNavigation();
  const { passengerId } = route.params;

  const [kg, setKg] = useState(5);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  console.log("Passenger",passengerId)
  console.log("useridd",userId)
  console.log("kgs",kg)
  useEffect(() => {
    getUserIdFromToken();
  }, []);

  const getUserIdFromToken = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (token) {
        const decoded = jwtDecode<CustomJwtPayload>(token);
        setUserId(decoded.id.toString());
      }
    } catch (err) {
      console.error('Error decoding token:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!userId) return;

    try {
      setLoading(true);
      const response = await submitLuggageCapacity(parseInt(passengerId), kg, parseInt(userId));
      console.log("Luggage capacity submitted successfully:", response);
      navigation.navigate('Home' as never);
    } catch (error) {
      console.error("Error submitting luggage capacity:", error);
      alert("Failed to submit luggage capacity.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How much space do you have?</Text>

      <Text style={styles.label}>Select from dropdown</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={kg.toString()}
          onValueChange={(value) => setKg(parseInt(value))}
          style={styles.picker}
          dropdownIconColor="#FFD700"
        >
          {Array.from({ length: 30 }, (_, i) => (
            <Picker.Item key={i} label={`${i + 1} Kg`} value={`${i + 1}`} color="#FFD700" />
          ))}
        </Picker>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LuggageCapacityScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#000', // black background
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#FFD700', // gold
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    color: '#FFD700',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: '#FFD700',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 30,
  },
  picker: {
    height: 50,
    color: '#FFD700',
    backgroundColor: '#111', // darker black for picker
  },
  button: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
