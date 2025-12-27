import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Header from '../../Components/Header';

const TimeShedule = () => {
  // Data for the schedule rows
  const scheduleData = [
    'Barawakubuka Interchange',
    'Angunkolapelessa Interchange',
    'Kasagala Interchange',
    'Bedigama Interchange',
    'Beliatta Interchange',
    'Aparekka Interchange',
    'Kapuduwe Interchange',
    'Godagama-Palatuwa Interchange',
    'Godagama Interchange',
    'Kokmaduwa Interchange',
    'Imaduwa Interchange',
    'Pinnaduwa Interchange',
    'Baddegama Interchange',
    'Kurrudugahahetekma Interchange',
    'Welipeenna Interchange',
    'Dodangoda Interchange',
    'Geliangama Interchange',
    'Kahathuduwa Interchange',
    'Kottawa Interchange',
    'Kaduwela Interchange',
  ];

  // Component return
  return (
    <View style={styles.container}>
      <Header title="Time Schedule" type="arrow-left" />

      {/* Schedule section */}
      <ScrollView>
        {/* Black table headers */}
        {/* <View style={styles.tableHeader}>
          <View style={styles.tableHeaderItem}>
            <Text style={styles.tableHeaderText}>KDUSC to KADAWATHA</Text>
          </View>
          <View style={styles.tableHeaderItem}>
            <Text style={styles.tableHeaderText}>KADAWATHA to KDUSC</Text>
          </View>
        </View> */}

        {/* Schedule rows */}
        <View style={styles.table}>
          {scheduleData.map((location, index) => (
            <View key={index} style={styles.row}>
              <View style={styles.locationCell}>
                <Text>{location}</Text>
              </View>
              <View style={styles.timeCell}>
                <Text>3.40 PM</Text>
              </View>
              <View style={styles.timeCell}>
                <Text>3.45 PM</Text>
              </View>
              <View style={styles.timeCell}>
                <Text>3.40 PM</Text>
              </View>
              <View style={styles.timeCell}>
                <Text>3.45 PM</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
  },
  tableHeader: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    // backgroundColor: '#000',
    padding: 10,
  },
  table:{
    margin: 10,
  },
  tableHeaderItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    marginVertical: 1,
  },
  locationCell: {
    flex: 2,
    padding: 10,
    // borderRightWidth: 1,
    // borderColor: '#ddd',
  },
  timeCell: {
    flex: 1,
    padding: 10,
    alignItems: 'center',
    // borderRightWidth: 1,
    // borderColor: '#ddd',
  },
});

export default TimeShedule;
