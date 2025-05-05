// ParcelTrackingScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';

const { width } = Dimensions.get('window');

// ✅ Define TypeScript types for tracking data
interface TrackingEvent {
  date: string;
  location: string;
  status: string;
}

interface TrackingData {
  status: string;
  estimatedDelivery: string;
  history: TrackingEvent[];
}

const ParcelTrackingScreen = () => {
  const [trackingId, setTrackingId] = useState<string>('');
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null);

  const handleTrack = () => {
    if (!trackingId) {
      alert('Please enter a tracking ID.');
      return;
    }

    // Simulate fetching tracking data
    const mockData: TrackingData = {
      status: 'In Transit',
      estimatedDelivery: '2025-04-30',
      history: [
        { date: '2025-04-25', location: 'Hyderabad', status: 'Dispatched' },
        { date: '2025-04-26', location: 'Mumbai', status: 'In Transit' },
      ],
    };

    setTrackingData(mockData);
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
        <Text style={styles.title}>Track Your Parcel</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Tracking ID</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter tracking ID..."
            placeholderTextColor="#ccc"
            value={trackingId}
            onChangeText={setTrackingId}
          />
        </View>

        <TouchableOpacity style={styles.trackButton} onPress={handleTrack}>
          <Text style={styles.trackText}>TRACK</Text>
        </TouchableOpacity>

        {trackingData && (
          <View style={styles.resultContainer}>
            <Text style={styles.resultTitle}>Status: {trackingData.status}</Text>
            <Text style={styles.resultText}>
              Estimated Delivery: {trackingData.estimatedDelivery}
            </Text>
            <Text style={styles.resultSubtitle}>History:</Text>
            {trackingData.history.map((event, index) => (
              <Text key={index} style={styles.resultText}>
                {event.date} - {event.location}: {event.status}
              </Text>
            ))}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ParcelTrackingScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    paddingHorizontal: '6%',
    paddingTop: '20%',
    paddingBottom: '5%',
    flexGrow: 1,
  },
  title: {
    color: '#FFD700',
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: '8%',
    textAlign: 'center',
  },
  inputContainer: {
    width: '100%',
    marginBottom: '6%',
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
  trackButton: {
    backgroundColor: '#D4A437',
    borderRadius: 25,
    paddingVertical: '4%',
    alignItems: 'center',
    marginTop: '8%',
  },
  trackText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: width * 0.045,
  },
  resultContainer: {
    marginTop: '10%',
  },
  resultTitle: {
    color: '#FFD700',
    fontSize: width * 0.05,
    fontWeight: 'bold',
    marginBottom: '2%',
  },
  resultSubtitle: {
    color: '#FFD700',
    fontSize: width * 0.045,
    fontWeight: 'bold',
    marginTop: '4%',
    marginBottom: '2%',
  },
  resultText: {
    color: '#fff',
    fontSize: width * 0.04,
    marginBottom: '1%',
  },
});
