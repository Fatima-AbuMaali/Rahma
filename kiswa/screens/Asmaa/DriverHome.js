import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  Platform,
  PixelRatio,
  ScrollView,
  Text,
  View,
  Pressable,
  Linking,
  SafeAreaView,
} from "react-native";
import { Block, theme } from "galio-framework";
import { FontAwesome, Ionicons } from "react-native-vector-icons";
//Firebase
import { auth, db } from "../../config";
import {
  doc,
  query,
  collection,
  onSnapshot,
  setDoc,
  addDoc,
} from "firebase/firestore";
import * as Notifications from "expo-notifications";
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

const DriverHome = (props) => {
  async function schedulePushNotification(noti) {
    await Notifications.scheduleNotificationAsync(noti);
  }

  let user = auth?.currentUser?.email;
  useEffect(() => {
    getOrders();
  }, []);

  const [type, setType] = useState("pick");
  const [arr, setArr] = useState([]);

  const [orders, setOrders] = useState([]);
  const getOrders = async () => {
    const collectionRef = collection(db, "drivers", user, "orders");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setArr(
        querySnapshot.docs.map((doc) =>
          doc.data().type == "pickup" && doc.data().status == "pending"
            ? { id: doc.id, data: doc.data(), num: doc.id.split(doc.id[6])[0] }
            : undefined
        )
      );
      setOrders(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
          num: doc.id.split(doc.id[6])[0],
        }))
      );
      console.log(orders.length);
    });

    return () => unsubscribe();
  };

  const navigation = props.navigation;

  const change = (type) => {
    console.log("changeeee", orders.length);
    if (type == "deliv") {
      setType("deliv");

      setArr(
        orders.filter(
          (x) => x.data.type == "deliver" && x.data.status == "pending"
        )
      );
    } else {
      setType("pick");
      setArr(
        orders.filter(
          (x) => x.data.type == "pickup" && x.data.status == "pending"
        )
      );
    }
  };

  const map = async (lat, long, userId, type) => {
    console.log(type);
    if (type == "deliver") {
      const notiref = await addDoc(
        collection(db, "families", userId, "notifications"),
        {
          title: "Order on way",
          body: "Your orders is on the way ",
          seen: "false",
        }
      );
      console.log("notification  add ID: ", notiref.id);
    } else {
      const notiref = await addDoc(
        collection(db, "donors", userId, "notifications"),
        {
          title: "Order on way",
          body: "Your orders is on the way ",
          seen: "false",
        }
      );
      console.log("notification  add ID: ", notiref.id);
    }
    Linking.openURL(
      `https://www.google.com/maps/search/?api=1&query=${lat},${long}`
    );
  };

  return (
    <View>
      <Block style={styles.nav}>
        <Pressable onPress={() => change("pick")}>
          <Text style={type == "pick" ? styles.selected : styles.unselected}>
            Pickup
          </Text>
        </Pressable>

        <Text style={styles.unselected}>|</Text>
        <Pressable onPress={() => change("deliv")}>
          <Text style={type == "deliv" ? styles.selected : styles.unselected}>
            Deliver
          </Text>
        </Pressable>
      </Block>
      <SafeAreaView style={{ height: "85%", width: width }}>
        <ScrollView>
          <View style={styles.home}>
            {arr.length != 0 ? (
              arr.map((x, i) =>
                x != undefined ? (
                  <View key={i + 2} style={styles.card}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.cardTitle}>Order No</Text>

                      <Text style={styles.cardTitle}>#{x.num}</Text>
                    </View>
                    <View style={styles.userCard}>
                      <FontAwesome
                        name="user-circle-o"
                        size={50}
                        color="#1a1f87"
                      />
                      <View style={{ marginLeft: 10 }}>
                        <Text
                          style={{
                            fontSize: normalize(15),
                            fontWeight: "bold",
                          }}
                        >
                          Name
                        </Text>
                        <Text
                          style={{
                            fontSize: normalize(15),
                            fontWeight: "bold",
                          }}
                        >
                          Phone
                        </Text>
                        <Text
                          style={{
                            fontSize: normalize(15),
                            fontWeight: "bold",
                          }}
                        >
                          Email
                        </Text>
                      </View>
                      <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: normalize(15) }}>
                          {x.data.userName}
                        </Text>
                        <Text style={{ fontSize: normalize(15) }}>
                          {x.data.phone}
                        </Text>
                        <Text style={{ fontSize: normalize(15) }}>
                          {x.data.userId}
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
                      <View style={[styles.dataView, { flexDirection: "row" }]}>
                        <Ionicons
                          name="md-today-sharp"
                          size={30}
                          color="#3C4DBD"
                        />
                        <Text style={styles.dataTitles}>{x.data.date}</Text>
                      </View>
                      <View style={[styles.dataView, { flexDirection: "row" }]}>
                        <Ionicons
                          name="time-outline"
                          size={30}
                          color="#3C4DBD"
                        />
                        <Text style={styles.dataTitles}>{x.data.timeSlot}</Text>
                      </View>
                    </View>

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        marginTop: 15,
                      }}
                    >
                      <View style={[styles.dataView, { flexDirection: "row" }]}>
                        <Ionicons
                          name="location-outline"
                          size={30}
                          color="#3C4DBD"
                        />
                        <Text style={styles.dataTitles}>{x.data.location}</Text>
                      </View>
                      <View style={[styles.dataView, { flexDirection: "row" }]}>
                        <Ionicons
                          name="map-outline"
                          size={30}
                          color="#3C4DBD"
                        />
                        <Text
                          style={[
                            styles.dataTitles,
                            { textDecorationLine: "underline", color: "blue" },
                          ]}
                          onPress={() =>
                            map(
                              x.data.lat,
                              x.data.long,
                              x.data.userId,
                              x.data.type
                            )
                          }
                        >
                          Open Map
                        </Text>
                      </View>
                    </View>

                    <View
                      style={{ justifyContent: "center", alignItems: "center" }}
                    >
                      <Pressable
                        onPress={() =>
                          navigation.navigate("OrderDetails", {
                            id: x.id,
                            userName: x.data.userName,
                            phone: x.data.phone,
                            zone: x.data.location,
                          })
                        }
                        style={styles.pickupButtonContainer}
                      >
                        {type == "pick" ? (
                          <Text style={styles.pickupButton}>Pick</Text>
                        ) : (
                          <Text style={styles.pickupButton}>Drop</Text>
                        )}
                      </Pressable>
                      {/* <Pressable style={styles.cancelButtonContainer}>
            <Text style={styles.cancelButton}>c</Text>
          </Pressable> */}
                    </View>
                  </View>
                ) : null
              )
            ) : (
              <Text style={styles.noOrder}> No Orders yet</Text>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
    // </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  nav: {
    marginVertical: "7%",
    marginHorizontal: "19%",
    width: width * 0.6,
    flexDirection: "row",
    alignContent: "center",
    justifyContent: "space-between",
  },
  noOrder: {
    fontSize: normalize(25),
    marginTop: "50%",
    marginLeft: "25%",
  },
  unselected: {
    fontSize: normalize(19),
  },
  selected: {
    color: "#3C4DBD",
    fontSize: normalize(19),
    fontWeight: "bold",
  },
  home: {
    marginHorizontal: "10%",
    height: height,
  },
  card: {
    marginVertical: "2%",
    padding: "7%",
    borderWidth: 1,
    borderColor: "#cbc",
    borderRadius: 20,
  },
  cardTitle: {
    fontSize: normalize(20),
    marginBottom: "6%",
    // color:"#3C4DBD"
  },
  userCard: {
    borderWidth: 1,
    borderColor: "lightgrey",
    margin: "2%",
    borderRadius: 15,
    flexDirection: "row",
    padding: "3%",
    marginBottom: "9%",
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
    marginBottom: "10%",
  },
  dataTitles: {
    fontSize: normalize(19),
    // color: '#999',
    marginTop: "2%",
    marginLeft: "5%",
  },
  pickupButtonContainer: {
    backgroundColor: "#1a1f87",
    borderRadius: 35,
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

export default DriverHome;
