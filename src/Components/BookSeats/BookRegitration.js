import React, { useState, useEffect } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  Alert,
  ScrollView,
  TouchableOpacity,
  Switch,
  Modal,
  FlatList,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../../firebase';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Icon } from 'react-native-elements';

export default function BookRegistration() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [destination, setDestination] = useState('');
  const [journeyType, setJourneyType] = useState('');
  const [travelDate, setTravelDate] = useState(new Date());
  const [reserveTuesday, setReserveTuesday] = useState(false);
  const [upcomingTuesday, setUpcomingTuesday] = useState(null);
  const [interchanges, setInterchanges] = useState([]);
  const [showDestinationModal, setShowDestinationModal] = useState(false);

  const route = useRoute();
  const navigation = useNavigation();
  const { seatNumber, seatId, date } = route.params;

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        if (savedEmail) {
          setEmail(savedEmail);
          const userDocRef = doc(db, 'userdata', savedEmail);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setFullName(userData.fullName);
            setPhoneNumber(userData.phoneNumber);
          } else {
            console.log('No user data found in Firebase');
          }
        }
      } catch (error) {
        console.log('Error fetching user data:', error);
      }
    };

    fetchUserData();
    fetchInterchangeData();
  }, []);

  useEffect(() => {
    // Set journey type based on current time
    const currentHour = new Date().getHours();
    if (currentHour < 11) {
      setJourneyType('toCompany');
    } else {
      setJourneyType('fromCompany');
    }
  }, []);

  const fetchInterchangeData = async () => {
    try {
      const ticketPricesCollection = collection(db, 'ticketPrices');
      const querySnapshot = await getDocs(ticketPricesCollection);
      const interchangeData = querySnapshot.docs.map(
        doc => doc.data().exitName,
      );
      setInterchanges(interchangeData);
    } catch (error) {
      console.log('Error fetching interchange data:', error);
      Alert.alert(
        'Error',
        'Failed to fetch destination options. Please try again.',
      );
    }
  };

  async function submitBooking() {
    if (!fullName || !email || !phoneNumber || !destination) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      // Book for the selected date
      await setDoc(
        doc(
          db,
          'reservations',
          `${email}_${seatId}_${date.toISOString().split('T')[0]}`,
        ),
        {
          fullName,
          email,
          phoneNumber,
          journeyType,
          destination,
          travelDate: date,
          seatId,
          seat_state: true,
        },
      );



      Alert.alert('Success', 'Your seat(s) have been booked successfully');
      navigation.navigate('BookSeats', { refreshSeats: true });
    } catch (error) {
      console.log('Error submitting data:', error);
      Alert.alert('Error', 'Failed to book the seat. Please try again.');
    }
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Book Your Seat</Text>
      <Text style={styles.seatInfo}>Seat Number: {seatNumber}</Text>
      <Text style={styles.seatInfo}>{date.toISOString().split('T')[0]}</Text>
      <Text style={styles.seatInfo}>{journeyType === 'toCompany' ? 'To Company' : journeyType === 'fromCompany' ? 'From Company' : ''}</Text>

      <TextInput
        value={fullName}
        placeholder="Full Name"
        style={styles.input}
        editable={false}
      />

      <TextInput
        value={email}
        placeholder="Email"
        style={styles.input}
        keyboardType="email-address"
        editable={false}
      />

      <TextInput
        value={phoneNumber}
        placeholder="Phone Number"
        style={styles.input}
        keyboardType="phone-pad"
        editable={false}
      />

      <TouchableOpacity
        style={styles.pickerButton}
        onPress={() => setShowDestinationModal(true)}
      >
        <Text style={[styles.pickerButtonText, !destination && styles.placeholderText]}>
          {destination || 'Select a destination'}
        </Text>
        <Icon name="chevron-down" type="material" size={24} color="#666" />
      </TouchableOpacity>

      {/* Destination Modal */}
      <Modal
        visible={showDestinationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowDestinationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Destination</Text>
              <TouchableOpacity onPress={() => setShowDestinationModal(false)}>
                <Icon name="close" type="material" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={interchanges}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.modalItem}
                  onPress={() => {
                    setDestination(item);
                    setShowDestinationModal(false);
                  }}
                >
                  <Text style={styles.modalItemText}>{item}</Text>
                  {destination === item && (
                    <Icon name="check" type="material" size={20} color="#2948FF" />
                  )}
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>


      <TouchableOpacity style={styles.submitButton} onPress={submitBooking}>
        <Text style={styles.submitButtonText}>Book Seat</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  info: {
    fontSize: 16,
    marginBottom: 15,
    color: '#666',
  },
  pickerButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 15,
    marginBottom: 15,
  },
  pickerButtonText: {
    fontSize: 16,
    color: '#333',
  },
  placeholderText: {
    color: '#999',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '70%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  modalItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalItemText: {
    fontSize: 16,
    color: '#333',
  },
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  seatInfo: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: 'center',
    color: '#666',
  },
  input: {
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 15,
    paddingLeft: 15,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  dateInfo: {
    fontSize: 14,
    color: '#666',
    marginTop: -10,
    marginBottom: 15,
    textAlign: 'center',
  },
  submitButton: {
    backgroundColor: '#2948FF',
    padding: 15,
    borderRadius: 8,
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#e6f7ff', // Light blue background
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#91d5ff', // Slightly darker blue border
  },
  highlightedText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0050b3', // Dark blue text
    flex: 1, // Take up available space
    marginRight: 10, // Add some space between text and switch
  },
  upcomingTuesdayInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    textAlign: 'center',
    fontStyle: 'italic',
  },

});
