import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const Lost = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lost and Found</Text>
      <Text style={styles.message}>This feature is currently unavailable.</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F8F7F3',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    color: '#666',
  },
});

export default Lost;
