import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Feather,
  FontAwesome5,
  MaterialIcons,
  Ionicons,
} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const navigation = useNavigation<any>();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Top Navbar */}
      <View style={styles.navbar}>
        <TouchableOpacity onPress={handleToggle}>
          <Feather name="menu" size={28} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.navbarTitle}>Home</Text>
      </View>

      {/* Main Content */}
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('SendParcelScreen', { destination: 'Dubai' })
          }
        >
          <Text style={styles.buttonText}>Send a Parcel to Dubai in 7 Hours</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            navigation.navigate('SendParcelScreen', { destination: 'Hyderabad' })
          }
        >
          <Text style={styles.buttonText}>Send a Parcel to HYD in 7 Hours</Text>
        </TouchableOpacity>

        <Text style={styles.orText}>OR</Text>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PassengerRegistrationScreen')}
        >
          <Text style={styles.buttonText}>Fly to Dubai for Free</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('PassengerRegistrationScreen')}
        >
          <Text style={styles.buttonText}>Rent Your Baggage Space & Earn</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Overlay Drawer Menu */}
      {isMenuOpen && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={handleToggle}
        >
          <TouchableOpacity
            activeOpacity={1}
            style={styles.drawer}
            onPress={(e) => e.stopPropagation()}
          >
            {/* Close Icon */}
            <View style={styles.closeIconWrapper}>
              <TouchableOpacity onPress={handleToggle}>
                <Feather name="x" size={26} color="#f4c542" />
              </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.menuContainer}>
              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('ProfileScreen')}
              >
                <Feather name="user" size={20} color="#f4c542" />
                <Text style={styles.menuText}>Profile</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('TrackScreen')}
              >
                <FontAwesome5 name="shipping-fast" size={20} color="#f4c542" />
                <Text style={styles.menuText}>Track</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('PassengerListScreen')}
              >
                <Ionicons name="airplane-outline" size={20} color="#f4c542" />
                <Text style={styles.menuText}>PassengerList</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('LocationsScreen')}
              >
                <Feather name="map-pin" size={20} color="#f4c542" />
                <Text style={styles.menuText}>Locations</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('RatesScreen')}
              >
                <Feather name="dollar-sign" size={20} color="#f4c542" />
                <Text style={styles.menuText}>Rates</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('PickupScreen')}
              >
                <MaterialIcons name="local-shipping" size={20} color="#f4c542" />
                <Text style={styles.menuText}>Pickup</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('SettingsScreen')}
              >
                <Feather name="settings" size={20} color="#f4c542" />
                <Text style={styles.menuText}>Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('SupportScreen')}
              >
                <Feather name="help-circle" size={20} color="#f4c542" />
                <Text style={styles.menuText}>Support</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.menuItem}
                onPress={() => navigation.navigate('MessageCenterScreen')}
              >
                <Feather name="message-square" size={20} color="#f4c542" />
                <Text style={styles.menuText}>Message Center</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem} onPress={handleLogout}>
                <MaterialIcons name="logout" size={20} color="#f4c542" />
                <Text style={styles.menuText}>Logout</Text>
              </TouchableOpacity>
            </ScrollView>
          </TouchableOpacity>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
    backgroundColor: '#000',
  },
  navbarTitle: {
    color: '#FFD700',
    fontSize: 26,
    fontWeight: 'bold',
    marginLeft: '5%',
  },
  container: {
    flexGrow: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: '5%',
    paddingTop: '30%',
    borderTopColor: '#FFD700',
    borderTopWidth: 1,
  },
  button: {
    backgroundColor: '#f4c542',
    paddingVertical: '4%',
    paddingHorizontal: '5%',
    borderRadius: 10,
    width: '100%',
    marginBottom: '13%',
  },
  buttonText: {
    color: '#000',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: '13%',
  },
  smallText: {
    marginTop: '5%',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    flexDirection: 'row',
  },
  drawer: {
    width: '50%',
    backgroundColor: '#000',
    height: '100%',
    padding: 20,
  },
  menuContainer: {
    paddingTop: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    borderBottomColor: '#f4c542',
    borderBottomWidth: 1,
    paddingBottom: 8,
  },
  menuText: {
    color: '#f4c542',
    fontSize: 18,
    marginLeft: 15,
  },
  closeIconWrapper: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  }
});
