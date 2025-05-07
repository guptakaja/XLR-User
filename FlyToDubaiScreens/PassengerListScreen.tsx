import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { fetchPassengerLuggageByUserId } from '../Api-requests/PassengerRegistrationApi';

import AsyncStorage from '@react-native-async-storage/async-storage';
interface PassengerRegistration {
  hyd_name?: string;
  hyd_phone?: string;
  hyd_email?: string;
  hyd_location?: string;
  dubai_number?: string;
  dubai_location?: string;
}

interface PassengerData {
  id: number;
  PassengerRegistration?: PassengerRegistration;
}

const PassengerListScreen = () => {
  const navigation = useNavigation();
  const [passengers, setPassengers] = useState<PassengerData[]>([]);
  const [loading, setLoading] = useState(true);
  


  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await fetchPassengerLuggageByUserId();
        setPassengers(result);
      } catch (error) {
        console.error('Fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#FFD700" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: PassengerData }) => {
    const p = item.PassengerRegistration || {};
    return (
      <View style={styles.card}>
        <Text style={styles.cardText}>Name: {p.hyd_name || 'N/A'}</Text>
        <Text style={styles.cardText}>Phone: {p.hyd_phone || 'N/A'}</Text>
        <Text style={styles.cardText}>Email: {p.hyd_email || 'N/A'}</Text>
        <Text style={styles.cardText}>Hyd Location: {p.hyd_location || 'N/A'}</Text>
        <Text style={styles.cardText}>Dubai Number: {p.dubai_number || 'N/A'}</Text>
        <Text style={styles.cardText}>Dubai Location: {p.dubai_location || 'N/A'}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={passengers}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

export default PassengerListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    padding: 16,
    borderTopColor:"white",
    borderTopWidth:1
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFD700',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#1a1a1a',
    padding: 16,
    borderRadius: 10,
    marginBottom: 12,
    borderColor: '#FFD700',
    borderWidth: 1,
  },
  cardText: {
    color: '#FFD700',
    fontSize: 14,
    marginBottom: 4,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});
