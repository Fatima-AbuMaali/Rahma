import {
  StyleSheet,
  View,
  Image,
  Button,
  Pressable,
  ScrollView,
  Dimensions,
  ImageBackground,
} from "react-native";
import React, { Component, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { List } from "react-native-paper";
import { Card, Header, Divider } from "@rneui/themed";
import DonationCard from "../../components/Syeda/DonationCard";
import { Block, Text, theme } from "galio-framework";
import {
  Fontisto,
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
  Ionicons,
  Entypo,
} from "react-native-vector-icons";
import {
  doc,
  setDoc,
  getDocs,
  getDoc,
  query,
  where,
  collection,
} from "firebase/firestore";
import { db, auth } from "../../config";

import { useIsFocused } from "@react-navigation/native";

const { width, height } = Dimensions.get("screen");

const DonorHistory = ({ route, navigation }) => {
  let user = auth?.currentUser?.email;

  //this part isFocused is used to re-render the page each time it is opened
  const isFocused = useIsFocused();

  const [expanded, setExpanded] = useState(true);

  const handlePress = () => setExpanded(!expanded);

  const [donationArray, setDonationArray] = useState([]);
  console.log("donation:  ", donationArray);

  const [smallArray, setSmallArray] = useState([]);
  console.log("smallArray", smallArray);

  const [number, setNumber] = useState();
  console.log("number", number);

  let counter = 0;

  const readDonations = async () => {
    const q = query(
      collection(db, "donorDonation"),
      where("email", "==", user)
    );
    const docs = await getDocs(q);
    // let counter = 0
    docs.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      counter += 1;
      //setCounter(counter)
      console.log("readDonations => ", doc.id, " => ", doc.data());
    });
    setNumber(counter);
    //console.log("counter: ", counter)
  };

  console.log("counter => ", counter);

  useEffect(() => {
    if (isFocused) {
      readAllWhere();
      readDonations();
    }
  }, [isFocused]);

  const readAllWhere = async () => {
    const q = query(
      collection(db, "donorDonation"),
      where("email", "==", user)
    );
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      console.log("readAllWhere => ", doc.id, " => ", doc.data());
    });

    let temp = [];

    docs.forEach((doc) => {
      temp.push({
        // donation: doc.data()
        dateSlot: doc.data().dateSlot,
        timeSlot: doc.data().timeSlot,
        donatedItems: doc.data().donatedItems,
        trackId: doc.data().trackId,
      });
    });
    setDonationArray(temp);
  };
  const renderArticles = () => {
    return (
      <SafeAreaView style={styles.container}>
        {number === 0 ? (
          <Block>
            <Text
              bold
              size={20}
              color="#32325D"
              style={{ alignSelf: "center", margin: 20 }}
            >
              Uh oh! Looks like you haven't made any donations yet. {"\n"}
              Check this page again when you have!
            </Text>
            <ImageBackground
              style={{
                width: width * 0.9,
                height: height * 0.5,
                alignSelf: "center",
              }}
              source={{
                uri: "https://i.pinimg.com/564x/1b/44/87/1b448703bd3fca661cd7cafd6d6b90c1.jpg",
              }}
            ></ImageBackground>
          </Block>
        ) : (
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.articles}
          >
            <Text
              bold
              size={28}
              color="#32325D"
              style={{ alignSelf: "center"}}
            >
              View Past Donations
            </Text>
            <View style={{ width: width * 0.9 }}>
              {donationArray.flat().map((donationItem) => (
                <DonationCard
                  key={donationItem.trackId}
                  trackId={donationItem.trackId}
                  timeSlot={donationItem.timeSlot}
                  dateSlot={donationItem.dateSlot}
                  donatedItems={donationItem.donatedItems}
                />
              ))}
            </View>
          </ScrollView>
        )}
      </SafeAreaView>
    );
  };

  // const { navigation } = this.props;

  return (
    <Block flex center style={styles.home}>
      {/* <View
        style={{
          backgroundColor: "#3C4DBD",
          width: width,
          height: height * 0.1,
        }}
      >
        <View style={styles.topl}>
          <Image
            source={require("../../assets/Fatima/white.png")}
            style={{ width: 120, height: 50 }}
            width={width > 500 ? width * 0.3 : width * 0.35}
            height={width > 500 ? height * 0.06 : height * 0.05}
          />
        </View>
      </View> */}
      {renderArticles()}
      <Block
        style={{
          height: "8%",
          backgroundColor: "#F2F8FF",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          borderColor: "lightgray",
          borderWidth: 1,
          marginBottom: "2%",
          alignItems: "center",
          // paddingLeft: "1%",
        }}
      >
        {user != undefined ? null : (
          <Pressable
            style={{ width: "14%" }}
            onPress={() => {
              navigation.navigate("Onboarding");
            }}
          >
            <Ionicons name="home-outline" size={40} />
          </Pressable>
        )}

        <Pressable
          style={{ width: "14%", marginRight: "7%", marginLeft: "7%" }}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <MaterialCommunityIcons
            name="heart-plus-outline"
            color="black"
            size={40}
          />
        </Pressable>

        <Pressable
          style={{ width: "14%" }}
          onPress={() => navigation.navigate("AboutUs")}
        >
          <Feather name="info" size={40} />
        </Pressable>

        {user != undefined ? (
          <Pressable
            style={{ width: "14%" }}
            onPress={() => navigation.navigate("Profile")}
          >
            <AntDesign name="user" size={40} />
          </Pressable>
        ) : null}
      </Block>
    </Block>
  );
};

export default DonorHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "50%",
    padding: 10,
    fontSize: 20,
    borderRadius: 10,
    backgroundColor: "green",
    marginVertical: 30,
    alignSelf: "center",
  },
  text: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: "bold",
    letterSpacing: 0.25,
    color: "white",
    alignSelf: "center",
  },
  home: {
    width: width,
    backgroundColor: "#FFF",
  },
  articles: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
  },
  request: {
    backgroundColor: "#DCD0FF",
    borderRadius: 20,
    height: 100,
    marginVertical: 5,
  },
  header: {
    // flex: 1,
    width: width * 0.95,
    height: height * 0.18,
    backgroundColor: "#F2F8FF",
    alignSelf: "center",
    // borderWidth: 1,
    flexDirection: "row",
    // borderColor: "red",
  },
  avatar: {
    width: 80,
    height: 80,
    margin: "4%",
    marginTop: "30%",
    borderRadius: 30,
    // borderWidth: 2,
  },

  // lilac button
  button: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: "#3C4DBD",
    position: "relative",
    overflow: "hidden",
    width: width * 0.7,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 30,
    // marginLeft: "40%",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  sign: {
    justifyContent: "flex-end",
    // borderColor: 'green',
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    // borderWidth: 1,
    width: width * 0.3,
    alignSelf: "flex-end",
    marginRight: 10,
  },
  backButton: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    margin: 20,
    position: "absolute",
    top: 0,
    left: 0,
  },
  topl: {
    width: width,
    padding: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#3C4DBD",
    marginTop: "6%",
  },
});
