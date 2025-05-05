import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, Dimensions
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

const { width, height } = Dimensions.get('window');

// 1. Define ParamList
type RootStackParamList = {
  SendParcelScreen: undefined;
  ReceiverDetailsScreen: { weight: string; productDescription: string };
};

// 2. Define Navigation type
type SendParcelScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'SendParcelScreen'>;

const SendParcelScreen = () => {
  const navigation = useNavigation<SendParcelScreenNavigationProp>();
  const [weight, setWeight] = useState<string>('1');
  const [productDescription, setProductDescription] = useState<string>('');

  const handleNext = () => {
    if (!productDescription) {
      alert('Please describe your product.');
      return;
    }
    navigation.navigate('PickupLocationScreen'as never);
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
        <Text style={styles.title}>
          Send a Parcel to Dubai
        </Text>

        {/* Weight Picker */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Select Weight (Kg)</Text>
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={weight}
              onValueChange={(itemValue) => setWeight(itemValue)}
              style={styles.picker}
              dropdownIconColor="#000"
            >
              {Array.from({ length: 30 }, (_, i) => (
                <Picker.Item key={i} label={`${i + 1} Kg`} value={`${i + 1}`} />
              ))}
            </Picker>
          </View>
        </View>

        {/* Product Description */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Product Description</Text>
          <TextInput
          style={[styles.input, styles.descriptionInput]}
          placeholder="Describe the product you want to send..."
          placeholderTextColor="#ccc"
          value={productDescription}
          onChangeText={setProductDescription}
          multiline={true}
          numberOfLines={4}
          textAlignVertical="top"
          />
        </View>

        {/* Next Button */}
        <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
          <Text style={styles.nextText}>NEXT</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default SendParcelScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingHorizontal: '6%',
    paddingBottom: '5%',
    flexGrow: 1,
  },
  title: {
    color: '#FFD700',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: '8%',
    paddingBottom: '2%',
    textAlign: 'left',
    borderBottomWidth:1,
    borderBottomColor:'#FFD700',
  },
  inputContainer: {
    width: '100%',
    marginBottom: '6%',
  },
  descriptionInput: {
    minHeight: 120,
  },
  label: {
    color: '#FFD700',
    fontSize: width * 0.04,
    marginBottom: '2%',
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingVertical: '3%',
    paddingHorizontal: '4%',
    fontSize: width * 0.04,
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    height: 60,
    color: '#000',
  },
  nextButton: {
    backgroundColor: '#D4A437',
    borderRadius: 25,
    paddingVertical: '4%',
    alignItems: 'center',
    marginTop: '8%',
  },
  nextText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
});
