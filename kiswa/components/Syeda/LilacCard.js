import React from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';

const LilacCard = ({ imageUrl, title, subtitle }) => {
  return (
    <View style={styles.card}>
      <Image style={styles.image} source={{ uri: imageUrl }} />
      <View style={styles.divider} />
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#C8A2C8',
    borderColor: '#4B0082',
    borderWidth: 2,
    borderRadius: 8,
    margin: 16,
  },
  image: {
    height: 150, // Reduced image height
    resizeMode: 'cover',
  },
  divider: {
    height: 2,
    backgroundColor: '#4B0082',
  },
  textContainer: {
    backgroundColor: '#F1ECFF', // Reduced opacity of text container
    padding: 10, // Increased padding
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: 'gray',
  },
});

export default LilacCard;
