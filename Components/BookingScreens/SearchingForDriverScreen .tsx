import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useRoute, RouteProp, useNavigation } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Ionicons";
import MapView, { Marker } from "react-native-maps";
import config from "../../Api-requests/config";
import { io,Socket  } from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

// Define the types for the route parameters and Driver
type Location = {
  latitude: number;
  longitude: number;
  name?: string;
};

type address = {
  name: string;
  latitude: number;
  longitude: number;
};

type Driver = {
  driver_id: number;
  vehicle_type: string;
  latitude: number;
  longitude: number;
};

type RootStackParamList = {
  SearchingForDriverScreen: {
    bookingId: string;
    address: address;
    location: Location;
    totalPrice: number;
    vehicleName: string;
    sender_name: string,
    sender_phone: string,
    receiver_name: string,
    receiver_phone: string,
    otp: any,
  };
  RideConfirmedScreen: {
    totalPrice: number;
    status: any;
    location: Location;
    address: address;
    otp: any;
  };
};

type SearchingForDriverScreenRouteProp = RouteProp<
  RootStackParamList,
  "SearchingForDriverScreen"
>;

type SearchingForDriverScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "SearchingForDriverScreen"
>;

const SearchingForDriverScreen = () => {
  const route = useRoute<SearchingForDriverScreenRouteProp>();
  const { bookingId, address, location, totalPrice, vehicleName,sender_name,sender_phone,receiver_name,receiver_phone,otp } = route.params;
  const navigation = useNavigation<SearchingForDriverScreenNavigationProp>();

  const [countdown, setCountdown] = useState(600);
  const [nearbyDrivers, setNearbyDrivers] = useState<Driver[]>([]);
  const [userId, setUserId] = useState<number | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null); // State for socket connection
  const [currentDriverIndex, setCurrentDriverIndex] = useState(0);

  // Fetch user ID from token stored in AsyncStorage
  const userDetails = async () => {
    try {
      const token = await AsyncStorage.getItem(config.userCookie);
      if (!token) throw new Error("Token not found in AsyncStorage");
      const decodedToken: any = jwtDecode(token);
      const user_id = decodedToken.id;
      console.log("User ID decoded from token:", user_id);
      setUserId(user_id); // Set userId state
    } catch (error) {
      console.error("Failed to decode token or retrieve user info:", error);
      Alert.alert("Error", "Failed to retrieve user information.");
    }
  };

  useEffect(() => {
    // Fetch user details when the component mounts
    userDetails();
  }, []);

  // Initialize socket connection and log socket ID
  useEffect(() => {
    const newSocket = io(config.SOCKET_IO_URL);

    // Log socket connection event with the user's socket ID
    newSocket.on("connect", () => {
      console.log("Connected to Socket.IO server with ID:", newSocket.id);
    });

    setSocket(newSocket);


    newSocket.on("rideRequestStatus", (status) => {
      console.log("Ride request status", status);
      console.log(`Ride request status received from: Socket ID: ${newSocket.id}`);
      
      if (status?.status === "accepted") {
        navigation.navigate("RideConfirmedScreen", {
          totalPrice:totalPrice,
          status: status,
          location: location,
          address: address,
          otp: otp,
        });
      }
    });
    
    return () => {
      console.log("Disconnecting socket with ID:", newSocket.id);
      newSocket.disconnect(); // Clean up socket when unmounting
    };
  }, []);

  // Emit event to fetch nearby drivers and log socket ID
  useEffect(() => {
    if (socket) {
      console.log("Requesting nearby drivers, Socket ID:", socket.id);
      socket.emit("requestNearbyDrivers", {
        vehicle_type: vehicleName,
        latitude: address.latitude,
        longitude: address.longitude,
      });

      // Listen for nearby drivers from the server
      socket.on("nearbyDrivers", (drivers: Driver[]) => {
        console.log("Nearby drivers received:", drivers, "Socket ID:", socket.id);
        setNearbyDrivers(drivers);
      });
    }
  }, [socket, vehicleName, address.latitude, address.longitude]);

 

  // Request booking from the next available driver and log socket ID
  const requestNextDriver = () => {
    const filteredDrivers = nearbyDrivers.filter(
      (driver) => driver.vehicle_type === vehicleName
    );
    console.log("Filtered drivers:", filteredDrivers);

    if (filteredDrivers.length > 0 && currentDriverIndex < filteredDrivers.length) {
      const driverToRequest = filteredDrivers[currentDriverIndex];
      setCurrentDriverIndex(currentDriverIndex + 1); // Move to the next driver

      // Emit ride request to this driver only if socket is connected
      if (socket) {
        console.log(
          "Requesting booking with driver:",
          driverToRequest.driver_id,
          "Socket ID:",
          socket.id
        );
        socket.emit("REQUEST_BOOKING", {
          bookingId: bookingId,
          userId: userId,
          driver_id: driverToRequest.driver_id,
          pickupAddress: {
            latitude: address.latitude,
            longitude: address.longitude,
            name: address.name
          },
          dropoffAddress: {
            latitude: location.latitude,
            longitude: location.longitude,
            name: location.name
          },
          totalPrice: totalPrice,
          vehicleName: vehicleName,
          sender_name: sender_name,
          sender_phone: sender_phone,
          receiver_name: receiver_name,
          receiver_phone: receiver_phone,
          otp: otp, // OTP for security purposes
        });
      } else {
        Alert.alert("Error", "Socket connection is not available.");
      }
    } else {
      // If no more drivers are available, show an alert
      console.log("No drivers available or all drivers have rejected the ride, Socket ID:", socket?.id);
      Alert.alert("No Drivers Available", "For selected vehicle.");
    }
  };

  // Automatically request booking with the first available driver
  useEffect(() => {
    if (nearbyDrivers.length > 0) {
      requestNextDriver();
    }
  }, [nearbyDrivers]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    if (countdown === 0) {
      clearInterval(interval);
      Alert.alert("Time's up", "Booking has been cancelled automatically.");
    }

    return () => clearInterval(interval);
  }, [countdown]);

  const handleCancelTrip = () => {
    Alert.alert(
      "Trip Cancelled",
      "Your trip has been cancelled.",
      [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate('TabLayoutScreen' as never);  // Navigate to TabLayoutScreen
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Navigation */}
      <View style={styles.topNavContainer}>
        <View style={styles.topNav}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon name="arrow-back" size={24} color="#FFD700" />
          </TouchableOpacity>
          <Text style={styles.tripIdText}>Trip CRN {bookingId}</Text>
          <View style={styles.navIcons}>
            <Icon name="information-circle-outline" size={24} color="#FFD700" />
            <Icon
              name="share-social-outline"
              size={24}
              color="#FFD700"
              style={styles.shareIcon}
            />
          </View>
        </View>
      </View>
  
      {/* Route and Address Info */}
      <View style={styles.routeInfoCard}>
        <View style={styles.routeInfo}>
          <Text style={styles.routeText}>
            {address.name} → {location.name}
          </Text>
          <TouchableOpacity>
            <Text style={styles.addText}>+ ADD</Text>
          </TouchableOpacity>
        </View>
      </View>
  
      {/* Main Container for Map and Searching for Driver Info */}
      <View style={styles.mainContainer}>
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            region={{
              latitude: address.latitude,
              longitude: address.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
          >
            {/* Current Location Marker */}
            <Marker
              coordinate={{
                latitude: address.latitude,
                longitude: address.longitude,
              }}
            >
              <View>
                <Image
                  source={require('../../assets/images/shashi-bsk.png')}
                  style={{ width: 40, height: 40 }}
                />
              </View>
            </Marker>
  
            {/* Filtered Driver Location Markers */}
            {nearbyDrivers.map((driver) => {
              let vehicleIcon;
              switch (driver.vehicle_type) {
                case "Bike":
                  vehicleIcon = require('../../assets/images/bike1.png');
                  break;
                case "Truck":
                  vehicleIcon = require('../../assets/images/truck1.png');
                  break;
                case "3-wheeler":
                  vehicleIcon = require('../../assets/images/3-wheeler.png');
                  break;
                case "4-wheeler":
                  vehicleIcon = require('../../assets/images/4-wheeler.png');
                  break;
                default:
                  vehicleIcon = require('../../assets/images/shashi-bsk.png');
              }
  
              return (
                <Marker
                  key={driver.driver_id}
                  coordinate={{
                    latitude: driver.latitude,
                    longitude: driver.longitude,
                  }}
                >
                  <View>
                    <Image
                      source={vehicleIcon}
                      style={{ width: 70, height: 50 }}
                    />
                  </View>
                </Marker>
              );
            })}
          </MapView>
        </View>
  
        {/* Searching for Driver Info */}
        <View style={styles.searchingContainer}>
          <View style={styles.bookingStatus}>
            <Icon name="checkmark-circle" size={48} color="#FFD700" />
            <Text style={styles.searchingText}>Searching for a driver...</Text>
            <Text style={styles.cancelText}>
              Booking will get cancelled if not allocated in{" "}
              {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? "0" : ""}
              {countdown % 60}
            </Text>
            <Text style={styles.savingText}>
              Yay! You are saving ₹15 on this order 🤑
            </Text>
          </View>
  
          {/* Payment Info */}
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentText}>Cash</Text>
            <Text style={styles.priceText}>₹{totalPrice}</Text>
            <TouchableOpacity>
              <Text style={styles.viewBreakupText}>View Breakup</Text>
            </TouchableOpacity>
          </View>
  
          {/* Contact Support and Cancel Trip */}
          <View style={styles.actions}>
            <TouchableOpacity style={styles.supportButton}>
              <Text style={styles.supportText}>Contact Support</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={handleCancelTrip}>
              <Text style={styles.cancelButtonText}>Cancel Trip</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
  // Stylesheet
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
    },
    topNavContainer: {
      width: "100%",
      backgroundColor: "#000",
      paddingTop: 40,
      paddingBottom: 16,
      borderBottomColor: 'white',
      borderBottomWidth: 1,
    },
    topNav: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 16,
    },
    tripIdText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFD700",
    },
    navIcons: {
      flexDirection: "row",
    },
    shareIcon: {
      marginLeft: 12,
    },
    routeInfoCard: {
      margin: 16,
      padding: 16,
      backgroundColor: "#000",
      borderRadius: 8,
      borderColor: '#FFD700',
      borderWidth: 1,
    },
    routeText: {
      color: '#FFD700',
    },
    routeInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    addText: {
      color: "#FFD700",
      fontWeight: 'bold',
    },
    mainContainer: {
      flex: 1,
      flexDirection: "column",
      backgroundColor: '#000',
    },
    mapContainer: {
      flex: 1,
      margin: 16,
      borderRadius: 8,
      overflow: "hidden",
      borderColor: '#FFD700',
      borderWidth: 1,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    searchingContainer: {
      flex: 1,
      backgroundColor: "#000",
      borderTopLeftRadius: 12,
      borderTopRightRadius: 12,
      padding: 16,
    },
    bookingStatus: {
      alignItems: "center",
      marginBottom: 16,
    },
    searchingText: {
      marginTop: 16,
      fontSize: 20,
      fontWeight: "bold",
      color: '#FFD700',
    },
    cancelText: {
      marginTop: 8,
      color: "#FFD700",
    },
    savingText: {
      marginTop: 8,
      color: "#FFD700",
      fontWeight: 'bold',
    },
    paymentInfo: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      backgroundColor: "#000",
      padding: 16,
      borderRadius: 8,
      borderColor: '#FFD700',
      borderWidth: 1,
    },
    paymentText: {
      color: '#FFD700',
    },
    priceText: {
      fontWeight: "bold",
      fontSize: 16,
      color: '#FFD700',
    },
    viewBreakupText: {
      color: "#FFD700",
      fontWeight: 'bold',
    },
    actions: {
      marginTop: 16,
      flexDirection: "row",
      justifyContent: "space-between",
    },
    supportButton: {
      backgroundColor: "#FFD700",
      padding: 12,
      borderRadius: 8,
      flex: 1,
      marginRight: 8,
      alignItems: "center",
      borderColor: '#FFD700',
      borderWidth: 1,
    },
    supportText: {
      color: "#000",
      fontWeight: "bold",
    },
    cancelButton: {
      backgroundColor: "#000",
      padding: 12,
      borderRadius: 8,
      flex: 1,
      alignItems: "center",
      borderColor: '#FFD700',
      borderWidth: 1,
    },
    cancelButtonText: {
      color: "#FFD700",
      fontWeight: "bold",
    },
  });
export default SearchingForDriverScreen;