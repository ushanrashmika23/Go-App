import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const NewLost = () => {
  const navigation = useNavigation();
  const handleLostItems = () => {
    navigation.navigate('LostItemList');
  };

  const handleFoundItems = () => {
    navigation.navigate('FoundItemList');
  };

  const handleSubmit = () => {
    navigation.navigate('SubmitLostItem');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lost and Found</Text>

      <TouchableOpacity style={styles.button} onPress={handleLostItems}>
        <Text style={styles.buttonText}>Lost Items</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={handleFoundItems}>
        <Text style={styles.buttonText}>Found Items</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit Lost or Found Item</Text>
      </TouchableOpacity>
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
    marginBottom: 30,
    color: '#333',
  },
  button: {
    width: '100%',
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007bff',
    marginBottom: 15,
  },
  submitButton: {
    backgroundColor: '#28a745',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default NewLost;
