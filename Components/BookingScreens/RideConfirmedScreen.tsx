import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,Linking,
  Dimensions,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Marker } from 'react-native-maps'; // For the map at the top
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { Divider } from "react-native-paper";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootParamList } from "../../types";
import config from "../../Api-requests/config";
import { io,Socket  } from "socket.io-client";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from "jwt-decode";

type RideStatusUpdate = {
  bookingId: string;
  driver_id: string;
  status: string;
  driver_name: string;
  vehicle_type: string;
  vehicle_number: string;
  phone: string;
};

type Location = {
  latitude: number;
  longitude: number;
  name?: string;
};

type otp = { otp: any };
type totalPrice = { totalPrice: any};
type status = {
  bookingId: string;
  driverId: number;
  vehicleType: string;
  vehicleNumber: string;
  status: string;
  drivername: string;
  phone: string;
};

type address = {
  name: string;
  latitude: number;
  longitude: number;
};

// Navigation prop types
type RideConfirmedScreenNavigationProp = StackNavigationProp<
  RootParamList,
  "RideConfirmedScreen"
>;

type RideConfirmedScreenRouteProp = RouteProp<
  RootParamList,
  "RideConfirmedScreen"
>;

const RideConfirmedScreen = () => {
  const route = useRoute<RideConfirmedScreenRouteProp>();
  const navigation = useNavigation<RideConfirmedScreenNavigationProp>();

  const { status, address, location, otp,totalPrice } = route.params;
  const [rideStatus, setRideStatus] = useState<RideStatusUpdate | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [userId, setUserId] = useState<number | null>(null);

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

  useEffect(() => {
    const socketInstance: Socket = io(config.SOCKET_IO_URL);
    setSocket(socketInstance);
  
    // Ensure connection
    socketInstance.on('connect', () => {
      console.log("Connected to Socket.IO server with ID:", socketInstance.id);
  
      // Send socket ID and booking ID to backend
      socketInstance.emit('associateSocketWithBooking', {
        bookingId: status.bookingId, // Add bookingId in route params
        socketId: socketInstance.id
      });
    });
  
    // Listen for ride status updates
    socketInstance.on('rideStatusUpdate', (data: RideStatusUpdate) => {
      console.log("rideStatusUpdate", data);
      if (data.status === 'ride_started') {
        setRideStatus(data);
        Alert.alert(
          'Ride Started',
          `Your ride with driver ${data.driver_name} (Vehicle: ${data.vehicle_type} - ${data.vehicle_number}) has started.`
        );
        navigation.navigate("RideStartScreen", {
          totalPrice,
          status,
          location,
        });
      }
    });
  
    // Error handling
    socketInstance.on('error', (error) => {
      console.error('Socket error:', error);
    });
  
    return () => {
      socketInstance.disconnect();
    };
  }, []);
  
  const handleCancelTrip = () => {
    if (socket) {
      socket.emit("cancelTrip", {
        bookingId: status.bookingId,
        userId,
        message: "Trip cancelled",
      });
      console.log("Trip cancel event emitted");
  
      Alert.alert(
        "Trip Cancelled",
        "Your trip has been cancelled.",
        [
          {
            text: "OK",
            onPress: () => navigation.navigate("Tablayout" as never),
          },
        ]
      );
    }
  };
  

  const handleCallDriver = () => {
    Linking.openURL(`tel:${status.phone}`);
  };

  return (
    <ScrollView style={styles.container}>
      {/* MapView at the top */}
      <View style={styles.mapContainer}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: address.latitude,
            longitude: address.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
        >
          {/* Marker for Pickup */}
          <Marker
            coordinate={{
              latitude: address.latitude,
              longitude: address.longitude,
            }}
            title="Pickup"
            pinColor="green"
          />
          {/* Marker for Dropoff */}
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
            title="Dropoff"
            pinColor="red"
          />
        </MapView>
      </View>
  
      <View style={styles.rideConfirmedHeader}>
        <Text style={styles.headerText}>Ride Confirmed</Text>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>5 Min</Text>
        </View>
      </View>
  
      <View style={styles.pinContainer}>
        <Text style={styles.pinLabel}>Start your ride with PIN</Text>
        <View style={styles.pinBoxes}>
          {otp.split("").map((digit: string, index: number) => (
            <View key={index} style={styles.pinBox}>
              <Text style={styles.pinDigit}>{digit}</Text>
            </View>
          ))}
        </View>
      </View>
  
      <Divider style={styles.divider} />
  
      {/* Driver and Vehicle Info */}
      <View style={styles.driverVehicleContainer}>
        {/* Vehicle Info */}
        <View style={styles.vehicleInfo}>
          <Text style={styles.vehicleNumber}>{status.vehicle_number}</Text>
          <Text style={styles.vehicleType}>{status.vehicle_type}</Text>
        </View>
  
        {/* Driver Info - Row with Name, Rating, and Icon */}
        {/* Driver Name and Rating */}
        <View style={styles.driverNameRatingContainer}>
          <Text style={styles.driverName}>{status.driver_name}</Text>
          <View style={styles.driverRating}>
            <Ionicons name="star" size={14} color="#FFD700" />
            <Text style={styles.ratingText}>4.5</Text>
          </View>
        </View>
  
        {/* Person Icon in a separate container */}
        <View style={styles.personIconContainer}>
          <Ionicons name="person" size={24} color="#FFD700" />
        </View>
      </View>
  
      <View style={styles.contactActions}>
        <TouchableOpacity onPress={handleCallDriver} style={styles.callButton}>
          <Ionicons name="call" size={24} color="#FFD700" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.messageButton}>
          <Ionicons name="chatbubble-outline" size={20} color="#FFD700" />
          <Text style={styles.messageButtonText}>Message {status.driver_name}</Text>
        </TouchableOpacity>
      </View>
  
      <Divider style={styles.divider} />
  
      {/* Location Details */}
      <View style={styles.locationDetailsContainer}>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={20} color="green" />
          <Text style={styles.locationText}>{address.name}</Text>
        </View>
        <View style={styles.locationRow}>
          <Ionicons name="location-sharp" size={20} color="red" />
          <Text style={styles.locationText}>{location.name}</Text>
        </View>
      </View>
  
      <Divider style={styles.divider} />
  
      {/* Fare and Payment */}
      <View style={styles.fareContainer}>
        <Text style={styles.fareLabel}>Total Fare</Text>
        <Text style={styles.fareText}>₹{totalPrice}</Text>
      </View>
  
      <View style={styles.paymentTypeContainer}>
        <Text style={styles.paymentType}>CASH RIDE</Text>
      </View>
  
      <TouchableOpacity style={styles.cancelRideButton} onPress={handleCancelTrip}>
        <Text style={styles.cancelRideText}>Cancel Ride</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#000",
    },
    mapContainer: {
      height: Dimensions.get("window").height * 0.25,
    },
    map: {
      ...StyleSheet.absoluteFillObject,
    },
    rideConfirmedHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 10,
    },
    headerText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFD700",
    },
    timerContainer: {
      backgroundColor: "#000",
      borderRadius: 20,
      paddingVertical: 6,
      paddingHorizontal: 16,
      borderColor: "#FFD700",
      borderWidth: 1,
    },
    timerText: {
      fontSize: 12,
      color: "#FFD700",
    },
    pinContainer: {
      alignItems: "center",
      paddingBottom: 13,
    },
    pinLabel: {
      fontSize: 16,
      color: "#FFD700",
    },
    pinBoxes: {
      flexDirection: "row",
      marginTop: 10,
    },
    pinBox: {
      backgroundColor: "#000",
      padding: 12,
      borderRadius: 8,
      marginHorizontal: 4,
      borderColor: "#FFD700",
      borderWidth: 1,
    },
    pinDigit: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#FFD700",
    },
    divider: {
      height: 1,
      backgroundColor: "#FFD700",
    },
    driverVehicleContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      paddingVertical: 8,
      backgroundColor: "#000",
      borderRadius: 10,
      borderColor: "#FFD700",
      borderWidth: 1,
    },
    vehicleInfo: {
      flexDirection: "column",
    },
    vehicleNumber: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFD700",
    },
    vehicleType: {
      fontSize: 14,
      color: "#FFD700",
    },
    driverNameRatingContainer: {
      flexDirection: "column",
      marginRight: 10,
    },
    driverName: {
      fontSize: 16,
      fontWeight: "bold",
      color: "#FFD700",
    },
    driverRating: {
      flexDirection: "row",
      alignItems: "center",
      marginTop: 4,
    },
    ratingText: {
      marginLeft: 4,
      fontSize: 14,
      color: "#FFD700",
    },
    personIconContainer: {
      justifyContent: "center",
    },
    contactActions: {
      flexDirection: "row",
      justifyContent: "space-between",
      padding: 16,
    },
    callButton: {
      backgroundColor: "#000",
      padding: 12,
      borderRadius: 8,
      marginRight: 8,
      borderColor: "#FFD700",
      borderWidth: 1,
    },
    messageButton: {
      backgroundColor: "#000",
      borderColor: "#FFD700",
      borderWidth: 1,
      borderRadius: 8,
      paddingVertical: 10,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
    },
    messageButtonText: {
      marginLeft: 8,
      fontSize: 14,
      fontWeight: "bold",
      color: "#FFD700",
    },
    locationDetailsContainer: {
      paddingHorizontal: 16,
    },
    locationRow: {
      flexDirection: "row",
      alignItems: "center",
      marginVertical: 8,
    },
    locationText: {
      marginLeft: 8,
      fontSize: 14,
      color: "#FFD700",
    },
    fareContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      paddingHorizontal: 16,
      marginVertical: 6,
    },
    fareLabel: {
      fontSize: 16,
      color: "#FFD700",
    },
    fareText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#FFD700",
    },
    paymentTypeContainer: {
      alignItems: "center",
      marginVertical: 16,
    },
    paymentType: {
      fontSize: 16,
      color: "#FFD700",
    },
    cancelRideButton: {
      backgroundColor: "#000",
      padding: 16,
      alignItems: "center",
      borderRadius: 8,
      marginHorizontal: 16,
      borderColor: "#FFD700",
      borderWidth: 1,
    },
    cancelRideText: {
      color: "#FFD700",
      fontWeight: "bold",
      fontSize: 16,
    },
  });

export default RideConfirmedScreen;