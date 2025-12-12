import React, { useState } from 'react';
import { View, TextInput, Button, Image, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {  storage, db } from '../../firebase';
import { v4 } from 'uuid';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { addDoc, collection } from 'firebase/firestore';

const Lost = () => {
  const [txt, setTxt] = useState('');
  const [img, setImg] = useState(null);

  const handleUpload = async () => {
    // Request permission to access media library
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    // Pick an image from the device's media library
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imgRef = ref(storage, `Imgs/${v4()}`);
      const response = await fetch(result.assets[0].uri);
      const blob = await response.blob();

      uploadBytes(imgRef, blob).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          setImg(url);
          Alert.alert('Image uploaded successfully');
        });
      }).catch((error) => {
        console.log('Upload failed:', error);
      });
    }
  };

  const handleClick = async () => {
    const valRef = collection(db, 'txtData');
    await addDoc(valRef, { txtVal: txt, imgUrl: img });
    Alert.alert('Data added successfully');
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Enter text"
        value={txt}
        onChangeText={(text) => setTxt(text)}
        style={{ marginBottom: 10, borderWidth: 1, padding: 10 }}
      />
      <Button title="Upload File" onPress={handleUpload} />
      <Button title="Add Data" onPress={handleClick} style={{ marginTop: 10 }} />

      {img && (
        <Image
          source={{ uri: img }}
          style={{ marginTop: 20, height: 200, width: 200 }}
        />
      )}
    </View>
  );
};

export default Lost;
