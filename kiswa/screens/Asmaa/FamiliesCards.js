import { Block } from "galio-framework";
import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
} from "react-native";

const FamiliesCards = ({ navigation }) => {
  const matches = [
    {
      id: 1,
      avatar: "https://bootdey.com/img/Content/avatar/avatar2.png",
      name: "John Doe",
      age: "30",
    },
    {
      id: 2,
      avatar: "https://bootdey.com/img/Content/avatar/avatar3.png",
      name: "John Doe",
      age: "30",
    },
    {
      id: 3,
      avatar: "https://bootdey.com/img/Content/avatar/avatar4.png",
      name: "John Doe",
      age: "30",
    },
    {
      id: 4,
      avatar: "https://bootdey.com/img/Content/avatar/avatar5.png",
      name: "John Doe",
      age: "30",
    },
    {
      id: 5,
      avatar: "https://bootdey.com/img/Content/avatar/avatar6.png",
      name: "John Doe",
      age: "30",
    },
  ];

  return (
    <Block>
      <View style={styles.container}>
        <View style={styles.sectionBody}>
          <ScrollView horizontal contentContainerStyle={styles.sectionScroll}>
            {matches.map(({ avatar, id, name, age }) => (
              <View style={styles.sectionCard} key={id}>
                <Image style={styles.sectionImage} source={{ uri: avatar }} />
                <View style={styles.sectionInfo}>
                  <Text style={styles.sectionLabel}>{name}</Text>
                  <Text style={styles.sectionLabel}>Age: {age}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </Block>
  );
};
export default FamiliesCards;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
    backgroundColor: "#FFF",
  },
  header: {
    backgroundColor: "#00BFFF",
    height: 250,
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 20,
    paddingHorizontal: 16,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 4,
  },
  informationContainer: {
    width: 150,
    height: 150,
    marginLeft: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#ffffff",
  },
  label: {
    fontSize: 12,
    color: "#ffffff",
    marginTop: 10,
  },
  section: {
    paddingHorizontal: 16,
    marginVertical: 5,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
  },
  seeAllButton: {
    backgroundColor: "#A9A9A9",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  seeAllButtonText: {
    color: "#eee",
  },
  sectionBody: {
    marginTop: 10,
  },
  sectionScroll: {
    paddingBottom: 20,
  },
  sectionCard: {
    width: 200,
    minHeight: 200,
    backgroundColor: "#fff",
    shadowColor: "#B0C4DE",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 1,
    margin: 10,
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  sectionImage: {
    width: "100%",
    aspectRatio: 1,
  },
  sectionInfo: {
    padding: 10,
  },
  sectionLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
});
