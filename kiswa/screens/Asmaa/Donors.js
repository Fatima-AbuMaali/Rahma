//galio
import { Block, Text, theme } from "galio-framework";
import {
  Dimensions,
  Image,
  ImageBackground,
  PixelRatio,
  Platform,
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
const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;

const Donors = ({ navigation }) => {
  const [deviceType, setDeviceType] = useState("");
  const [hover, setHover] = useState(false);

  useEffect(() => {
    setFlag(false);
    readAllWhere();
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
  }, []);

  const [donors, setDonors] = useState([]);
  const [alldonors, setAllDonors] = useState([]);

  const readAllWhere = async () => {
    const collectionRef = collection(db, "donors");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setDonors(querySnapshot.docs.map((doc) => doc.data()));
      setAllDonors(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  };
  const [flag, setFlag] = useState(false);

  const [donations, setDonations] = useState([]);

  const readOne = async (user) => {
    setHover(user);
    const q = query(
      collection(db, "donorDonation"),
      where("email", "==", user)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setDonations(querySnapshot.docs.map((doc) => doc.data()));
      //  setFamilies(querySnapshot.docs.map((doc) => doc.data()));
      setFlag(true);
    });

    return () => unsubscribe();
  };

  const renderCards = () => {
    return (
      <Block
        // height={height * 0.6}
        style={{ borderWidth: 1, height: height * 0.6, marginTop: "5%" }}
      >
        <ScrollView>
          <Text
            style={{
              fontSize: deviceType == "mobile" ? 20 : 30,
              marginLeft: "5%",
              marginTop: "3%",
            }}
          >
            Donations
          </Text>
          <View
            style={{ flexDirection: "row", flexWrap: "wrap", width: width }}
          >
            {/* <ScrollView> */}
            {donations &&
              donations.map((item) => (
                <View style={styles.notificationBox} key={item.trackId}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: "2%",
                      paddingVertical: "1%",
                    }}
                  >
                    <Text style={styles.description}>Picked </Text>
                    {/* <Text style={styles.description}>{item.dateTime}</Text> */}
                  </View>

                  <View
                    style={{
                      borderWidth: 0.6,
                      width: width > 550 ? width * 0.43 : width * 0.8,
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
                    {item.status == "pending" ? (
                      <Image
                        style={styles.icon}
                        source={require("../../assets/Asmaa/pendingDon.png")}
                      />
                    ) : (
                      <Image
                        style={styles.icon}
                        source={require("../../assets/Asmaa/picked.png")}
                      />
                    )}

                    <View
                      style={{
                        width: "67%",
                        // borderWidth: 1,
                      }}
                    >
                      <View
                        style={{
                          // flexDirection: "row",
                          width: "120%",
                          // borderWidth: 1,
                          padding: "1%",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* <MaterialIcons name="location-pin" size={25} />
                        <Text style={styles.description}>{item.location}</Text>
                        <Text style={styles.description}>{item.location}</Text> */}
                        <Text style={styles.description}>{item.dateSlot}</Text>
                        <Text style={styles.description}>{item.timeSlot}</Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          width: "75%",
                          // borderWidth: 1,
                          justifyContent: "space-between",
                        }}
                      >
                        {/* <MaterialIcons name="date-range" size={25} /> */}
                        {/* <Text style={styles.description}>
                          {item.date} -{item.time}
                        </Text> */}
                      </View>
                    </View>
                  </View>
                </View>
              ))}
          </View>
        </ScrollView>
      </Block>
    );
  };

  // >>>>>>>>>>>>>> Search functions <<<<<<<<<<<<<<
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value) => {
    console.log("donors", alldonors);
    setSearchQuery(value);
    if (value.length === 0) {
      setDonors(alldonors);
    }

    const filteredData = alldonors.filter(
      (item) =>
        item.userName &&
        item.userName.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredData.length === 0) {
      setDonors([]);
    } else {
      setDonors(filteredData);
    }
  };

  return (
    <DataTable style={{ height: 100 }}>
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
            Donors
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
          Name
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
          {donors &&
            donors.map((x) => (
              <DataTable.Row
                key={x.email}
                onPress={() => readOne(x.email)}
                style={{
                  width: "90%",
                  // height: "12%",
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
                <DataTable.Cell numeric textStyle={{ fontSize: normalize(25) }}>
                  {x.phone}
                </DataTable.Cell>
              </DataTable.Row>
            ))}
        </ScrollView>
      </View>

      {flag && donations.length == 0 ? (
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
              color: "#5e1e7f",
            }}
          >
            No Donations Yet
          </Text>
        </View>
      ) : flag && donations.length != 0 ? (
        renderCards()
      ) : null}
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
  notificationList: {
    marginTop: 20,
    padding: 10,
  },
  // notificationBox: {
  //   paddingTop: 10,
  //   paddingBottom: 10,
  //   marginTop: 5,
  //   backgroundColor: "#FFFFFF",
  //   flexDirection: "row",
  //   borderRadius: 10,
  // },
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
    width: width > 550 ? width * 0.43 : width * 0.8,
    // padding: "5%",
    // paddingTop: "1%",
    marginTop: "2%",
    marginBottom: "3%",
    marginLeft: width > 550 ? "3%" : "8%",
    // marginHorizontal: width < 550 ? "5%" : 0,
    backgroundColor: "#E9F2FA",
    // flexDirection: "row",
    borderRadius: 25,
    borderWidth: 0.3,
  },
  icon: {
    width: 70,
    height: 70,
  },
  description: {
    fontSize: width > 500 ? normalize(20) : normalize(26),
    // color: "#3498db",
    marginLeft: "3%",
    // textAlign: "center",
  },
});

export default Donors;
