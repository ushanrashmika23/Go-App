import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Header from '../../Components/Header';
import { Button } from 'react-native-elements';
// import firestore from '@react-native-firebase/firestore';

const DriverDetails = () => {
    const [driver, setDriver] = useState(null);

    const getData = async () => {
        const driverCollection = await firestore().collection('DriverDetails').get();
        if (driverCollection.docs.length > 0) {
            setDriver(driverCollection.docs[0].data());
        }
    }

    useEffect(() => {
        getData();
    }, []);

    if (!driver) {
        setDriver({
            driverId: '12345',
            Name: 'John Doe',
            Tel: '+1234567890',
            Email: 'john.doe@example.com',
            ImageUrl: 'https://cdn1.iconfinder.com/data/icons/male-profession-colour/1063/11-1024.png',
        });
    }

    return (
        <View >
            <Header title="Driver Details" type="arrow-left" />
            <View style={styles.container}>
                <View style={styles.card}>


                    <Image source={{ uri: "https://cdn1.iconfinder.com/data/icons/male-profession-colour/1063/11-1024.png" }} style={styles.image} />
                    <View style={styles.info}>
                        <View style={styles.info}>
                            <Text style={styles.text}>John Doe John Doe</Text>
                            <Text style={styles.tele}> 0712345678</Text>
                            {/* <Text style={styles.text}>Email: john.doe@example.com</Text> */}
                        </View>
                    </View>
                </View>

                {/* <Button
                    title="Complaint"
                    // onPress={() => alert('Complaint filed!')}
                    buttonStyle={styles.complaintButton}
                /> */}

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginTop: 60,
    },
    card: {
        flexDirection: 'column',
        width: '90%',
        padding: 20,
        backgroundColor: '#c9d1ff',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        height: 200,
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginRight: 20,
    },
    info: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        // marginTop: 10,
        fontSize: 22,
        fontWeight: '700',
        marginBottom: 5,
        color: '#000',
    },
    tele: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 5,
        color: '#2948FF',
    },

    complaintButton: {
        backgroundColor: '#2948FF',
        marginTop: 20,
        width: '90%',
        height: 40,
        textAlign: 'center',
        borderRadius: 8,
    },

});

export default DriverDetails;
