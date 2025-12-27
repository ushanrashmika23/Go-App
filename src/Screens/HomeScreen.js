import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { Icon } from 'react-native-elements';
import HomeHeader from '../Components/HomeHeader';
import { colors } from '../global/styles';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen() {
  const [delivery, setDelivery] = useState(true);
  const [userEmail, setUserEmail] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    loadUserEmail();
  }, []);

  const loadUserEmail = async () => {
    try {
      const email = await AsyncStorage.getItem('userEmail');
      if (email) {
        setUserEmail(email);
      }
    } catch (error) {
      console.error('Error loading email:', error);
    }
  };

  const MenuButton = ({ title, iconName, onPress }) => (
    <TouchableOpacity style={styles.menuButton} onPress={onPress}>
      <Icon
        type="material-community"
        name={iconName}
        color={colors.primary}
        size={32}
      />
      <Text style={styles.menuButtonText}>{title}</Text>
    </TouchableOpacity>
  );

  const QRScanBanner = ({ onScanPress }) => (
    <TouchableOpacity style={styles.qrBanner} onPress={onScanPress}>
      <View style={styles.qrTextContainer}>
        <Text style={styles.qrTitle}>Are you ready for a</Text>
        <Text style={styles.qrSubtitle}>Smooth ride?</Text>
        <Text style={styles.qrDescription}>
          Sit back, relax & enjoy the ride.
        </Text>
      </View>
      <View style={styles.qrIconContainer}>
        <Icon
          type="material-community"
          name="qrcode-scan"
          color={'#ffffff'}
          size={46}
        />
        <TouchableOpacity style={styles.scanButton} onPress={onScanPress}>
          <Text style={styles.scanButtonText}>Scan</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleScanPress = () => {
    // Implement QR code scanning functionality here
    console.log('Scan QR Code');
    navigation.navigate('qrscan');
    // You might want to navigate to a scanning screen or open a camera view
  };

  return (
    <SafeAreaView style={styles.container}>
      <HomeHeader />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={styles.content}>

          <QRScanBanner onScanPress={handleScanPress} />

          <View style={styles.menuGrid}>
            <MenuButton
              title="Tracking"
              iconName="map-marker-radius"
              onPress={() => navigation.navigate('indexScreen')}
            />
            <MenuButton
              title="Seat Reservation"
              iconName="seat-passenger"
              onPress={() => navigation.navigate('BookSeats')}
            />
            <MenuButton
              title="Lost and Found"
              iconName="briefcase-search"
              onPress={() => navigation.navigate('newLost')}
            />
            <MenuButton
              title="Bus Scheduling"
              iconName="bus-clock"
              onPress={() => { navigation.navigate('TimeShedule') }}
            />
            <MenuButton
              title="Details"
              iconName="information"
              onPress={() => navigation.navigate('Details')}
            />
            <MenuButton
              title="Emergency Details"
              iconName="phone-alert"
              onPress={() => navigation.navigate('Emergency')}
            />
            <MenuButton
              title="FeedBack Details"
              iconName="message-text"
              onPress={() => navigation.navigate('FeedBack')}
            />
            <MenuButton
              title="My Tickets"
              iconName="ticket-confirmation"
              onPress={() =>
                navigation.navigate('ReservationHistory', {
                  userEmail: userEmail,
                })}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  qrBanner: {
    flexDirection: 'row',
    backgroundColor: '#2948FF',
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  qrTextContainer: {
    flex: 2,
    alignItems: 'flex-start',
    color: '#ffffff',

  },
  qrTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    // color: colors.grey1,
    color: '#ffffff',
  },
  qrSubtitle: {
    fontSize: 28,
    fontWeight: 'bold',
    // color: colors.primary,
    color: '#ffffff',
    marginVertical: 4,
  },
  qrDescription: {
    fontSize: 14,
    // color: colors.grey2,
    color: '#ffffff',
    marginTop: 8,
  },
  qrIconContainer: {
    display: 'flex',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 10,
  },
  scanButton: {
    // backgroundColor: 'blue',
    backgroundColor: '#ffffff',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    width: '75%',
    display: 'flex',
    alignItems: 'center',
  },
  scanButtonText: {
    // color: colors.cardbackground,
    color: '#000000',
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    height: '100%',
  },
  content: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    width: '100%',
    padding: 16,
    minHeight: 500,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
  },
  deliveryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: colors.grey5,
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  activeButton: {
    backgroundColor: colors.buttons,
  },
  deliveryText: {
    fontSize: 16,
    color: colors.grey2,
    fontWeight: '500',
    marginLeft: 8,
  },
  activeText: {
    color: colors.cardbackground,
  },
  locationCard: {
    backgroundColor: colors.grey5,
    borderRadius: 15,
    padding: 16,
    marginBottom: 20,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: {
    marginLeft: 8,
    fontSize: 16,
    color: colors.grey1,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  menuButton: {
    width: '48%',
    // backgroundColor: colors.cardbackground,
    backgroundColor: '#d4daff',
    borderRadius: 15,
    padding: 16,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '500',
    color: colors.grey1,
    textAlign: 'center',
  },
});
