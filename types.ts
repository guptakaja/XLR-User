
export type RootParamList = {
    Home: undefined;
    Login: undefined;
    Signup: undefined;
    EnterMobileNumber: undefined;
    EnterOtp: { mobileNumber: string; orderId: string };
    ResetPassword: { mobileNumber: string;  }; 
    SendParcelScreen: undefined;
    ParcelSummaryScreen: {
    weight: string;
    productDescription: string;
    receiverName: string;
    receiverAddress: string;
    receiverNumber: string;
    receiverLocation: string;
  };
  ParcelTrackingScreen:undefined;
  DeliveryPartnerScreen:undefined;
  ProfileScreen:undefined;
  PickupLocationScreen:undefined;
  SenderDetailsScreen:{location:any}
  SelectPickupOnMapScreen:undefined;
  SelectDropOnMapScreen:undefined;
  DropLocationScreen:{ name: string; address: any; phone: string };
  ReceiverDetailsScreen:{ location:any; name: string; address: any; phone: string };
  VehicleSelectionScreen: {
    location: any;
    receiver_name: string;
    receiver_address: string;
    receiver_phone: string;
    name: any;
    phone: string;
    address: any;
  };
  BookingSummaryScreen: {
    location: any;
    receiver_name: string;
    receiver_address: string;
    receiver_phone: string;
    name: any;
    phone: string;
    address: any; vehicleId:any; totalPrice: any; vehicleName:any; vehicleImage:any;
  }
  SearchingForDriverScreen: {
    bookingId: string; // Ensure these types are correct
    address: string;
    location: string;
    totalPrice: number;
    vehicleName: string;
    sender_name:string,
    sender_phone: string,
    receiver_name: string,
    receiver_phone: string,
    otp:any,
  };
  RideConfirmedScreen:{status:any, location:any, address:any, otp:any, totalPrice:any}
  RideStartScreen:{status:any, location:any, totalPrice:any, }
  PaymentScreen:{status:any,totalPrice:any, }
  };
  