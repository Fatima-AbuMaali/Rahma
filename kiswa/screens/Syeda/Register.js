import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  View,
  TextInput,
  Pressable,
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../../components";
import { Images, argonTheme } from "../../constants";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

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

import { auth } from "../../config";

import validator from "validator";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Dropdown } from "react-native-element-dropdown";
import * as Location from "expo-location";
const { width, height } = Dimensions.get("screen");

export default function Register({ navigation }) {
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

  const [userName, setUserName] = useState("");
  const [userNameError, setUserNameError] = useState("");

  const [phoneError, setPhoneError] = useState("");
  const [phone, setPhone] = useState("");

  const [location, setLocation] = useState("");
  const [locationError, setLocationError] = useState("");

  const [ZoneError, setZoneError] = useState("");
  const [zone, setZone] = useState(zones[0].label);

  const [emailErro, setEmailError] = useState("");
  const [email, setEmail] = useState("");

  const [passError, setPassError] = useState("");
  const [password, setPassword] = useState("");

  const [registerError, setRegisteerError] = useState("");

  const [stat, setStat] = useState("denid");

  const handleRegister = () => {
    console.log("in regstr...");
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("registend done");
        alert("Done!, Now log in please");
        navigation.navigate("LoginDonor");
        add();
      })
      .catch((error) => {
        console.log(error.message);
        setRegisteerError("Email is Already in Use, Please Login");
      });
  };

  const add = async () => {
    const docRef = doc(db, "donors", email.toLowerCase());

    await setDoc(docRef, {
      userName: userName,
      phone: phone,
      location: location,
      email: email.toLowerCase(),
      zone: zone,
    })
      .then(() => {
        console.log("data submitted");
      })
      .catch((error) => {
        console.log(error.message);
      });
    //console.log("Document written with ID: ", docRef.id);
  };

  const [valid, setValid] = useState(false);
  const emailValidate = async () => {
    if (validator.isEmail(email)) {
      setEmailError("");
    } else {
      setEmailError("Please Enter a Valid Email");
    }
  };
  const passValidate = async () => {
    if (password.length >= 6) {
      setPassError("");
    } else {
      setPassError("Password Must Be at Least 6 Characters");
    }
  };
  const userNameValidate = async () => {
    if (userName.length != 0) {
      setUserNameError("");
    } else {
      setUserNameError("Please Enter Your User Name");
    }
  };
  const phoneValidate = async () => {
    if (phone.length >= 8) {
      console.log(phone);
      setPhoneError("");
    } else {
      console.log(phone);
      setPhoneError(
        "Phone Number is not Valid, Please Enter a Valid Phone Number"
      );
    }
  };

  const validation = async () => {
    userNameValidate();
    phoneValidate();
    emailValidate();
    passValidate();
    if (zone !== " All Zones") {
      setZoneError("");
    } else {
      setZoneError("Select Zone");
    }
    if (stat === "granted") {
      setLocationError("");
    } else {
      setLocationError("Allow Location");
    }
    console.log(valid);
    if (
      validator.isEmail(email) &&
      password.length >= 5 &&
      userName.length != 0 &&
      phone.length >= 7 &&
      zone !== " All Zones" &&
      stat == "granted"
    ) {
      console.log(stat);
      console.log("validated");
      handleRegister();
    } else {
      console.log("not validated");
    }
  };

  const getLocation = () => {
    const getPermissions = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      setStat(status);
      console.log("stat... ", stat);
      console.log(status);
      if (status !== "granted") {
        console.log("Please grant location permissions");
        return;
      } else {
        console.log("permitted");
        alert("Your location has been recorded.");
        setLocationError("");
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };
    getPermissions();
  };

  return (
    <Block flex middle style={{ backgroundColor: "#3C4DBD" }}>
      <StatusBar hidden />
      {/* <ImageBackground
        source={Images.RegisterBackground}
        style={{ width, height, zIndex: 1 }}
      > */}
      <Block safe flex middle>
        <Block style={styles.registerContainer}>
          <Block flex>
            <Block flex={0.19}>
              <Text
                style={{ padding: 20, color: "blue" }}
                onPress={() => navigation.goBack()}
              >
                Go Back
              </Text>

              <Block flex={0.17} middle>
                <Image
                  source={require("../../assets/Fatima/black.png")}
                  style={{
                    width: width - theme.SIZES.BASE,
                    height: theme.SIZES.BASE * 5,
                    position: "relative",
                    resizeMode: "contain",
                    marginTop: "25%",
                    marginBottom: "10%",
                  }}
                />
              </Block>
            </Block>
            <Block flex center style={{ marginTop: "5%" }}>
              <Text
                style={{
                  justifyContent: "flex-start",
                  alignSelf: "center",
                  fontSize: 18,
                  margin: "2%",
                }}
              >
                Register as Donor
              </Text>
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="padding"
                enabled
              >
                <Block width={width * 0.8} style={{ marginBottom: 10 }}>
                  <Input
                    borderless
                    placeholder="NickName"
                    value={userName}
                    onChangeText={(name) => {
                      setUserName(name);
                      userNameValidate();
                    }}
                    iconContent={
                      <Icon
                        size={16}
                        color={argonTheme.COLORS.ICON}
                        name="user"
                        family="Entypo"
                        style={styles.inputIcons}
                      />
                    }
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    {userNameError}
                  </Text>
                </Block>
                <Block width={width * 0.8} style={{ marginBottom: 10 }}>
                  <Input
                    phone-pad
                    borderless
                    placeholder="Phone Number"
                    value={phone}
                    maxLength={8}
                    onChangeText={(pho) => {
                      setPhone(pho);
                      phoneValidate();
                    }}
                    iconContent={
                      <Icon
                        size={16}
                        color={argonTheme.COLORS.ICON}
                        name="telephone"
                        family="Foundation"
                        style={styles.inputIcons}
                      />
                    }
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    {phoneError}
                  </Text>
                </Block>

                <Block width={width * 0.8} style={{ marginBottom: 10 }}>
                  <Input
                    borderless
                    placeholder="Email"
                    value={email}
                    onChangeText={(em) => {
                      setEmail(em);
                      emailValidate();
                    }}
                    iconContent={
                      <Icon
                        size={16}
                        color={argonTheme.COLORS.ICON}
                        name="ic_mail_24px"
                        family="ArgonExtra"
                        style={styles.inputIcons}
                      />
                    }
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    {emailErro}
                  </Text>
                </Block>
                <Block width={width * 0.8} style={{ marginBottom: 10 }}>
                  <Input
                    password
                    borderless
                    placeholder="Password"
                    value={password}
                    onChangeText={(pass) => {
                      setPassword(pass);
                      passValidate();
                    }}
                    iconContent={
                      <Icon
                        size={16}
                        color={argonTheme.COLORS.ICON}
                        name="padlock-unlocked"
                        family="ArgonExtra"
                        style={styles.inputIcons}
                      />
                    }
                  />
                  <Text
                    style={{
                      textAlign: "center",
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    {passError}
                  </Text>
                </Block>
                <View
                  style={{
                    alignItems: "center",
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Block width={width * 0.35} style={{ marginBottom: 10 }}>
                    <Button
                      color={stat !== "granted" ? "warning" : "success"}
                      style={{ width: width * 0.4 }}
                      onPress={() => {
                        getLocation();
                      }}
                    >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Location
                      </Text>
                    </Button>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "red",
                        fontSize: 12,
                      }}
                    >
                      {locationError}
                    </Text>
                  </Block>
                  <Block width={width * 0.35} style={{ marginBottom: 0 }}>
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
                      // onChange={validation}
                      onChange={(item) => {
                        setZone(item.label);
                        setZoneError("");
                      }}
                    ></Dropdown>
                    <Text
                      style={{
                        textAlign: "center",
                        color: "red",
                        fontSize: 12,
                      }}
                    >
                      {ZoneError}
                    </Text>
                  </Block>
                </View>

                <Block middle>
                  <Button
                    // color="primary"
                    style={styles.createButton}
                    onPress={validation}
                  >
                    <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                      CREATE ACCOUNT
                    </Text>
                  </Button>
                  <Text
                    style={{
                      textAlign: "center",
                      color: "red",
                      fontSize: 12,
                    }}
                  >
                    {registerError}
                  </Text>
                </Block>
              </KeyboardAvoidingView>
            </Block>
          </Block>
        </Block>
      </Block>
      {/* </ImageBackground> */}
    </Block>
  );
}

const styles = StyleSheet.create({
  registerContainer: {
    width: width * 0.9,
    height: height * 0.875,
    backgroundColor: "#F4F5F7",
    borderRadius: 4,
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
  socialConnect: {
    backgroundColor: argonTheme.COLORS.WHITE,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderColor: "#8898AA",
  },
  socialButtons: {
    width: 120,
    height: 40,
    backgroundColor: "#fff",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  socialTextButtons: {
    color: argonTheme.COLORS.PRIMARY,
    fontWeight: "800",
    fontSize: 14,
  },
  inputIcons: {
    marginRight: 12,
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30,
  },
  createButton: {
    width: width * 0.4,
    // marginTop: 25,
    backgroundColor: "#1a1f87",
  },
  dropdown: {
    marginBottom: 10,
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
    // margin: 16,
    // height: 50,
    // backgroundColor: "white",
    // borderRadius: 12,
    // padding: 12,
    // shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.2,
    // shadowRadius: 1.41,

    // elevation: 2,
  },
  placeholderStyle: {
    fontSize: 14,
    color: argonTheme.COLORS.HEADER,
  },
  selectedTextStyle: {
    fontSize: 12,
  },
});
