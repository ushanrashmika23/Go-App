import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, SafeAreaView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import Svg, { Text as SvgText } from 'react-native-svg';

const SigninWelcomeScreen = ({ navigation }) => {
  const [authState, setAuthState] = useState(false);

  useEffect(() => {
    const getEmailFromStorage = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('userEmail');
        if (savedEmail) {
          setAuthState(true);
          navigation.navigate('HomeScreen');
        }
      } catch (error) {
        console.log('Error fetching email from AsyncStorage:', error);
      }
    };

    getEmailFromStorage(); // Call the function to fetch email on mount
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {/* <LinearGradient colors={['#2948FF', '#3d59fdff','#396afc']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.container}> */}
      <LinearGradient colors={['#2948FF', '#526bfcff', '#2948ff']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.container}>
        <View style={styles.headerContainer}></View>

        <View style={styles.swiperContainer}>
          <Text style={styles.mainText}>FIND BUS</Text>
          <Image source={require('../../../assets/imgs/bus.png')} style={styles.image} resizeMode="contain" />
        </View>

        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>
            Connecting {"\n"}
            you to every {"\n"}
            destination.
          </Text>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Get Started"
            buttonStyle={styles.button}
            titleStyle={styles.buttonTitle}
            onPress={() => navigation.navigate('Registration')}
          />
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
  },
  mainText: {
    position: 'absolute',
    fontSize: 148,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
    zIndex: 5,
    lineHeight: 180,
  },
  headerContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 20,
  },
  headerText: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '500',
    textAlign: 'center',
    width: '85%',
    textTransform: 'uppercase',
    letterSpacing: 1,
    lineHeight: 36,
  },
  swiperContainer: {
    flex: 4,
  },
  slide: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  image: {
    width: '80%',
    height: '80%',
    zIndex: 10,
    alignSelf: 'center',
  },
  dot: {
    backgroundColor: 'rgba(41, 74, 221,0.3)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  activeDot: {
    backgroundColor: '#2948FF',
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: 3,
    marginRight: 3,
    marginTop: 3,
    marginBottom: 3,
  },
  buttonContainer: {
    flex: 2,
    justifyContent: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    height: 50,
    marginBottom: 15,
  },
  lecbutton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    height: 50,
    marginBottom: 15,
  },
  buttonTitle: {
    color: '#2948FF',
    fontSize: 18,
    fontWeight: '700',
  },
  loginButtonTitle: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SigninWelcomeScreen;
