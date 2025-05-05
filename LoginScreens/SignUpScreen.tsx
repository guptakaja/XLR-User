import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
  Alert
} from 'react-native';
import { postSignup } from '../Api-requests/LoginApi';

const { width, height } = Dimensions.get('window');

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [fullname, setFullname] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 👈 Added for show/hide password

  const handleSignup = async () => {
    if (!fullname || !phone || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const signupData = { fullname, email, password, phone };
      const response = await postSignup(signupData);

      Alert.alert('Success', 'User registered successfully');
      navigation.navigate('Login' as never);
    } catch (error: any) {
      console.error('Signup error:', error.message);
      Alert.alert('Signup Failed', error.message || 'Something went wrong');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
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

        <View style={styles.inputContainer}>
          <Text style={styles.title}>
            Send a parcel to your loved ones in Less than a day OR Earn as a passenger and Fly for free
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter full name..."
            placeholderTextColor="#ccc"
            value={fullname}
            onChangeText={setFullname}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Mobile Number</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter mobile number..."
            placeholderTextColor="#ccc"
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter email..."
            keyboardType="email-address"
            placeholderTextColor="#ccc"
            value={email}
            onChangeText={setEmail}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="Enter password..."
              placeholderTextColor="#ccc"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.showHideButton} onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.showHideText}>
                {showPassword ? 'HIDE' : 'SHOW'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.signupButton} onPress={handleSignup}>
          <Text style={styles.signupText}>SIGNUP</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Already Have An Account? <Text style={styles.loginText} onPress={() => navigation.navigate('Login' as never)}>LOG IN</Text>
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingHorizontal: '6%',
    paddingTop: '10%',
    paddingBottom: '5%',
    flexGrow: 1,
  },
  logo: {
    width: '100%',
    height: height * 0.08,
    marginBottom: '10%',
    marginTop: "5%"
  },
  logoDivider: {
    height: 1,
    backgroundColor: '#f2f0e4',
    opacity: 0.5,
    marginBottom: '8%',
  },
  inputContainer: {
    width: '100%',
    marginBottom: '5%',
  },
  title: {
    color: '#FFD700',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginBottom: '4%',
    textAlign: 'left',
  },
  label: {
    color: '#FFD700',
    fontSize: width * 0.035,
    marginBottom: '2%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: '4%',
    paddingHorizontal: '4%',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: '4%',
    paddingVertical: '1%',    // unified 3% vertical padding
  },
  showHideText: {
    color: '#FFD700',
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
  showHideButton: {
    paddingHorizontal: 10,
  },
  signupButton: {
    backgroundColor: '#D4A437',
    borderRadius: 25,
    paddingVertical: '4%',
    alignItems: 'center',
    marginTop: '5%',
  },
  signupText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.04,
  },
  footerText: {
    textAlign: 'center',
    color: '#aaa',
    marginTop: '6%',
    fontSize: width * 0.035,
  },
  loginText: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
});
