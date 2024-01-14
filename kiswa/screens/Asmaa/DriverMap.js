import {
  Dimensions,
  Image,
  Linking,
  PixelRatio,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Entypo } from "react-native-vector-icons";
import { auth, db } from "../../config";
import { FlatList, TouchableOpacity } from "react-native-gesture-handler";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
import { useIsFocused } from "@react-navigation/native";

// import { Block } from "galio-framework";
const { width, height } = Dimensions.get("screen");
const scale = width / 428;
export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}
const DriverMap = (props) => {
  const isFocused = useIsFocused();
  const id = props.email;
  const navigation = props.navigation;
  // let id = auth?.currentUser?.email;
  let lat = 25.2709954;
  let long = 51.5324509;

  let user = auth?.currentUser?.email;

  const getOrders = async () => {
    console.log(today);
    const collectionRef = collection(db, "drivers", user, "orders");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setOrders(
        querySnapshot.docs.map((doc) =>
          new Date(doc.data().date) == new Date() ? doc.data() : undefined
        )
      );
      console.log(orders);
      //  setOrders(querySnapshot.docs.map((doc) => doc.data()));
      // setArr(orders.filter((x) => x.status == "pending"));
    });

    return () => unsubscribe();
  };

  const [today, setToday] = useState();
  const [tomorrow, setTomorrow] = useState();

  const [orders, setOrders] = useState([]);
  const [ordersTomo, setOrdersTomo] = useState([]);

  const readOrders = async () => {
    let temp = [];

    const q = query(collection(db, "drivers", "sim@mail.com", "orders"));
    const docs = await getDocs(q);
    docs.forEach(async (doc) => {
      let hour = doc.data().dateTime.toDate().getHours();
      console.log(doc.data().dateTime.toDate());
      let t = doc.data();
      t.time = hour + ":00";
      t.dateTime = doc.data().dateTime.toDate();
      t.date = doc.data().dateTime.toDate().toLocaleDateString();
      // let a;
      // doc.data().type == "pickup"
      //   ? (a = await readUser(doc.data().userId, "donors"))
      //   : (a = await readUser(doc.data().userId, "families"));
      // t.userName = a.userName;
      // t.phone = a.phone;
      t.dateTime.toDateString() == today ? temp.push(t) : null;
    });

    await Promise.all(temp);
    setOrders(temp);
    // setOrders(temp);

    console.log("22", ordersTomo);
    // sortTime();
  };
  const readOrdersTomo = async () => {
    let temp2 = [];

    const q = query(collection(db, "drivers", "sim@mail.com", "orders"));
    const docs = await getDocs(q);
    docs.forEach(async (doc) => {
      let hour = doc.data().dateTime.toDate().getHours();
      console.log(doc.data().dateTime.toDate());
      let t = doc.data();
      t.time = hour + ":00";
      t.dateTime = doc.data().dateTime.toDate();
      t.date = doc.data().dateTime.toDate().toLocaleDateString();
      // let a;
      // doc.data().type == "pickup"
      //   ? (a = await readUser(doc.data().userId, "donors"))
      //   : (a = await readUser(doc.data().userId, "families"));
      // t.userName = a.userName;
      // t.phone = a.phone;
      t.dateTime.toDateString() == tomorrow ? temp2.push(t) : null;
      setOrdersTomo(temp2);
    });
    await Promise.all(temp2);

    // setOrdersTomo(temp2);

    console.log("22", ordersTomo);
    // sortTime();
  };

  const sortTime = () => {
    let temp = [...orders];
    temp.sort((a, b) => {
      const timeA = a.time;
      const timeB = b.time;
      return timeB - timeA;
    });

    setOrders(temp);
    // console.log("afterrr", orders);
  };

  const readUser = async (id, table) => {
    const docRef = doc(db, table, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      // setData(docSnap.data());
      // return data;
      // console.log(docSnap.data());
      return docSnap.data();
    } else {
      console.log("No such document!");
    }
  };

  const makeDate = () => {
    var newD = new Date();
    var tom = new Date(newD);
    // console.log(newD);

    tom.setDate(tom.getDate() + 1);

    newD.setDate(newD.getDate());

    setToday(newD.toDateString());
    setTomorrow(tom.toDateString());
    // console.log(tom.toDateString());
  };

  useEffect(() => {
    makeDate();
    getOrders();
    // readOrders();
    // readOrdersTomo();
  }, [props]);

  return (
    <SafeAreaView style={{ width: width, height: 700 }}>
      <View style={styles.container}>
        <ScrollView>
          <Text
            style={{
              fontSize: 20,
              marginHorizontal: 13,
              marginTop: 20,
              fontWeight: "bold",
            }}
          >
            {today && today}
          </Text>
          {orders.length > 0 ? (
            orders.map((item, i) =>
              item != undefined ? (
                <TouchableOpacity
                  key={item.trackId}
                  // onPress={() => showAlert("row")}
                >
                  <View style={styles.eventBox}>
                    <View style={styles.eventDate}>
                      <View>
                        <Entypo name="dot-single" size={30} />
                        <View
                          style={{
                            marginHorizontal: 15,
                            borderWidth: 1,
                            width: 2,
                            height: 60,
                          }}
                        ></View>
                      </View>
                      <Text style={styles.eventDay}>{item.time} PM</Text>

                      {/* <Text style={styles.eventMonth}>{item.month}</Text> */}
                    </View>
                    <View style={styles.eventContent}>
                      {item.type == "pickup" ? (
                        <Image
                          style={styles.icon}
                          source={require("../../assets/imgs/pick.png")}
                        />
                      ) : (
                        <Image
                          style={styles.icon}
                          source={require("../../assets/imgs/deliv.png")}
                        />
                      )}
                      {/* <Text style={styles.eventTime}>10:00 am - 10:45 am</Text> */}
                      <View style={{ marginLeft: "4%" }}>
                        <Text style={styles.userName}>{item.location}</Text>
                        <Text style={styles.description}>
                          {/* {item.userName} 66006600 */}
                        </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null
            )
          ) : (
            <Text style={styles.noOrder}>Done! 😊</Text>
          )}
          <Text
            style={{
              fontSize: 20,
              marginHorizontal: 13,
              marginTop: 20,
              fontWeight: "bold",
            }}
          >
            {tomorrow && tomorrow}
          </Text>
          {ordersTomo.length > 0 ? (
            ordersTomo.map((item, i = 100) => (
              <TouchableOpacity
                key={i + 20}
                // onPress={() => showAlert("row")}
              >
                <View style={styles.eventBox}>
                  <View style={styles.eventDate}>
                    <View>
                      <Entypo name="dot-single" size={30} />
                      <View
                        style={{
                          marginHorizontal: 15,
                          borderWidth: 1,
                          width: 2,
                          height: 60,
                        }}
                      ></View>
                    </View>
                    <Text style={styles.eventDay}>{item.time} PM</Text>

                    {/* <Text style={styles.eventMonth}>{item.month}</Text> */}
                  </View>
                  <View style={styles.eventContent}>
                    {item.type == "pickup" ? (
                      <Image
                        style={styles.icon}
                        source={require("../../assets/imgs/pick.png")}
                      />
                    ) : (
                      <Image
                        style={styles.icon}
                        source={require("../../assets/imgs/deliv.png")}
                      />
                    )}
                    {/* <Text style={styles.eventTime}>10:00 am - 10:45 am</Text> */}
                    <View style={{ marginLeft: "4%" }}>
                      <Text style={styles.userName}>{item.location}</Text>
                      <Text style={styles.description}>
                        {item.userName} 66006600
                      </Text>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          ) : orders.length > 0 ? (
            <Text style={styles.noOrder}>No orders for now! </Text>
          ) : (
            <Text style={styles.noOrder}>Done! 😊</Text>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default DriverMap;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F1EFFF",
    height: height,
  },
  noOrder: {
    fontSize: normalize(25),
    marginTop: "20%",
    marginLeft: "15%",
  },
  eventList: {
    // marginTop: 10,
    // height: "90%",
    // borderWidth: 1,
  },
  eventBox: {
    // padding: 10,
    marginTop: 5,
    marginBottom: 5,
    flexDirection: "row",
    // borderWidth: 1,
    width: "95%",
  },
  eventDate: {
    flexDirection: "row",
    // borderWidth: 1,
    height: "30%",
    // marginTop: 20,
  },
  eventDay: {
    fontSize: normalize(15),
    color: "#0099FF",
    marginTop: 10,

    // fontWeight: "600",
  },
  eventMonth: {
    fontSize: normalize(16),
    color: "#0099FF",
    fontWeight: "600",
  },
  eventContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    marginLeft: "2%",
    backgroundColor: "#FFFFFF",
    padding: "5%",
    paddingBottom: 0,
    paddingTop: "4%",
    borderRadius: 9,
    // borderWidth: 1,
  },
  icon: {
    width: 50,
    height: 50,
  },
  description: {
    fontSize: normalize(15),
    color: "#646464",
  },
  eventTime: {
    fontSize: normalize(18),
    color: "#151515",
  },
  userName: {
    fontSize: normalize(16),
    color: "#151515",
  },
});
