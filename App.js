// App.js
import {
  StyleSheet,
  Text,
  View,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
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
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" backgroundColor="#2948FF" translucent={false} />
      <View style={styles.container}>
        <RootNavigation />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#2948FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
