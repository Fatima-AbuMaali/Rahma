import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  FlatList,
  PixelRatio,
  Platform,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AntDesign, MaterialIcons } from "react-native-vector-icons";
import { signOut } from "firebase/auth";
import { auth, db } from "../../config";
import { collection, getDocs, onSnapshot, query } from "firebase/firestore";
import { Block } from "galio-framework";
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

const DriverHistory = (props, { navigation }) => {
  let id = auth?.currentUser?.email;

  console.log(id);
  const [deviceType, setDeviceType] = useState("");

  const [arr, setArr] = useState([]);
  const [orders, setOrders] = useState([]);

  const readOrders = async () => {
    let temp = [];
    const q = query(collection(db, "drivers", id.toLowerCase(), "orders"));
    const docs = await getDocs(q);
    // console.log(docs)
    docs.forEach((doc) => {
      let hour = doc.data()?.dateTime.toDate().getHours();
      let t = doc.data();
      t.time = hour + ":00";
      t.date = doc.data()?.dateTime.toDate().toLocaleDateString();
      doc.data().status == "fullfied" ? temp.push(t) : null;
      // temp.push(doc.data());
      console.log(doc.id, " => ", doc.data());
      //   doc.data().type == "pickup" ? pick.push(t) : deliv.push(t);
    });
    setOrders(temp);
    setOrders(temp);

    // setArr(temp);
    console.log(orders);
  };
  let user = auth?.currentUser?.email;

  const getOrders = async () => {
    // console.log(cartId);
    const collectionRef = collection(db, "drivers", user, "orders");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setArr(
        querySnapshot.docs.map((doc) =>
          doc.data().status == "fullfield" ? doc.data() : undefined
        )
      );

      setOrders(querySnapshot.docs.map((doc) => doc.data()));
      // setArr(orders.filter((x) => x.status == "pending"));
      console.log("arrr", arr);
    });

    return () => unsubscribe();
  };

  useEffect(() => {
    console.log(arr);
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
    // readOrders();
    getOrders();
  }, []);

  return (
    <Block
      flex
      middle
      style={{ backgroundColor: "#F0F4F8", flex: 1, width: width }}
    >
      <Block>
        <Block flex>
          <Text style={styles.title}>Orders History</Text>
          {arr.length > 0 ? (
            arr.map((item) =>
              item != undefined ? (
                <View style={styles.notificationBox} key={item.trackId}>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      paddingHorizontal: "2%",
                      paddingVertical: "1%",
                    }}
                  >
                    <Text style={styles.description}>Order No. </Text>
                    <Text style={styles.description}>#{item.trackId}</Text>
                  </View>

                  <View
                    style={{
                      borderWidth: 0.6,
                      width: width * 0.9,
                      marginBottom: "4%",
                    }}
                  ></View>
                  <View
                    style={{
                      flexDirection: "row",
                      margin: "5%",
                      marginTop: "1%",
                    }}
                  >
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

                    <View
                      style={{
                        marginLeft: "5%",
                        width: "80%",
                        // borderWidth: 1,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          width: "40%",
                          // borderWidth: 1,
                          padding: "1%",
                          justifyContent: "space-between",
                        }}
                      >
                        <MaterialIcons
                          name="location-pin"
                          size={25}
                          color="#1a1f87"
                        />
                        <Text style={styles.description}>{item.location}</Text>
                      </View>

                      <View
                        style={{
                          flexDirection: "row",
                          width: "75%",
                          // borderWidth: 1,
                          padding: "1%",

                          justifyContent: "space-between",
                        }}
                      >
                        <MaterialIcons
                          name="date-range"
                          size={25}
                          color="#1a1f87"
                        />
                        <Text style={styles.description}>{item.date}</Text>
                        <Text style={styles.description}>{item.timeSlot}</Text>
                      </View>
                    </View>
                    <View
                      style={{
                        justifyContent: "flex-start",
                        alignContent: "flex-end",
                        marginLeft: "7%",
                      }}
                    >
                      {/* <AntDesign name="checkcircle" size={35} color="green" /> */}
                    </View>
                  </View>
                </View>
              ) : null
            )
          ) : (
            <Text style={styles.noOrder}>No orders yet</Text>
          )}
        </Block>
      </Block>
    </Block>
  );
};

export default DriverHistory;

const styles = StyleSheet.create({
  topl: {
    width: width * 0.97,
    padding: "2%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1a1f87",
    marginTop: "3%",
  },
  title: {
    fontSize: normalize(25),
    marginTop: "5%",
    marginLeft: "5%",
  },
  noOrder: {
    fontSize: normalize(25),
    marginTop: "50%",
    marginLeft: "5%",
  },
  container: {
    backgroundColor: "red",
  },
  notificationList: {
    marginTop: "1%",
    padding: "3%",
    // borderWidth: 1,
    backgroundColor: "#F0F4F8",
  },
  notificationBox: {
    width: width * 0.9,
    // padding: "5%",
    paddingTop: "1%",
    marginTop: "2%",
    marginBottom: "3%",
    backgroundColor: "#FFF",
    // flexDirection: "row",
    borderRadius: 20,
    borderWidth: 0.3,
  },
  icon: {
    width: 50,
    height: 50,
  },
  description: {
    fontSize: normalize(19),
    // color: "#3498db",
    marginLeft: "5%",
    // textAlign: "center",
  },
});
