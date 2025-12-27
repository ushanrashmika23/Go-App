import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation } from '@react-navigation/native'; // You can use other icon libraries as well.
import Header from '../Components/Header';

const Details = () => {
  const navigation = useNavigation();
  const { width } = Dimensions.get("window");
  return (
    <View style={{}}>
      {/* Header */}
      <Header title="Details" type="arrow-left" />
      <Image
        source={require('./../../assets/imgs/lostcover.png')}
        style={{
          width: width,
          height: undefined,
          aspectRatio: 1134 / 700,
        }}
        resizeMode="contain"
      />
      <View style={styles.container}>
        {/* Button List */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TimeShedule')}>
          <Icon name="clock-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Time Schedule</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('TicketPrices')}>
          <Icon name="ticket-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Ticket Prices</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('DriverDetails')}>
          <Icon name="account-outline" size={24} color="white" />
          <Text style={styles.buttonText}>Driver Details</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('BusDetails')}>
          <Icon name="bus" size={24} color="white" />
          <Text style={styles.buttonText}>Bus Details</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff', // Use your header background color
    padding: 10,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'black',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2948FF',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 8,
    height: 55,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 15,
  },
});

export default Details;
