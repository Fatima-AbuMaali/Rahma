import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Image,
  Dimensions,
  Platform,
  PixelRatio,
  ScrollView,
  Text,
  View,
  Pressable,
  Linking,
} from "react-native";
import { Block, theme } from "galio-framework";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
  Entypo,
} from "react-native-vector-icons";
//Firebase
import { auth } from "../../config";
import {
  doc,
  query,
  getDocs,
  getDoc,
  addDoc,
  collection,
  setDoc,
} from "firebase/firestore";
import { db } from "../../config";
import { signOut } from "firebase/auth";
import { Tab, TabView } from "@rneui/themed";
import DriverHistory from "./DriverHistory";
import DriverProfile from "./DriverProfile";

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

const OrderDetails = ({ route, navigation }) => {
  const [deviceType, setDeviceType] = useState();

  const { id } = route.params;
  const { userName } = route.params;
  const { phone } = route.params;
  const { zone } = route.params;

  useEffect(() => {
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
    readOrder();
    // alert(phone);
  }, []);

  const [orders, setOrders] = useState([]);
  const [pickup, setPickup] = useState([]);
  const [num, setNum] = useState();
  const [data, setData] = useState();

  let user = auth?.currentUser?.email;

  const readOrder = async () => {
    const docRef = doc(db, "drivers", user, "orders", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      //   console.log("Document data:", docSnap.data());
      let t = docSnap.data();
      var num = docSnap.id[7];
      //   console.log(docSnap.id.split(num)[0]);
      var a;
      docSnap.data().type == "pickup"
        ? (a = await readUser(docSnap.data().userId, "donors"))
        : (a = await readUser(docSnap.data().userId, "families"));

      setData(t);
      setNum(docSnap.id.split(num)[0]);
    } else {
      console.log("No such document!");
    }
  };
  let lat = 25.2709954;
  let long = 51.5324509;

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

  const [btn, setBtn] = useState("green");
  const done = async () => {
    const docRef = doc(db, "drivers", user, "orders", id);
    await setDoc(docRef, { status: "fullfield" }, { merge: true })
      .then(() => {
        console.log("data updated");
        setBtn("grey");
        alert("Done");
        navigation.goBack();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <View style={{ backgroundColor: "white" }}>
      <View style={styles.home}>
        <Text style={{ fontSize: 30, textAlign: "center" }}>Order Details</Text>

        {data && (
          <View style={styles.card}>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                margin: "3%",
                marginBottom: 0,
              }}
            >
              <Text style={styles.cardTitle}>Order No</Text>

              <Text style={styles.cardTitle}>#{num}</Text>
            </View>

            <View
              style={{
                borderWidth: 1.3,
                width: width * 0.79,
                borderColor: "#3C4DBD",
              }}
            ></View>
            <View style={{ margin: "7%" }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 15,
                }}
              >
                {data.type == "pickup" ? (
                  <View style={[styles.dataView, { flexDirection: "row" }]}>
                    <Entypo name="home" size={30} color="#1a1f87" />
                    <Text style={styles.dataTitles}>
                      From: {userName} {zone}
                    </Text>
                  </View>
                ) : (
                  <View style={[styles.dataView, { flexDirection: "row" }]}>
                    <MaterialCommunityIcons
                      name="storefront"
                      size={30}
                      color="#1a1f87"
                    />
                    <Text style={styles.dataTitles}>
                      From: Wherehouse - Duhail
                    </Text>
                  </View>
                )}
              </View>
              <View
                style={{
                  borderWidth: 1,
                  width: 2,
                  height: 70,
                  marginHorizontal: "5%",
                }}
              ></View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 15,
                }}
              >
                {data.type == "pickup" ? (
                  <View style={[styles.dataView, { flexDirection: "row" }]}>
                    <MaterialCommunityIcons
                      name="storefront"
                      size={30}
                      color="#1a1f87"
                    />
                    <Text style={styles.dataTitles}>To: Store- Duhail </Text>
                  </View>
                ) : (
                  <View style={[styles.dataView, { flexDirection: "row" }]}>
                    <Entypo name="home" size={30} color="#1a1f87" />
                    <Text style={styles.dataTitles}>
                      To: {data.userName} {data.zone}
                    </Text>
                  </View>
                )}
              </View>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 15,
                }}
              >
                <View style={[styles.dataView, { flexDirection: "row" }]}>
                  <Ionicons name="time-outline" size={30} color="#1a1f87" />
                  <Text
                    style={styles.dataTitles}
                    onPress={() => Linking.openURL(`tel:${phone}`)}
                  >
                    12:00 - 02:00 Pm
                  </Text>
                </View>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 15,
                }}
              >
                {data && (
                  <View style={[styles.dataView, { flexDirection: "row" }]}>
                    <Feather name="user" size={30} color="green" />
                    <Text style={styles.dataTitles}>{data.userName}</Text>
                  </View>
                )}

                {data && (
                  <View style={[styles.dataView, { flexDirection: "row" }]}>
                    <Feather name="phone" size={30} color="green" />
                    <Text
                      style={styles.dataTitles}
                      onPress={() => Linking.openURL(`tel:${phone}`)}
                    >
                      {phone}
                    </Text>
                  </View>
                )}
              </View>
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Pressable
                  onPress={done}
                  style={[
                    styles.pickupButtonContainer,
                    { backgroundColor: btn },
                  ]}
                >
                  <Text style={styles.pickupButton}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  unselected: {
    fontSize: normalize(19),
  },
  selected: {
    color: "#1a1f87",
    fontSize: normalize(19),
    fontWeight: "bold",
  },
  home: {
    margin: "10%",
    // marginTop: "20%",
    height: height,
  },
  card: {
    borderWidth: 2,
    borderColor: "#3C4DBD",
    borderRadius: 15,
    height: height * 0.55,
    // backgroundColor: "#FFF",
  },
  cardTitle: {
    fontSize: normalize(20),
    marginBottom: "6%",
    // color:"#1a1f87"
  },
  userCard: {
    borderWidth: 1,
    borderColor: "lightgrey",
    margin: "2%",
    borderRadius: 12,
    flexDirection: "row",
    padding: "3%",
    shadowColor: "#666",
    shadowOffset: {
      width: 1,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 1.49,
    elevation: 2,
  },

  dataView: {
    marginBottom: "6%",
    // borderWidth: 1,
  },
  dataTitles: {
    fontSize: normalize(19),
    // color: '#999',
    marginTop: "2%",
    marginLeft: "5%",
  },
  pickupButtonContainer: {
    // backgroundColor: "#7CB673",
    // backgroundColor: "lightgrey",
    borderRadius: 12,
    width: width * 0.4,
    margin: "6%",
  },
  pickupButton: {
    textAlign: "center",
    fontSize: normalize(15),
    color: "#fff",
    padding: "7%",
  },

  cancelButtonContainer: {
    backgroundColor: "lightgrey",
    color: "black",
    textAlign: "center",
  },

  cancelButton: {
    color: "black",
    textAlign: "center",
    fontSize: normalize(15),
    padding: "7%",
  },
});

export default OrderDetails;
