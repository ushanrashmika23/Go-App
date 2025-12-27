import React, {useState, useRef} from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
  SafeAreaView,
  Platform,
  Modal,
} from 'react-native';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from 'firebase/auth';
import {getDoc, doc} from 'firebase/firestore';
import {useNavigation} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {auth, db} from '../../../firebase';
import { LinearGradient } from 'expo-linear-gradient';

const Login = ({route}) => {
  const {justRegistered} = route.params || {};
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigation = useNavigation();
  const hasMounted = useRef(false);

  const validateInputs = () => {
    let isValid = true;

    const emailRegex =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

    if (!email) {
      setEmailError('Email is required');
      isValid = false;
    } else if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      isValid = false;
    } else {
      setEmailError('');
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password,
      );
      const user = userCredentials.user;
      console.log('Logged in with:', user.email);

      const userDoc = await getDoc(doc(db, 'userdata', user.email));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;
        const userEmail = userData.email;

        await AsyncStorage.setItem('userRole', userRole);
        await AsyncStorage.setItem('userEmail', userEmail);
        console.log('User role and email saved:', userRole);

        navigation.navigate('HomeScreen');
      } else {
        throw new Error('user_data_not_found');
      }
    } catch (error) {
      console.error('Login error:', error.code);
      handleLoginError(error);
    } finally {
      setIsLoading(false);
    }
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
      case 'auth/user-disabled':
        message = 'This account has been disabled. Please contact support.';
        break;
      case 'auth/too-many-requests':
        message =
          'Too many unsuccessful login attempts. Please try again later.';
        break;
    }

    if (error.message === 'user_data_not_found') {
      message = 'User data not found. Please contact support.';
    }

    Alert.alert('Login Error', message);
  };

  const forgotPassword = () => {
    if (email) {
      setIsLoading(true);
      sendPasswordResetEmail(auth, email)
        .then(() => {
          Alert.alert(
            'Password Reset',
            'Password reset email sent successfully.',
          );
        })
        .catch(error => {
          handleLoginError(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      Alert.alert(
        'Email Required',
        'Please enter your email address to reset your password.',
      );
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Registration');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient colors={['#2948FF', '#526bfcff', '#2948ff']} start={{ x: 1, y: 0 }} end={{ x: 0, y: 1 }} style={styles.container}>
        <KeyboardAvoidingView
          style={styles.innerContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
          <View style={styles.content}>
            <Text style={styles.title}>SIGN IN</Text>
            {/* <Text style={styles.subtitle}>Sign in to continue</Text> */}
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Email"
                  placeholderTextColor="#ccc"
                  value={email}
                  onChangeText={text => {
                    setEmail(text);
                    setEmailError('');
                  }}
                  style={[styles.input, emailError && styles.inputError]}
                  editable={!isLoading}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>
              {emailError ? (
                <Text style={styles.errorText}>{emailError}</Text>
              ) : null}
              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  placeholder="Password"
                  placeholderTextColor="#ccc"
                  value={password}
                  onChangeText={text => {
                    setPassword(text);
                    setPasswordError('');
                  }}
                  style={[styles.input, passwordError && styles.inputError]}
                  secureTextEntry
                  editable={!isLoading}
                />
              </View>
              {passwordError ? (
                <Text style={styles.errorText}>{passwordError}</Text>
              ) : null}
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={handleLogin}
                style={styles.loginButton}
                disabled={isLoading}>
                <Text style={styles.buttonText}>Login</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={forgotPassword}
                style={styles.forgotPasswordButton}
                disabled={isLoading}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.registerContainer}>
              <Text style={styles.registerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={navigateToRegister}>
                <Text style={styles.registerLink}>Register Here</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </LinearGradient>
      <Modal
        transparent={true}
        animationType="fade"
        visible={isLoading}
        onRequestClose={() => {}}>
        <View style={styles.modalBackground}>
          <View style={styles.activityIndicatorWrapper}>
            <ActivityIndicator size="large" color="#2948FF" />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginBottom: 30,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 20,
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
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  loginButton: {
    backgroundColor: '#ffffff',
    width: '100%',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#2948FF',
    fontWeight: '600',
    fontSize: 16,
  },
  forgotPasswordButton: {
    padding: 10,
  },
  forgotPasswordText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  registerText: {
    color: '#fff',
    fontSize: 14,
  },
  registerLink: {
    color: '#fff',
    textDecorationLine: 'underline',
    fontWeight: 'bold',
    fontSize: 14,
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 1,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
  label: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '500',
    marginBottom: 5,
    alignSelf: 'flex-start',
    width: '100%',
  },
  modalBackground: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  activityIndicatorWrapper: {
    backgroundColor: 'white',
    height: 100,
    width: 100,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Login;
