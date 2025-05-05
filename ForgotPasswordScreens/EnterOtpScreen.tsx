import { useNavigation, useRoute, RouteProp, NavigationProp } from '@react-navigation/native';
import React, { useState, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { verifyOtp, sendOtp } from '../Api-requests/LoginApi'; 
import { RootParamList } from '../types';

const { width } = Dimensions.get('window');

const EnterOtpScreen = () => {
  const route = useRoute<RouteProp<RootParamList, 'EnterOtp'>>();
const navigation = useNavigation<NavigationProp<RootParamList>>();
const { mobileNumber, orderId } = route.params;

  const [otp, setOtp] = useState(['', '', '', '']);
  const inputRefs = useRef<TextInput[]>([]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // If user pastes a value, take only the first character
      value = value.charAt(0);
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next field if there's a value and it's not the last field
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyPress = (index: number, key: string) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous field on backspace when current field is empty
      inputRefs.current[index - 1].focus();
      // Also clear the previous field
      const newOtp = [...otp];
      newOtp[index - 1] = '';
      setOtp(newOtp);
    }
  };

  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 4) {
      Alert.alert('Error', 'Please enter a valid 4-digit OTP.');
      return;
    }
  
    try {
      const response = await verifyOtp({ phone: mobileNumber, otp: enteredOtp, orderId });
  
      if (response) {
        Alert.alert('Success', 'OTP Verified!', [
          {
            text: 'OK',
            onPress: () => {
              navigation.navigate('ResetPassword', { mobileNumber }); // Removed 'as never'
            },
          },
        ]);
      } else {
        Alert.alert('Error', 'Invalid OTP. Please try again.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to verify OTP.');
    }
  };
  

  const handleResendOtp = async () => {
    try {
      const response = await sendOtp({ phone: mobileNumber });

      if (response.orderId) {
        Alert.alert('Success', 'OTP resent successfully.');
        // Optionally update orderId
      } else {
        Alert.alert('Error', 'Failed to resend OTP.');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to resend OTP.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Enter OTP</Text>
        <Text style={styles.subtitle}>OTP sent to {mobileNumber}</Text>
      </View>

      <View style={styles.otpInputsContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => ref && (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={(value) => handleChange(index, value)}
            onKeyPress={({ nativeEvent }) => handleKeyPress(index, nativeEvent.key)}
            keyboardType="number-pad"
            maxLength={1}
            blurOnSubmit={false}
          />
        ))}
      </View>

      <TouchableOpacity style={styles.verifyButton} onPress={handleVerifyOtp}>
        <Text style={styles.verifyText}>VERIFY OTP</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.resendButton} onPress={handleResendOtp}>
        <Text style={styles.resendText}>Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EnterOtpScreen;

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
  otpInputsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginVertical: '6%',
  },
  otpInput: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: width * 0.14,
    height: width * 0.16,
    textAlign: 'center',
    fontSize: width * 0.06,
    color: '#000',
  },
  verifyButton: {
    backgroundColor: '#D4A437',
    borderRadius: 30,
    paddingVertical: '4%',
    alignItems: 'center',
    width: '100%',
    marginTop: '10%',
  },
  verifyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  resendButton: {
    marginTop: '6%',
  },
  resendText: {
    color: '#FFD700',
    fontSize: width * 0.04,
    fontWeight: 'bold',
  },
});