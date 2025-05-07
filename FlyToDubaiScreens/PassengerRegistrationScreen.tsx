import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as DocumentPicker from 'expo-document-picker';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { postPassengerRegistration } from '../Api-requests/PassengerRegistrationApi';
import config from '../Api-requests/config';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootParamList } from '../types';

type NavigationProp = NativeStackNavigationProp<RootParamList, 'PassengerRegistrationScreen'>;

const PassengerRegistrationScreen = () => {
  const navigation = useNavigation<NavigationProp>();
  const [hydName, setHydName] = useState('');
  const [hydPhone, setHydPhone] = useState('');
  const [hydEmail, setHydEmail] = useState('');
  const [dubaiNumber, setDubaiNumber] = useState('');
  const [dubaiLocation, setDubaiLocation] = useState('');
  const [hydLocation, setHydLocation] = useState('');
  const [travelDate, setTravelDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [visaFile, setVisaFile] = useState<any>(null);
  const [ticketFile, setTicketFile] = useState<any>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [locationType, setLocationType] = useState<'HYD' | 'DUBAI'>('HYD');

  const pickDocument = async (setFile: (file: any) => void) => {
    const result = await DocumentPicker.getDocumentAsync({ type: '*/*' });
    if (!result.canceled) setFile(result.assets[0]);
  };

  const handleDateChange = (_: any, selectedDate?: Date) => {
    if (selectedDate) setTravelDate(selectedDate);
    setShowDatePicker(false);
  };

  const handleSubmit = async () => {
    if (!hydName || !hydPhone || !hydEmail || !hydLocation || !dubaiNumber || !dubaiLocation || !travelDate) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const formData = new FormData();
  
    formData.append('hyd_name', hydName);
    formData.append('hyd_phone', hydPhone);
    formData.append('hyd_email', hydEmail);
    formData.append('hyd_location', hydLocation);
    formData.append('dubai_number', dubaiNumber);
    formData.append('dubai_location', dubaiLocation);
    formData.append('travel_date', travelDate.toISOString());
  
    if (visaFile) {
      formData.append('visa_file', {
        uri: visaFile.uri,
        name: visaFile.name,
        type: visaFile.mimeType || 'application/octet-stream',
      } as any);
    }
  
    if (ticketFile) {
      formData.append('ticket_file', {
        uri: ticketFile.uri,
        name: ticketFile.name,
        type: ticketFile.mimeType || 'application/octet-stream',
      } as any);
    }
  
    try {
      const result = await postPassengerRegistration(formData);
      if (result.success) {
        const passengerId = result.data?.id;
        Alert.alert('Success', 'Registration successful');
        console.log('Registration success:', result);
        navigation.navigate('LuggageCapacityScreen',{ passengerId });
      } else {
        Alert.alert('Error', 'Registration failed. Please try again.');
      }
    } catch (error) {
      console.error('Submit error:', error);
      Alert.alert('Error', 'An error occurred while submitting your registration');
    }
  };
  

  const openLocationModal = (type: 'HYD' | 'DUBAI') => {
    setLocationType(type);
    setShowLocationModal(true);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
          <Text style={styles.heading}>Register as Passenger</Text>

          <Text style={styles.label}>Hyderabad Name</Text>
          <TextInput style={styles.input} value={hydName} onChangeText={setHydName} placeholder="Full Name" placeholderTextColor="#aaa" />

          <Text style={styles.label}>Hyderabad Phone</Text>
          <TextInput style={styles.input} value={hydPhone} onChangeText={setHydPhone} placeholder="Phone Number" placeholderTextColor="#aaa" keyboardType="phone-pad" />

          <Text style={styles.label}>Hyderabad Email</Text>
          <TextInput style={styles.input} value={hydEmail} onChangeText={setHydEmail} placeholder="Email" placeholderTextColor="#aaa" keyboardType="email-address" />

          <Text style={styles.label}>Hyderabad Pickup Location</Text>
          <TouchableOpacity style={styles.locationButton} onPress={() => openLocationModal('HYD')}>
            <Text style={styles.dateText}>{hydLocation || 'Select Hyderabad Location'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Dubai Number</Text>
          <TextInput style={styles.input} value={dubaiNumber} onChangeText={setDubaiNumber} placeholder="Phone Number" placeholderTextColor="#aaa" keyboardType="phone-pad" />

          <Text style={styles.label}>Dubai Pickup Location</Text>
          <TouchableOpacity style={styles.locationButton} onPress={() => openLocationModal('DUBAI')}>
            <Text style={styles.dateText}>{dubaiLocation || 'Select Dubai Location'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Date of Travel</Text>
          <TouchableOpacity style={styles.datePicker} onPress={() => setShowDatePicker(true)}>
            <Text style={styles.dateText}>{travelDate.toDateString()}</Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={travelDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}

          <Text style={styles.label}>Upload Visa</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument(setVisaFile)}>
            <Text style={styles.uploadText}>{visaFile?.name || 'Choose File'}</Text>
          </TouchableOpacity>

          <Text style={styles.label}>Upload Ticket</Text>
          <TouchableOpacity style={styles.uploadButton} onPress={() => pickDocument(setTicketFile)}>
            <Text style={styles.uploadText}>{ticketFile?.name || 'Choose File'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
            <Text style={styles.submitText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal for Google Places */}
      <Modal visible={showLocationModal} animationType="slide">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
          <View style={{ padding: 10, backgroundColor: '#111' }}>
            <Text style={{ color: '#FFD700', fontSize: 18 }}>
              {locationType === 'HYD' ? 'Search Hyderabad Location' : 'Search Dubai Location'}
            </Text>
          </View>
          <GooglePlacesAutocomplete
            placeholder="Search"
            onPress={(data) => {
              if (locationType === 'HYD') setHydLocation(data.description);
              else setDubaiLocation(data.description);
              setShowLocationModal(false);
            }}
            query={{
              key: config.GOOGLE_API_KEY,
              language: 'en',
              components: locationType === 'HYD' ? 'country:in' : 'country:ae',
            }}
            styles={{
              container: { flex: 1, paddingTop: 10 },
              textInput: {
                backgroundColor: '#000',
                color: '#fff',
                borderColor: '#FFD700',
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
                margin: 10,
              },
              listView: {
                backgroundColor: '#000',
              },
              row: {
                backgroundColor: '#000',
                padding: 10,
                borderBottomColor: '#FFD700',
                borderBottomWidth: 0.5,
              },
              description: {
                color: '#fff',
              },
            }}
            fetchDetails
            enablePoweredByContainer={false}
            debounce={300}
          />
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
};

export default PassengerRegistrationScreen;

const styles = StyleSheet.create({
  container: {
    padding: 15,
    backgroundColor: '#000',
    flexGrow: 1,
  },
  heading: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 1,
    textAlign: 'left',
  },
  label: {
    color: '#FFD700',
    marginBottom: 5,
    marginTop: 10,
  },
  input: {
    borderColor: '#FFD700',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    color: '#fff',
    backgroundColor: '#000',
  },
  locationButton: {
    borderColor: '#FFD700',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  datePicker: {
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
  },
  dateText: {
    color: '#fff',
  },
  uploadButton: {
    borderColor: '#FFD700',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  uploadText: {
    color: '#fff',
  },
  submitButton: {
    backgroundColor: '#FFD700',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    marginBottom: 20,
  },
  submitText: {
    color: '#000',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
