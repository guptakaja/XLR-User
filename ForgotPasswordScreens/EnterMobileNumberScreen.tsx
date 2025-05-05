import { useNavigation,NavigationProp  } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions, Alert } from 'react-native';
import { sendOtp } from '../Api-requests/LoginApi';
import { RootParamList } from '../types';
const { width, height } = Dimensions.get('window');

const EnterMobileNumberScreen = () => {
  const navigation = useNavigation<NavigationProp<RootParamList>>();
  const [mobileNumber, setMobileNumber] = useState('');

  const handleSendOtp = async () => {
    if (!mobileNumber) {
      Alert.alert('Error', 'Please enter your mobile number.');
      return;
    }
  
    if (mobileNumber.length !== 10) {
      Alert.alert('Error', 'Mobile number must be exactly 10 digits.');
      return;
    }
  
    try {
      const response = await sendOtp({ phone: mobileNumber });
  
      if (response.orderId) {
        navigation.navigate('EnterOtp', { 
          mobileNumber, 
          orderId: response.orderId 
        } as never);
      } else {
        Alert.alert('Error', 'Failed to send OTP. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    }
  };  return (
    <View style={styles.container}>
    <View style={styles.textContainer}>
      <Text style={styles.title}>Enter Mobile Number</Text>
      <Text style={styles.subtitle}>We'll send you an OTP to verify</Text>
    </View>

    <View style={styles.inputContainer}>
      <Text style={styles.label}>Mobile Number</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter mobile number..."
        keyboardType="phone-pad"
        placeholderTextColor="#ccc"
        onChangeText={(text) => setMobileNumber(text)}
      />
    </View>

    <TouchableOpacity style={styles.sendOTPButton} onPress={handleSendOtp}>
      <Text style={styles.otpText}>GET OTP</Text>
    </TouchableOpacity>
  </View>
);
};

export default EnterMobileNumberScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '7%',
    paddingTop: '12%',
    paddingBottom: '10%',
    flexGrow: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  textContainer: {
    width: '100%',
    alignItems: 'flex-start',
    marginBottom: '8%',
  },
  title: {
    color: '#FFD700',
    fontSize: width * 0.07,
    fontWeight: 'bold',
    marginBottom: '1%',
  },
  subtitle: {
    color: '#aaa',
    fontSize: width * 0.04,
  },
  inputContainer: {
    width: '100%',
    marginBottom: '4%',
  },
  label: {
    color: '#FFD700',
    fontSize: width * 0.04,
    marginBottom: '2%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    fontSize: width * 0.04,
    color: '#000',
  },
  sendOTPButton: {
    backgroundColor: '#D4A437',
    borderRadius: 30,
    paddingVertical: '4%',
    alignItems: 'center',
    width: '100%',
    marginTop: '10%',
  },
  otpText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
});
