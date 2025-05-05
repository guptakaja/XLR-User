import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, KeyboardAvoidingView, Platform, Dimensions, Alert } from 'react-native';
import { postLogin } from '../Api-requests/LoginApi';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import config from '../Api-requests/config';
const { width, height } = Dimensions.get('window');

const LoginScreen = () => {
    const navigation = useNavigation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
      const checkToken = async () => {
        try {
          const token = await AsyncStorage.getItem(config.userCookie);
          if (token) {
            const decoded: any = jwtDecode(token);
            console.log('User ID from token:', decoded.id); // Customize based on your token payload
            navigation.navigate('Home' as never);
          }
        } catch (error) {
          console.error('Error checking token:', error);
        }
      };
  
      checkToken();
    }, []);

    const handleLogin = async () => {
        if (!email || !password) {
          Alert.alert('Error', 'Please enter email and password.');
          return;
        }
      
        try {
          const loginData = { email, password };
          const response = await postLogin(loginData);
          console.log('Login success', response);
      
          if (response?.token) {
            await AsyncStorage.setItem('userToken', response.token);
          }
      
          navigation.navigate('Home' as never);
        } catch (error: any) {
          console.error('Login failed', error.message);
          Alert.alert('Login Failed', error.message || 'Something went wrong.');
        }
      };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1, backgroundColor: '#000' }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Image
          source={require('../assets/xlr-logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <View style={styles.logoDivider} />
        <View style={styles.textContainer}>
            <Text style={styles.title}>Welcome Back!</Text>
            <Text style={styles.subtitle}>Log Into Your Account</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email..."
            keyboardType="email-address"
            placeholderTextColor="#ccc"
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordInputContainer}>
            <TextInput
              style={styles.passwordInput}
              placeholder="Enter password..."
              secureTextEntry={!showPassword}
              placeholderTextColor="#ccc"
              onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity 
              style={styles.showHideButton}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Text style={styles.showHideText}>
                {showPassword ? 'HIDE' : 'SHOW'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginText}>LOGIN</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.forgotContainer} onPress={() => navigation.navigate('EnterMobileNumber' as never)}>
          <Text style={styles.forgotText}>FORGOT YOUR PASSWORD?</Text>
        </TouchableOpacity>

        <View style={styles.divider} />

        <View style={styles.footerContainer} >
          <Text style={styles.footerText}>
            Don't Have An Account? <Text style={styles.signupText} onPress={() => navigation.navigate('Signup' as never)}>SIGN UP</Text>
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: '7%',
    paddingTop: '12%',
    paddingBottom: '10%',
    flexGrow: 1,
    backgroundColor: '#000',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: height * 0.08,
    marginBottom: '10%',
    marginTop: "5%"
  },
  logoDivider: {
    width: '100%',
    height: 1,
    backgroundColor: '#fff',
    marginBottom: '8%',
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
  },
  passwordInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  passwordInput: {
    flex: 1,
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    fontSize: width * 0.04,
  },
  showHideButton: {
    paddingHorizontal: 10,
  },
  showHideText: {
    color: '#FFD700',
    fontWeight: 'bold',
    fontSize: width * 0.035,
  },
  loginButton: {
    backgroundColor: '#D4A437',
    borderRadius: 30,
    paddingVertical: '4%',
    alignItems: 'center',
    width: '100%',
    marginTop: '8%',
  },
  loginText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  forgotContainer: {
    marginTop: '5%',
  },
  forgotText: {
    color: '#FFD700',
    fontSize: width * 0.035,
    textAlign: 'center',
  },
  divider: {
    borderBottomColor: '#aaa',
    borderBottomWidth: 1,
    width: '90%',
    marginTop: '8%',
    marginBottom: '5%',
  },
  footerContainer: {
    marginTop: '5%',
  },
  footerText: {
    textAlign: 'center',
    color: '#aaa',
    fontSize: width * 0.04,
  },
  signupText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});