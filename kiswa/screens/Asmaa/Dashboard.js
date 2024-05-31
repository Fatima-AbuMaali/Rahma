import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  ScrollView,
  Platform,
  PixelRatio,
  SafeAreaView,
} from "react-native";

import React, { useEffect, useState } from "react";
import {
  BarChart,
  PieChart,
  StackedBarChart,
  LineChart,
  ProgressChart,
} from "react-native-chart-kit";
import CircularProgress from "react-native-circular-progress-indicator";
//FireBase
import { auth } from "../../config";

import {
  doc,
  query,
  getDocs,
  getDoc,
  addDoc,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config";
import { Block } from "galio-framework";

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
const Dashboard = () => {
  const [deviceType, setDeviceType] = useState("");
  const [khor, setKhor] = useState([]);
  const [value, setValue] = useState(0);
  const [daysSt, setDaysSt] = useState({
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
  });
  // const [reqDaysst, setReqDaysst] = useState({});

  const zones = [];
  const z = [
    { name: "Doha", count: 0 },
    { name: "Al Rayyan", count: 0 },
    { name: "Rumeilah", count: 0 },
    { name: "Wadi Al Sail", count: 0 },
    { name: "Al Daayen", count: 0 },
    { name: "Umm Salal", count: 0 },
    { name: "Al Wakra", count: 0 },
    { name: "Al Khor", count: 0 },
    { name: "Al Shamal", count: 0 },
    { name: "Al Shahaniya", count: 0 },
  ];
  const days = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
  };
  const reqDays = {
    Sunday: 0,
    Monday: 0,
    Tuesday: 0,
    Wednesday: 0,
    Thursday: 0,
    Friday: 0,
  };

  const stat = [
    {
      title: "Donations",
      data: "donations",
      img: require("../../assets/imgs/donations.png"),
    },
    {
      title: "Requests",
      data: "requests",
      img: require("../../assets/imgs/requests.png"),
    },
    {
      title: "Items",
      data: "items",
      img: require("../../assets/imgs/Items.png"),
    },

    {
      title: "Feedback",
      data: "feedback",
      img: require("../../assets/imgs/feedbacks.png"),
    },
  ];
  const userStat = [
    {
      title: "Donors",
      data: "donors",
      img: require("../../assets/Asmaa/donor2.png"),
    },
    {
      title: "Drivers",
      data: "drivers",
      img: require("../../assets/Asmaa/driver.png"),
    },
    {
      title: "Families",
      data: "families",
      img: require("../../assets/Asmaa/family(6).png"),
    },
    {
      title: "Workers",
      data: "workers",
      img: require("../../assets/Asmaa/worker.png"),
    },
  ];
  useEffect(() => {
    readDonors();
    readDonations();
    readFamilies();
    readRequests();
    readItems();
    readWorkers();
    readFeedback();
    readDrivers();
    zonesData();
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
  }, []);

  const zonesData = () => {
    donations.forEach((x) => {
      console.log(x.day);
    });
  };

  //Users---------
  const [families, setFamilies] = useState([]);
  const readFamilies = async () => {
    const collectionRef = collection(db, "families");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setFamilies(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  };

  const [donors, setDonors] = useState([]);
  const readDonors = async () => {
    const collectionRef = collection(db, "donors");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setDonors(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  };

  const [drivers, setDrivers] = useState([]);
  const readDrivers = async () => {
    const collectionRef = collection(db, "drivers");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setDrivers(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  };
  const [workers, setWorkers] = useState([]);
  const readWorkers = async () => {
    const collectionRef = collection(db, "inventoryWorkers");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setWorkers(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  };

  const [requests, setRequests] = useState([]);
  const readRequests = async () => {
    const collectionRef = collection(db, "familyRequests");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setRequests(querySnapshot.docs.map((doc) => doc.data()));

      // querySnapshot.docs.forEach((doc) => {
      //   d = doc.data().day;
      //   reqDays[d] += 1;
      // });
      // console.log(reqDays);
      // setReqDaysst(reqDays);
    });

    return () => unsubscribe();
  };
  const [donations, setDonations] = useState([]);
  const readDonations = async () => {
    let d;
    const collectionRef = collection(db, "donorDonation");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setDonations(querySnapshot.docs.map((doc) => doc.data()));

      querySnapshot.docs.forEach((doc) => {
        d = doc.data().day;
        days[d] += 1;
      });
      console.log(days);
      setDaysSt(days);
    });

    return () => unsubscribe();
  };
  const [feedback, setFeedback] = useState([]);
  const readFeedback = async () => {
    const collectionRef = collection(db, "feedback");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setFeedback(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  };
  const [items, setItems] = useState([]);
  const readItems = async () => {
    const collectionRef = collection(db, "inventory");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setItems(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  };

  const data = {
    labels: ["Sunday", "Monday", "Tuesday", "Wednsday", "Thursday", "Friday"],
    datasets: [
      {
        data: [
          daysSt.Sunday,
          daysSt.Monday,
          daysSt.Tuesday,
          daysSt.Wednesday,
          daysSt.Thursday,
          daysSt.Friday,
        ],

        color: (opacity = 3) => `rgba(85, 105, 231, ${opacity})`, // optional
        strokeWidth: 4, // optional
      },
      {
        data: [0, 1, 1, 2, 3, 4],

        color: (opacity = 3) => `rgba(233, 162, 134, ${opacity})`, // optional
        strokeWidth: 4, // optional
      },
    ],
    legend: ["Donations", "Requests"], // optional
  };

  return (
    <SafeAreaView
      style={{
        backgroundColor: "white",
        height: deviceType == "mobile" ? 800 : 1000,
      }}
    >
      {/* <View style={{ flex: 1 }}> */}
      <ScrollView
        style={{ backgroundColor: "white", flex: 1 }}
        showsVerticalScrollIndicator={true}
        gestureEnabled={false}
      >
        <View style={styles.container}>
          <View
            style={{
              width: width,
              height: height * 0.033,
              backgroundColor: "#1d2f6f",
            }}
          >
            <Text style={styles.title}>Dashboard</Text>
          </View>

          <ScrollView
            style={{ flex: 1 }}
            horizontal={true}
            showsHorizontalScrollIndicator={true}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                width: width * 1.6,
                height: deviceType == "mobile" ? height * 0.24 : height * 0.32,
              }}
            >
              <View
                style={[
                  styles.statistics,
                  {
                    height:
                      deviceType == "mobile" ? height * 0.2 : height * 0.25,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: normalize(30),
                    marginLeft: "7%",
                    borderBottomWidth: 2,
                    borderBottomColor: "black",
                  }}
                >
                  Statistics
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                  }}
                ></View>
                <View style={styles.blockss}>
                  {stat.map((x) => (
                    <View key={x.title} style={styles.block}>
                      <View style={styles.imgBlock}>
                        <Image
                          source={x.img}
                          style={{
                            width: "90%",
                            height: "90%",
                            position: "relative",
                            resizeMode: "contain",
                          }}
                          width="90%"
                          height="90%"
                        />
                      </View>
                      <View style={styles.text}>
                        <Text
                          style={{
                            fontSize: normalize(20),
                            fontWeight: "300",
                          }}
                        >
                          {x.title}
                        </Text>
                        <Text></Text>

                        <Text style={{ fontSize: normalize(25) }}>
                          {x.data == "requests"
                            ? requests.length
                            : x.data == "donations"
                            ? donations.length
                            : x.data == "items"
                            ? items.length
                            : feedback.length}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>

              <View
                style={[
                  styles.statistics,
                  {
                    height:
                      deviceType == "mobile" ? height * 0.2 : height * 0.25,
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: normalize(30),
                    marginLeft: "7%",
                    borderBottomWidth: 2,
                    borderBottomColor: "black",
                  }}
                >
                  Users
                </Text>
                <View
                  style={{
                    borderWidth: 1,
                  }}
                ></View>
                <View style={styles.blockss}>
                  {userStat.map((x) => (
                    <View style={styles.block} key={x.title}>
                      <View style={styles.imgBlock}>
                        <Image
                          source={x.img}
                          style={{
                            width: "90%",
                            height: "90%",
                            position: "relative",
                            resizeMode: "contain",
                          }}
                          width="90%"
                          height="90%"
                        />
                      </View>
                      <View style={styles.text}>
                        <Text
                          style={{
                            fontSize: normalize(20),
                            fontWeight: "300",
                          }}
                        >
                          {x.title}
                        </Text>
                        <Text></Text>

                        <Text style={{ fontSize: normalize(25) }}>
                          {x.data == "workers"
                            ? workers.length
                            : x.data == "drivers"
                            ? drivers.length
                            : x.data == "donors"
                            ? donors.length
                            : families.length}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </ScrollView>

          {daysSt && (
            <LineChart
              data={data}
              width={width * 1.1}
              height={height * 0.25}
              verticalLabelRotation={0}
              chartConfig={{
                backgroundColor: "#ccc",
                backgroundGradientFrom: "#fff",
                backgroundGradientTo: "#fff",
                decimalPlaces: 0,
                color: (opacity = 0) => `rgba(100, 102,101 , ${opacity})`,
                style: {
                  // borderRadius: 16,
                  // margin: "1%",
                },
              }}
              bezier
            />
          )}

          <View
            style={{
              width: width,
              // height: 40,
              height: height * 0.033,
              backgroundColor: "#1d2f6f",
            }}
          >
            <Text style={styles.title}>Orders</Text>
          </View>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={true}
            scrollEventThrottle={1}
            // width="100%"
          >
            <Block
              style={{
                flexDirection: "row",
                width: deviceType == "mobile" ? width * 2 : width * 1.5,
                height: height * 0.4,
              }}
            >
              <View
                style={[
                  styles.status,
                  {
                    width: deviceType == "mobile" ? width * 0.8 : width * 0.5,
                  },
                ]}
              >
                <Text style={styles.pieTitle}> Orders</Text>
                <View
                  style={{
                    borderWidth: 1,
                    width: "100%",
                  }}
                ></View>
                <PieChart
                  data={[
                    {
                      name: "Pending",
                      population: requests.filter(
                        (item) => item.status === "pending"
                      ).length,
                      color: "#F5717F",
                      legendFontColor: "#7F7F7F",
                      legendFontSize: 15,
                    },
                    {
                      name: "Fullfied",
                      population: requests.filter(
                        (item) => item.status === "fullfied"
                      ).length,
                      color: "#7ae582",
                      legendFontColor: "#7F7F7F",
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
                  style={
                    {
                      // marginVertical: 8,
                      // borderRadius: 20,
                    }
                  }
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="30"
                  absolute //for the absolute number remove if you want percentage
                />
              </View>
              <View
                style={[
                  styles.status,
                  {
                    width: deviceType == "mobile" ? width * 0.8 : width * 0.5,
                  },
                ]}
              >
                <Text style={styles.pieTitle}>Top Zones</Text>
                <View
                  style={{
                    borderWidth: 1,
                    width: "100%",
                  }}
                ></View>
                <PieChart
                  data={[
                    {
                      name: "Duhail",
                      population: families.filter(
                        (item) => item.zone === "Duhail"
                      ).length,
                      color: "#4cc9f0",
                      legendFontColor: "#7F7F7F",
                      legendFontSize: 15,
                    },
                    {
                      name: "Al Rayyan",
                      population: families.filter(
                        (item) => item.zone === "Al Rayyan"
                      ).length,
                      color: "#ffd166",
                      legendFontColor: "#7F7F7F",
                      legendFontSize: 15,
                    },
                    {
                      name: "Rumeilah",
                      population: families.filter(
                        (item) => item.zone === "Rumeilah"
                      ).length,
                      color: "#06d6a0",
                      legendFontColor: "#7F7F7F",
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
                  style={
                    {
                      // marginVertical: 8,
                    }
                  }
                  accessor="population"
                  backgroundColor="transparent"
                  paddingLeft="30"
                  absolute //for the absolute number remove if you want percentage
                />
              </View>
            </Block>
          </ScrollView>
        </View>
      </ScrollView>
      {/* </View> */}
    </SafeAreaView>
  );
};

export default Dashboard;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: "2%",
    // height: height * 1.2,
  },
  scrollView: {
    marginTop: 7,
    paddingHorizontal: 7,
    borderWidth: 3,
  },
  title: {
    fontSize: width > 500 ? normalize(30) : normalize(40),
    marginLeft: "3%",
    textAlign: "left",
    color: "#fff",
  },
  statistics: {
    borderWidth: 1,
    width: width * 0.73,
    height: height * 0.3,
    margin: 10,
    borderRadius: 20,
    paddingBottom: 0,
  },
  blockss: {
    // padding: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    // margin: "1%",
  },
  block: {
    width: "46%",
    borderWidth: 1,
    height: Platform.OS === "ios" ? "55%" : "50%",
    margin: "2%",
    justifyContent: "space-between",
    flexDirection: "row",
    borderRadius: 8,
  },
  imgBlock: {
    width: "40%",
    padding: "3%",
    flexDirection: "row",
    // borderWidth: 1,
    // backgroundColor: "#E4E9EC",
  },
  text: {
    width: "55%",
  },

  pieTitle: {
    fontSize: width > 500 ? normalize(27) : normalize(37),
    marginLeft: "7%",
    padding: 5,
  },

  status: {
    // width: width * 0.5,
    height: height * 0.25,
    borderWidth: 1,
    borderRadius: 30,
    // padding: "1%",
    // flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: "1%",
    margin: "1%",
  },
});
