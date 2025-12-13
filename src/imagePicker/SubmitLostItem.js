import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { db, auth } from '../../firebase';
import { addDoc, collection } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';


export default function SubmitLostItem() {
    const [itemType, setItemType] = useState('lost'); // 'lost' or 'found'
    const [itemName, setItemName] = useState('');
    const [itemDescription, setItemDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
    const navtion = useNavigation();

    const showDatePicker = () => {
        setDatePickerVisibility(true);
    };

    const hideDatePicker = () => {
        setDatePickerVisibility(false);
    };

    const handleConfirm = (date) => {
        setSelectedDate(date);
        hideDatePicker();
    };

    const handleSubmit = async () => {
        // Validation
        if (!itemName.trim()) {
            Alert.alert('Error', 'Please enter item name');
            return;
        }

        if (!itemDescription.trim()) {
            Alert.alert('Error', 'Please enter item description');
            return;
        }

        const currentUser = auth.currentUser;
        if (!currentUser) {
            Alert.alert('Error', 'Please log in to submit an item');
            return;
        }

        try {
            const lostFoundRef = collection(db, 'lostFound');
            await addDoc(lostFoundRef, {
                itemType,
                itemName: itemName.trim(),
                itemDescription: itemDescription.trim(),
                dateTime: selectedDate.toISOString(),
                userId: currentUser.uid,
                userEmail: currentUser.email,
                createdAt: new Date().toISOString(),
                status: 'active'
            });

            Alert.alert('Success', `${itemType === 'lost' ? 'Lost' : 'Found'} item submitted successfully!`);

            // Reset form
            setItemName('');
            setItemDescription('');
            setSelectedDate(new Date());
            setItemType('lost');
            navtion.navigate('newLost');
        } catch (error) {
            console.error('Error submitting item:', error);
            Alert.alert('Error', `Failed to submit item: ${error.message}`);
        }
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Submit Item</Text>

                {/* Radio buttons for Lost/Found */}
                <View style={styles.radioGroup}>
                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setItemType('lost')}
                    >
                        <View style={styles.radioOuter}>
                            {itemType === 'lost' && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.radioLabel}>Lost Item</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.radioButton}
                        onPress={() => setItemType('found')}
                    >
                        <View style={styles.radioOuter}>
                            {itemType === 'found' && <View style={styles.radioInner} />}
                        </View>
                        <Text style={styles.radioLabel}>Found Item</Text>
                    </TouchableOpacity>
                </View>

                {/* Item Name Text Input */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Item Name</Text>
                    <TextInput
                        style={styles.textInput}
                        placeholder="e.g., Phone, Wallet, Keys..."
                        value={itemName}
                        onChangeText={setItemName}
                    />
                </View>

                {/* Item Description Text Area */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Item Description</Text>
                    <TextInput
                        style={styles.textArea}
                        placeholder="Describe the item in detail..."
                        value={itemDescription}
                        onChangeText={setItemDescription}
                        multiline
                        numberOfLines={4}
                        textAlignVertical="top"
                    />
                </View>

                {/* Date Time Picker */}
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Date & Time</Text>
                    <TouchableOpacity style={styles.dateButton} onPress={showDatePicker}>
                        <Text style={styles.dateText}>{selectedDate.toLocaleString()}</Text>
                    </TouchableOpacity>
                </View>

                <DateTimePickerModal
                    isVisible={isDatePickerVisible}
                    mode="datetime"
                    onConfirm={handleConfirm}
                    onCancel={hideDatePicker}
                    date={selectedDate}
                />

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F7F3',
    },
    content: {
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
        textAlign: 'center',
    },
    radioGroup: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioOuter: {
        height: 24,
        width: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#007bff',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 8,
    },
    radioInner: {
        height: 12,
        width: 12,
        borderRadius: 6,
        backgroundColor: '#007bff',
    },
    radioLabel: {
        fontSize: 16,
        color: '#333',
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
        minHeight: 100,
    },
    dateButton: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 10,
        padding: 15,
        backgroundColor: '#fff',
    },
    dateText: {
        fontSize: 16,
        color: '#333',
    },
    submitButton: {
        backgroundColor: '#28a745',
        borderRadius: 10,
        padding: 15,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
