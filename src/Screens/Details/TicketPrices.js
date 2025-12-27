import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import { db } from '../../../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import Header from '../../Components/Header';

const TicketPrices = () => {
  const [loading, setLoading] = useState(true); // Set loading to true on component mount
  const [ticketPrices, setTicketPrices] = useState([]); // Initial empty array of ticket prices

  useEffect(() => {
    const ticketPricesRef = collection(db, 'ticketPrices');

    const unsubscribe = onSnapshot(ticketPricesRef, (querySnapshot) => {
      const ticketPrices = [];

      querySnapshot.forEach((documentSnapshot) => {
        ticketPrices.push({
          ...documentSnapshot.data(),
          key: documentSnapshot.id, // To uniquely identify each item in the list
        });
      });

      setTicketPrices(ticketPrices);
      setLoading(false);
    });

    // Unsubscribe from events when no longer in use
    return () => unsubscribe();
  }, []);


  if (loading) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View>
      <Header title="Ticket Prices" type="arrow-left" />
      <View style={styles.container}>
        <FlatList
          data={ticketPrices}
          keyExtractor={item => item.key}
          renderItem={({ item }) => (
            <View style={styles.itemContainer}>
              <Text style={styles.itemText}>{item.exitName}</Text>
              <Text style={styles.itemPrice}>Price: {item.price}</Text>
            </View>
          )}
        />
      </View>
    </View>
  );
};

export default TicketPrices;

const styles = {
  container: {
    flex: 1,
    padding: 16,
  },
  itemContainer: {
    paddingHorizontal: 16,
    backgroundColor: '#c9d1ff',
    height: 60,
    marginBottom: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  itemText: {
    fontSize: 16,
    fontWeight: 700,
  },
  itemPrice: {
    fontSize: 16,
    color: '#2948FF',
    fontWeight: 700,
  },
};