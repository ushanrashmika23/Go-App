import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { db, auth } from '../../../firebase';
import { addDoc, collection } from 'firebase/firestore';
import Header from '../../Components/Header';

const FeedBack = () => {
  const [name, setName] = useState('');
  const [contactInfo, setContactInfo] = useState('');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    // Validation
    if (!name.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }

    if (!contactInfo.trim()) {
      Alert.alert('Error', 'Please enter your contact information');
      return;
    }

    if (!description.trim()) {
      Alert.alert('Error', 'Please enter a description');
      return;
    }

    const currentUser = auth.currentUser;
    if (!currentUser) {
      Alert.alert('Error', 'Please log in to submit a complaint');
      return;
    }

    try {
      setSubmitting(true);
      const complaintsRef = collection(db, 'complaints');
      await addDoc(complaintsRef, {
        name: name.trim(),
        contactInfo: contactInfo.trim(),
        description: description.trim(),
        userId: currentUser.uid,
        userEmail: currentUser.email,
        createdAt: new Date().toISOString(),
        status: 'pending'
      });

      Alert.alert('Success', 'Your complaint has been submitted successfully. We will get back to you soon.');

      // Reset form
      setName('');
      setContactInfo('');
      setDescription('');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      Alert.alert('Error', `Failed to submit complaint: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Header title="Feedback Details" type="arrow-left" />
      <View style={styles.content}>
        <Text style={styles.title}>Complaint Form</Text>
        {/* <Text style={styles.intro}>
          We value your feedback. Please fill out the form below to submit your complaint or concern, and we'll address it as soon as possible.
        </Text> */}

        {/* Name Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
          />
        </View>

        {/* Contact Info Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Contact Information</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Phone number or email"
            value={contactInfo}
            onChangeText={setContactInfo}
            keyboardType="default"
          />
        </View>

        {/* Description Text Area */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Describe your complaint or concern in detail..."
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={submitting}
        >
          <Text style={styles.submitButtonText}>
            {submitting ? 'Submitting...' : 'Submit Complaint'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F7F3',
  },
  content: {
    padding: 20,
    backgroundColor: '#c8ccf8',
    borderRadius:16,
    margin: 15,
    marginTop: 25,
    
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#2948FF',
    textAlign: 'center',
  },
  intro: {
    fontSize: 14,
    color: '#666',
    marginBottom: 25,
    lineHeight: 20,
    textAlign: 'center',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    height: 50,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
    minHeight: 120,
  },
  submitButton: {
    backgroundColor: '#2948FF',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#99c2ff',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default FeedBack;