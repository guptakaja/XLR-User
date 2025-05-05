import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { getProfile } from '../Api-requests/LoginApi';
import { jwtDecode, JwtPayload } from 'jwt-decode';

interface UserData {
  id: string; 
  fullname: string;
  email: string;
  phone?: string;
  address?: string;
}

interface CustomJwtPayload extends JwtPayload {
  id: number; // JWT returns `id` as number, but API expects string? Adjust accordingly.
}

const ProfileScreen = () => {
  const navigation = useNavigation();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        navigation.navigate('Login' as never);
        return;
      }

      const decoded = jwtDecode<CustomJwtPayload>(token);
      const userId = decoded.id.toString(); 

      const data = await getProfile(userId, token);
      setUserData(data);
    } catch (error: any) {
      console.error('Failed to fetch profile:', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      navigation.navigate('Login' as never);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#f4c542" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Failed to load profile data.</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profile</Text>

      <View style={styles.fieldWrapper}>
        <Text style={styles.label}>Name</Text>
        <View style={styles.profileItem}>
          <Text style={styles.value}>{userData.fullname}</Text>
        </View>
      </View>

      <View style={styles.fieldWrapper}>
        <Text style={styles.label}>Email</Text>
        <View style={styles.profileItem}>
          <Text style={styles.value}>{userData.email}</Text>
        </View>
      </View>

      {userData.phone && (
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Phone</Text>
          <View style={styles.profileItem}>
            <Text style={styles.value}>{userData.phone}</Text>
          </View>
        </View>
      )}

      {userData.address && (
        <View style={styles.fieldWrapper}>
          <Text style={styles.label}>Address</Text>
          <View style={styles.profileItem}>
            <Text style={styles.value}>{userData.address}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: '5%',
    paddingTop: '10%',
    backgroundColor: '#000', // Black background
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // Black background
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700', // Golden title
    marginBottom: '5%',
    paddingBottom: '2%',
    textAlign: 'center', // start align
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700', // Golden border
  },
  profileItem: {
    marginBottom: '4%',
    backgroundColor: '#fff', // White card-like background
    borderRadius: 8,
    padding: '4%',
  },
  label: {
    fontSize: 16,
    color: '#FFD700', // Golden labels
    marginBottom: '2%',
  },
  fieldWrapper: {
    marginBottom: '5%', // Field margin
  },
  value: {
    fontSize: 18,
    color: '#000', // Black text inside white card
    fontWeight: '600',
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    textAlign: 'center',
  },
});
