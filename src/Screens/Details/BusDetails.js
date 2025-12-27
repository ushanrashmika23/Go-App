import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';
import Header from '../../Components/Header';
// import firestore from '@react-native-firebase/firestore';

const BusDetails = () => {
    const [bus, setBus] = useState({
        RegNo: 'WP KA 1234',
        Tel: '+1234567890',
        Name: 'City Transport Service',
        ImageUrl: 'https://thumbs.dreamstime.com/z/blue-bus-icon-vector-illustration-eps-267259672.jpg?w=576',
    });

    const getData = async () => {
        // const busCollection = await firestore().collection('BusDetails').get();
        // if (busCollection.docs.length > 0) {
        //     setBus(busCollection.docs[0].data());
        // }
    };

    useEffect(() => {
        getData();
    }, []);

    return (
        <ScrollView >
            <Header title="Bus Details" type="arrow-left" />
            <View style={styles.container}>
                <View style={styles.card}>

                    <Image
                        source={bus.ImageUrl ? { uri: bus.ImageUrl } : require('../../../assets/bus-icon.png')} // Use your uploaded image if bus.ImageUrl is not available
                        style={styles.image}
                    />
                    <View style={styles.info}>
                        <Text style={styles.text}>{bus.name || 'Transport Service'}</Text>
                        <Text style={styles.tele}>{bus.RegNo || 'N/A'}</Text>
                        <Text style={styles.tele}>{bus.Tel || 'N/A'}</Text>
                    </View>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F8F4EB', // Light cream background like in the image
        padding: 20,
    },
    card: {
        backgroundColor: '#c9d1ff',
        borderRadius: 12,
        padding: 20,
        // shadowColor: '#000',
        // shadowOffset: { width: 0, height: 3 },
        // shadowOpacity: 0.2,
        // shadowRadius: 4,
        // elevation: 5,
        alignItems: 'center',
        width: '90%',
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 12,
        marginBottom: 20,
    },
    info: {
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
});

export default BusDetails;
