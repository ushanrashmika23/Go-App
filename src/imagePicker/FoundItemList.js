import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { db, auth } from '../../firebase';
import { collection, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default function FoundItemsList() {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchFoundItems();
    }, []);

    const fetchFoundItems = async () => {
        try {
            setLoading(true);
            const lostFoundRef = collection(db, 'lostFound');
            const q = query(
                lostFoundRef,
                where('itemType', '==', 'found'),
                orderBy('createdAt', 'desc')
            );

            const querySnapshot = await getDocs(q);
            const items = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));

            // Separate my items and other items
            const currentUser = auth.currentUser;
            const myItems = [];
            const otherItems = [];

            items.forEach(item => {
                if (currentUser && item.userId === currentUser.uid) {
                    myItems.push(item);
                } else {
                    otherItems.push(item);
                }
            });

            // Combine with my items on top
            setItems([...myItems, ...otherItems]);
        } catch (error) {
            console.error('Error fetching found items:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = (itemId, itemName) => {
        Alert.alert(
            'Delete Item',
            `Are you sure you want to delete "${itemName}"?`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'lostFound', itemId));
                            setItems(items.filter(item => item.id !== itemId));
                            Alert.alert('Success', 'Item deleted successfully');
                        } catch (error) {
                            console.error('Error deleting item:', error);
                            Alert.alert('Error', 'Failed to delete item');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => {
        const currentUser = auth.currentUser;
        const isMyItem = currentUser && item.userId === currentUser.uid;

        return (
            <View style={[styles.itemCard, isMyItem && styles.myItemCard]}>
                <View style={styles.cardHeader}>
                    <View style={{ flex: 1 }}>
                        {isMyItem && <Text style={styles.myItemBadge}>My Item</Text>}
                        <Text style={styles.itemName}>{item.itemName}</Text>
                    </View>
                    {isMyItem && (
                        <TouchableOpacity
                            onPress={() => handleDelete(item.id, item.itemName)}
                            style={styles.deleteButton}
                        >
                            <Ionicons name="trash-outline" size={24} color="#dc3545" />
                        </TouchableOpacity>
                    )}
                </View>
                <Text style={styles.itemDescription}>{item.itemDescription}</Text>
                <View style={styles.itemDetails}>
                    <Text style={styles.detailText}>
                        Date: {new Date(item.dateTime).toLocaleString()}
                    </Text>
                    <Text style={styles.detailText}>By: {item.userEmail}</Text>
                </View>
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.centerContainer}>
                <ActivityIndicator size="large" color="#007bff" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Found Items</Text>
            {items.length === 0 ? (
                <View style={styles.centerContainer}>
                    <Text style={styles.emptyText}>No found items</Text>
                </View>
            ) : (
                <FlatList
                    data={items}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.listContainer}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F7F3',
    },
    centerContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        padding: 20,
        textAlign: 'center',
        color: '#333',
    },
    listContainer: {
        padding: 15,
    },
    itemCard: {
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 15,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    myItemCard: {
        borderWidth: 2,
        borderColor: '#fff',
        // backgroundColor: '#f0f8ff',
    },
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 8,
    },
    myItemBadge: {
        fontSize: 12,
        color: '#007bff',
        fontWeight: 'bold',
        marginBottom: 4,
    },
    deleteButton: {
        padding: 5,
    },
    itemName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    itemDescription: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
        lineHeight: 20,
    },
    itemDetails: {
        borderTopWidth: 1,
        borderTopColor: '#eee',
        paddingTop: 8,
    },
    detailText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    emptyText: {
        fontSize: 16,
        color: '#999',
    },
});
