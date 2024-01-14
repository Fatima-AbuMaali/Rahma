import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Pressable,
  Button,
  Dimensions,
} from "react-native";
import { useState, useEffect } from "react";

import {
  Fontisto,
  AntDesign,
  Entypo,
  FontAwesome5,
  FontAwesome,
  EvilIcons,
  Ionicons,
} from "react-native-vector-icons";

import React from "react";
import { Block, Checkbox, Text, theme, NavBar, Icon } from "galio-framework";
import { Header } from "../../components";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  deleteDoc,
  updateDoc,
  deleteField,
  onSnapshot,
} from "firebase/firestore";
import { auth, db } from "../../config";
import * as Notifications from "expo-notifications";
import { normalize } from "../Syeda/Home";
import { signOut } from "firebase/auth";

const { width, height } = Dimensions.get("screen");

const FamilyHome = ({ route, navigation }) => {
  const id = route.params;
  //------------------------------------------------------------
  async function schedulePushNotification(noti) {
    await Notifications.scheduleNotificationAsync(noti);
  }
  const [notifications, setNotifications] = useState([]);
  const getNotifications = async () => {
    const collectionRef = collection(db, "families", id, "notifications");
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

    notifications.map((x) => update(x));

    return () => unsubscribe();
  };
  const update = async (id) => {
    await setDoc(
      doc(db, "families", id, "notifications"),
      {
        seen: "true",
      },
      { merge: true }
    )
      .then(() => {
        console.log("data updated");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  //------------------------------------------------------------
  // console.log(id);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    getFamily();
    getNotifications();
  }, [id]);

  useEffect(() => {
    getCart();
  }, [id]);

  const getFamily = async () => {
    console.log(id);
    const docRef = doc(db, "families", id);
    const docSnap = await getDoc(docRef);
    // let temp = [];

    if (docSnap.exists()) {
      //console.log("Document data:", docSnap.data());
      setUserName(docSnap.data().userName);
      //   setNanny(temp);
      console.log(userName);
    } else {
      console.log("No such document!");
    }
  };
  const [cartId, setCartId] = useState("");

  const getCart = async () => {
    console.log(id);
    console.log("in cartt..");
    const q = query(
      collection(db, "familyRequests"),
      where("familyID", "==", id),
      where("cart", "==", "open")
    );
    console.log("gett.");
    const docs = await getDocs(q);
    // console.log(docs.forEach((doc) => doc.data()));
    let temp = [];
    docs.forEach((doc) => {
      console.log("mm");
      temp.push({
        id: doc.id,
        data: doc.data(),
      });
    });
    console.log(temp);
    if (temp.length > 0) {
      console.log(temp);
      setCartId(temp[0].id);
      console.log("carttID..", temp[0].id);
    } else {
      console.log("no open cart");
      // console.log(cartId);
      NewCart();
    }
  };
  const NewCart = async () => {
    const docRef = await addDoc(collection(db, "familyRequests"), {
      familyID: id,
      cart: "open",
      status: "pending",
    });

    console.log("NewCart add with ID: ", docRef.id, "for user ", id);
    setCartId(docRef.id);
  };
  //sign out
  const onSignOut = () => {
    signOut(auth)
      .then(() => navigation.navigate("Onboarding"))
      .catch((error) => console.log("Error logging out: ", error));
  };

  console.log(cartId);
  const renderArticles = () => {
    return (
      <View
        style={{
          backgroundColor: "white",
          width: "100%",
          height: "90%",
          flex: 1,
        }}
      >
        {/* welcome user */}
        <Block style={styles.header1}>
          <Block>
            <Text style={styles.text}>Welcome,</Text>
            <Text style={styles.textt}>{userName}</Text>
          </Block>
          <Block>
            <Image
              style={{
                width: 90,
                height: 90,
              }}
              source={require("../../assets/Fatima/donation.png")}
            ></Image>
          </Block>
        </Block>
        {/* about rahma */}
        <Block style={styles.header2}>
          <Text
            style={{
              color: "white",
              fontWeight: "bold",
              fontSize: normalize(20),
            }}
          >
            Rahma
          </Text>
          <Text
            style={{ width: "66%", color: "white", fontSize: normalize(15) }}
          >
            We connect with clothing donators to fulfill your requests while
            protecting your privacy and security.
          </Text>
        </Block>
        {/* request and history */}
        <Block>
          <Block style={styles.header3}>
            <TouchableOpacity
              onPress={() => navigation.navigate("FamilyRequest", id)}
            >
              <Block style={styles.box1}>
                <Image
                  source={require("../../assets/imgs/requstClothes.png")}
                  style={{
                    width: width / 5.4,
                    height: 100,
                  }}
                ></Image>
                <Text style={styles.tit}>Request Clothes</Text>
              </Block>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate("RequestHistory", id)}
            >
              <Block style={styles.box2}>
                <Image
                  source={require("../../assets/imgs/rqustHistory.png")}
                  style={{
                    width: width / 5.4,

                    height: 100,
                  }}
                ></Image>
                <Text style={styles.tit}>Requests History</Text>
              </Block>
            </TouchableOpacity>
          </Block>
          {/* feedback */}

          <Block style={styles.box3}>
            <Pressable
              onPress={() => navigation.navigate("FamilyFeedback", id)}
              styles={{ backgroundColor: "gray" }}
            >
              <Image
                source={require("../../assets/imgs/feedback.png")}
                style={{
                  width: width > 500 ? width / 7 : 100,

                  height: width > 500 ? height / 10 : 100,
                  marginLeft: width > 500 ? 20 : 0,
                }}
              ></Image>
              <Text style={styles.tit}>Give Feedback</Text>
            </Pressable>
          </Block>
        </Block>
      </View>
    );
  };
  return (
    <Block flex style={styles.home}>
      <Block
        style={{
          // flex: 1,
          backgroundColor: "#3C4DBD",
          width: width,
          height: height * 0.1,
        }}
      >
        <View style={styles.topl}>
          <Image
            source={require("../../assets/Fatima/white.png")}
            style={{ width: 150, height: 50 }}
            width={width < 500 ? width * 0.35 : width * 0.25}
            height={width < 500 ? height * 0.05 : height * 0.06}
          />

          <Pressable
            style={{
              justifyContent: "center",
              // marginTop: "3%",
              marginRight: "2%",
            }}
            onPress={onSignOut}
          >
            <Text style={{ color: "#FFF", fontSize: normalize(17) }}>
              Log Out
            </Text>
          </Pressable>
        </View>
      </Block>
      {renderArticles()}
      <Block
        style={{
          height: "8%",
          backgroundColor: "#FFFAFA",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          borderColor: "lightgray",
          borderWidth: 1,
          // marginBottom: "1%",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{ width: "14%" }}
          onPress={() => navigation.navigate("FamilyHome", id)}
        >
          <Entypo name="home" color={"#f8a069"} size={42} />
        </Pressable>

        <Pressable
          style={{ width: "14%", marginRight: "7%", marginLeft: "7%" }}
          onPress={() => navigation.navigate("FamilyCart", { cartId, id })}
        >
          <FontAwesome5 name="shopping-cart" color="#1a1f87" size={38} />
        </Pressable>

        <Pressable
          style={{ width: "14%" }}
          onPress={() => navigation.navigate("FamilyProfile", id)}
        >
          <FontAwesome name="user-circle" color="#1a1f87" size={40} />
        </Pressable>
      </Block>
    </Block>
  );
};

export default FamilyHome;

const styles = StyleSheet.create({
  home: {
    width: width,
    // backgroundColor: "#490066",
    // height: "100%",
  },
  topl: {
    width: width,
    padding: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#3C4DBD",
    marginTop: width < 500 ? 10 : 3,
  },
  tit: {
    fontSize: normalize(15),
  },
  header1: {
    // marginTop: "10%",
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    // marginLeft: "6%",
    margin: "10%",
    marginBottom: "4%",
    width: "80%",
  },
  header2: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    marginLeft: "6%",
    height: "15%",
    backgroundColor: "#1a1f87",
    borderRadius: 10,
    width: "86%",
    marginBottom: "8%",
  },
  header3: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginLeft: "7%",
    height: "35%",
    borderRadius: 10,
    // backgroundColor: "gray",
    width: "84%",
  },
  text: {
    fontSize: 24,
    margin: 5,
  },
  textt: {
    fontSize: 27,
    margin: 5,
    fontWeight: "bold",
    color: "#B21807",
  },
  box1: {
    width: width / 2.5,
    height: height / 6,
    backgroundColor: "#E6EBFD",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderColor: "lightgray",
    borderWidth: 2,
  },
  box2: {
    // width: 160,
    width: width / 2.5,

    // height: 150,
    height: height / 6,

    backgroundColor: "#FFF8E5",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderColor: "lightgray",
    borderWidth: 2,
  },
  box3: {
    // width: 160,
    width: width / 2.5,
    height: height / 6,

    // height: 150,
    marginLeft: "7%",
    marginTop: "7%",
    backgroundColor: "#EDFDF9",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 8,
    borderColor: "lightgray",
    borderWidth: 2,
  },
});
