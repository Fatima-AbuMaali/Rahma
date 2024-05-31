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
} from "react-native";
import { Block, theme } from "galio-framework";
import {
  Feather,
  FontAwesome,
  Ionicons,
  MaterialCommunityIcons,
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
  onSnapshot,
  setDoc,
} from "firebase/firestore";
import { db } from "../../config";
import { signOut } from "firebase/auth";
import { Tab, TabView } from "@rneui/themed";
import DriverHistory from "./DriverHistory";
import DriverProfile from "./DriverProfile";
import DriverHome from "./DriverHome";
import Drivers from "./Drivers";
import DriverMap from "./DriverMap";
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
const DriverDash = ({ route, navigation }) => {
  let user = auth?.currentUser?.email;

  async function schedulePushNotification(noti) {
    await Notifications.scheduleNotificationAsync(noti);
  }
  const id = route.params;
  const [deviceType, setDeviceType] = useState("");
  useEffect(() => {
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
    getNotifications();
  }, []);

  const [index, setIndex] = useState(0);
  const onSignOut = () => {
    signOut(auth)
      .then(() => navigation.navigate("Login"))
      .catch((error) => console.log("Error logging out: ", error));
  };

  const [notifications, setNotifications] = useState([]);
  const getNotifications = async () => {
    const collectionRef = collection(db, "drivers", user, "notifications");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      querySnapshot.docs.map((doc) =>
        doc.data().seen == "false"
          ? schedulePushNotification({
              content: {
                title: doc.data().title,
                body: doc.data().body,
                data: { data: "goes here" },
              },
              trigger: { seconds: 1 },
            })
          : doc.data()
      );
      setNotifications(querySnapshot.docs.map((doc) => doc.id));
    });

    // notifications.map((x) => update(x));

    return () => unsubscribe();
  };

  return (
    <Block flex>
      <View
        style={{
          backgroundColor: "#3C4DBD",
          width: width,
          height: height * 0.1,
        }}
      >
        <View style={styles.topl}>
          <Image
            source={require("../../assets/Fatima/white.png")}
            style={{ width: 150, height: 50 }}
            width={width * 0.35}
            height={height * 0.062}
          />
          <Pressable onPress={onSignOut}>
            <Feather
              name="log-out"
              size={deviceType == "mobile" ? 35 : 45}
              color="white"
            />
          </Pressable>
        </View>
      </View>

      <TabView value={index} onChange={setIndex} disableTransition disableSwipe>
        {/*--------- Home -------------*/}
        <TabView.Item style={styles.comp}>
          {/* <View style={styles.board}> */}
          <DriverHome navigation={navigation} />
          {/* </View> */}
        </TabView.Item>

        {/*--------- History -------------*/}
        <TabView.Item style={styles.comp}>
          <DriverHistory navigation={navigation} />
        </TabView.Item>
        {/*--------- Profile -------------*/}
        <TabView.Item style={styles.comp}>
          <DriverProfile navigation={navigation} />
          {/* <Drivers /> */}
        </TabView.Item>
      </TabView>
      <Tab
        value={index}
        onChange={setIndex}
        indicatorStyle={{
          backgroundColor: "#fff",
          height: 0.0,
        }}
        style={{
          height: 70,
          // borderWidth: 1,
          backgroundColor: "white",
        }}
      >
        <Tab.Item
          onChange={setIndex}
          value={2}
          title="Boys"
          style={{
            borderBottomColor: index == 0 ? "#af9ec6" : "white",
            borderBottomWidth: 0,
            backgroundColor: "white",
          }}
        >
          <FontAwesome
            color={index == 0 ? "#3C4DBD" : "black"}
            name="home"
            size={deviceType == "mobile" ? 45 : 45}
          />
        </Tab.Item>

        <Tab.Item
          onChange={setIndex}
          value={4}
          title="Girls"
          style={{
            borderBottomColor: index == 1 ? "#af9ec6" : "white",
            borderBottomWidth: 0,
            backgroundColor: "white",
          }}
        >
          <FontAwesome
            color={index == 1 ? "#3C4DBD" : "black"}
            name="history"
            size={deviceType == "mobile" ? 45 : 45}
          />
          {/* <Text style={{ fontSize: normalize(19) }}>Clerk</Text> */}
        </Tab.Item>
        <Tab.Item
          onChange={setIndex}
          value={5}
          title="Girls"
          style={{
            borderBottomColor: index == 3 ? "#af9ec6" : "white",
            borderBottomWidth: 0,
            backgroundColor: "white",
          }}
        >
          <FontAwesome
            color={index == 2 ? "#3C4DBD" : "black"}
            name="user-circle"
            size={deviceType == "mobile" ? 40 : 45}
          />
          {/* <Text style={{ fontSize: normalize(19) }}>Inventory</Text> */}
        </Tab.Item>
      </Tab>
    </Block>
  );
};
const styles = StyleSheet.create({
  topl: {
    width: width * 0.97,
    padding: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#3C4DBD",
    marginTop: "3%",
  },
  comp: {
    //width: width,
    // height: height * 0.2,
    backgroundColor: "white",
  },
});

export default DriverDash;
