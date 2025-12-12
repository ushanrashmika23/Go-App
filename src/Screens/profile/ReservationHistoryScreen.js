import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, parameters } from './../../global/styles';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import { db } from '../../../firebase';
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore';

const ReservationHistoryScreen = ({ route }) => {
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const navigation = useNavigation();
  const { userEmail } = route.params;

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoadingBookings(true);
    try {
      const q = query(
        collection(db, 'reservations'),
        where('email', '==', userEmail),
      );
      const querySnapshot = await getDocs(q);
      const bookingsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBookings(bookingsData);
    } catch (error) {
      console.log('Error fetching bookings:', error);
      Alert.alert('Error', 'Failed to fetch bookings');
    } finally {
      setLoadingBookings(false);
    }
  };

  const handleCancelBooking = async bookingId => {
    try {
      await deleteDoc(doc(db, 'reservations', bookingId));
      Alert.alert('Success', 'Booking cancelled successfully');
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      console.error('Error cancelling booking:', error);
      Alert.alert('Error', 'Failed to cancel booking');
    }
  };

  const isPastJourney = (travelDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const journeyDate = travelDate.toDate();
    journeyDate.setHours(0, 0, 0, 0);
    return journeyDate < today;
  };

  const canCancelBooking = (travelDate, journeyType, checked) => {
    const now = new Date();
    const currentHour = now.getHours();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const journeyDate = travelDate.toDate();
    journeyDate.setHours(0, 0, 0, 0);

    // Check if booking is already checked in
    if (checked === true) {
      return false;
    }

    // Check if it's a past journey
    if (journeyDate < today) {
      return false;
    }

    // Check if it's same day toCompany journey after 11am
    if (journeyDate.getTime() === today.getTime() &&
      journeyType === 'toCompany' &&
      currentHour >= 11) {
      return false;
    }

    return true;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" type="feather" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reservation History</Text>
      </View>

      {loadingBookings ? (
        <ActivityIndicator size="large" color="#2948FF" style={styles.loader} />
      ) : (
        <View style={styles.bookingsContainer}>
          {bookings.length > 0 ? (
            bookings.map(booking => {
              const isPast = isPastJourney(booking.travelDate);
              const canCancel = canCancelBooking(booking.travelDate, booking.journeyType, booking.checked);
              const now = new Date();
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const journeyDate = booking.travelDate.toDate();
              journeyDate.setHours(0, 0, 0, 0);
              const isSameDayToCompanyAfter11 = journeyDate.getTime() === today.getTime() &&
                booking.journeyType === 'toCompany' &&
                now.getHours() >= 11;

              return (
                <View key={booking.id} style={styles.bookingItem}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <View>
                      <Text style={styles.bookingText}>
                        Date: {booking.travelDate.toDate().toLocaleDateString()}
                      </Text>
                      <Text style={styles.bookingText}>
                        Type: {booking.journeyType}
                      </Text>
                      <Text style={styles.bookingText}>
                        Destination: {booking.destination}
                      </Text>
                      <Text style={styles.bookingText}>Seat: {booking.seatId}</Text>
                    </View>
                    {booking.checked === true && (
                      <View>
                        <Icon
                          type="material-community"
                          name={'check-circle-outline'}
                          color={'green'}
                          size={32}
                        />
                      </View>
                    )}
                  </View>
                  {isPast && (
                    <Text style={styles.pastJourneyText}>Past Journey</Text>
                  )}
                  {booking.checked === true && !isPast && (
                    <Text style={styles.pastJourneyText}>Already checked in</Text>
                  )}
                  {isSameDayToCompanyAfter11 && !isPast && booking.checked !== true && (
                    <Text style={styles.pastJourneyText}>Cancellation closed</Text>
                  )}
                  <TouchableOpacity
                    style={[
                      styles.cancelButton,
                      !canCancel && styles.disabledButton,
                    ]}
                    onPress={() => canCancel && handleCancelBooking(booking.id)}
                    disabled={!canCancel}>
                    <Text style={styles.cancelButtonText}>Cancel Booking</Text>
                  </TouchableOpacity>
                </View>
              );
            })
          ) : (
            <Text style={styles.noBookingsText}>No reservations found.</Text>
          )}
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 20,
  },
  loader: {
    marginTop: 50,
  },
  bookingsContainer: {
    padding: 20,
  },
  bookingItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  bookingText: {
    fontSize: 14,
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: '#ff4d4dff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  disabledButton: {
    backgroundColor: '#ccc',
    opacity: 0.6,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  pastJourneyText: {
    fontSize: 12,
    color: '#888',
    fontStyle: 'italic',
    marginTop: 5,
  },
  noBookingsText: {
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ReservationHistoryScreen;
