import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Image,
  ImageBackground,
  Platform,
  TextInput,
  Modal,
  TouchableOpacity,
  View,
  Alert,
  Pressable,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../../components";
import { Images, argonTheme } from "../../constants";
import { HeaderHeight } from "../../constants/utils";

import { useIsFocused } from "@react-navigation/native";

import { auth } from "../../config";

import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  deleteDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../../config";

import { Dropdown } from "react-native-element-dropdown";
import * as Location from "expo-location";

import * as ImagePicker from "expo-image-picker";
import {
  Fontisto,
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
  Ionicons,
  Entypo,
} from "react-native-vector-icons";

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

const Profile = ({ route, navigation }) => {
  let user = auth?.currentUser?.email;

  const isFocused = useIsFocused();

  const zones = [
    { label: " All Zones", value: "0" },
    { label: "Duhail", value: "1" },
    { label: "Al Rayyan", value: "2" },
    { label: "Rumeilah", value: "3" },
    { label: "Wadi Al Sail", value: "4" },
    { label: "Al Daayen", value: "5" },
    { label: "Umm Salal", value: "6" },
    { label: "Al Wakra", value: "7" },
    { label: "Al Khor", value: "8" },
    { label: "Al Shamal", value: "9" },
    { label: "Al Shahaniya", value: "10" },
  ];

  const [nickname, setNickname] = useState("");
  const [zone, setZone] = useState("");
  const [number, setNumber] = useState();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  const [location, setLocation] = useState();
  const [stat, setStat] = useState("denied");

  const [image, setImage] = useState("");

  useEffect(() => {
    if (isFocused) {
      readName();
      readDonations();
      read();
    }
  }, [isFocused]);

  const read = async () => {
    let user = auth?.currentUser?.email;
    const docRef = doc(db, "donors", user);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
    } else {
      console.log("No such document!");
    }
  };

  const readName = async () => {
    const q = query(collection(db, "donors"), where("email", "==", user));
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      setNickname(doc.data().userName);
      setZone(doc.data().zone);
      setEmail(doc.data().email);
      setPhone(doc.data().phone);
      setLocation(doc.data().location);
    });
  };

  //count no. of donations
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

  const getLocation = () => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setStat(status);
      console.log("stat... ", stat);
      console.log(status);
      if (status !== "granted") {
        console.log("Please grant location permissions");
        Alert.alert("Please grant location permissions.");
        return;
      } else {
        console.log("permitted");
        Alert.alert("Your new location has been recorded.");
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      console.log(currentLocation);
      setLocation(currentLocation);
    };
    getPermissions();
  };

  const update = async () => {
    let user = auth?.currentUser?.email;
    const docRef = doc(db, "donors", user);
    await setDoc(
      docRef,
      {
        email: email,
        location: location,
        phone: phone,
        userName: nickname,
        zone: zone,
      },
      { merge: true }
    )
      .then(() => {
        console.log("data updated");
        Alert.alert("You new information has been recorded.");
        navigation.navigate("Home");
      })
      .catch((error) => {
        console.log("ERROR: ", error.message);
      });
    //navigation.navigate('Home')
  };

  return (
    <Block flex style={styles.profile}>
      <Block flex>
        <ImageBackground
          source={require("../../assets/Fatima/back.png")}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, marginTop: "25%" }}
          >
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
                <View style={{ width: 120 }}>
                  <Image
                    style={styles.avatar}
                    source={{
                      uri: "https://vectorified.com/images/generic-avatar-icon-25.jpg",
                    }}
                  ></Image>
                </View>
              </Block>
              <Block style={styles.info}></Block>
              <Block flex>
                <Block middle style={styles.nameInfo}>
                  <Text bold size={28} color="#32325D">
                    {nickname}
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                    {user}
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                    {zone}, Qatar
                  </Text>
                  {number === 0 ? null : number === 1 ? (
                    <Block row>
                      <Text
                        style={{
                          fontSize: 15,
                          alignSelf: "center",
                          marginTop: 15,
                        }}
                      >
                        Proud Donor of 1 Donation
                      </Text>
                      <Image
                        style={{
                          width: 25,
                          height: 25,
                          marginLeft: 12,
                          marginTop: 10,
                        }}
                        source={{
                          uri: "https://cdn-icons-png.flaticon.com/512/9466/9466004.png",
                        }}
                      ></Image>
                    </Block>
                  ) : (
                    <Block row>
                      <Text
                        style={{
                          fontSize: 15,
                          alignSelf: "center",
                          marginTop: 15,
                        }}
                      >
                        Proud Donor of {number} Donations
                      </Text>
                      <Image
                        style={{
                          width: 25,
                          height: 25,
                          marginLeft: 12,
                          marginTop: 10,
                        }}
                        source={{
                          uri: "https://cdn-icons-png.flaticon.com/512/9466/9466004.png",
                        }}
                      ></Image>
                    </Block>
                  )}
                </Block>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate("DonorHistory")}
                >
                  <Text style={styles.buttonText}>View My Donations</Text>
                </TouchableOpacity>
                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                  <Block style={styles.divider} />
                </Block>

                {/* editable fields */}
                <Block style={styles.container}>
                  <Block width={width * 0.8}>
                    <Input
                      style={styles.input}
                      borderless
                      value={nickname}
                      onChangeText={setNickname}
                      autoCapitalize="words"
                      placeholder="Nickname"
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="hat-3"
                          family="ArgonExtra"
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      style={styles.input}
                      borderless
                      value={phone}
                      onChangeText={setPhone}
                      keyboardType="numeric"
                      maxLength={8}
                      placeholder="Phone Number"
                      iconContent={
                        <Icon
                          size={16}
                          color={argonTheme.COLORS.ICON}
                          name="phone"
                          family="Entypo"
                          style={styles.inputIcons}
                        />
                      }
                    />
                  </Block>
                  <Block width={width * 0.35}>
                    <Button
                      color={stat !== "granted" ? "default" : "primary"}
                      style={styles.createButton}
                      onPress={getLocation}
                    >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Change Location
                      </Text>
                    </Button>
                  </Block>
                  <Block width={width * 0.5} style={{ marginBottom: 0 }}>
                    <Dropdown
                      style={styles.dropdown}
                      placeholderStyle={styles.placeholderStyle}
                      selectedTextStyle={styles.selectedTextStyle}
                      data={zones}
                      maxHeight={160}
                      labelField="label"
                      valueField="value"
                      placeholder={zone}
                      value={zone}
                      onChange={(item) => {
                        setZone(item.label);
                      }}
                    ></Dropdown>
                  </Block>

                  <Block width={width * 0.35}>
                    <Button style={styles.createButton} onPress={update}>
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Update Info
                      </Text>
                    </Button>
                  </Block>
                </Block>
              </Block>
            </Block>
          </ScrollView>
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
                // color="#f8a069"
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
                <AntDesign name="user" color="#f8a069" size={40} />
              </Pressable>
            ) : null}
          </Block>
        </ImageBackground>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    flex: 1,
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1,
  },
  profileBackground: {
    width: width,
    height: height / 3,
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 35,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2,
  },
  info: {
    paddingHorizontal: 40,
  },
  avatarContainer: {
    position: "relative",
    marginTop: -50,
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0,
  },
  nameInfo: {
    marginTop: 35,
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure,
  },
  inputIcons: {
    marginRight: 12,
  },
  dropdown: {
    marginVertical: 20,
    padding: 7,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "purple",
    height: 44,
    backgroundColor: "#FFFFFF",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 14,
    color: argonTheme.COLORS.HEADER,
  },
  selectedTextStyle: {
    fontSize: 12,
  },
  input: {
    borderBottomWidth: 1,
    borderColor: "purple",
    margin: 15,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  addImage: {
    width: 30,
    height: 30,
    borderRadius: 100 / 2,
    alignSelf: "flex-end",
  },
  button: {
    padding: 5,
    paddingHorizontal: 30,
    borderRadius: 30,
    backgroundColor: "#3C4DBD",
    position: "relative",
    overflow: "hidden",
    width: width * 0.5,
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
    // marginLeft: "40%",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "bold",
    color: "white",
  },
});

export default Profile;
