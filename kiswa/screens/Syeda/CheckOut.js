import React, { useState, useEffect } from "react";

import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  TextInput,
  View,
  Platform,
  PixelRatio,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Alert,
  Pressable,
} from "react-native";
import { Block, Text, theme } from "galio-framework";
import { Dropdown } from "react-native-element-dropdown";
import { Button, Icon, Input } from "../../components";
import { Images, argonTheme } from "../../constants";
import { FontAwesome, Ionicons } from "react-native-vector-icons";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../config";

import {
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  deleteDoc,
  updateDoc,
  deleteField,
  onSnapshot,
  getDocs,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../config";

import * as Location from "expo-location";

const { width, height } = Dimensions.get("screen");
const scale = width / 834;

export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

import { useIsFocused } from "@react-navigation/native";

const CheckOut = ({ route, navigation }) => {
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

  const isFocused = useIsFocused();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  let confirm = route.params.itemsArray;
  let Dzone = route.params.Dzone;

  console.log("confirmCheckout: ", confirm);

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");

  const [locationError, setLocationError] = useState("");

  const [ZoneError, setZoneError] = useState("");
  const [zone, setZone] = useState(zones[0].label);

  const [signedIn, setSignedIn] = useState(false);
  const [flag, setflag] = useState(0);

  const [stat, setStat] = useState("denied");

  let user = auth?.currentUser?.email;

  console.log("user logged in: ", user);

  const [long, setlong] = useState("");
  const [lat, setLat] = useState("");
  const readName = async () => {
    let user = auth?.currentUser?.email;
    console.log("readName");
    const q = query(collection(db, "donors"), where("email", "==", user));
    const docs = await getDocs(q);
    docs.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
      console.log("just phone", doc.data().phone);
      setPhone(doc.data().phone);
      console.log("phone: ", phone);
      setEmail(doc.data().email);
      console.log("email : ", email);
      setLocation(doc.data().location);
      console.log("location: ", location);
      setZone(doc.data().zone);
      setLat(doc.data().location.coords.latitude);
      setlong(doc.data().location.coords.longitude);
      console.log(doc.data().location.coords.longitude);
    });
  };
  const [drivers, setDrivers] = useState([]);

  const readDriver = async () => {
    // alert(Dzone);
    // alert(Dzone);
    const q = query(collection(db, "drivers"), where("zone", "==", Dzone));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setDrivers(querySnapshot.docs.map((doc) => doc.data().email));
      console.log("ddd", drivers[0]);
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    // alert(user);
    if (user != undefined) {
      readName();
      readDriver();
    }
  }, []);

  const weekday = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const donate = async () => {
    const day = new Date().getDay();
    let trackId = Math.floor(Math.random() * 10000);
    //Alert.alert("working")
    const docRef = await addDoc(collection(db, "donorDonation"), {
      day: weekday[day],
      phone: phone,
      email: email,
      location: location,
      zone: zone,
      // type: route.params.type,
      // amount: route.params.amount,
      timeSlot: route.params.time,
      dateSlot: route.params.date,
      trackId: trackId,
      donatedItems: confirm,
      long: long,
      lat: lat,
    });
    console.log("Document written with ID: ", docRef.id);
    navigation.navigate("Feedback");

    if (user != undefined) {
      //Asma: I added this
      const docRefDriver = await addDoc(
        collection(db, "drivers", drivers[0], "orders"),
        {
          phone: phone,
          userId: email,
          location: "khor",
          timeSlot: route.params.time,
          dateSlot: route.params.date,
          trackId: trackId,
          time: route.params.time,
          date: route.params.date,
          trackId: trackId,
          status: "pending",
          type: "pickup",
        }
      );
      console.log("driver orders add ID: ", docRefDriver.id);
      const notiref = await addDoc(
        collection(db, "drivers", drivers[0], "notifications"),
        {
          title: "New Order",
          body: "Deliver order to " + Dzone,
          seen: "false",
        }
      );
      console.log("notification  add ID: ", notiref.id);
    }
    // confirm.map(async (item) => {
    //     console.log(docRef.id)
    //     const docRef2 = await addDoc(collection(db, "donorDonation", docRef.id, "Items"), {
    //         type: item.cloth,
    //         quantity: item.amount,
    //         trackId: trackId
    //     });
    //     console.log("Document written with ID: ", docRef2.id);
    // })

    // navigation.navigate("Feedback");
  };

  const done = async () => {
    let trackId = Math.floor(Math.random() * 10000);
    const docRef = await addDoc(collection(db, "guestDonor"), {
      phone: phone,
      email: email,
      location: location,
      zone: zone,
      // type: route.params.type,
      // amount: route.params.amount,
      timeSlot: route.params.time,
      dateSlot: route.params.date,
      trackId: trackId,
      donatedItems: confirm,
    });
    console.log("Document written with ID: ", docRef.id);

    // confirm.map(async (item) => {
    //     const docRef2 = await addDoc(collection(db, "guestDonor", docRef.id, "Items"), {
    //         type: item.cloth,
    //         quantity: item.amount,
    //         trackId: trackId
    //     });
    //     console.log("Document written with ID: ", docRef2.id);
    // })

    navigation.navigate("Feedback");
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
        Alert.alert("Your location has been recorded.");
        setLocationError("");
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      console.log("currentLocation", currentLocation);
      setLocation(currentLocation);
    };
    getPermissions();
  };

  const validateEmail = (email) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const validation = () => {
    if (!phone || phone.length != 8) {
      setPhoneError("Please enter a valid phone number");
      return;
    } else {
      setPhoneError("");
    }

    if (!email) {
      setEmailError("Please enter an email address");
      return;
    } else {
      setEmailError("");
    }

    if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      return;
    } else {
      setEmailError("");
    }

    if (stat !== "granted") {
      setLocationError("Location");
    } else {
      setLocationError("");
    }

    if (zone !== " All Zones") {
      setZoneError("");
    } else {
      setZoneError("Select Zone");
      return;
    }

    if (
      phone &&
      email &&
      validateEmail &&
      stat === "granted" &&
      zone !== " All Zones"
    ) {
      done();
    }
  };

  return (
    <Block flex middle>
      {/* <ImageBackground
        resizeMode="cover"
        source={require("../../assets/Fatima/back.png")}
        style={{ width, height, zIndex: 1 }}
      >
        <Block safe flex middle> */}
      <SafeAreaView style={styles.registerContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.articles}
        >
          <Block row>
            <Pressable
              style={{ marginHorizontal: "3%" }}
              onPress={() => navigation.navigate("Donate")}
            >
              {/* <Image
                    style={styles.backButton}
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/54/54623.png",
                    }}
                  ></Image> */}
              {/* <Ionicons name="arrow-back" size={40} /> */}
            </Pressable>
          </Block>
          <Text
            style={{
              alignSelf: "center",
              fontSize: normalize(80),
              fontWeight: "bold",
              marginTop: "6%",
            }}
          >
            Checkout
          </Text>

          <Block style={{ marginLeft: "5%" }}>
            <Text style={{ fontSize: normalize(40), margin: "5%" }}>
              <Ionicons
                name="time-outline"
                size={normalize(45)}
                color="#1a1f87"
              />
              {route.params.time}
            </Text>

            <Text style={{ fontSize: normalize(40), margin: "5%" }}>
              <Ionicons
                name="md-today-sharp"
                size={normalize(45)}
                color="#1a1f87"
              />
              {route.params.date}
            </Text>
            <Block
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                height: height * 0.15,
                // borderWidth: 1,
                width: width,
              }}
            >
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator
                indicatorStyle="black"
                bounces
              >
                {route.params.itemsArray.map((item, index) => (
                  <View key={index} style={styles.smallContainer}>
                    <View style={styles.smallSquare}>
                      <Image
                        style={styles.smallImage}
                        source={{ uri: item.icon }}
                      />
                      <Text style={styles.smallText}>{item.cloth}</Text>
                      <Text style={styles.smallText}>x{item.amount}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </Block>
            <Pressable onPress={() => navigation.goBack()}>
              <Text
                style={{
                  fontSize: normalize(40),
                  textAlign: "center",
                  //marginRight: "6%",
                  color: "blue",
                }}
              >
                Edit cart
              </Text>
            </Pressable>
          </Block>

          {user !== undefined ? (
            <View style={styles.container}>
              <Block width={width * 0.8}>
                <TouchableOpacity
                  style={styles.donateButton}
                  onPress={() => donate()}
                >
                  <Text style={styles.donateButtonText}>Donate</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.donateButton, { backgroundColor: "#ba324f" }]}
                  onPress={() => navigation.navigate("Home")}
                >
                  <Text style={styles.donateButtonText}>Cancel</Text>
                </TouchableOpacity>
                {/* <Button
                                                style={styles.createButton}
                                                onPress={validation}
                                            >
                                                <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                                                    DONE
                                                </Text>
                                            </Button> */}
              </Block>
            </View>
          ) : (
            <View style={styles.container}>
              <Text></Text>

              <Text style={styles.error}>{phoneError}</Text>
              <Block width={width * 0.8}>
                <Input
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
              <Text></Text>
              <Text style={styles.error}>{emailError}</Text>
              <Block width={width * 0.8}>
                <Input
                  borderless
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  iconContent={
                    <Icon
                      size={16}
                      color={argonTheme.COLORS.ICON}
                      name="email"
                      family="Entypo"
                      style={styles.inputIcons}
                    />
                  }
                />
              </Block>

              <Block
                style={{
                  flexDirection: "row",
                  width: width * 0.85,
                  justifyContent: "space-between",
                }}
              >
                <Block width={width * 0.2}>
                  <Button
                    small
                    color={stat !== "granted" ? "default" : "success"}
                    style={[styles.createButton, { width: width * 0.08 }]}
                    onPress={getLocation}
                  >
                    {stat != "granted" ? (
                      <Text
                        bold
                        // size={normalize(30)}
                        color={argonTheme.COLORS.WHITE}
                      >
                        Get Location
                      </Text>
                    ) : (
                      <Text
                        bold
                        size={normalize(30)}
                        color={argonTheme.COLORS.WHITE}
                      >
                        Location Done
                      </Text>
                    )}
                  </Button>
                  <Text style={styles.error}>{locationError}</Text>
                </Block>

                <Block width={width * 0.4}>
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
                      setZoneError("");
                    }}
                  ></Dropdown>
                  <Text
                    style={{
                      textAlign: "center",
                      color: "red",
                    }}
                  >
                    {ZoneError}
                  </Text>
                </Block>
              </Block>

              <Block
                width={width * 0.75}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                {/* <Button
                                                style={styles.createButton}
                                                onPress={validation}
                                            >
                                                <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                                                    DONE
                                                </Text>
                                            </Button> */}
                <TouchableOpacity
                  style={[styles.donateButton, { backgroundColor: "#ba324f" }]}
                  onPress={() => navigation.navigate("Home")}
                >
                  <Text style={styles.donateButtonText}>Cancel</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.donateButton}
                  onPress={validation}
                >
                  <Text style={styles.donateButtonText}>Donate</Text>
                </TouchableOpacity>
              </Block>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
      {/* </Block>
      </ImageBackground> */}
    </Block>
  );
};

const styles = StyleSheet.create({
  registerContainer: {
    width: width,
    height: height * 0.9,
    backgroundColor: "#F4F5F7",
    borderRadius: 10,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30,
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    // alignSelf: "center",
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: '#F5FCFF',
  },
  input: {
    width: "80%",
    height: 40,
    margin: 15,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
  },
  error: {
    color: "red",
    textAlign: "center",
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    shadowRadius: 0,
    shadowOpacity: 0,
  },
  backButton: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    margin: 20,
  },
  smallContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  smallSquare: {
    backgroundColor: "white",
    borderRadius: 10,
    width: 110,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    borderColor: "purple",
    borderWidth: 1,
  },
  smallImage: {
    width: 60,
    height: 60,
    //borderRadius: 10,
  },
  smallText: {
    //marginTop: 5,
    fontSize: 14,
    //fontWeight: 'bold',
  },
  inputIcons: {
    marginRight: 12,
  },
  donateButton: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: 80,
    backgroundColor: "#26753F",
    position: "relative",
    overflow: "hidden",
    width: "48%",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 20,
  },
  donateButtonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
  },
  dropdown: {
    marginTop: 9,
    padding: 7,
    borderRadius: 4,
    borderColor: argonTheme.COLORS.INPUT_ERROR,
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
});

export default CheckOut;
