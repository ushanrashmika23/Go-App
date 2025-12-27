import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Text,
  Modal,
  SafeAreaView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getDocs, collection, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../../../firebase';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Header from '../Header';

const initializeSeats = (count, userRole) =>
  Array.from({ length: count }, (_, index) => ({
    seatId: index + 1,
    seatNumber: index + 1,
    empty: true,
    selected: false,
    // locked: userRole === 'lecturer' ? index >= 20 : index < 20,
    locked: false,
  }));

const BookSeats = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [seats, setSeats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState('');
  const [date, setDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  const fetchUserRole = async () => {
    try {
      const role = await AsyncStorage.getItem('userRole');
      setUserRole(role || '');
      return role;
    } catch (error) {
      console.error('Error fetching user role:', error);
      return '';
    }
  };

  const fetchSeatData = async () => {
    setIsLoading(true);
    try {
      const role = await fetchUserRole();
      const initialSeats = initializeSeats(32, role);

      // Determine journey type based on current time
      const currentHour = new Date().getHours();
      const journeyType = currentHour < 11 ? 'toCompany' : 'fromCompany';

      // Create start and end of the selected date
      const startOfSelectedDate = new Date(date);
      startOfSelectedDate.setHours(0, 0, 0, 0); // Set to the start of the day

      const endOfSelectedDate = new Date(date);
      endOfSelectedDate.setHours(23, 59, 59, 999); // Set to the end of the day

      console.log(
        'Querying for date range:',
        startOfSelectedDate,
        'to',
        endOfSelectedDate,
        'with journey type:',
        journeyType,
      );

      // Create a query to fetch reservations for the selected date range and journey type
      const reservationsQuery = query(
        collection(db, 'reservations'),
        where('travelDate', '>=', Timestamp.fromDate(startOfSelectedDate)),
        where('travelDate', '<=', Timestamp.fromDate(endOfSelectedDate)),
        where('journeyType', '==', journeyType),
      );

      const querySnapshot = await getDocs(reservationsQuery);

      console.log('Query snapshot size:', querySnapshot.size);

      const reservations = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Reservation data:', data);
        return data;
      });

      console.log('Fetched reservations:', reservations);

      // Update seats based on reservation data
      const updatedSeats = initialSeats.map(seat => {
        const reservation = reservations.find(
          res => res.seatId === seat.seatId,
        );
        if (reservation) {
          console.log(
            `Updating seat ${seat.seatId} with reservation data:`,
            reservation,
          );
        }
        return reservation ? { ...seat, empty: !reservation.seat_state } : seat;
      });

      console.log('Updated seats:', updatedSeats);
      setSeats(updatedSeats);
    } catch (error) {
      console.error('Error fetching seat data:', error);
      Alert.alert('Error', 'Failed to load seat data. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSeatData();
  }, [date, route.params?.refreshSeats]);

  const onSelectSeat = seat => {
    if (seat.locked) {
      Alert.alert(
        'Seat Unavailable',
        'This seat is not available for your role.',
      );
      return;
    }
    if (!seat.empty) {
      Alert.alert('Seat Unavailable', 'This seat is already booked.');
      return;
    }
    navigation.navigate('BookRegistration', {
      seatNumber: seat.seatNumber,
      seatId: seat.seatId,
      date: date,
    });
  };

  const renderSeat = ({ item }) => (
    <TouchableOpacity
      style={styles.seatContainer}
      onPress={() => onSelectSeat(item)}
      disabled={!item.empty || item.locked}>
      <View
        style={[
          styles.seat,
          !item.empty && styles.bookedSeat,
          item.locked && styles.lockedSeat,
        ]}>
        <Icon
          name={item.empty ? 'event-seat' : 'event-seat'}
          type="material"
          size={24}
          color={item.locked ? '#9E9E9E' : item.empty ? '#4CAF50' : '#FF5252'}
        />
        <Text style={styles.seatNumber}>{item.seatNumber}</Text>
      </View>
    </TouchableOpacity>
  );

  const SeatLegend = () => (
    <View style={styles.legend}>
      <View style={styles.legendItem}>
        <Icon name="event-seat" type="material" size={24} color="#4CAF50" />
        <Text style={styles.legendText}>Available</Text>
      </View>
      <View style={styles.legendItem}>
        <Icon name="event-seat" type="material" size={24} color="#FF5252" />
        <Text style={styles.legendText}>Booked</Text>
      </View>
      {/* <View style={styles.legendItem}>
        <Icon name="event-seat" type="material" size={24} color="#9E9E9E" />
        <Text style={styles.legendText}>Locked</Text>
      </View> */}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* <View style={styles.header}>
        <Icon name="bus" type="font-awesome" size={30} color="#3498db" />
        <Text style={styles.headerText}>Select Your Seat</Text>
      </View> */}
      <Header title="Select Your Seat" type="arrow-left" />

      <TouchableOpacity
        style={styles.dateButton}
        onPress={() => setShowDatePicker(true)}>
        <Text style={styles.dateButtonText}>
          Select Date: {date.toDateString()}
        </Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={(selectedDate) => {
          setShowDatePicker(false);
          if (selectedDate) {
            setDate(selectedDate);
          }
        }}
        onCancel={() => setShowDatePicker(false)}
        date={date}
      />

      <SeatLegend />

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <Text>Loading seats...</Text>
        </View>
      ) : (
        <View style={styles.seatGrid}>
          <FlatList
            data={seats}
            renderItem={renderSeat}
            keyExtractor={item => item.seatId.toString()}
            numColumns={5}
            columnWrapperStyle={styles.columnWrapper}
          />
        </View>
      )}

      <TouchableOpacity style={styles.refreshButton} onPress={fetchSeatData}>
        <Icon name="refresh" type="material" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

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
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
  },
  legendText: {
    marginLeft: 5,
    fontSize: 14,
    color: '#333',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  seatGrid: {
    flex: 1,
    padding: 10,
  },
  seatContainer: {
    margin: 5,
    alignItems: 'center',
  },
  seat: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40,
    height: 40,
    borderRadius: 5,
    backgroundColor: '#fff',
    elevation: 2,
  },
  bookedSeat: {
    backgroundColor: '#ffebee',
  },
  seatNumber: {
    fontSize: 12,
    color: '#333',
  },
  columnWrapper: {
    justifyContent: 'space-around',
  },
  refreshButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#2948FF',
    borderRadius: 30,
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
  },
  lockedSeat: {
    backgroundColor: '#E0E0E0',
  },
  dateButton: {
    margin: 10,
    padding: 10,
    backgroundColor: '#2948FF',
    borderRadius: 5,
    alignItems: 'center',
  },
  dateButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default BookSeats;
