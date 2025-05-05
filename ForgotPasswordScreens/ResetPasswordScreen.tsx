import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Dimensions, Alert } from 'react-native';
import { resetPassword } from '../Api-requests/LoginApi';
import { RootParamList } from '../types';

const { width } = Dimensions.get('window');

const ResetPasswordScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootParamList>>();
  const route = useRoute<RouteProp<RootParamList, 'ResetPassword'>>();
  const { mobileNumber } = route.params;
  
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleResetPassword = async () => {
    if (!password || !confirmPassword) {
      Alert.alert('Error', 'Please enter both password fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      const response = await resetPassword({ 
        phone: mobileNumber, 
        newPassword: password 
      });

      if (response) {
        Alert.alert('Success', 'Password reset successfully!', [
          { 
            text: 'OK', 
            onPress: () => navigation.replace('Login')
          }
        ]);
      } else {
        Alert.alert('Error', response.message || 'Failed to reset password');
      }
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContainer}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>For {mobileNumber}</Text>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="New Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text style={styles.toggleText}>
            {showPassword ? 'HIDE' : 'SHOW'}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="#aaa"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity 
          style={styles.toggleButton}
          onPress={() => setShowConfirmPassword(!showConfirmPassword)}
        >
          <Text style={styles.toggleText}>
            {showConfirmPassword ? 'HIDE' : 'SHOW'}
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.verifyButton} 
        onPress={handleResetPassword}
        disabled={isLoading}
      >
        <Text style={styles.verifyText}>
          {isLoading ? 'PROCESSING...' : 'CONFIRM'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ResetPasswordScreen;

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
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FFD700',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: width * 0.04,
    paddingVertical: 12,
  },
  toggleButton: {
    padding: 8,
  },
  toggleText: {
    color: '#FFD700',
    fontSize: width * 0.035,
    fontWeight: 'bold',
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
});