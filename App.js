// App.js
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  PermissionsAndroid,
  Platform,
} from 'react-native';
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
    <View style={styles.container}>
      <RootNavigation />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
