import {
  Alert,
  StatusBar,
  Image,
  Dimensions,
  Text,
  PixelRatio,
  Platform,
  Pressable,
  StyleSheet,
} from "react-native";
import React from "react";

import { Button, Icon } from "react-native-elements";
import Onboarding from "react-native-onboarding-swiper";
import MaterialIcons from "react-native-vector-icons";
import { useEffect } from "react";
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

//onboarding page to welcome first time users and give them a introduction of what the app is for
const AppOnboard = ({ route, navigation }) => {
  useEffect(() => {
    alert(
      "This APP is a capstone project for 2023, developed by UDST students."
    );
  }, []);
  return (
    <Onboarding
      showDone={true}
      style={{ fontSize: 20 }}
      onSkip={() => navigation.navigate("Onboarding")}
      //stores the data in pages array, and each object is for a different page
      //the properties are title, subtitile, background color, and an image
      pages={[
        {
          title:
            width < 500 ? (
              "Welcome to Rahma!"
            ) : (
              <Text style={styles.tit}>Welcome to Rahma!</Text>
            ),

          subtitle:
            width < 500 ? (
              "Rahma is a free platform on which you can either choose to become a donor and donate clothes or a receiver and receive clothes."
            ) : (
              <Text style={styles.subTit}>
                Rahma is a free platform on which you can either choose to
                become a donor and donate clothes or a receiver and receive
                clothes.
              </Text>
            ),
          backgroundColor: "#3C4DBD",

          image: (
            <Image
              style={{
                width: width > 500 ? width * 0.92 : width * 0.8,
                height: width > 500 ? height * 0.2 : height * 0.1,
                position: "relative",
              }}
              source={require("../../assets/Fatima/white.png")}
            />
          ),
        },
        {
          title:
            width < 500 ? (
              "Environment Friendly"
            ) : (
              <Text style={styles.tit}>Environment Friendly</Text>
            ),
          subtitle:
            width < 500 ? (
              "We accept clothes of all quality types. The good quality ones go to people who requested them, and the worn out ones go to recycling organizations."
            ) : (
              <Text style={styles.subTit}>
                We accept clothes of all quality types. The good quality ones go
                to people who requested them, and the worn out ones go to
                recycling organizations.
              </Text>
            ),
          backgroundColor: "#3C4DBD",
          image: (
            <Image
              style={{ width: width * 0.7, height: height * 0.4 }}
              source={require("../../Images/eco-friendly.gif")}
            />
          ),
        },
        {
          title:
            width < 500 ? (
              "Secured Privacy"
            ) : (
              <Text style={styles.tit}>Secured Privacy</Text>
            ),
          subtitle:
            width < 500 ? (
              "We do not ask for any personal information other than the necessary contact information. All of your personal details are private and will never be shared with anyone."
            ) : (
              <Text style={styles.subTit}>
                We do not ask for any personal information other than the
                necessary contact information. All of your personal details are
                private and will never be shared with anyone.
              </Text>
            ),

          backgroundColor: "#3C4DBD",
          image: (
            <Image
              style={{ width: width * 0.7, height: height * 0.4 }}
              source={require("../../Images/privacy.gif")}
            />
          ),
        },
        {
          title:
            width < 500 ? (
              "Door-to-door service"
            ) : (
              <Text style={styles.tit}>Door-to-door service</Text>
            ),
          subtitle:
            width < 500 ? (
              "We will come to your house to pick-up/deliver the donation."
            ) : (
              <Text style={styles.subTit}>
                We will come to your house to pick-up/deliver the donation.
              </Text>
            ),
          backgroundColor: "#3C4DBD",
          image: (
            <Image
              style={{ width: width * 0.8, height: height * 0.4 }}
              source={require("../../Images/home.gif")}
            />
          ),
        },
        {
          //this button takes you to the login page
          title: (
            <Text style={{ color: "#FFF", fontSize: normalize(24) }}>
              Are You Ready?
            </Text>
          ),
          subtitle: (
            <Pressable
              style={{
                width: width * 0.45,
                height: height * 0.06,
                backgroundColor: "#ff9d76",
                alignContent: "center",
                justifyContent: "center",
                borderRadius: 20,
                marginTop: "3%",
                // borderWidth: 1,
              }}
              onPress={() => {
                navigation.navigate("Onboarding"); //can put Home here instead of onboard //basically whatever page you want the user to go to after they press 'get started'
                StatusBar.setBarStyle("default");
              }}
            >
              <Text
                style={{
                  fontSize: normalize(22),
                  textAlign: "center",
                  color: "#fff",
                }}
              >
                Get Started
              </Text>
            </Pressable>
          ),
          backgroundColor: "#3C4DBD",
          image: (
            <Image
              style={{
                width: width * 0.8,
                height: width > 500 ? height * 0.2 : height * 0.1,
              }}
              source={require("../../assets/Fatima/white.png")}
            />
          ),
        },
      ]}
    />
  );
};

export default AppOnboard;

const styles = StyleSheet.create({
  tit: {
    color: "#FFF",
    fontSize: normalize(18),
    textAlign: "center",
    // fontFamily: Platform.OS === "ios" ? "Cochin" : "",
    fontWeight: "600",
  },
  subTit: {
    marginTop: "2%",
    color: "#FFF",
    fontSize: normalize(14),
    textAlign: "center",
    // fontFamily: Platform.OS === "ios" ? "Cochin" : "",
    fontWeight: "300",
  },
});
//https://blog.openreplay.com/setting-up-onboarding-screens-in-react-native/
//to clear up data on android emulator
//npx react-native run-android
//after runnning this command you should (or maybe not idk) be able to see the onboarding screens againn
//whitelogo url
//https://raw.githubusercontent.com/AsmaaZaoud/rahmaaApp/Fatima/rahma/assets/Fatima/Whitelogo-noBackground.png
