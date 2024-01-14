import React, { useState } from "react";
import {
  Animated,
  ScrollView,
  View,
  Image,
  StyleSheet,
  Dimensions,
  ImageBackground,
  Pressable,
} from "react-native";

import { Block, Text, theme } from "galio-framework";
import {
  Fontisto,
  AntDesign,
  MaterialCommunityIcons,
  FontAwesome5,
  Feather,
  Ionicons,
  Entypo,
} from "react-native-vector-icons";
import Images from "../../constants/Images";
import { auth } from "../../config";
import { normalize } from "./Home";
import { signOut } from "firebase/auth";
const { width, height } = Dimensions.get("screen");

const AboutUs = ({ navigation }) => {
  let user = auth?.currentUser?.email;
  //sign out
  const onSignOut = () => {
    signOut(auth)
      .then(() => navigation.navigate("Onboarding"))
      .catch((error) => console.log("Error logging out: ", error));
  };
  const [fadeAnim] = useState(new Animated.Value(1));

  const handleScroll = (event) => {
    const { y } = event.nativeEvent.contentOffset;

    // Calculate the opacity based on the scroll position
    const opacity = Math.max(0, 1 - y / 100);

    // Update the opacity of the Animated.View
    Animated.timing(fadeAnim, {
      toValue: opacity,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Block flex>
      <View
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
            style={{
              width: 150,
              height: 50,
              // position: width > 500 ? "absolute" : "relative",
            }}
            width={width > 500 ? width * 0.25 : width * 0.35}
            height={width > 500 ? height * 0.06 : height * 0.05}
          />
          {user != undefined ? (
            <Pressable
              style={{
                // justifyContent: "center",
                marginTop: "1%",
                marginRight: "2%",
              }}
              onPress={onSignOut}
            >
              {/* <Feather name="log-out" size={35} color="white" /> */}
              <Text style={{ color: "#FFF", fontSize: normalize(17) }}>
                Log Out
              </Text>
            </Pressable>
          ) : (
            <Pressable
              style={{
                justifyContent: "center",
                marginTop: "1%",
                marginRight: "2%",
              }}
              onPress={() => navigation.navigate("Login")}
            >
              {/* <Feather name="log-in" size={35} color="white" /> */}
              <Text
                style={{
                  color: "#FFF",
                  fontSize: normalize(17),
                }}
              >
                Login /SignUp
              </Text>
            </Pressable>
          )}
        </View>
      </View>
      <ScrollView>
        <View style={styles.container}>
          <Text bold size={40} color="#331054">
            About Rahma
          </Text>
          <Image
            style={styles.image}
            source={{
              uri: "https://as1.ftcdn.net/v2/jpg/03/00/14/50/1000_F_300145014_WkM7fkKi1n8RbgkWajcNON69Y3pERv7n.jpg",
            }}
          ></Image>
          <Text
            style={{
              fontSize: 25,
              marginHorizontal: 20,
              fontWeight: "300",
              marginTop: 20,
            }}
          >
            Rahma is a free platform on which you can either choose to become a
            donor and donate clothes or a receiver and receive clothes.
          </Text>
          <View style={{ margin: 30 }}></View>

          <Text bold size={30} color="#32325D">
            You help the environment!
          </Text>
          <Image
            style={styles.image}
            source={{
              uri: "https://harmony1.com/wp-content/uploads/2016/05/shutterstock_19259410.jpg",
            }}
          ></Image>

          <Text
            style={{
              fontSize: 18,
              marginHorizontal: 20,
              marginTop: 20,
            }}
          >
            Artificial fibres such as polyester take anywhere from 20 to 200
            years to break down, which is extremely harmful to our environment.
            We collect clothes in any state of condition. Whether they be brand
            new or worn out, we accept them! We send them to recycling and
            upcycling projects in Qatar, that helps give new life to old
            clothes. We at Rahma, want to take an initiative towards reducing
            the carbon footprint and help save the environment.
          </Text>
          <View style={{ margin: 30 }}></View>
          <Text bold size={30} color="#32325D">
            You help the people!
          </Text>
          <Image
            style={styles.image}
            source={{
              uri: "https://as2.ftcdn.net/v2/jpg/03/07/48/99/1000_F_307489964_JQtPHVe3f7h6KYEZnKlYLrk11QZfho9r.jpg",

              // "https://harmony1.com/wp-content/uploads/2016/05/shutterstock_19259410.jpg",
            }}
          ></Image>

          <Text style={{ fontSize: 18, marginHorizontal: 20, marginTop: 20 }}>
            Whether it may be being able to give clothes to children, an outfit
            to a person, or even warm clothes during the chilly weather, you are
            helping so many people in Qatar that are deprived of necessary
            resources. We at Rahma, want to take an initiative and help change
            the lives of people, but, we can't do this without you!
          </Text>
          <View style={{ margin: 30 }}></View>
        </View>
      </ScrollView>

      <Block
        style={{
          height: "8%",
          backgroundColor: "#F2F8FF",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          borderColor: "lightgray",
          borderWidth: 1,
          marginBottom: "2%",
          alignItems: "center",
          // paddingLeft: "1%",
        }}
      >
        {user != undefined ? null : (
          <Pressable
            style={{ width: "14%" }}
            onPress={() => {
              navigation.navigate("Onboarding");
            }}
          >
            <Ionicons name="home-outline" size={40} />
          </Pressable>
        )}

        <Pressable
          style={{ width: "14%", marginRight: "7%", marginLeft: "7%" }}
          onPress={() => {
            navigation.navigate("Home");
          }}
        >
          <MaterialCommunityIcons
            name="heart-plus-outline"
            // color="#f8a069"
            size={40}
          />
        </Pressable>

        <Pressable
          style={{ width: "14%" }}
          onPress={() => navigation.navigate("AboutUs")}
        >
          <Feather name="info" color="#f8a069" size={40} />
        </Pressable>

        {user != undefined ? (
          <Pressable
            style={{ width: "14%" }}
            onPress={() => navigation.navigate("Profile")}
          >
            <AntDesign name="user" size={40} />
          </Pressable>
        ) : null}
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: "2%",
  },
  textBG: {
    // position: "absolute",
    // bottom: -30, // adjust this value as needed to control the overlap
    // height: 100,
    // alignSelf: "center",
    // borderWidth: 1,
    // borderColor: 'red',
    borderRadius: 30,
    backgroundColor: "white",
    padding: 15,
  },
  image: {
    width: width * 0.9,
    height: height * 0.25,
    borderRadius: 20,
    marginTop: 20,
  },
  topl: {
    // flex: 1,
    width: width,
    // padding: "4%",
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#3C4DBD",
    marginTop: "6%",
  },
});

export default AboutUs;
