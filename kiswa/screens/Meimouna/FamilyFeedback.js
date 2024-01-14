import {
  View,
  Text,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  SafeAreaView,
  Dimensions,
} from "react-native";
import React from "react";
import { useState, useEffect } from "react";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { addDoc, collection } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../config";
import { Checkbox, theme, NavBar, Icon } from "galio-framework";
const { width, height } = Dimensions.get("screen");

const FamilyFeedback = ({ route, navigation }) => {
  const [feedback, setfeedback] = useState("");
  const [feedbackText, setFeedbackText] = useState("");
  const [dateCreated, setDateCreated] = useState(new Date());
  const id = route.params;

  console.log(id);
  const [FeedbackErro, setFeedbackError] = useState("");

  const addvild = () => {
    if (feedback.length != 0) {
      setFeedbackError("");
    } else {
      setFeedbackError("Select From Above");
    }
    if (feedback.length != 0) {
      console.log("okay");
      add();
    }
  };
  const add = async () => {
    const docRef = await addDoc(collection(db, "feedback"), {
      rate: feedback,
      comment: feedbackText,
      dateTime: dateCreated.toLocaleDateString(),
      type: "family",
      user: id,
      // dateTime: new Date(),
    })
      .then(() => {
        console.log("feedback added");
        navigation.navigate("FeedbackConf", { mood: feedback, id });

        setFeedbackText("");
        setfeedback(""); //not updateing the feied feedback
        setDateCreated(new Date());
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  return (
    <SafeAreaView style={{ flex: 1, height: "100%" }}>
      <NavBar
        title="Feedback"
        style={{
          height: "10%",
          // marginBottom: "1%",
          backgroundColor: "#FFFAFA",
          borderColor: "lightgray",
          borderWidth: 1,
          // marginTop: "1%",
          width: "100%",
        }}
        titleStyle={{
          color: "#4C4AAB",
          fontSize: 22,
          fontWeight: "bold",
        }}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text></Text>

          {/* <Text></Text> */}
          {/* <Text></Text> */}
          <LinearGradient
            colors={[
              "rgba(26, 31, 135)",
              "rgba(26, 31, 135",
              "rgba(26, 31, 135)",
            ]}
            style={[
              StyleSheet.absoluteFill,
              {
                height: "100%",
                flex: 1,
                width: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#C0DAF0",
              },
            ]}
          />
          <BlurView
            // tint="light"
            intensity={100}
            style={{
              width: 350,
              height: 700,
              borderWidth: 2,
              borderColor: "#fff",
              padding: 20,
              // borderRadius: 25,
              //zIndex: 999,
            }}
          >
            <View
              style={{
                // width: "100%",
                // height: "16%",
                backgroundColor: "red",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {/* <Image
                  source={require("../../assets/imgs/feedback2.png")}
                  style={{
                    width: "35%",
                    height: "100%",
                    zIndex: 999,
                    marginBottom: "5%",
                  }}
                ></Image> */}
            </View>
            <Text></Text>
            <Text
              style={{ fontSize: 18, marginBottom: "6%", fontWeight: "bold" }}
            >
              How satisfied are you with Rahma?
            </Text>
            <Text></Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-around",
                // width: "100%",
                //justifyContent: "center",
                //backgroundColor: "red",
                height: 90,
              }}
            >
              <TouchableOpacity
                // style={{ width: "30%" }}
                style={{
                  backgroundColor: "white",
                  width: width / 4.5,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  borderWidth: 2,
                  borderColor:
                    feedback == "Excellent" ? "#1a1f87" : "lightgray",
                  padding: 2,
                }}
                onPress={() => setfeedback("Excellent")}
              >
                <Image
                  source={require("../../assets/imgs/Excellent-removebg-preview.png")}
                  style={{
                    width: "81%",
                    height: "100%",
                  }}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  width: width / 4.5,
                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  borderWidth: 2,
                  borderColor: feedback == "Mid" ? "#1a1f87" : "lightgray",
                  padding: 2,
                }}
                onPress={() => setfeedback("Mid")}
              >
                <Image
                  source={require("../../assets/imgs/medium-removebg-preview.png")}
                  style={{
                    width: "82%",
                    height: "100%",
                  }}
                ></Image>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  backgroundColor: "white",
                  width: width / 4.5,

                  borderRadius: 50,
                  justifyContent: "center",
                  alignItems: "center",
                  textAlign: "center",
                  borderWidth: 2,
                  borderColor: feedback == "Verybad" ? "#1a1f87" : "lightgray",
                  padding: 2,
                }}
                onPress={() => setfeedback("Verybad")}
              >
                <Image
                  source={require("../../assets/imgs/veryBad-removebg-preview.png")}
                  style={{
                    width: "77%",
                    height: "100%",
                    // backgroundColor: "red",
                  }}
                ></Image>
              </TouchableOpacity>
            </View>
            {FeedbackErro !== "" ? (
              <Text
                style={{
                  //textAlign: "center",
                  color: "red",
                  fontWeight: "bold",
                  fontSize: 15,
                  //marginLeft: 20,
                }}
              >
                {FeedbackErro}
              </Text>
            ) : null}

            <Text></Text>
            {/* <Text style={{ fontSize: 18, marginBottom: "2%" }}></Text> */}
            <TextInput
              value={feedbackText}
              placeholder="Do you have any thoughts you'd like to share?"
              onChangeText={setFeedbackText}
              multiline={true}
              // textAlignVertical={"top"}
              style={{
                // margin: 8,
                borderWidth: 2,
                padding: 10,
                borderRadius: 20,
                backgroundColor: "#fff",
                height: 200,
                paddingTop: 8,
                fontSize: 16,
                borderColor: "white",
              }}
            />
            {/* <Text style={{ fontSize: 15 }}>
                {feedbackText.length == 0 ? "" : feedbackText.length + " Characters"}
              </Text> */}
            {/* <Text
                style={{
                  //textAlign: "center",
                  color: "red",
                  fontWeight: "bold",
                  fontSize: 15,
                  //marginLeft: 20,
                }}
              >
                {FeedbackTextErro}
              </Text> */}
            <Text></Text>
            <Text></Text>

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Pressable
                style={{
                  // marginBottom: "10%",
                  backgroundColor: "#808080",
                  height: 50,
                  width: "40%",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  //marginLeft: "10%",
                  borderRadius: 8,
                }}
                onPress={() => navigation.replace("FamilyHome", id)}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                style={{
                  // marginBottom: "10%",
                  backgroundColor: "#1a1f87",
                  height: 50,
                  width: "40%",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  //marginLeft: "10%",
                  borderRadius: 8,
                }}
                onPress={() => addvild()}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
                >
                  Send
                </Text>
              </Pressable>
            </View>
          </BlurView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default FamilyFeedback;
