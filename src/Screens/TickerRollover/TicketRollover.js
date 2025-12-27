import React, { useState, useEffect } from 'react';
import {
  View,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Text,
  SafeAreaView,
  TextInput,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Icon } from 'react-native-elements';
import { db } from '../../../firebase';
import { doc, getDoc, updateDoc, query, where, collection, getDocs, Timestamp } from 'firebase/firestore';
import Header from '../../Components/Header';

export default function TicketRollover({ route }) {
  const { bookingId } = route.params || {};
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedSeat, setSelectedSeat] = useState('');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  useEffect(() => {
    loadBooking();
  }, [bookingId]);

  const loadBooking = async () => {
    if (!bookingId) return;
    try {
      const bookingRef = doc(db, 'reservations', bookingId);
      const snap = await getDoc(bookingRef);
      if (snap.exists()) {
        const data = snap.data();
        setBookingDetails(data);
        if (data.travelDate) {
          // Handle both string format and Timestamp
          if (typeof data.travelDate === 'string') {
            const [year, month, day] = data.travelDate.split('-').map(Number);
            setSelectedDate(new Date(year, month - 1, day));
          } else if (data.travelDate.toDate) {
            // Firestore Timestamp
            setSelectedDate(data.travelDate.toDate());
          }
        }
        if (data.seatId) {
          setSelectedSeat(String(data.seatId));
        }
      }
    } catch (error) {
      console.error('Error loading booking:', error);
      Alert.alert('Error', 'Failed to load booking');
    }
  };

  const handleChangeBooking = async () => {
    if (!bookingId) {
      Alert.alert('Error', 'Missing booking id');
      return;
    }

    if (!selectedSeat.trim()) {
      Alert.alert('Error', 'Please enter a seat number');
      return;
    }

    const seatNum = parseInt(selectedSeat, 10);
    if (isNaN(seatNum) || seatNum < 1 || seatNum > 32) {
      Alert.alert('Error', 'Seat number must be between 1 and 32');
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const picked = new Date(selectedDate);
    picked.setHours(0, 0, 0, 0);
    if (picked < today) {
      Alert.alert('Error', 'Cannot set a past date');
      return;
    }

    try {
      setIsLoading(true);

      // Create start of day (00:00:00) and end of day (23:59:59) timestamps
      const startOfDay = new Date(selectedDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(selectedDate);
      endOfDay.setHours(23, 59, 59, 999);

      const startTimestamp = Timestamp.fromDate(startOfDay);
      const endTimestamp = Timestamp.fromDate(endOfDay);

      // First, check if user already has another booking on the same day (excluding current booking)
      if (bookingDetails && bookingDetails.email) {
        const userBookingsRef = collection(db, 'reservations');
        const userQ = query(
          userBookingsRef,
          where('email', '==', bookingDetails.email),
          where('travelDate', '>=', startTimestamp),
          where('travelDate', '<=', endTimestamp)
        );
        const userQuerySnapshot = await getDocs(userQ);

        // Filter out the current booking
        const otherBookings = userQuerySnapshot.docs.filter(doc => doc.id !== bookingId);

        if (otherBookings.length > 0) {
          Alert.alert('Error', 'You already have a booking on this date. Please cancel the existing booking first.');
          setIsLoading(false);
          return;
        }
      }

      // Check if seat is available on the selected date
      const reservationsRef = collection(db, 'reservations');
      const q = query(
        reservationsRef,
        where('seatId', '==', seatNum),
        where('travelDate', '>=', startTimestamp),
        where('travelDate', '<=', endTimestamp)
      );
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        // Seat is already booked on this date
        Alert.alert('Unavailable', `Seat ${seatNum} is already booked for ${selectedDate.toDateString()}`);
        setIsLoading(false);
        return;
      }

      // Seat is available, proceed with update
      const bookingRef = doc(db, 'reservations', bookingId);
      const travelTimestamp = Timestamp.fromDate(selectedDate);
      await updateDoc(bookingRef, {
        travelDate: travelTimestamp,
        seatId: seatNum,
      });
      Alert.alert('Success', 'Booking updated successfully');
    } catch (error) {
      console.error('Error updating booking:', error);
      Alert.alert('Error', 'Failed to change booking');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header title="Ticket Rollover" type="arrow-left" />


      {bookingDetails && (
        <View style={styles.detailsCard}>
          <Text style={styles.detailsTitle}>Current Booking Details</Text>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Date:</Text>
            <Text style={styles.detailValue}>
              {typeof bookingDetails.travelDate === 'string'
                ? bookingDetails.travelDate
                : bookingDetails.travelDate?.toDate?.()?.toDateString() || 'N/A'}
            </Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Current Seat:</Text>
            <Text style={styles.detailValue}>{bookingDetails.seatId || 'N/A'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Journey Type:</Text>
            <Text style={styles.detailValue}>{bookingDetails.journeyType || 'N/A'}</Text>
          </View>
        </View>
      )}

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setDatePickerVisibility(true)}
        disabled={isLoading}
      >
        <Text style={styles.dateButtonText}>
          Select Date: {selectedDate.toDateString()}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={(date) => {
          setSelectedDate(date);
          setDatePickerVisibility(false);
        }}
        onCancel={() => setDatePickerVisibility(false)}
        date={selectedDate}
        minimumDate={new Date()}
      />
      <Text style={{ marginLeft: 10, marginTop: 10, color: '#666' }}>New Seat Number:</Text>
      <TextInput
        style={styles.seatInput}
        placeholder="Enter Seat Number (1-32)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={selectedSeat}
        onChangeText={setSelectedSeat}
        editable={!isLoading}
        maxLength={2}
      />

      <TouchableOpacity
        style={[styles.changeButton, isLoading && styles.buttonDisabled]}
        onPress={handleChangeBooking}
        disabled={isLoading}
      >
        <Text style={styles.changeButtonText}>
          {isLoading ? 'Updating...' : 'Change Booking'}
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
    elevation: 2,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#333',
  },
  dateButton: {
    margin: 10,
    padding: 12,
    backgroundColor: '#2948FF',
    borderRadius: 8,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
  detailsCard: {
    marginHorizontal: 10,
    marginTop: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 8,
    elevation: 1,
  },
  detailsTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2948FF',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 6,
    paddingBottom: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
  },
  detailValue: {
    fontSize: 13,
    color: '#333',
    fontWeight: '500',
  },
  seatInput: {
    marginHorizontal: 10,
    marginTop: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    fontSize: 16,
    color: '#333',
  },
  changeButton: {
    backgroundColor: '#2948FF',
    borderRadius: 8,
    padding: 14,
    marginHorizontal: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  changeButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonDisabled: {
    backgroundColor: '#9bb3ff',
  },
});

