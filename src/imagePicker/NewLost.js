import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL, listAll } from "firebase/storage";
import { storage, db, auth } from '../../firebase';
import MyFilesList from './MyList';
import { addDoc, collection, getDocs, query } from 'firebase/firestore';

const NewLost = () => {
  const [imageData, setImageData] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [files, setFiles] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const listRef = ref(storage, 'images/');
        const listResp = await listAll(listRef);
        const files = await Promise.all(listResp.items.map(async (itemRef) => {
          const downloadURL = await getDownloadURL(itemRef);

          // Fetch the corresponding text from Firestore
          const uploadsRef = collection(db, 'uploads');
          const q = query(uploadsRef);
          const querySnapshot = await getDocs(q);
          let textData = '';
          querySnapshot.forEach((doc) => {
            if (doc.data().imageUrl === downloadURL) {
              textData = doc.data().text;
            }
          });

          return { name: itemRef.name, url: downloadURL, text: textData };
        }));
        setFiles(files);
      } catch (error) {
        console.log('Failed to retrieve files:', error.message || error);
      }
    };

    fetchFiles();
  }, []);

  const openCamera = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) {
      setImageData(result);
    } else {
      console.log('Image selection was canceled');
    }
  };

  const uploadImage = async () => {
    // Check if user is authenticated
    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Authentication Required', 'Please log in to upload files');
      return;
    }

    if (imageData && text) {
      const uri = imageData.assets[0].uri;
      const fileName = uri.split('/').pop() || `image_${Date.now()}.jpg`;
      const pathToFile = uri;

      try {
        console.log('Fetching image from URI:', uri);
        const response = await fetch(uri);
        const blob = await response.blob();
        console.log('Blob created, size:', blob.size, 'type:', blob.type);

        // Use images folder instead of user-specific path for simplicity
        const storageRef = ref(storage, `images/${fileName}`);
        console.log('Uploading to path:', `images/${fileName}`);

        setUploadProgress(10);

        // Use uploadBytes instead of uploadBytesResumable for simpler error handling
        const uploadResult = await uploadBytes(storageRef, blob);
        console.log('Upload complete:', uploadResult);

        setUploadProgress(50);

        const downloadURL = await getDownloadURL(uploadResult.ref);
        console.log('File available at', downloadURL);

        setUploadProgress(75);

        // Save text and image URL to Firestore
        try {
          const valRef = collection(db, 'uploads');
          await addDoc(valRef, {
            text,
            imageUrl: downloadURL,
            userId: currentUser.uid,
            createdAt: new Date().toISOString()
          });

          setUploadProgress(100);
          Alert.alert('Success', 'File uploaded successfully!');

          // Update the state to include the new file
          setFiles((prevFiles) => [...prevFiles, { name: fileName, url: downloadURL, text }]);
          setText(''); // Reset the text input
          setImageData(null); // Reset the image data
          setUploadProgress(0); // Reset progress
        } catch (firestoreError) {
          console.error('Failed to add document to Firestore:', firestoreError);
          Alert.alert('Partial Success', 'File uploaded but failed to save metadata');
        }
      } catch (error) {
        console.error('Upload failed:', error);
        console.error('Error code:', error.code);
        console.error('Error message:', error.message);
        console.error('Error details:', JSON.stringify(error, null, 2));
        Alert.alert('Upload Failed', `Error: ${error.message}`);
        setUploadProgress(0);
      }
    } else {
      console.log('No image selected or text provided');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      {imageData && (
        <Image source={{ uri: imageData.assets[0].uri }} style={{ width: 200, height: 200, marginBottom: 10 }} />
      )}
      <TextInput
        placeholder="Enter text here"
        value={text}
        onChangeText={(text) => setText(text)}
        style={{
          width: '100%',
          height: 50,
          borderWidth: 0.5,
          borderRadius: 10,
          marginBottom: 10,
          paddingHorizontal: 10,
        }}
      />
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#007bff',
          marginTop: 10,
        }}
        onPress={openCamera}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Select Image</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={{
          width: '100%',
          height: 50,
          borderRadius: 10,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#28a745',
          marginTop: 20,
        }}
        onPress={uploadImage}
      >
        <Text style={{ color: 'white', fontWeight: 'bold' }}>Upload Image</Text>
      </TouchableOpacity>
      {uploadProgress > 0 && <Text>Upload Progress: {uploadProgress.toFixed(2)}%</Text>}
      <MyFilesList files={files} />
    </View>
  );
};

export default NewLost;
