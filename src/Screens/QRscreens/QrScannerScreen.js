import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import { CameraView, Camera } from 'expo-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LottieView from 'lottie-react-native';
import { db } from '../../../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
  limit,
  updateDoc,
  doc
} from "firebase/firestore";

const QRScanner = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);
  const expectedBusId = 'YcqA0RNxsa';

  useEffect(() => {
    const getCameraPermissions = async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getCameraPermissions();
  }, []);

  const processQRCode = async data => {
    setScanned(true);

    console.log('Scanned data:', data);

    // const scannedBusId = data.split(':')[1];
    const scannedBusId = data;

    if (scannedBusId !== expectedBusId) {
      Alert.alert(
        'Invalid Bus',
        'The scanned QR code does not match the expected bus.',
      );
      setScanned(false);
      return;
    }

    const userEmail = await AsyncStorage.getItem('userEmail');

    // Determine journey type based on current time
    const currentHour = new Date().getHours();
    const journeyType = currentHour < 11 ? 'toCompany' : 'fromCompany';

    // Get the start and end of the current day
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const startOfDay = Timestamp.fromDate(currentDate);
    const endOfDay = Timestamp.fromDate(
      new Date(currentDate.getTime() + 24 * 60 * 60 * 1000),
    );

    try {
      const bookingQuery = query(
        collection(db, 'reservations'),
        where('email', '==', userEmail),
        where('travelDate', '>=', startOfDay),
        where('travelDate', '<', endOfDay),
        where('journeyType', '==', journeyType),
        // where('checked', '==', false),
        limit(1)
      );

      const bookingSnapshot = await getDocs(bookingQuery);

      if (!bookingSnapshot.empty) {
        const bookingDoc = bookingSnapshot.docs[0];
        await updateDoc(doc(db, 'reservations', bookingDoc.id), {
          checked: true
        });
        setBookingDetails(bookingDoc.data());
      } else {
        // Alert.alert(
        //   'No Booking Found',
        //   `You don't have a booking for this bus today (${journeyType === 'toCompany' ? 'To Company' : 'From Company'}).`,
        // );
      }
    } catch (error) {
      console.error('Error updating booking: ', error);
      Alert.alert('Error', 'Failed to process the QR code. Please try again.');
    } finally {
      setTimeout(() => setScanned(false), 5000);
    }
  };

  const handleBarCodeScanned = ({ type, data }) => {
    if (!scanned) {
      processQRCode(data);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.centerText}>Requesting camera permission...</Text>
      </View>
    );
  }
  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text style={styles.centerText}>No access to camera</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.topText}>Scan the QR code to check in.</Text>
      <CameraView
        style={styles.camera}
        barcodeScannerSettings={{
          barcodeTypes: ['qr'],
        }}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      />
      <View style={styles.bottomContent}>
        {scanned ? (
          bookingDetails ? (
            <View style={styles.bookingInfo}>
              <LottieView
                source={require('../../../assets/check-animation.json')}
                autoPlay
                loop={false}
                style={styles.checkAnimation}
              />
              <Text style={styles.bookingText}>Booking Confirmed!</Text>
              <Text>Destination: {bookingDetails.destination}</Text>
              <Text>Seat: {bookingDetails.seatId}</Text>
              <Text>Journey Type: {bookingDetails.journeyType}</Text>
            </View>
          ) : (
            <Text style={styles.centerText}>Processing...</Text>
          )
        ) : (
          <Text style={styles.centerText}>Ready to scan</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  topText: {
    fontSize: 18,
    padding: 20,
    color: '#777',
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: 'white',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
  bottomContent: {
    padding: 20,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  centerText: {
    fontSize: 18,
    color: '#777',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  bookingInfo: {
    alignItems: 'center',
    padding: 20,
  },
  bookingText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  checkAnimation: {
    width: 100,
    height: 100,
  },
});

export default QRScanner;
