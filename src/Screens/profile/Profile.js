import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Icon } from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { auth, db, storage } from '../../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import * as ImagePicker from 'expo-image-picker';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loadingUserInfo, setLoadingUserInfo] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleImagePick = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      alert('Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled && result.assets.length > 0) {
      const image = result.assets[0];
      uploadImageToFirebase(image.uri);
    }
  };

  const uploadImageToFirebase = async imageUri => {
    setUploadingImage(true);
    try {
      const userEmail = await AsyncStorage.getItem('userEmail');
      const fileName = userEmail + '_profile.jpg';
      const storageRef = ref(storage, `profile/${fileName}`);

      // Upload the file to Firebase Storage
      const response = await fetch(imageUri);
      const blob = await response.blob();
      await uploadBytes(storageRef, blob);

      // Get the image URL
      const downloadURL = await getDownloadURL(storageRef);

      // Save the URL to Firestore
      const userDocRef = doc(db, 'userdata', userEmail);
      await updateDoc(userDocRef, { profileImage: downloadURL });

      // Update state
      setUserInfo(prev => ({ ...prev, profileImage: downloadURL }));
    } catch (error) {
      console.log('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const fetchUserData = async () => {
    setLoadingUserInfo(true);
    try {
      const savedEmail = await AsyncStorage.getItem('userEmail');
      const userDocRef = doc(db, 'userdata', savedEmail);
      const userDoc = await getDoc(userDocRef);
      if (userDoc.exists()) {
        setUserInfo(userDoc.data());
      } else {
        console.log('No user data found in Firebase');
      }
    } catch (error) {
      console.log('Error fetching user data:', error);
    } finally {
      setLoadingUserInfo(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem('userRole');
      await AsyncStorage.removeItem('userEmail');
      navigation.navigate('SigninWelcomeScreen');
      console.log('User logged out, storage cleared');
    } catch (error) {
      console.error('Error clearing storage during logout:', error);
    }
  };

  // InfoItem component with local state for each field
  const InfoItem = ({ label, value, field, editable }) => {
    const [localValue, setLocalValue] = useState(value); // Local state for each field
    const [isEditing, setIsEditing] = useState(false); // Editing state for each field

    const handleEdit = () => {
      setIsEditing(true);
    };

    const handleSave = async () => {
      try {
        const userEmail = await AsyncStorage.getItem('userEmail');
        const userDocRef = doc(db, 'userdata', userEmail);
        await updateDoc(userDocRef, { [field]: localValue });

        // Update the global userInfo state
        setUserInfo(prev => ({ ...prev, [field]: localValue }));
        setIsEditing(false);
      } catch (error) {
        console.log('Error updating user data:', error);
      }
    };

    return (
      <View style={styles.infoItem}>
        <Text style={styles.infoLabel}>{label}</Text>
        <View style={styles.infoValueContainer}>
          {isEditing ? (
            <TextInput
              style={styles.input}
              value={localValue}
              onChangeText={text => setLocalValue(text)} // Use localValue for each input field
              placeholder={`Enter new ${label}`}
            />
          ) : (
            <Text style={styles.infoValue}>{value}</Text>
          )}
          {isEditing ? (
            <TouchableOpacity onPress={handleSave}>
              <Icon name="check" type="feather" size={20} color="green" />
            </TouchableOpacity>
          ) : editable ? (
            <TouchableOpacity onPress={handleEdit}>
              <Icon name="edit" type="feather" size={20} color="#888" />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>My Profile</Text>
        {/* <Icon name="person-circle-outline" type="ionicon" size={28} color="#2948FF" /> */}
      </View>
      <ScrollView style={styles.scrollContent}>

        {loadingUserInfo ? (
          <ActivityIndicator size="large" color="#2948FF" style={styles.loader} />
        ) : (
          <>
            <View style={styles.profileImageContainer}>
              {/* <TouchableOpacity onPress={handleImagePick}> */}
              <TouchableOpacity>
                <Image
                  source={{
                    uri:
                      userInfo?.profileImage || 'https://tse4.mm.bing.net/th/id/OIP.yBwIrstROT-OGYe0waN_7AHaHa?w=1920&h=1920&rs=1&pid=ImgDetMain&o=7&rm=3',
                  }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
              <Text style={{ marginTop: 8, fontSize: 18, fontWeight: 'bold' }}>{userInfo?.fullName}</Text>
              {uploadingImage && (
                <ActivityIndicator size="small" color="#2948FF" />
              )}
            </View>

            <View style={styles.infoContainer}>
              <Text style={styles.sectionTitle}>Your Info</Text>
              <InfoItem
                label="Full Name"
                value={userInfo?.fullName}
                field="fullName"
                editable={true}
              />
              <InfoItem
                label="Email Address"
                value={userInfo?.email}
                field="email"
                editable={false}
              />
              <InfoItem
                label="Phone Number"
                value={userInfo?.phoneNumber}
                field="phoneNumber"
                editable={true}
              />
              <InfoItem
                label="Role"
                value={userInfo?.role}
                field="role"
                editable={false}
              />
            </View>

            {/* TODO: add password reset icon */}

            {/* <TouchableOpacity
            style={styles.menuItem}
            onPress={() =>
              navigation.navigate('HomeScreen', {
                screen: 'ReservationHistory',
                params: {
                  userEmail: userInfo?.email,
                },
              })
            }>
            <Text style={styles.menuItemText}>Reservation History</Text>
            <Icon name="chevron-right" type="feather" size={20} color="#888" />
          </TouchableOpacity> */}

            <TouchableOpacity style={styles.logoutButton} onPress={logout}>
              <Text style={styles.logoutButtonText}>LOGOUT</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ProfilePage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#2948FF',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  scrollContent: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loader: {
    marginTop: 50,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    opacity: 0.5
  },
  infoContainer: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  infoLabel: {
    fontSize: 14,
    color: '#888',
  },
  infoValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoValue: {
    fontSize: 14,
    marginRight: 10,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  menuItemText: {
    fontSize: 16,
  },
  bookingsContainer: {
    padding: 20,
  },
  bookingItem: {
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
  },
  bookingText: {
    fontSize: 14,
    marginBottom: 5,
  },
  cancelButton: {
    backgroundColor: '#ff4d4d',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  logoutButton: {
    backgroundColor: '#2948FF',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 30,
    marginBottom: 20,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
