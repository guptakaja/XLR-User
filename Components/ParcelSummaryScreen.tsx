import { useNavigation, useRoute } from '@react-navigation/native';
import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

const { width } = Dimensions.get('window');

const ParcelSummaryScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {
    destination,
    weight,
    productDescription,
    receiverName,
    receiverAddress,
    receiverNumber,
    receiverLocation,
  } = route.params as {
    destination: string;
    weight: string;
    productDescription: string;
    receiverName: string;
    receiverAddress: string;
    receiverNumber: string;
    receiverLocation: string;
  };

  const handleConfirm = () => {
    // Later you can send this data to backend too
    console.log('Confirmed Parcel:', {
      destination,
      weight,
      productDescription,
      receiverName,
      receiverAddress,
      receiverNumber,
      receiverLocation,
    });

    navigation.navigate('DeliveryPartnersScreen' as never); // Navigate to the DeliveryPartnersScreen
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Parcel Summary</Text>

        <View style={styles.card}>
          <SummaryItem label="Destination" value={destination} />
          <SummaryItem label="Weight" value={`${weight} Kg`} />
          <SummaryItem label="Product" value={productDescription} />
          <SummaryItem label="Receiver Name" value={receiverName} />
          <SummaryItem label="Receiver Address" value={receiverAddress} />
          <SummaryItem label="Receiver Number" value={receiverNumber} />
          <SummaryItem label="Receiver Location" value={receiverLocation} />
        </View>

        <TouchableOpacity style={styles.confirmButton} onPress={handleConfirm}>
          <Text style={styles.confirmText}>CONFIRM & FIND PARTNER</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const SummaryItem = ({ label, value }: { label: string; value: string }) => (
  <View style={styles.item}>
    <Text style={styles.label}>{label}</Text>
    <Text style={styles.value}>{value}</Text>
  </View>
);

export default ParcelSummaryScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingHorizontal: '6%',
    paddingTop: '10%',
    paddingBottom: '10%',
    flexGrow: 1,
  },
  title: {
    color: '#FFD700',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: '8%',
    paddingBottom: '2%',
    textAlign: 'center',
    borderBottomWidth:1,
    borderBottomColor:'#FFD700',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: '5%',
    marginBottom: '8%',
  },
  item: {
    marginBottom: '5%',
  },
  label: {
    color: '#FFD700',
    fontSize: width * 0.04,
    marginBottom: 4,
  },
  value: {
    color: '#fff',
    fontSize: width * 0.045,
    fontWeight: 'bold',
  },
  confirmButton: {
    backgroundColor: '#D4A437',
    borderRadius: 25,
    paddingVertical: '4%',
    alignItems: 'center',
  },
  confirmText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
});
