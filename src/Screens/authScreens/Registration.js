import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { auth, db } from '../../../firebase';
import { Icon } from 'react-native-elements';
import { LinearGradient } from 'expo-linear-gradient';

const Registration = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  // const [enrollmentNum, setEnrollmentNum] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('passenger');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  const validateInputs = () => {
    // Email validation
    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email) {
      showAlert('Email is required');
      return false;
    } else if (!emailRegex.test(email)) {
      showAlert('Please enter a valid email address');
      return false;
    }

    // Password validation
    if (!password) {
      showAlert('Password is required');
      return false;
    } else if (password.length < 6) {
      showAlert('Password must be at least 6 characters long');
      return false;
    }

    // Confirm password validation
    if (password !== confirmPassword) {
      showAlert('Passwords do not match');
      return false;
    }

    // Full name validation
    if (!fullName) {
      showAlert('Full name is required');
      return false;
    }

    // Enrollment number validation
    // if (!enrollmentNum) {
    //   showAlert(
    //     role === 'student'
    //       ? 'Student Enrollment Number is required'
    //       : 'Lecturer ID is required',
    //   );
    //   return false;
    // }

    // Phone number validation
    const phoneRegex = /^\d{10}$/;
    if (!phoneNumber) {
      showAlert('Phone number is required');
      return false;
    } else if (!phoneRegex.test(phoneNumber)) {
      showAlert('Phone number must be exactly 10 digits');
      return false;
    }

    return true;
  };

  const handleLoginError = error => {
    let message = 'An unexpected error occurred. Please try again later.';

    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        message = 'Invalid email or password. Please try again.';
        break;
      case 'auth/invalid-email':
        message = 'Invalid email address. Please check and try again.';
        break;
      case 'auth/email-already-in-use':
        message = 'Email already in use. Please check and try again.';
        break;
      case 'auth/user-disabled':
        message = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/too-many-requests':
        message =
          'Too many unsuccessful login attempts. Please try again later.';
        break;
      case 'auth/network-request-failed':
        message = 'Network error. Please check your internet connection and try again.';
        break;
    }

    if (error.message === 'user_data_not_found') {
      message = 'User data not found. Please contact support.';
    }

    Alert.alert('Registration Error', message);
  };

  const showAlert = message => {
    Alert.alert('Registration Error', message);
  };

  const handleRegister = async () => {
    if (!validateInputs()) {
      return;
    }
    setIsLoading(true);

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredential.user;

      await setDoc(doc(db, 'userdata', user.email), {
        email: user.email,
        fullName: fullName,
        // enrollmentNum: enrollmentNum,
        phoneNumber: phoneNumber,
        role: role,
      });
      setIsLoading(false);
      console.log('Registered with:', user.email, 'as', role);
      Alert.alert('Success', 'Registration successful!', [
        {
          text: 'OK',
          onPress: () =>
            navigation.navigate('SigninScreen', { justRegistered: true }),
        },
      ]);
    } catch (error) {
      console.log('Registration Error:', error.message);
      setIsLoading(false);
      // showAlert(error.message);
      handleLoginError(error)
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#2948FF', '#526bfcff', '#2948ff']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollViewContent}>
          <KeyboardAvoidingView behavior="padding">
            <View style={styles.headerContainer}>
              <Text style={styles.title}>CREATE ACCOUNT</Text>
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>

                <TextInput
                  placeholder="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  style={styles.input}
                  placeholderTextColor="#ccc"
                />
              </View>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>

                <TextInput
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  style={styles.input}
                  placeholderTextColor="#ccc"
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>

                <TextInput
                  placeholder="Password"
                  value={password}
                  onChangeText={setPassword}
                  style={styles.input}
                  secureTextEntry
                  placeholderTextColor="#ccc"
                />
              </View>
              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>

                <TextInput
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  style={styles.input}
                  secureTextEntry
                  placeholderTextColor="#ccc"
                />
              </View>
             
              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>

                <TextInput
                  placeholder="Phone Number"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  style={styles.input}
                  placeholderTextColor="#ccc"
                  keyboardType="phone-pad"
                  maxLength={10}
                />
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleRegister}
                style={styles.button}
                disabled={isLoading}>
                {isLoading ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Register</Text>
                )}
              </TouchableOpacity>
            </View>
            <View style={styles.loginContainer}>
              <Text style={styles.loginText}>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SigninScreen')}>
                <Text style={styles.loginLink}>Login here</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#294add',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center', // Add this to center the ActivityIndicator
  },
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginTop: 10,
  },
  inputContainer: {
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 5,
    color: '#fff',
    backgroundColor: 'transparent',
    fontSize: 16,
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  roleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 15,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8396e7ff',
    marginHorizontal: 5,
  },
  roleButtonActive: {
    backgroundColor: '#294add',
  },
  roleButtonText: {
    color: '#8396e7ff',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  roleButtonTextActive: {
    color: 'white',
  },
  buttonContainer: {
    width: '100%',
    marginTop: 20,
  },
  button: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#2948FF',
    fontWeight: '700',
    fontSize: 18,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  loginText: {
    color: '#fff',
    fontSize: 16,
  },
  loginLink: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 5,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 5,
  },
});

export default Registration;
