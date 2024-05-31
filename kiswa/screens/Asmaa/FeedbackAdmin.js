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
  SafeAreaView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Feather, MaterialIcons, AntDesign } from "react-native-vector-icons";
import { signOut } from "firebase/auth";
import { db } from "../../config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
} from "firebase/firestore";
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

const FeedbackAdmin = (props, { navigation }) => {
  const id = props.email;
  console.log(id);
  const [deviceType, setDeviceType] = useState("");

  // const [arr, setArr] = useState([]);
  const [feedback, setFeedback] = useState([]);

  const readFeedback = async () => {
    const collectionRef = collection(db, "feedback");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setFeedback(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return () => unsubscribe();
  };

  useEffect(() => {
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
    readFeedback();
    // alert("feed");
  }, []);

  const deleteFeedBack = async (id) => {
    const docf = doc(db, "feedback", id); //remove feedback
    await deleteDoc(docf)
      .then(() => {
        alert("Feedbacke removed");
        readFeedback();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <SafeAreaView height={deviceType == "mobile" ? 600 : 800}>
      <Block middle style={{ backgroundColor: "white" }}>
        <Block>
          <Block>
            <Text style={styles.title}>Feedback</Text>

            <FlatList
              style={styles.notificationList}
              enableEmptySections={true}
              data={feedback}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => {
                return (
                  <View style={styles.notificationBox} key={item.id}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        paddingHorizontal: "2%",
                        paddingVertical: "1%",
                      }}
                    >
                      <Text style={styles.description}>{item.data.user} </Text>
                      <Text style={styles.description}>
                        {item.data.dateTime}
                      </Text>
                    </View>

                    <View
                      style={{
                        borderWidth: 0.6,
                        width: width * 0.9,
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
                      {item.data.type == "donor" ? (
                        <Image
                          style={styles.icon}
                          source={require("../../assets/Asmaa/donorFeedback.png")}
                        />
                      ) : (
                        <Image
                          style={styles.icon}
                          source={require("../../assets/Asmaa/familyFeedback.png")}
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
                            flexDirection: "row",
                            //   width: "50%",
                            // borderWidth: 1,
                            padding: "1%",
                            justifyContent: "space-between",
                          }}
                        >
                          {/* <MaterialIcons name="location-pin" size={25} />
                        <Text style={styles.description}>{item.location}</Text>
                        <Text style={styles.description}>{item.location}</Text> */}
                          <Text style={styles.description}>
                            {item.data.comment}
                          </Text>
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
                      <Pressable
                        onPress={() => deleteFeedBack(item.id)}
                        style={{
                          marginLeft: "16%",
                        }}
                      >
                        <AntDesign
                          name="delete"
                          size={normalize(46)}
                          color="red"
                        />
                      </Pressable>
                    </View>
                  </View>
                );
              }}
            />
          </Block>
        </Block>
      </Block>
    </SafeAreaView>
  );
};

export default FeedbackAdmin;

const styles = StyleSheet.create({
  topl: {
    width: width * 0.97,
    padding: "2%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#5e1e7f",
    marginTop: "3%",
  },
  title: {
    fontSize: normalize(30),
    marginTop: "5%",
    marginLeft: "5%",
  },

  notificationList: {
    marginTop: "1%",
    // padding: "3%",
    // borderWidth: 1,
    backgroundColor: "white",
  },
  notificationBox: {
    width: width * 0.9,
    // padding: "5%",
    // paddingTop: "1%",
    marginTop: "2%",
    marginBottom: "3%",
    backgroundColor: "#E9F2FA",
    // flexDirection: "row",
    borderRadius: 20,
    borderWidth: 0.3,
  },
  icon: {
    width: normalize(80),
    height: normalize(80),
  },
  description: {
    fontSize: width > 500 ? normalize(20) : normalize(28),
    // color: "#3498db",
    marginLeft: "3%",
    // textAlign: "center",
  },
});
