import React from 'react';
import { View, Text, Image } from 'react-native';

const DonationCard = ({ trackId, timeSlot, dateSlot, donatedItems }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.trackId}>{`TrackId: ${trackId}`}</Text>
            <Text style={styles.timeSlot}>{`Time Slot: ${timeSlot}`}</Text>
            <Text style={styles.dateSlot}>{`Date Slot: ${dateSlot}`}</Text>
            {/* <Text style={styles.clothesDonated}>{`Clothes Donated: ${donatedItems.map(item => `${item.amount} ${item.cloth.toLowerCase()}`).join(', ')}`}</Text> */}
            <View style={styles.items}>
                {donatedItems.map((item, index) => (
                    <View style={styles.item} key={index}>
                        <Image source={{ uri: item.icon }} style={styles.icon} />
                        <Text style={styles.itemText}>{item.amount} {item.cloth}</Text>
                    </View>
                ))}
            </View>
        </View>
    );
};

const styles = {
    container: {
        backgroundColor: '#fae8fa',
        borderRadius: 8,
        padding: 16,
        margin: 8,
    },
    trackId: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    timeSlot: {
        fontSize: 16,
        marginBottom: 4,
    },
    dateSlot: {
        fontSize: 16,
        marginBottom: 4,
    },
    clothesDonated: {
        fontSize: 16,
        marginTop: 8,
    },
    // items: {
    //     flexDirection: 'row',
    //     flexWrap: 'wrap',
    //   },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        marginBottom: 10,
    },
    icon: {
        width: 35,
        height: 35,
        marginRight: 5
    }
};

export default DonationCard;
