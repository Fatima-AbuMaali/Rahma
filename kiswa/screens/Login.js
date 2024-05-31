import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input } from "../components";
import { Images, argonTheme } from "../constants";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../config";

import {
  doc,
  setDoc,
  addDoc,
  collection,
  query,
  where,
  deleteDoc,
  updateDoc,
  deleteField,
  onSnapshot,
  getDocs,
  getDoc,
  Timestamp,
} from "firebase/firestore";
import { db } from "../config";
import { async } from "@firebase/util";
import { set } from "react-native-reanimated";

const { width, height } = Dimensions.get("screen");

const Login = ({ navigation }) => {
  const [deviceType, setDeviceType] = useState("");
  useEffect(() => {
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
  }, []);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [userr, setUserr] = useState("");

  // reformat
  const reformat = (doc) => {
    return { id: doc.id, ...doc.data() };
  };

  const getUser = async () => {
    if (email == "admin@admin.com") {
      navigation.navigate("AdminHome");
      return;
    }
    const driver = doc(db, "drivers", email.toLowerCase());
    const clerk = doc(db, "inventoryWorkers", email.toLowerCase());
    const family = doc(db, "families", email);
    const donor = doc(db, "donors", email.toLowerCase());

    const driverSnap = await getDoc(driver);
    const clerkSnap = await getDoc(clerk);
    const familySnap = await getDoc(family);
    const donorSnap = await getDoc(donor);

    if (driverSnap.exists()) {
      navigation.navigate("DriverDash", email);
    } else if (clerkSnap.exists()) {
      navigation.navigate("InventoryClerkHomePage");
    } else if (familySnap.exists()) {
      navigation.navigate("FamilyHome", email);
    } else if (donorSnap.exists()) {
      navigation.navigate("App");
    }
  };
  const EmailErrorStyle = () => {
    if (deviceType == "mobile" && error.key == "email") {
      return [styles.inputsSmall, styles.errorBorder];
    } else if (deviceType == "ipad" && error.key == "email") {
      return [styles.inputsLarge, styles.errorBorder];
    } else if (deviceType == "mobile" && error.key == "email&pass") {
      return [styles.inputsSmall, styles.errorBorder];
    } else if (deviceType == "ipad" && error.key == "email&pass") {
      return [styles.inputsLarge, styles.errorBorder];
    } else if (deviceType == "mobile" && error.key == "db") {
      return [styles.inputsSmall, styles.errorBorder];
    } else if (deviceType == "ipad" && error.key == "db") {
      return [styles.inputsLarge, styles.errorBorder];
    } else if (deviceType == "mobile") {
      return styles.inputsSmall;
    } else if (deviceType == "ipad") {
      return styles.inputsLarge;
    }
  };
  const PasswordErrorStyle = () => {
    if (deviceType == "mobile" && error.key == "pass") {
      return [styles.inputsSmall, styles.errorBorder];
    } else if (deviceType == "ipad" && error.key == "pass") {
      return [styles.inputsLarge, styles.errorBorder];
    } else if (deviceType == "mobile" && error.key == "email&pass") {
      return [styles.inputsSmall, styles.errorBorder];
    } else if (deviceType == "ipad" && error.key == "email&pass") {
      return [styles.inputsLarge, styles.errorBorder];
    } else if (deviceType == "mobile" && error.key == "db") {
      return [styles.inputsSmall, styles.errorBorder];
    } else if (deviceType == "ipad" && error.key == "db") {
      return [styles.inputsLarge, styles.errorBorder];
    } else if (deviceType == "mobile") {
      return styles.inputsSmall;
    } else if (deviceType == "ipad") {
      return styles.inputsLarge;
    }
  };
  const [error, setError] = useState({ satus: false, key: null, msg: "" });
  const validate = () => {
    if (
      (email == null || email == "") &&
      (password == null || password == "")
      //    ||
      // error.msg == "Firebase: Error (auth/wrong-password)."
    ) {
      setError({
        satus: true,
        key: "email&pass",
        msg: "Please Enter a Valid Email & Password",
      });
      return false;
    }

    // else if (error.msg == "auth/wrong-password") {
    // }
    else if (!email.includes("@")) {
      setError({
        satus: true,
        key: "email",
        msg: "Please Enter a Valid Email",
      });
      return false;
    } else if (password == null || password == "") {
      setError({
        satus: true,
        key: "pass",
        msg: "Please Enter Password",
      });
      return false;
    } else if (password.length < 6) {
      setError({
        satus: true,
        key: "pass",
        msg: "Password must be at least 6 charc",
      });
      return false;
    } else if (
      password != null &&
      password.length >= 6 &&
      email != null &&
      email.includes("@")
    ) {
      setError({
        satus: false,
        key: "",
        msg: "",
      });
      return true;
    }
  };
  const handleLogin = () => {
    // console.log(validate());
    if (validate() == true) {
      signInWithEmailAndPassword(auth, email, password)
        .then(async () => {
          await getUser();
          setError({ satus: false, key: null, msg: "" });
        })
        .catch((error) => {
          console.log(error.code);
          console.log(error.message.split("/")[1]);
          setError({
            satus: true,
            key: "db",
            msg: error.message.split("/")[1],
          });
          // setError({ satus: true, key: "db", msg: error.message });
        });
    } else {
      validate();
    }
  };

  return (
    <Block flex middle style={{ backgroundColor: "#3C4DBD" }}>
      <StatusBar hidden />
      {/* <ImageBackground
        source={require("../assets/Fatima/background.png")}
        style={{ width, height, zIndex: 1 }}
      > */}
      <Block safe flex middle>
        <Block
          style={
            deviceType == "mobile"
              ? styles.registerContainer
              : styles.registerContainerLarge
          }
        >
          <Text
            style={{ padding: 20, color: "blue" }}
            onPress={() => navigation.navigate("Onboarding")}
          >
            Go Back
          </Text>
          {/* comment */}
          <Block flex style={{ marginTop: "4%" }}>
            <Block flex={0.17} middle>
              <Image
                source={require("../assets/Fatima/black.png")}
                style={
                  deviceType == "mobile" ? styles.logoSmall : styles.logoLarge
                }
              />
            </Block>
            <Block flex center style={{ marginTop: "40%" }}>
              <KeyboardAvoidingView
                style={{ flex: 1 }}
                behavior="padding"
                enabled
              >
                <Block width={width * 0.8} style={{ marginBottom: 15 }}>
                  <Input
                    borderless
                    placeholder="Email"
                    value={email}
                    style={EmailErrorStyle()}
                    onChangeText={setEmail}
                    iconContent={
                      <Icon
                        size={16}
                        color={"#5A9DA0"}
                        name="ic_mail_24px"
                        family="ArgonExtra"
                        style={styles.inputIcons}
                      />
                    }
                  />
                </Block>
                <Block width={width * 0.8}>
                  <Input
                    password
                    borderless
                    placeholder="Password"
                    value={password}
                    style={PasswordErrorStyle()}
                    onChangeText={setPassword}
                    iconContent={
                      <Icon
                        size={16}
                        color={"#5A9DA0"}
                        name="padlock-unlocked"
                        family="ArgonExtra"
                        style={styles.inputIcons}
                      />
                    }
                  />
                  {error.key == "email&pass" && error.satus && (
                    <Text style={styles.errorMessage}>{error.msg}</Text>
                  )}
                  {error.key == "pass" && error.satus && (
                    <Text style={styles.errorMessage}>{error.msg}</Text>
                  )}
                  {error.key == "db" && error.satus && (
                    <Text style={styles.errorMessage}>{error.msg}</Text>
                  )}
                  {error.key == "email" && error.satus && (
                    <Text style={styles.errorMessage}>{error.msg}</Text>
                  )}
                </Block>

                <Block middle>
                  <Button
                    color="primary"
                    style={
                      deviceType == "mobile"
                        ? styles.loginSmall
                        : styles.loginLarge
                    }
                    onPress={handleLogin}
                  >
                    <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                      Log In
                    </Text>
                  </Button>
                </Block>
              </KeyboardAvoidingView>
            </Block>
          </Block>
        </Block>
      </Block>
      {/* </ImageBackground> */}
    </Block>
  );
};

const styles = StyleSheet.create({
  logoLarge: {
    width: width - theme.SIZES.BASE,
    height: theme.SIZES.BASE * 9,
    position: "relative",
    resizeMode: "contain",
    marginTop: "35%",
  },
  logoSmall: {
    width: width - theme.SIZES.BASE,
    height: theme.SIZES.BASE * 6,
    position: "relative",
    resizeMode: "contain",
    marginTop: "35%",
  },
  registerContainer: {
    width: width * 0.9,
    height: height * 0.7,
    backgroundColor: "#F4F5F7",
    borderRadius: 6,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
    justifyContent: "center",
  },
  registerContainerLarge: {
    width: width * 0.7,
    height: height * 0.7,
    backgroundColor: "#F4F5F7",
    borderRadius: 6,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
    justifyContent: "center",
  },
  inputsLarge: {
    width: "70%",
    // alignSelf: "Center",
    marginLeft: "16%",
  },
  inputsSmall: {},
  inputIcons: {
    marginRight: 12,
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30,
  },
  loginLarge: {
    width: width * 0.3,
    marginTop: 25,
    backgroundColor: "#E49D81",
  },
  signUpLarge: {
    width: width * 0.3,
    marginTop: 25,
    backgroundColor: "#F0936F",
  },
  loginSmall: {
    marginTop: 25,
    backgroundColor: "#E49D81",
  },
  signUpSmall: {
    marginTop: 25,
    backgroundColor: "#F0936F",
  },
  errorMessage: {
    alignSelf: "center",
    fontWeight: "bold",
    paddingTop: "4%",
    color: "red",
  },
  errorBorder: {
    borderColor: "red",
    borderWidth: 1,
  },
});

export default Login;
