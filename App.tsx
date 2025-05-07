import React from 'react';
import { RootParamList } from './types';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './Components/HomeScreen';
import SignUpScreen from './LoginScreens/SignUpScreen';
import LoginScreen from './LoginScreens/LoginScreen';
import EnterMobileNumberScreen from './ForgotPasswordScreens/EnterMobileNumberScreen';
import EnterOtpScreen from './ForgotPasswordScreens/EnterOtpScreen';
import ResetPasswordScreen from './ForgotPasswordScreens/ResetPasswordScreen';
import SendParcelScreen from './Components/SendParcelScreen';
import ParcelSummaryScreen from './Components/ParcelSummaryScreen';
import ParcelTrackingScreen from './Components/ParcelTrackingScreen';
import ProfileScreen from './Components/ProfileScreen';
import PickupLocationScreen from './Components/SenderDetailsScreens/PickupLocation';
import SenderDetailsScreen from './Components/SenderDetailsScreens/SenderDetailsScreen';
import SelectPickupOnMapScreen from './Components/SenderDetailsScreens/SelectPickupOnMapScreen';
import SelectDropOnMapScreen from './Components/ReceiverDetailsScreens/SelectDropOnMapScreen';
import DropLocationScreen from './Components/ReceiverDetailsScreens/DropLocationScreen';
import ReceiverDetailsScreen from './Components/ReceiverDetailsScreens/ReceiverDetailsScreen';
import VehicleSelectionScreen from './Components/BookingScreens/VehicleSelectionScreen';
import BookingSummaryScreen from './Components/BookingScreens/BookingSummaryScreen';
import RideConfirmedScreen from './Components/BookingScreens/RideConfirmedScreen';
import RideStartScreen from './Components/BookingScreens/RideStartScreen';
import PaymentScreen from './Components/BookingScreens/PaymentScreen';
import SearchingForDriverScreen from './Components/BookingScreens/SearchingForDriverScreen ';
import PassengerRegistrationScreen from './FlyToDubaiScreens/PassengerRegistrationScreen';
import LuggageCapacityScreen from './FlyToDubaiScreens/LuggageCapacityScreen';
import PassengerListScreen from './FlyToDubaiScreens/PassengerListScreen';
import { StatusBar } from 'react-native';

const Stack = createNativeStackNavigator<RootParamList>();

export default function App() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Group>
            <Stack.Screen
              name="Signup"
              component={SignUpScreen}
              options={{ headerShown: false, animation: 'slide_from_right', }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false, animation: 'slide_from_right', }}
            />
            <Stack.Screen
              name="EnterMobileNumber"
              component={EnterMobileNumberScreen}
              options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen
              name="EnterOtp"
              component={EnterOtpScreen}
              options={{ headerShown: false, animation: 'slide_from_right', }} />
            <Stack.Screen
              name="ResetPassword"
              component={ResetPasswordScreen}
              options={{ headerShown: false, animation: 'slide_from_right', }} />

            <Stack.Screen
              name="SendParcelScreen"
              component={SendParcelScreen}
              options={{ headerShown: false, animation: 'slide_from_right' }}
            />

            <Stack.Screen
              name="ParcelSummaryScreen"
              component={ParcelSummaryScreen}
              options={{ headerShown: false, animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="ParcelTrackingScreen"
              component={ParcelTrackingScreen}
              options={{ headerShown: false, animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="ProfileScreen"
              component={ProfileScreen}
              options={{
                headerShown: true,
                animation: 'slide_from_right',
                headerStyle: {
                  backgroundColor: '#000', // Black background
                },
                headerTintColor: '#FFD700', // Gold back arrow color
                headerTitleStyle: {
                  color: '#FFD700', // Gold title text
                },
              }}
            />
            <Stack.Screen
              name="PickupLocationScreen"
              component={PickupLocationScreen}
              options={{ headerShown: true, animation: 'slide_from_right', headerStyle: { backgroundColor: '#000', }, headerTitleStyle: { color: '#FFD700' }, headerTintColor: '#FFD700', }}
            />
            <Stack.Screen
              name="SenderDetailsScreen"
              component={SenderDetailsScreen}
              options={{ headerShown: true, animation: 'slide_from_right', headerStyle: { backgroundColor: '#000', }, headerTitleStyle: { color: '#FFD700' }, headerTintColor: '#FFD700', }}
            />
            <Stack.Screen
              name="SelectPickupOnMapScreen"
              component={SelectPickupOnMapScreen}
              options={{ headerShown: true, animation: 'slide_from_right', headerStyle: { backgroundColor: '#000', }, headerTitleStyle: { color: '#FFD700' }, headerTintColor: '#FFD700', }}
            />
            <Stack.Screen
              name="SelectDropOnMapScreen"
              component={SelectDropOnMapScreen}
              options={{ headerShown: true, animation: 'slide_from_right', headerStyle: { backgroundColor: '#000', }, headerTitleStyle: { color: '#FFD700' }, headerTintColor: '#FFD700', }}
            />
            <Stack.Screen
              name="DropLocationScreen"
              component={DropLocationScreen}
              options={{ headerShown: true, animation: 'slide_from_right', headerStyle: { backgroundColor: '#000', }, headerTitleStyle: { color: '#FFD700' }, headerTintColor: '#FFD700', }}
            />
            <Stack.Screen
              name="ReceiverDetailsScreen"
              component={ReceiverDetailsScreen}
              options={{ headerShown: true, animation: 'slide_from_right', headerStyle: { backgroundColor: '#000', }, headerTitleStyle: { color: '#FFD700' }, headerTintColor: '#FFD700', }}
            />
            <Stack.Screen
              name="VehicleSelectionScreen"
              component={VehicleSelectionScreen}
              options={{ headerShown: true, animation: 'slide_from_right', headerStyle: { backgroundColor: '#000', }, headerTitleStyle: { color: '#FFD700' }, headerTintColor: '#FFD700', }}
            />
            <Stack.Screen
              name="BookingSummaryScreen"
              component={BookingSummaryScreen}
              options={{ headerShown: true, animation: 'slide_from_right', headerStyle: { backgroundColor: '#000', }, headerTitleStyle: { color: '#FFD700' }, headerTintColor: '#FFD700', }}
            />
            <Stack.Screen
              name="RideConfirmedScreen"
              component={RideConfirmedScreen}
              options={{ headerShown: true, animation: 'slide_from_right', headerStyle: { backgroundColor: '#000', }, headerTitleStyle: { color: '#FFD700' }, headerTintColor: '#FFD700', }}
            />
            <Stack.Screen
              name="RideStartScreen"
              component={RideStartScreen}
              options={{ headerShown: true, animation: 'slide_from_right', headerStyle: { backgroundColor: '#000', }, headerTitleStyle: { color: '#FFD700' }, headerTintColor: '#FFD700', }}
            />
            <Stack.Screen
              name="PaymentScreen"
              component={PaymentScreen}
              options={{ headerShown: true, animation: 'slide_from_right', headerStyle: { backgroundColor: '#000', }, headerTitleStyle: { color: '#FFD700' }, headerTintColor: '#FFD700', }}
            />
            <Stack.Screen
              name="SearchingForDriverScreen"
              component={SearchingForDriverScreen}
              options={{ headerShown: false, animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="PassengerRegistrationScreen"
              component={PassengerRegistrationScreen}
              options={{ headerShown: false, animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="LuggageCapacityScreen"
              component={LuggageCapacityScreen}
              options={{ headerShown: false, animation: 'slide_from_right' }}
            />
            <Stack.Screen
              name="PassengerListScreen"
              component={PassengerListScreen}
              options={{
                headerShown: true,
                animation: 'slide_from_right',
                headerStyle: {
                  backgroundColor: '#000', // Black background
                },
                headerTintColor: '#FFD700', // Gold back arrow color
                headerTitleStyle: {
                  color: '#FFD700', // Gold title text
                },
              }}
            />






          </Stack.Group>


        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
