import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation, RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import config from '../../Api-requests/config';
import { RootParamList } from '../../types';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { jwtDecode } from 'jwt-decode';
import { StackNavigationProp } from '@react-navigation/stack';
import { TextInput } from 'react-native-paper'; // Import TextInput from react-native-paper

type ReceiverDetailsScreenRouteProp = RouteProp<RootParamList, 'ReceiverDetailsScreen'>;
type DropLocationScreenNavigationProp = StackNavigationProp<RootParamList, 'DropLocationScreen'>;

const ReceiverDetailsScreen = () => {
    const route = useRoute<ReceiverDetailsScreenRouteProp>();
    const navigation = useNavigation<DropLocationScreenNavigationProp>();
    const { location } = route.params;
    const name = route?.params?.name || "Unknown";
    const address = route?.params?.address || "Fetching current location...";
    const phone = route?.params?.phone || "Unknown";
    console.log("Params data",address);

    console.log("Location", location);
    const [receiverName, setReceiverName] = useState('');
    const [receiverMobile, setReceiverMobile] = useState('');
    const [locationType, setLocationType] = useState('Home');
    const [user_id, setUserId] = useState<string | null>(null);
    const [distance, setDistance] = useState<number | null>(null); // State to store distance


    

    const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
        const R = 6371; // Earth's radius in kilometers
        const dLat = (lat2 - lat1) * (Math.PI / 180); // Convert degrees to radians
        const dLon = (lon2 - lon1) * (Math.PI / 180);
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // Distance in kilometers
    };

    // Calculate distance when component mounts
    useEffect(() => {
        if (location && address) {
            const { latitude: lat1, longitude: lon1 } = location;

            // Ensure that address has latitude and longitude, not just a string
            if (typeof address === 'object' && 'latitude' in address && 'longitude' in address) {
                const { latitude: lat2, longitude: lon2 } = address;

                const calculatedDistance = calculateDistance(lat1, lon1, lat2, lon2);
                setDistance(calculatedDistance);
                console.log(`Distance between location and address: ${calculatedDistance.toFixed(2)} km`);
            } else {
                console.error('Address does not contain latitude and longitude');
                Alert.alert('Error', 'Address data is missing latitude and longitude.');
            }
        }
    }, [location, address]);

    const handleConfirm = () => {
        if (!receiverName || !receiverMobile) {
          Alert.alert('Error', 'Please fill in all required fields.');
          return;
        }
      
        navigation.navigate(
          'VehicleSelectionScreen',
          { name,address,phone, 
            receiver_name: receiverName,
            receiver_address: location.name,
            receiver_phone: receiverMobile,
            location,
          } as never
        );
      };
      
    const handleChangeLocation = () => {
        navigation.navigate('SelectDropOnMapScreen' as never);
    };

    return (
        <View style={styles.container}>
            <MapView
                style={styles.map}
                initialRegion={{
                    latitude: location.latitude,
                    longitude: location.longitude,
                    latitudeDelta: 0.005,
                    longitudeDelta: 0.005,
                }}
            >
                <Marker coordinate={location} />
            </MapView>
    
            <View style={styles.detailsContainer}>
                <View style={styles.locationRow}>
                    <Icon name="location-on" size={24} color="#FFD700" />
                    <View style={styles.locationTextContainer}>
                        <Text style={styles.locationTitle}>{location.name || 'Selected Location'}</Text>
                    </View>
                    <TouchableOpacity onPress={handleChangeLocation}>
                        <Text style={styles.changeButton}>Change</Text>
                    </TouchableOpacity>
                </View>
    
                {/* Input for Receiver's Name */}
                <TextInput
                    label="Receiver's Name"
                    mode="outlined"
                    value={receiverName}
                    onChangeText={setReceiverName}
                    style={styles.input}
                    theme={{
                        colors: {
                            primary: '#FFD700',
                            background: '#FFFFFF',
                            text: '#000000',
                            placeholder: '#ccc'
                        }
                    }}
                />
    
                {/* Input for Receiver's Mobile Number */}
                <TextInput
                    label="Receiver's Mobile Number"
                    mode="outlined"
                    keyboardType="phone-pad"
                    value={receiverMobile}
                    onChangeText={setReceiverMobile}
                    style={styles.input}
                    theme={{
                        colors: {
                            primary: '#FFD700',
                            background: '#FFFFFF',
                            text: '#000000',
                            placeholder: '#ccc'
                        }
                    }}
                />
    
                <Text style={styles.saveAsText}>Save as (optional):</Text>
                <View style={styles.locationTypeContainer}>
                    <TouchableOpacity
                        style={[
                            styles.locationTypeButton,
                            locationType === 'Home' && styles.selectedButton,
                        ]}
                        onPress={() => setLocationType('Home')}
                    >
                        <Icon name="home" size={24} color={locationType === 'Home' ? '#000' : '#FFD700'} />
                        <Text
                            style={[
                                styles.locationTypeText,
                                locationType === 'Home' && styles.selectedText,
                            ]}
                        >
                            Home
                        </Text>
                    </TouchableOpacity>
    
                    <TouchableOpacity
                        style={[
                            styles.locationTypeButton,
                            locationType === 'Shop' && styles.selectedButton,
                        ]}
                        onPress={() => setLocationType('Shop')}
                    >
                        <Icon name="store" size={24} color={locationType === 'Shop' ? '#000' : '#FFD700'} />
                        <Text
                            style={[
                                styles.locationTypeText,
                                locationType === 'Shop' && styles.selectedText,
                            ]}
                        >
                            Shop
                        </Text>
                    </TouchableOpacity>
    
                    <TouchableOpacity
                        style={[
                            styles.locationTypeButton,
                            locationType === 'Other' && styles.selectedButton,
                        ]}
                        onPress={() => setLocationType('Other')}
                    >
                        <Icon name="favorite" size={24} color={locationType === 'Other' ? '#000' : '#FFD700'} />
                        <Text
                            style={[
                                styles.locationTypeText,
                                locationType === 'Other' && styles.selectedText,
                            ]}
                        >
                            Other
                        </Text>
                    </TouchableOpacity>
                </View>
    
                <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
                    <Text style={styles.confirmButtonText}>Confirm And Proceed</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
    // Styles
    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: '#000',
        },
        map: {
            height: '40%',
        },
        detailsContainer: {
            padding: 16,
            backgroundColor: '#000',
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            position: 'absolute',
            bottom: 0,
            width: '100%',
            height: '60%',
        },
        locationRow: {
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 16,
        },
        locationTextContainer: {
            flex: 1,
            marginLeft: 10,
        },
        locationTitle: {
            fontSize: 15,
            fontWeight: '400',
            color: '#FFD700',
        },
        locationSubtitle: {
            color: '#FFD700',
        },
        changeButton: {
            color: '#FFD700',
            fontWeight: '600',
        },
        input: {
            marginVertical: 8,
            backgroundColor: '#FFF',
        },
        saveAsText: {
            marginTop: 16,
            fontSize: 16,
            fontWeight: '600',
            color: '#FFD700',
        },
        locationTypeContainer: {
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginVertical: 16,
        },
        locationTypeButton: {
            flexDirection: 'row',
            alignItems: 'center',
            padding: 10,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#FFD700',
            width: '30%',
            justifyContent: 'center',
            backgroundColor: '#000',
        },
        locationTypeText: {
            marginLeft: 8,
            color: '#FFD700',
        },
        selectedButton: {
            backgroundColor: '#FFD700',
        },
        selectedText: {
            color: '#000',
        },
        confirmButton: {
            backgroundColor: '#FFD700',
            padding: 16,
            borderRadius: 10,
            alignItems: 'center',
            borderColor: '#FFD700',
            borderWidth: 1,
        },
        confirmButtonText: {
            color: '#000',
            fontSize: 18,
            fontWeight: '600',
        },
    });
    
    export default ReceiverDetailsScreen;