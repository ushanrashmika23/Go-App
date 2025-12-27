import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Dimensions } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import Header from '../Components/Header';

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
  const { width } = Dimensions.get("window");
  return (
    <View style={{ flex: 1 }}>
      <Header title="Lost & Found" type="arrow-left" />
      <View style={{ justifyContent: 'center' }}>
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
          {/* <Text style={styles.title}>Lost and Found</Text> */}

          <TouchableOpacity style={styles.button} onPress={handleLostItems}>
            <View style={styles.buttonContent}>
              <Icon name="search" type="material" color="#fff" size={22} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Lost Items</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleFoundItems}>
            <View style={styles.buttonContent}>
              <Icon name="content-paste" type="material" color="#fff" size={22} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Found Items</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
            <View style={styles.buttonContent}>
              <Icon name="lightbulb-outline" type="material" color="#fff" size={22} style={styles.buttonIcon} />
              <Text style={styles.buttonText}>Submit Lost or Found Item</Text>
            </View>
          </TouchableOpacity>

        </View>
      </View>
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
    marginTop: 80,
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
    // alignItems: 'center',
    backgroundColor: '#2948FF',
    marginBottom: 15,
    paddingHorizontal: 20,
  },
  submitButton: {
    // backgroundColor: '#2ebd4fff',
    backgroundColor: '#2948FF',
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonIcon: {
    marginRight: 10,
  },
});

export default NewLost;
