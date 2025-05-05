import React, { useEffect, useState } from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput } from 'react-native-paper';
import MapView, { Marker } from 'react-native-maps';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootParamList } from '../../types';

type SenderDetailsScreenNavigationProp = NativeStackNavigationProp<
  RootParamList,
  'DropLocationScreen'
>;

type SenderDetailsScreenRouteProp = RouteProp<RootParamList, 'DropLocationScreen'>;


const SenderDetailsScreen = () => {
  const navigation = useNavigation<SenderDetailsScreenNavigationProp>();
const route = useRoute<SenderDetailsScreenRouteProp>();
  const { location } = route.params;

  const [senderName, setSenderName] = useState('');
  const [senderMobile, setSenderMobile] = useState('');
  const [locationType, setLocationType] = useState('Home');
  const [loading, setLoading] = useState(false);



  const handleConfirm = () => {
    if (!senderName || !senderMobile) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }
  
    navigation.navigate('DropLocationScreen', {
      name: senderName,
      phone: senderMobile,
      address: location,
    });
  };
  

  const handleChangeLocation = () => {
    navigation.navigate('PickupLocationScreen' as never);
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
  
        <TextInput
          label="Sender's Name"
          mode="outlined"
          value={senderName}
          onChangeText={setSenderName}
          style={styles.input}
          theme={{
            colors: {
              primary: '#FFD700', // Outline color when focused
              text: '#000000', // Text color
              placeholder: '#ccc', // Placeholder color
              background: '#FFFFFF', // Background color
            }
          }}
        />
  
        <TextInput
          label="Sender's Mobile Number"
          mode="outlined"
          keyboardType="phone-pad"
          value={senderMobile}
          onChangeText={setSenderMobile}
          style={styles.input}
          theme={{
            colors: {
              primary: '#FFD700',
              text: '#000000',
              placeholder: '#ccc',
              background: '#FFFFFF',
            }
          }}
        />
  
        <Text style={styles.saveAsText}>Save as (optional):</Text>
        <View style={styles.locationTypeContainer}>
          {['Home', 'Shop', 'Other'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[
                styles.locationTypeButton,
                locationType === type && styles.selectedButton,
              ]}
              onPress={() => setLocationType(type)}
            >
              <Icon
                name={
                  type === 'Home' ? 'home' :
                  type === 'Shop' ? 'store' : 'favorite'
                }
                size={24}
                color={locationType === type ? '#000' : '#FFD700'}
              />
              <Text
                style={[
                  styles.locationTypeText,
                  locationType === type && styles.selectedText,
                ]}
              >
                {type}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
  
        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm} disabled={loading}>
          <Text style={styles.confirmButtonText}>
            {loading ? 'Submitting...' : 'Confirm And Proceed'}
          </Text>
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
      borderTopColor:"white",
      borderWidth:1,
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
      color: '#888',
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
  
  export default SenderDetailsScreen;