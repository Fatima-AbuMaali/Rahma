//galio
import { Block, Text, theme } from "galio-framework";
import {
  Dimensions,
  Image,
  ImageBackground,
  PixelRatio,
  Platform,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
  Table,
} from "react-native";
import { DataTable, Searchbar } from "react-native-paper";
import { Button } from "galio-framework";

//FireBase
import { auth } from "../../config";

import {
  doc,
  query,
  getDocs,
  getDoc,
  addDoc,
  collection,
  where,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config";
//argon
import { Images, argonTheme, articles } from "../../constants";

import { Card, Header } from "../../components";

import { Icon, AntDesign, FontAwesome } from "react-native-vector-icons";
import ArButton from "../../components/Button";
import { deviceName } from "expo-device";

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
const Families = ({ navigation }) => {
  const [deviceType, setDeviceType] = useState("");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setFlag(false);
    readAllWhere();
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
  }, []);

  const [families, setFamilies] = useState([]);
  const [allFamilies, setAllFamilies] = useState([]);

  const readAllWhere = async () => {
    const collectionRef = collection(db, "families");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setAllFamilies(querySnapshot.docs.map((doc) => doc.data()));
      setFamilies(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  };
  const [flag, setFlag] = useState(false);

  const [requests, setRequests] = useState([]);

  const readOne = async (user) => {
    setHover(user);
    const q = query(
      collection(db, "familyRequests"),
      where("familyID", "==", user)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setRequests(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
      //  setFamilies(querySnapshot.docs.map((doc) => doc.data()));
      setFlag(true);
    });

    return () => unsubscribe();
  };

  // >>>>>>>>>>>>>> Search functions <<<<<<<<<<<<<<
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value) => {
    setFlag(false);

    console.log("familiesss", allFamilies);
    setSearchQuery(value);
    if (value.length === 0) {
      setFamilies(allFamilies);
    }

    const filteredData = allFamilies.filter(
      (item) =>
        item.userName &&
        item.userName.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredData.length === 0) {
      setFamilies([]);
    } else {
      setFamilies(filteredData);
    }
  };
  const renderCards = () => {
    return (
      <SafeAreaView style={{ height: 600, width: width }}>
        <Block
          // height={height * 0.6}
          style={{
            borderWidth: 1,
            height: height,
            marginTop: "5%",
          }}
        >
          {/* <ScrollView> */}
          <Text
            style={{
              fontSize: normalize(28),
              marginLeft: "5%",
              marginTop: "3%",
            }}
          >
            Requests
          </Text>
          <View
            style={{
              width: width,
              height: 400,
            }}
          >
            <ScrollView>
              {requests.length > 0
                ? requests.map((item) => (
                    <Pressable
                      style={styles.notificationBox}
                      key={item.id}
                      onPress={() =>
                        navigation.navigate("FamilyCartDetails", {
                          cartId: item.id,
                        })
                      }
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          paddingHorizontal: "2%",
                          paddingVertical: "1%",
                        }}
                      >
                        <Text style={styles.description}>
                          {item.data.status}
                        </Text>
                      </View>

                      <View
                        style={{
                          borderWidth: 0.6,
                          width: width * 0.84,
                          marginBottom: "1%",
                          // borderWidth: 1,
                        }}
                      ></View>
                      <View
                        style={{
                          flexDirection: "row",
                          margin: "5%",
                          marginTop: "2%",
                          // borderWidth: 1,
                          marginBottom: "1%",
                        }}
                      >
                        {item.data.status == "pending" ? (
                          <Image
                            style={styles.icon}
                            source={require("../../assets/Asmaa/pendingDon.png")}
                          />
                        ) : (
                          <Image
                            style={styles.icon}
                            source={require("../../assets/Asmaa/fullfied.png")}
                          />
                        )}

                        <View
                          style={{
                            width: "67%",
                          }}
                        >
                          <View
                            style={{
                              width: "120%",
                              padding: "1%",
                              justifyContent: "space-between",
                            }}
                          >
                            <Text style={styles.description}>
                              {item.data.dateSlot}
                            </Text>
                            <Text style={styles.description}>
                              {item.data.timeSlot}
                            </Text>
                            <Text
                              style={{
                                fontSize: normalize(22),
                                textAlign: "right",
                                color: "#1a1f87",
                                fontWeight: "bold",
                                width:
                                  deviceType == "mobile"
                                    ? width * 0.6
                                    : width * 0.68,
                              }}
                            >
                              View Items
                            </Text>
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              width: "75%",
                              // borderWidth: 1,
                              justifyContent: "space-between",
                            }}
                          ></View>
                        </View>
                      </View>
                    </Pressable>
                  ))
                : null}
            </ScrollView>
          </View>
        </Block>
      </SafeAreaView>
    );
  };

  return (
    <DataTable style={{ height: 100 }}>
      <SafeAreaView style={{ height: 200, width: width }}>
        <Block
          style={[
            styles.head,
            { height: height * 0.08, justifyContent: "space-between" },
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <FontAwesome name="user" size={deviceType == "mobile" ? 30 : 45} />
            <Text
              style={{
                fontSize: deviceType == "mobile" ? 20 : 30,
                marginLeft: "5%",
              }}
            >
              Receviers
            </Text>
          </View>
          <Searchbar
            placeholder={width > 500 ? "Search" : ""}
            onChangeText={handleSearch}
            value={searchQuery}
            style={{
              width: width * 0.38,
              borderRadius: 20,
              height: "77%",
              marginTop: "2%",
              backgroundColor: "#D2E6FA",
            }}
            autoCorrect={false}
          />
        </Block>

        <DataTable.Header
          key={1}
          style={{
            borderTopWidth: 0,
            borderBottomWidth: 2,
            borderColor: "black",
            width: "90%",
            marginLeft: "3%",
            backgroundColor: "white",
          }}
        >
          <DataTable.Title
            textStyle={{
              fontSize: normalize(20),
              fontWeight: "bold",
            }}
          >
            NickName
          </DataTable.Title>
          <DataTable.Title
            textStyle={{
              fontSize: normalize(20),
              fontWeight: "bold",
            }}
          >
            Email
          </DataTable.Title>
          <DataTable.Title
            numeric
            textStyle={{
              fontSize: normalize(20),
              fontWeight: "bold",
            }}
          >
            Phone
          </DataTable.Title>
        </DataTable.Header>
        <View height={flag ? height * 0.2 : height * 0.5}>
          <ScrollView>
            {families.length > 0
              ? families.map((x) => (
                  <DataTable.Row
                    key={x.email}
                    onPress={() => readOne(x.email)}
                    style={{
                      width: "90%",
                      height: "12%",
                      marginLeft: "3%",
                      backgroundColor: hover == x.email ? "#C6E1FC" : "white",
                    }}
                  >
                    <DataTable.Cell textStyle={{ fontSize: normalize(25) }}>
                      {x.userName}
                    </DataTable.Cell>
                    <DataTable.Cell textStyle={{ fontSize: normalize(25) }}>
                      {x.email}
                    </DataTable.Cell>
                    <DataTable.Cell
                      numeric
                      textStyle={{ fontSize: normalize(25) }}
                    >
                      {x.phone}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))
              : null}
          </ScrollView>
        </View>

        {flag && requests.length == 0 ? (
          <View
            style={{
              width: width * 0.9,
              // height: height * 0.5,
              // borderWidth: 2,
              justifyContent: "center",
              marginTop: "6%",
              alignContent: "center",
              textAlign: "center",
            }}
          >
            <Text
              style={{
                textAlign: "center",
                fontSize: normalize(50),
                color: "#1a1f87",
              }}
            >
              No Requests Yet
            </Text>
          </View>
        ) : flag && requests.length != 0 ? (
          renderCards()
        ) : null}
      </SafeAreaView>
    </DataTable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: '#EBEBEB',
    //paddingTop: 50,
    paddingHorizontal: "5%",
    height: 400,
  },

  tabletitle: {
    fontWeight: "bold",
    color: "white",
  },
  head: {
    // flexDirection:"row",
    // borderWidth:1,
    // padding:"1%",
    // justifyContent:"space-between",
    // marginBottom:0

    flexDirection: "row",
    padding: "1%",
    marginTop: "3%",
    width: "90%",
    marginLeft: "3%",
    alignItems: "center",
    // borderWidth:2,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    marginLeft: 20,
    textAlign: "left",
  },
  formContent: {
    flexDirection: "row",
    marginTop: 30,
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderBottomWidth: 1,
    height: 45,
    alignItems: "right",
    width: "50%",

    margin: 5,
  },
  icon: {
    width: 30,
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

  image: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginLeft: 10,
    alignSelf: "center",
  },
  rowTitle: {
    fontSize: width * 0.03,
    //color:"purple",
    fontWeight: "bold",
  },
  rowData: { color: "black", fontSize: width * 0.04 },
  notificationList: {
    marginTop: "1%",
    // padding: "3%",
    // borderWidth: 1,
    backgroundColor: "white",
    flexDirection: "row",
  },
  notificationBox: {
    width: width * 0.84,
    // padding: "5%",
    // paddingTop: "1%",
    marginTop: "2%",
    marginBottom: "3%",
    marginLeft: "5%",
    backgroundColor: "#E9F2FA",
    // flexDirection: "row",
    borderRadius: 25,
    borderWidth: 0.3,
  },
  icon: {
    width: width > 500 ? 70 : 50,
    height: width > 500 ? 70 : 50,
  },
  description: {
    fontSize: normalize(25),
    // color: "#3498db",
    marginLeft: "3%",
    // textAlign: "center",
  },
});

export default Families;
