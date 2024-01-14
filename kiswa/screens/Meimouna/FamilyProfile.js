import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  Dimensions,
} from "react-native";
import React from "react";
import { Avatar } from "@rneui/themed";
import {
  Fontisto,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  Entypo,
  Ionicons,
  EvilIcons,
  Feather,
} from "react-native-vector-icons";
import { TextInput } from "react-native-paper";
import { Dropdown } from "react-native-element-dropdown";
import { Checkbox, theme, NavBar, Icon } from "galio-framework";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "../../config";
import { useEffect, useState } from "react";
import { Badge, Button } from "react-native-paper";
import { Block } from "galio-framework";
import * as Location from "expo-location";
const { width } = Dimensions.get("screen");
import { normalize } from "../Syeda/Home";

export default function FamilyProfile({ route, navigation }) {
  const id = route.params;
  // const [userinforr, setUserinforr] = useState([]);
  console.log("id..", id);

  const [phonenum, setPhoneNum] = useState("");
  const [userName, setUserName] = useState("");
  const [zone, setZone] = useState("");
  const [lat, setLat] = useState("");
  const [log, setLog] = useState("");
  const [location, setLocation] = useState("");
  useEffect(() => {
    getFamily();
  }, [id]);

  const getFamily = async () => {
    console.log(id);
    const docRef = doc(db, "families", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPhoneNum(docSnap.data().phone);
      setZone(docSnap.data().zone);
      setUserName(docSnap.data().userName);
      // setLat(docSnap.data().location.coords.latitude);
      // setLog(docSnap.data().location.coords.longitude);
    } else {
      console.log("No such document!");
    }
  };

  console.log(lat);

  const [modalVisible, setModalVisible] = useState(false);
  const zones = [
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
  const [stat, setStat] = useState("denid");
  const update = async () => {
    const docRef = doc(db, "families", id);
    await setDoc(
      docRef,
      { userName: userName, zone: zone, phone: phonenum, location: location },
      { merge: true }
    )
      .then(() => {
        console.log("data updated");
        setModalVisible(!modalVisible);
        //read();
      })
      .catch((error) => {
        console.log(error.message);
      });
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
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);
    };
    getPermissions();
  };
  const [phoneError, setPhoneError] = useState("");
  const [nameError, setNameError] = useState("");
  const validation = async () => {
    if (phonenum.length === 8) {
      setPhoneError("");
    } else {
      setPhoneError("Number is not Valid, Please Enter 8 Digit Number");
    }
    if (userName.length != 0) {
      setNameError("");
    } else {
      setNameError("please Enter User Name");
    }

    if (phonenum.length === 8 && userName.length != 0) {
      console.log("okay");
      update();
    }
  };

  const onSignOut = () => {
    signOut(auth)
      .then(() => navigation.navigate("Onboarding"))
      .catch((error) => console.log("Error logging out: ", error));
  };
  const renderArticles = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#FFF9FF",
          height: "90%",
          marginTop: "5%",
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            alignContent: "center",
            alignSelf: "center",
            alignItems: "center",
          }}
        >
          <View style={styles.header}>
            <NavBar
              title="Profile"
              right={
                <View style={{ marginRight: 0 }}>
                  {/* <Entypo
                    name="log-out"
                    color="#F9966B"
                    size={normalize(30)}
                    onPress={() => onSignOut()}
                    style={{ marginLeft: "25%" }}
                  /> */}
                  {/* <Text
                    style={{
                      color: "#F9966B",
                      fontSize:normalize(13),
                      fontWeight: "bold",
                    }}
                  >
                    Sign Out
                  </Text> */}
                </View>
              }
              style={{
                height: "30%",
                marginBottom: "2%",
                backgroundColor: "#FFFAFA",
                borderColor: "lightgray",
                borderWidth: 1,
                // marginTop: "1%",
                width: "100%",
              }}
              titleStyle={{
                color: "#4C4AAB",
                fontSize: normalize(24),
                fontWeight: "bold",
              }}
            />

            <View style={styles.headerContent}>
              <Avatar
                rounded
                size="xlarge"
                style={styles.avatar}
                source={require("../../assets/imgs/FamilyUser.png")}
              ></Avatar>
              {/* <Button title="Edit" /> */}
              <Pressable
                onPress={() => {
                  setModalVisible(true);
                }}
                style={{ marginTop: "2%" }}
              >
                <Text
                  style={{
                    fontSize: normalize(18),
                    color: "#F9966B",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Edit Profile
                </Text>
                {/* <Avatar.Accessory size={normalize(25)} /> */}
              </Pressable>
            </View>
          </View>
          <View style={styles.body}>
            <Text></Text>
            <Text style={styles.username}>{id}</Text>
            <Text></Text>
            <View
              style={{
                width: "100%",
                marginLeft: "5%",
                padding: "5%",
              }}
            >
              <View
                style={{ width: "95%", flexDirection: "row", marginLeft: "4%" }}
              >
                <Entypo name="user" color="#1a1f87" size={normalize(29)} />
                <Text
                  style={{
                    marginLeft: "7%",
                    fontSize: normalize(20),
                    marginTop: "1%",
                  }}
                >
                  Name:{"  "}
                  <Text
                    style={{
                      fontSize: normalize(20),
                      marginLeft: "20%",
                      fontWeight: "bold",
                    }}
                  >
                    {userName}
                  </Text>
                </Text>
              </View>
              <Text></Text>
              <Text style={{ color: "#F9966B", marginLeft: "5%" }}>
                _________________________________________
              </Text>
              <Text></Text>
              <View
                style={{ width: "95%", flexDirection: "row", marginLeft: "4%" }}
              >
                <Entypo name="location" color="#1a1f87" size={normalize(29)} />
                <Text
                  style={{
                    margin: "7%",
                    fontSize: normalize(20),
                    marginTop: "1%",
                  }}
                >
                  Zone:{"  "}
                  <Text
                    style={{
                      fontSize: normalize(20),
                      marginLeft: "20%",
                      fontWeight: "bold",
                    }}
                  >
                    {zone}
                  </Text>
                </Text>
              </View>
              <Text style={{ color: "#F9966B", marginLeft: "5%" }}>
                _________________________________________
              </Text>
              <Text></Text>
              <View
                style={{ width: "95%", flexDirection: "row", marginLeft: "4%" }}
              >
                <Entypo
                  name="old-mobile"
                  color="#1a1f87"
                  size={normalize(29)}
                />
                <Text
                  style={{
                    margin: "7%",
                    fontSize: normalize(20),
                    marginTop: "1%",
                  }}
                >
                  Number:{"  "}
                  <Text
                    style={{
                      fontSize: normalize(20),
                      marginLeft: "20%",
                      fontWeight: "bold",
                    }}
                  >
                    {phonenum}
                  </Text>
                </Text>
              </View>

              <Text style={{ color: "#F9966B", marginLeft: "5%" }}>
                _________________________________________
              </Text>
              <Text></Text>
            </View>
          </View>
        </View>

        {/* ......edit profile...... */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View>
            <View style={styles.modalView}>
              <Block style={styles.modalblock}>
                <Pressable onPress={() => setModalVisible(!modalVisible)}>
                  <Entypo
                    name="chevron-with-circle-left"
                    color="#1a1f92"
                    size={normalize(40)}
                  />
                </Pressable>
                <View>
                  <Text style={{ color: "gray", textAlign: "right" }}>
                    Profile,
                  </Text>
                  <Text
                    style={{
                      fontSize: normalize(18),
                      fontWeight: "bold",
                      textAlign: "right",
                    }}
                  >
                    Edit Details
                  </Text>
                </View>
              </Block>

              <Block style={styles.modalblock2}>
                <Text style={styles.modalText}>{id}</Text>

                <Block>
                  {/* <Text style={{ fontSize:normalize(16), marginBottom: 10, marginTop: 20 }}>
                  What Color?
                </Text> */}
                  <Text
                    style={{
                      // textAlign: "center",
                      color: "red",
                      fontSize: normalize(14),
                    }}
                  >
                    {phoneError}
                  </Text>
                  <TextInput
                    style={{ backgroundColor: "#CDE5FF" }}
                    label="Phone Number"
                    value={phonenum}
                    onChangeText={(text) => setPhoneNum(text)}
                  />

                  <Text
                    style={{
                      // textAlign: "center",
                      color: "red",
                      fontSize: normalize(14),
                    }}
                  >
                    {nameError}
                  </Text>
                  <TextInput
                    style={{ backgroundColor: "#CDE5FF" }}
                    label="User Name"
                    value={userName}
                    onChangeText={(userName) => setUserName(userName)}
                  />

                  <Text></Text>

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
                  <Text></Text>
                  <Button
                    // color={stat !== "granted" ? "default" : "primary"}
                    style={styles.createButton}
                    onPress={() => {
                      getLocation();
                    }}
                  >
                    <Text bold size={normalize(20)} color="white">
                      New Location
                    </Text>
                  </Button>
                </Block>

                <Pressable
                  style={[styles.button, styles.buttonClose, { marginTop: 40 }]}
                  onPress={() => validation()}
                >
                  <Text style={styles.textStyle}>Save</Text>
                </Pressable>
              </Block>
            </View>
          </View>
        </Modal>
      </View>
    );
  };
  return (
    <Block flex center style={styles.home}>
      {renderArticles()}
      <Block
        style={{
          height: "8%",
          backgroundColor: "#FFFAFA",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          borderColor: "lightgray",
          borderWidth: 1,
          marginBottom: "1%",
          alignItems: "center",
          // paddingLeft: "1%",
        }}
      >
        <Pressable
          style={{ width: "14%" }}
          onPress={() => navigation.navigate("FamilyHome", id)}
        >
          <Entypo name="home" color={"#1a1f87"} size={42} />
        </Pressable>

        <Pressable
          style={{ width: "14%", marginRight: "7%", marginLeft: "7%" }}
          onPress={() => navigation.replace("FamilyRequest", id)}
        >
          <Feather name="plus-circle" color="#1a1f87" size={45} />
        </Pressable>

        <Pressable
          style={{ width: "14%" }}
          onPress={() => navigation.navigate("FamilyProfile", id)}
        >
          <FontAwesome name="user-circle" color="#f8a069" size={40} />
        </Pressable>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  home: {
    width: width,
    // backgroundColor: "#490066",
    height: "100%",
  },
  header: {
    height: "40%",
    backgroundColor: "#FFF9FF",
    marginBottom: "1%",
  },
  headerContent: {
    // padding: 30,
    alignItems: "center",
    height: "69%",
    // backgroundColor: "gray",
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    // borderWidth: 2,
    borderColor: "#fbe5ff",
    marginBottom: 10,
  },
  badge: {
    width: 38,
    height: 38,
    borderRadius: 20,
    justifyContent: "center",
    // backgroundColor: "#fbe5ff",#842DCE
    padding: 10,
  },
  icon: {
    width: 40,
    height: 40,
  },
  title: {
    fontSize: normalize(18),
    color: "#EE82EE",
    marginLeft: 10,
  },
  btn: {
    marginLeft: "auto",
    width: 40,
    height: 40,
  },

  body: {
    backgroundColor: "white",
    borderRadius: 60,
    height: "68%",
    paddingTop: "2%",
    width: "95%",
    marginLeft: "4%",
    borderWidth: 2,
    borderColor: "lightgray",
  },
  box: {
    padding: 5,
    marginBottom: 2,
    width: "95%",
    alignSelf: "center",
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    shadowColor: "black",
    shadowOffset: {
      height: 1,
      width: -2,
    },
    elevation: 1,
  },
  username: {
    // color: "#842DCE",
    fontSize: normalize(22),
    alignSelf: "center",
    //marginLeft: 10,
  },
  modalView: {
    margin: 15,
    marginTop: "15%",
    height: 680,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 35,
    alignItems: "center",
    shadowColor: "#1a1f87",
    // shadowOffset: {
    //   width: 5,
    //   height: 10,
    // },
    shadowOpacity: 3,
    shadowRadius: 10,
    elevation: 10,
    borderColor: "#1a1f87",
    borderWidth: 2,
  },
  modalblock: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 20,
    width: "100%",
    // backgroundColor: "lightgray",
  },
  modalblock2: {
    marginTop: 10,
    marginBottom: 40,
    width: "100%",
    // backgroundColor: "lightgray",
    paddingTop: 20,
    padding: 10,
  },
  modalText: {
    marginBottom: 18,
    textAlign: "center",
    fontSize: normalize(25),
    fontWeight: "bold",
    color: "#1a1f87",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },

  buttonClose: {
    backgroundColor: "#F9966B",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    padding: "2%",
  },
  dropdown: {
    marginBottom: 10,
    padding: 7,
    borderRadius: 4,
    // borderColor: argonTheme.COLORS.INPUT_ERROR,
    height: 60,
    backgroundColor: "#CDE5FF",
    // shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: normalize(14),
    // color: argonTheme.COLORS.HEADER,
  },
  selectedTextStyle: {
    fontSize: normalize(12),
  },
  createButton: {
    width: "100%",
    backgroundColor: "#CDE5FF",
    height: 50,
    justifyContent: "center",
    // marginTop: 25,
  },
});
