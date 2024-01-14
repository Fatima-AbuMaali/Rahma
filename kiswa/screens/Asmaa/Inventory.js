//galio
import { Block, Text, theme } from "galio-framework";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
  Table,
  SafeAreaView,
  Pressable,
  Platform,
  PixelRatio,
} from "react-native";
import React, { useEffect, useState } from "react";

import {
  BarChart,
  PieChart,
  StackedBarChart,
  LineChart,
  ProgressChart,
} from "react-native-chart-kit";
import { DataTable } from "react-native-paper";
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
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config";
//argon
import { Images, argonTheme, articles } from "../../constants";

import { Card, Header } from "../../components";

import {
  Icon,
  Feather,
  FontAwesome,
  AntDesign,
} from "react-native-vector-icons";
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

const Inventory = ({ navigation }) => {
  const [deviceType, setDeviceType] = useState("");
  const [Total, setTotal] = useState(0);

  useEffect(() => {
    readItems();
    readRequests();
    readDonations();
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
  }, []);

  const [inventory, setInventory] = useState([]);
  const [allinventory, setAllInventory] = useState([]);
  const [blouse, setBlouse] = useState([]);

  const readItems = async () => {
    const collectionRef = collection(db, "inventory");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      //  console.log("snapshot");
      setInventory(querySnapshot.docs.map((doc) => doc.data()));

      //  setTotal(inventory.length)
    });

    return () => unsubscribe();
  };

  const data = {
    labels: ["Sunday", "Monday", "Tuesday", "Wednsday", "Thursday", "Friday"],
    datasets: [
      {
        data: [12, 14, 13, 17, 20, 14],
        color: (opacity = 1) => `rgba(121, 203, 128, ${opacity})`, // optional
        strokeWidth: 2, // optional
      },
    ],
    legend: ["Donation Days"], // optional
  };

  const [donLen, setDonLen] = useState(0);
  const [ReqLen, setReqLen] = useState(0);

  const [requests, setRequests] = useState([]);
  const readRequests = async () => {
    const collectionRef = collection(db, "familyRequests");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setRequests(querySnapshot.docs.map((doc) => doc.data()));
      setReqLen(requests.length);
      console.log(ReqLen);
    });

    return () => unsubscribe();
  };
  const [donations, setDonations] = useState([]);
  const readDonations = async () => {
    const collectionRef = collection(db, "donorDonation");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setDonations(querySnapshot.docs.map((doc) => doc.data()));
      setDonLen(donations.length);
    });

    return () => unsubscribe();
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        height: deviceType == "mobile" ? 700 : 900,
      }}
    >
      <ScrollView>
        <Block>
          <View
            style={{
              width: width,
              height: height * 0.033,
              backgroundColor: "#1d2f6f",
              marginTop: "2%",
            }}
          >
            <Text style={styles.title}>Statistics</Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              // borderWidth: 1,
              padding: "1%",
              width: width * 0.99,
              justifyContent: "space-between",
            }}
          >
            <View style={{ flexDirection: "row" }}>
              <Image
                style={styles.icon}
                source={require("../../assets/Asmaa/totalItems.png")}
              />
              <Text
                style={{
                  fontSize: deviceType == "mobile" ? 15 : 18,
                  marginLeft: "3%",
                  marginTop: "3%",
                }}
              >
                Total items ={inventory.length}
              </Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate("AdminHome", "table")}
            >
              <AntDesign
                name="table"
                color="green"
                size={deviceType == "mobile" ? 40 : 45}
              />
            </Pressable>
          </View>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
            <View
              style={{
                flexDirection: "row",
                // flex: 1,
                // borderWidth: 1,
                height: height * 0.3,
                width: width > 500 ? width * 1.7 : width * 2.7,
              }}
            >
              <View
                style={[
                  styles.status,
                  { width: deviceType == "mobile" ? width * 0.8 : width * 0.5 },
                ]}
              >
                <Text style={styles.pieTitle}>Quality</Text>
                <View
                  style={{
                    borderWidth: 1,
                    width: "100%",
                  }}
                ></View>
                <PieChart
                  data={[
                    {
                      name: "Good",
                      population: inventory.filter(
                        (item) => item.quality === "Good"
                      ).length,
                      color: "#4ba3c3",
                      legendFontColor: "#7F7F7F",
                      legendFontSize: 15,
                    },
                    {
                      name: "New",
                      population: inventory.filter(
                        (item) => item.quality === "New"
                      ).length,
                      color: "#76c893",
                      legendFontColor: "#7F7F7F",
                      legendFontSize: 15,
                    },
                    {
                      name: "Bad",
                      population: inventory.filter(
                        (item) => item.quality === "Bad"
                      ).length,
                      color: "#f26a4f",
                      legendFontColor: "#727F7F",
                      legendFontSize: 15,
                    },
                  ]}
                  width={deviceType == "mobile" ? width * 0.8 : width * 0.5}
                  height={height * 0.2}
                  chartConfig={{
                    backgroundColor: "#1cc910",
                    backgroundGradientFrom: "#eff3ff",
                    backgroundGradientTo: "#efefef",
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute //for the absolute number remove if you want percentage
                />
              </View>
              <View
                style={[
                  styles.status,
                  { width: deviceType == "mobile" ? width * 0.8 : width * 0.5 },
                ]}
              >
                <Text style={styles.pieTitle}>Ages</Text>
                <View
                  style={{
                    borderWidth: 1,
                    width: "100%",
                  }}
                ></View>
                <PieChart
                  data={[
                    {
                      name: "Kids",
                      population: inventory.filter(
                        (item) => item.age === "Kids"
                      ).length,
                      color: "#aed9e0",
                      legendFontColor: "#7F7F7F",
                      legendFontSize: 15,
                    },
                    {
                      name: "Adults",
                      population: inventory.filter(
                        (item) => item.age === "Adults"
                      ).length,
                      color: "#ffa69e",
                      legendFontColor: "#7F7F7F",
                      legendFontSize: 15,
                    },
                    {
                      name: "Baby",
                      population: inventory.filter(
                        (item) => item.age === "Baby"
                      ).length,
                      color: "#b8f2e6",
                      legendFontColor: "#727F7F",
                      legendFontSize: 15,
                    },
                    {
                      name: "Teenagers",
                      population: inventory.filter(
                        (item) => item.age === "Teenagers"
                      ).length,
                      color: "#d4e09b",
                      legendFontColor: "#727F7F",
                      legendFontSize: 15,
                    },
                  ]}
                  width={deviceType == "mobile" ? width * 0.8 : width * 0.5}
                  height={height * 0.2}
                  chartConfig={{
                    backgroundColor: "#1cc910",
                    backgroundGradientFrom: "#eff3ff",
                    backgroundGradientTo: "#efefef",
                    // decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(2, 2, 10, ${opacity})`,
                    style: {
                      // borderRadius: 16,
                      color: "red",
                    },
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="30"
                  absolute //for the absolute number remove if you want percentage
                />
              </View>

              <View
                style={[
                  styles.status,
                  { width: deviceType == "mobile" ? width * 0.8 : width * 0.5 },
                ]}
              >
                <Text style={styles.pieTitle}>Type</Text>
                <View
                  style={{
                    borderWidth: 1,
                    width: "100%",
                  }}
                ></View>
                <PieChart
                  data={[
                    {
                      name: "T-Shirt",
                      population: inventory.filter(
                        (item) => item.type === "T-Shirt"
                      ).length,
                      color: "#9d80cb",
                      legendFontColor: "#7F7F7F",
                      legendFontSize: 15,
                    },
                    {
                      name: "Blouse",
                      population: inventory.filter(
                        (item) => item.type === "Blouse"
                      ).length,
                      color: "#ec8c74",
                      legendFontColor: "#7F7F7F",
                      legendFontSize: 15,
                    },
                    {
                      name: "Pajamas",
                      population: inventory.filter(
                        (item) => item.type === "Pajamas"
                      ).length,
                      color: "#caa1d9",
                      legendFontColor: "#727F7F",
                      legendFontSize: 15,
                    },
                    {
                      name: "Abaya",
                      population: inventory.filter(
                        (item) => item.type === "Abaya"
                      ).length,
                      color: "#f4a261",
                      legendFontColor: "#727F7F",
                      legendFontSize: 15,
                    },
                    {
                      name: "Jacket",
                      population: inventory.filter(
                        (item) => item.type === "Jacket"
                      ).length,
                      color: "#e9c46a",
                      legendFontColor: "#727F7F",
                      legendFontSize: 15,
                    },
                    // {
                    //   name: "Leggings",
                    //   population: inventory.filter(
                    //     (item) => item.type === "Leggings"
                    //   ).length,
                    //   color: "#2a9d8f",
                    //   legendFontColor: "#727F7F",
                    //   legendFontSize: 15,
                    // },
                    {
                      name: "Pants",
                      population: inventory.filter(
                        (item) => item.type === "Pants / Trousers"
                      ).length,
                      color: "#F7A8A8",
                      legendFontColor: "#727F7F",
                      legendFontSize: 15,
                    },
                  ]}
                  width={deviceType == "mobile" ? width * 0.8 : width * 0.5}
                  height={height * 0.2}
                  chartConfig={{
                    backgroundColor: "#1cc910",
                    backgroundGradientFrom: "#eff3ff",
                    backgroundGradientTo: "#efefef",
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(20, 20, 19, ${opacity})`,
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  style={{
                    marginVertical: 5,
                  }}
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="15"
                  absolute //for the absolute number remove if you want percentage
                />
              </View>
            </View>
          </ScrollView>

          <View
            style={{
              width: width,
              height: height * 0.033,
              backgroundColor: "#1d2f6f",
              marginTop: "2%",
            }}
          >
            <Text style={styles.title}>Analysis</Text>
          </View>
          <View
            style={{
              marginTop: "2%",
              marginHorizontal: "5%",
              borderWidth: 1,
              height: height * 0.36,
              borderRadius: 20,
            }}
          >
            <Text style={styles.pieTitle}>Items</Text>
            <View
              style={{
                borderWidth: 1,
                width: "100%",
              }}
            ></View>

            <BarChart
              data={{
                labels: ["Donations", "Requests", ""],
                datasets: [
                  {
                    data: [donations.length, requests.length, 0],
                  },
                ],
              }}
              width={width * 0.7} // from react-native
              height={height * 0.3}
              //yAxisLabel={"QR"}
              chartConfig={{
                backgroundColor: "#f02",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 255) => `rgba(45, 28, 29, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View>
        </Block>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBEBEB",
    //paddingTop: 50,
    paddingHorizontal: "5%",
  },
  status: {
    height: height * 0.25,
    borderWidth: 1,
    borderRadius: 30,
    marginVertical: "1%",
    margin: "1%",
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
    fontSize: width > 500 ? normalize(30) : normalize(40),
    marginLeft: "3%",
    textAlign: "left",
    color: "#fff",
  },
  formContent: {
    flexDirection: "row",
    marginTop: 30,
  },
  pieTitle: {
    fontSize: width > 500 ? normalize(27) : normalize(37),
    marginLeft: "7%",
    padding: 5,
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
    width: normalize(40),
    height: normalize(40),
    marginLeft: "2%",
    marginTop: "2%",
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
  notificationBox: {
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 10,
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
});

export default Inventory;
