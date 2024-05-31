import {
  StyleSheet,
  View,
  Dimensions,
  Platform,
  PixelRatio,
  Image,
  Pressable,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { DataTable } from "react-native-paper";
import { theme } from "galio-framework";
import Dashboard from "./Dashboard";
import { Tab, TabView } from "@rneui/themed";

//FireBase
import { auth } from "../../config";
import {
  doc,
  query,
  getDocs,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import { db } from "../../config";
import { signOut } from "firebase/auth";

//argon
import { Images, argonTheme, articles } from "../../constants";
import { Card, Header } from "../../components";
import {
  FontAwesome5,
  FontAwesome,
  MaterialCommunityIcons,
} from "react-native-vector-icons";
import ArButton from "../../components/Button";
import { Dropdown } from "react-native-element-dropdown";

import { Button, Block, Checkbox, Text, NavBar, Icon } from "galio-framework";

//Pages
import Drivers from "./Drivers";
import Families from "./Families";
import Clerks from "./Clerks";
import Inventory from "./Inventory";
import Donors from "./Donors";
import FamiliesCards from "./FamiliesCards";
import InventoryTable from "./InventoryTable";
import Feedback from "./FeedbackAdmin";

const { width, height } = Dimensions.get("screen");
const scale = width / 830;
export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

const AdminHome = ({ route, navigation }) => {
  const invType = route.params;
  // console.log(p);
  const [deviceType, setDeviceType] = useState("");
  const [users, setUsers] = useState("graph");
  const [inv, setInv] = useState("graph");

  useEffect(() => {
    invType ? setInv(invType) : null;
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
  }, [invType]);

  const onSignOut = () => {
    signOut(auth)
      .then(() => navigation.navigate("Login"))
      .catch((error) => console.log("Error logging out: ", error));
  };

  const [index, setIndex] = useState(0);

  return (
    <View style={{ backgroundColor: "#3C4DBD" }}>
      <View style={styles.top}>
        <Image
          source={require("../../assets/Fatima/white.png")}
          style={{ width: normalize(250), height: normalize(80) }}
        />
        <Pressable onPress={onSignOut}>
          <MaterialCommunityIcons
            name="logout"
            size={normalize(50)}
            color="white"
            style={{ marginVertical: "2%", marginTop: "28%" }}
          />
        </Pressable>
      </View>

      <Block
        style={{
          backgroundColor: "white",
          paddingTop: "1%",
        }}
      >
        <Tab
          // scrollable={true}
          value={index}
          onChange={setIndex}
          indicatorStyle={{
            backgroundColor: "#fff",
            height: 0.2,
          }}
        >
          <Tab.Item
            // scrollable={true}
            onChange={setIndex}
            value={0}
            title="Men"
            style={{
              borderBottomColor: index == 0 ? "#F17A4F" : "white",
              borderBottomWidth: 5,
            }}
          >
            <FontAwesome
              name="home"
              size={deviceType == "mobile" ? 30 : 45}
              color="#F7865E"
            />
            <Text style={{ fontSize: normalize(19) }}>Home</Text>
          </Tab.Item>
          <Tab.Item
            scrollable={true}
            onChange={setIndex}
            value={1}
            title="Women"
            style={{
              borderBottomColor: index == 1 ? "#F17A4F" : "white",
              borderBottomWidth: 5,
            }}
          >
            <FontAwesome
              color="#F7865E"
              name="users"
              size={deviceType == "mobile" ? 30 : 45}
            />
            <Text style={{ fontSize: normalize(19) }}>Users</Text>
          </Tab.Item>
          <Tab.Item
            scrollable={false}
            onChange={setIndex}
            value={2}
            title="Boys"
            style={{
              borderBottomColor: index == 2 ? "#F17A4F" : "white",
              borderBottomWidth: 5,
            }}
          >
            <FontAwesome5
              color="#F7865E"
              name="user-tie"
              size={deviceType == "mobile" ? 30 : 45}
            />
            <Text style={{ fontSize: normalize(19) }}>Workers</Text>
          </Tab.Item>
          <Tab.Item
            scrollable={false}
            onChange={setIndex}
            value={3}
            title="Girls"
            style={{
              borderBottomColor: index == 3 ? "#F17A4F" : "white",
              borderBottomWidth: 5,
            }}
          >
            <FontAwesome5
              color="#F7865E"
              name="warehouse"
              size={deviceType == "mobile" ? 30 : 45}
            />
            <Text style={{ fontSize: normalize(19) }}>Inventory</Text>
          </Tab.Item>
        </Tab>
        {/* </Block> */}

        <TabView
          disableSwipe
          scrollable={true}
          disableTransition
          value={index}
          onChange={setIndex}
        >
          {/*--------- Dashboard -------------*/}
          <TabView.Item scrollable={true} style={styles.comp}>
            {/* <Text style={{fontSize: normalize(25)}}>Dashboard</Text> */}
            <Dashboard />
          </TabView.Item>

          {/*--------- Families -------------*/}
          <TabView.Item scrollable={true} style={styles.comp}>
            <View style={styles.board}>
              <View
                style={{
                  // width: width * 0.,
                  // borderWidth: 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  // marginHorizontal: "6%",
                  marginTop: "5%",
                }}
              >
                <Button
                  style={{ backgroundColor: "#1a1f87" }}
                  size="small"
                  onPress={() => setUsers("families")}
                >
                  <Text style={{ fontSize: normalize(30), color: "#FFF" }}>
                    Receviers
                  </Text>
                </Button>
                <Button
                  style={{ backgroundColor: "#1a1f87" }}
                  size="small"
                  onPress={() => setUsers("donors")}
                >
                  <Text style={{ fontSize: normalize(30), color: "#FFF" }}>
                    Donors
                  </Text>
                </Button>
                <Button
                  style={{ backgroundColor: "#1a1f87" }}
                  size="small"
                  onPress={() => setUsers("feedback")}
                >
                  <Text style={{ fontSize: normalize(30), color: "#FFF" }}>
                    Feedback
                  </Text>
                </Button>
              </View>

              {/* <Families navigation={navigation} /> */}
              {users == "feedback" ? (
                <Feedback navigation={navigation} />
              ) : users == "donors" ? (
                <Donors navigation={navigation} />
              ) : (
                // <FamiliesCards navigation={navigation} />
                <Families navigation={navigation} />
              )}
              {/* <FamiliesCards navigation={navigation} /> */}
            </View>
          </TabView.Item>
          {/*--------- Drivers -------------*/}
          <TabView.Item disableTransition style={styles.comp}>
            <View style={styles.board}>
              <View
                style={{
                  width: width * 0.5,
                  // borderWidth: 2,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginHorizontal: "6%",
                  marginTop: "5%",
                }}
              >
                <Button
                  style={{ backgroundColor: "#1a1f87" }}
                  onPress={() => setUsers("drivers")}
                >
                  <Text style={{ fontSize: normalize(30), color: "#FFF" }}>
                    Drivers
                  </Text>
                </Button>
                <Button
                  style={{ backgroundColor: "#1a1f87" }}
                  onPress={() => setUsers("clerks")}
                >
                  <Text style={{ fontSize: normalize(30), color: "#FFF" }}>
                    Inventory Workers
                  </Text>
                </Button>
              </View>
              {users == "drivers" ? (
                <Drivers navigation={navigation} />
              ) : (
                <Clerks navigation={navigation} />
              )}
            </View>
          </TabView.Item>

          {/*--------- Donors -------------*/}
          <TabView.Item disableTransition style={styles.comp}>
            <View style={styles.board}>
              {invType == "graph" ? (
                <View>
                  <Inventory navigation={navigation} />
                </View>
              ) : (
                <InventoryTable navigation={navigation} />
              )}
            </View>
          </TabView.Item>
        </TabView>
      </Block>
    </View>
  );
};

const styles = StyleSheet.create({
  top: {
    marginTop: width > 500 ? "1%" : "6%",
    // borderBottomWidth: 5,
    padding: "3%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  nav: {
    width: width * 0.25,
    height: height,
    backgroundColor: "white",
  },
  n: {
    flexDirection: "row",
    height: "8%",
    padding: "5%",
    alignItems: "center",
  },

  head: {
    flexDirection: "row",
    padding: "1%",
    marginTop: "3%",
    width: "90%",
    marginLeft: "3%",
    alignItems: "center",
    // borderWidth:2,
    justifyContent: "space-between",
  },
  comp: {
    width: width,
    height: height,
    backgroundColor: "white",
  },

  //Search --------------------
  icon: {
    width: 0,
    height: 30,
  },
  iconBtnSearch: {
    alignSelf: "center",
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    //flex: 1,
  },
  inputIcon: {
    marginLeft: 15,
    justifyContent: "center",
  },
  //------------------------

  dropdown: {
    margin: "2%",
    height: "5%",
    backgroundColor: "white",
    borderRadius: 12,

    padding: "1.2%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
});

export default AdminHome;
