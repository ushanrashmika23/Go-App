// App.js
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { SafeAreaView } from "react-native-safe-area-context";
import React, { useEffect } from 'react';
import { colors } from './src/global/styles';
import RootNavigation from './src/navigation/RootNavigation';
import Home from './src/Screens/HomeScreen';
// import PaymentScreen from './src/Components/BookSeats/PaymentScreen';
// import {StripeProvider} from '@stripe/stripe-react-native';


// import HomeSearch from './src/Components/HomeSearch/HomeSearch';
// import DestinationSearch from './src/DestinationSearch/DestinationSearch';

export default function App() {

  return (
    <SafeAreaView style={styles.container}>
      <RootNavigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
