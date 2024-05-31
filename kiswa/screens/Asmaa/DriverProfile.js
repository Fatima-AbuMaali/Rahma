import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Image,
  TextInput,
  View,
  Pressable,
  TouchableOpacity,
  Platform,
  ScrollView,
  PixelRatio,
  Modal,
  SafeAreaView,
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Icon, Input, Select } from "../../components";
import { Images, argonTheme } from "../../constants";

import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import { Button } from "react-native-paper";

import validator from "validator";

import {
  Feather,
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "react-native-vector-icons";

//Firebase
import { signOut } from "firebase/auth";
import { auth, db, storage } from "../../config";
import {
  doc,
  setDoc,
  getDocs,
  getDoc,
  addDoc,
  collection,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";

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

const DriverProfile = (props) => {
  useEffect(() => {
    read();
  }, []);

  const navigation = props.navigation;
  let id = auth?.currentUser?.email;

  const [data, setData] = useState({});

  const read = async () => {
    const docRef = doc(db, "drivers", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setData(docSnap.data());
      setFname(docSnap.data().fname);
      setLname(docSnap.data().lname);
      setPhone(docSnap.data().phone);
      setEmail(docSnap.data().email);
      setImage(docSnap.data().image);
      setDob(docSnap.data().dob?.toDate());
      setQId(docSnap.data().qId);
    } else {
      console.log("No such document!");
    }
  };

  const update = async () => {
    setEditFlag(false);
    setMsg(false);
    const docRef = doc(db, "drivers", id);
    await setDoc(docRef, { phone: phone, image: image }, { merge: true })
      .then(() => {
        console.log("data updated");
        read();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  //Image pick  -----------------
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState();
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
      setMsg(false);
      let c = result.uri.substring(result.uri.toString().lastIndexOf("/") + 1);
      setFileName(c);
    }
  };

  //Image upload----------------
  const storage = getStorage();
  const storageRef = ref(storage, "some-child");

  const uploadImage = async () => {
    console.log("got in upload");
    const imgRef = ref(storage, fileName);
    const img = await fetch(image);
    const bytes = await img.blob();
    await uploadBytesResumable(imgRef, bytes);
  };

  //Date pick -------------

  const max = new Date();
  const [isPickerShow, setIsPickerShow] = useState(false);
  const [date, setDate] = useState(new Date(Date.now()));

  const showPicker = () => {
    setIsPickerShow(true);
  };
  const hidePicker = () => {
    setIsPickerShow(false);
  };

  const onChange = (event, value) => {
    setDate(value);
    setDob(value);
  };

  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [qId, setQId] = useState("");
  const [dob, setDob] = useState();
  const [zone, setZone] = useState("");

  const [FnameError, setFnameError] = useState();
  const [LnameError, setLnameError] = useState();
  const [phoneError, setPhoneError] = useState();
  const [emailError, setEmailError] = useState();
  const [qIdError, setQIdError] = useState();
  const [dobError, setDobError] = useState();
  const [msg, setMsg] = useState(false);
  const [flag, setFlag] = useState(true);

  const [editModalVisible, setEditModalVisible] = useState(false);

  const validOne = (x) => {
    setFlag(false);
    switch (x) {
      case 1:
        Fname == "" ? setFnameError(true) : setFnameError(false);
        break;
      case 2:
        Lname == "" ? setLnameError(true) : setLnameError(false);
        break;
      case 3:
        qId.length != 11 ? setQIdError(true) : setQIdError(false);
        break;
      case 4:
        phone.length != 8 ? setPhoneError(true) : setPhoneError(false);
        break;
      case 5:
        validator.isEmail(email) == false
          ? setEmailError(true)
          : setEmailError(false);

        break;
      case 6:
        dob == "" ? setDobError(true) : setDobError(false);
        break;
      case 7:
      //alert(zone)
    }
  };

  const validUpdate = () => {
    !phoneError ? update() : setMsg(true);
  };

  const cheack = (value, type) => {
    if (type == "phone") {
      if (value.length === 8) {
        setPhoneError(false);
        //setPhone(value)
      }
      setPhone(value);
    } else if (type == "id") {
      if (value.length == 11) {
        setQIdError(false);
        //setPhone(value)
      }
      setQId(value);
    } else if (type == "email") {
      validator.isEmail(value) == true
        ? setEmailError(false)
        : setEmailError(true);

      setEmail(value);
    } else if (type == "fname") {
      if (value != "") {
        setFname(false);
        //setPhone(value)
      }
      setFname(value);
    }
  };

  const [editFlag, setEditFlag] = useState(false);

  return (
    <SafeAreaView style={{ height: 800, backgroundColor: "#F0F4F8" }}>
      <Block middle style={{ backgroundColor: "#F0F4F8" }}>
        <Block style={styles.registerContainer}>
          <Block flex>
            <Block center width={width * 0.4} style={styles.box}>
              <Pressable onPress={editFlag ? pickImage : null}>
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: image
                      ? image
                      : "https://cdn.onlinewebfonts.com/svg/img_266351.png",
                  }}
                />
              </Pressable>
            </Block>
            <View>
              {msg ? (
                <Text
                  style={{
                    color: "red",
                    textAlign: "center",
                    marginTop: 15,
                    fontSize: 18,
                  }}
                >
                  Please Fill al feilds!
                </Text>
              ) : null}
            </View>

            {/*------- Form ---------*/}

            <Block flex center style={{ height: height - 200 }}>
              <ScrollView>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Block
                    row
                    width={width * 0.8}
                    style={{
                      marginTop: "10%",
                      marginBottom: 5,
                      justifyContent: "space-between",
                    }}
                  >
                    <View style={{ width: "45%" }}>
                      <Text style={styles.text}>First Name</Text>
                      <TextInput
                        autoCorrect={false}
                        style={[
                          styles.xsmalInput,
                          {
                            borderColor: FnameError ? "red" : "black",
                            borderWidth: 0,
                          },
                        ]}
                        placeholder="Joe"
                        value={Fname}
                        onChangeText={(value) => cheack(value, "fname")}
                        onBlur={() => validOne(1)}
                        editable={false}
                      />
                    </View>

                    <View style={{ width: "45%" }}>
                      <Text style={styles.text}>Last Name</Text>
                      <TextInput
                        autoCorrect={false}
                        style={[
                          styles.xsmalInput,
                          {
                            borderColor: LnameError ? "red" : "black",
                            borderWidth: 0,
                          },
                        ]}
                        placeholder="Grek"
                        value={Lname}
                        onChangeText={setLname}
                        onBlur={() => validOne(2)}
                        editable={false}
                      />
                    </View>
                  </Block>

                  <Block
                    width={width * 0.8}
                    style={{
                      marginBottom: 15,
                      flexDirection: width > 500 ? "row" : "column",
                    }}
                  >
                    <View
                      style={{
                        width: width > 500 ? "50%" : "100%",
                        marginRight: width > 500 ? 5 : 0,
                      }}
                    >
                      <Text style={styles.text}>Qatar ID</Text>
                      <TextInput
                        autoCorrect={false}
                        keyboardType="number-pad"
                        inputMode="numeric"
                        style={[styles.smallInput]}
                        placeholder="30101200033"
                        value={data.qId}
                        onChangeText={(value) => cheack(value, "id")}
                        onBlur={() => validOne(3)}
                        maxLength={11}
                        editable={false}
                      />
                    </View>

                    <View
                      style={{
                        width: width > 500 ? "50%" : "100%",
                        marginLeft: width > 500 ? 15 : 0,
                      }}
                    >
                      <Text style={styles.text}>Phone</Text>
                      <TextInput
                        autoCorrect={false}
                        keyboardType="number-pad"
                        style={[
                          styles.smallInput,
                          {
                            borderColor: phoneError ? "red" : "black",
                            borderWidth: editFlag ? 0.3 : 0,
                          },
                        ]}
                        placeholder="66005500"
                        value={phone}
                        onChangeText={setPhone}
                        onBlur={() => validOne(4)}
                        maxLength={8}
                        editable={editFlag}
                      />
                    </View>
                  </Block>

                  <Block
                    width={width * 0.8}
                    style={{
                      marginBottom: 15,
                      flexDirection: width > 500 ? "row" : "column",
                    }}
                  >
                    <View
                      style={{
                        width: width > 500 ? "50%" : "100%",
                        marginRight: width > 500 ? 5 : 0,
                      }}
                    >
                      <Text style={styles.text}>Email</Text>
                      <TextInput
                        autoCorrect={false}
                        style={[
                          styles.smallInput,
                          { borderColor: emailError ? "red" : "black" },
                        ]}
                        placeholder="abc@example"
                        value={data.email}
                        onChangeText={(value) => cheack(value, "email")}
                        onBlur={() => validOne(5)}
                        editable={false}
                      />
                    </View>

                    <View style={styles.con}>
                      {/* Display the selected date */}
                      <Text style={styles.text}>Date of Birth</Text>
                      <Pressable
                        style={[
                          styles.pickedDateContainer,
                          { borderWidth: editFlag ? 0 : 0 },
                        ]}
                        // onPress={editFlag ? showPicker : null}
                      >
                        <Text style={styles.pickedDate}>
                          {dob
                            ? dob.toLocaleDateString()
                            : date.toLocaleDateString()}
                        </Text>
                      </Pressable>

                      {/* The date picker */}
                      {isPickerShow && (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "120%",
                            padding: "1%",
                            marginTop: "5%",
                          }}
                        >
                          <Pressable onPress={hidePicker}>
                            <Text style={{ fontSize: 18 }}>Cancel</Text>
                          </Pressable>
                          <Pressable onPress={hidePicker}>
                            <Text style={{ fontSize: 18 }}>Confirm</Text>
                          </Pressable>
                        </View>
                      )}
                      {isPickerShow && (
                        <DateTimePicker
                          value={date}
                          mode={"date"}
                          display={
                            Platform.OS === "ios" ? "spinner" : "default"
                          }
                          is24Hour={true}
                          onChange={onChange}
                          style={styles.datePicker}
                          maximumDate={max}
                          // editable={false}
                        />
                      )}
                    </View>
                  </Block>

                  {/*--------- Buttons ----------*/}

                  <Block
                    flex
                    width={width * 0.84}
                    height={height * 0.07}
                    style={{
                      flexDirection: "row",
                      borderWidth: 0,
                      justifyContent: "space-between",
                      marginTop: "2%",
                    }}
                  >
                    {editFlag ? (
                      <Button
                        mode="contained"
                        // buttonColor="red"
                        style={styles.cancelButton}
                        onPress={() => setEditFlag(false)}
                      >
                        <Text
                          bold
                          size={normalize(17)}
                          color={argonTheme.COLORS.WHITE}
                        >
                          Cancel
                        </Text>
                      </Button>
                    ) : (
                      <View></View>
                    )}

                    {editFlag ? (
                      <Button
                        mode="contained"
                        style={styles.createButton}
                        onPress={validUpdate}
                      >
                        <Text
                          bold
                          size={normalize(17)}
                          color={argonTheme.COLORS.WHITE}
                        >
                          Save
                        </Text>
                      </Button>
                    ) : (
                      <Button
                        mode="contained"
                        style={styles.createButton}
                        onPress={() => setEditFlag(!editFlag)}
                      >
                        <Text
                          bold
                          size={normalize(17)}
                          color={argonTheme.COLORS.WHITE}
                        >
                          Edit
                        </Text>
                      </Button>
                    )}
                  </Block>
                </KeyboardAvoidingView>
              </ScrollView>
            </Block>
          </Block>
        </Block>
      </Block>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  xsmalInput: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 18,
    fontSize: normalize(18),
    color: "#a59cae",
  },
  smallInput: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    fontSize: 20,
    color: "#a59cae",
  },

  text: {
    fontSize: normalize(20),
    color: "#111",
  },
  registerContainer: {
    backgroundColor: "#F0F4F8",
    width: width,
    height: height * 0.8,
    borderRadius: 4,
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: "hidden",
  },

  createButton: {
    width: width * 0.3,
    height: 50,
    alignContent: "center",
    justifyContent: "center",
    backgroundColor: "#1a1f87",
  },
  cancelButton: {
    width: width * 0.3,
    height: 50,
    alignContent: "center",
    justifyContent: "center",

    backgroundColor: theme.COLORS.MUTED,
  },

  box: {
    marginTop: 10,
  },
  profileImage: {
    width: width * 0.4,
    height: width * 0.4,
    marginBottom: 0,
    borderRadius: 100,
    borderWidth: 0.3,
  },
  con: {
    borderRadius: 10,
    fontSize: 20,
    marginTop: 7,
  },
  pickedDateContainer: {
    width: width * 0.8,
    padding: 18,
    backgroundColor: "#FFF",
    borderRadius: 16,
    borderWidth: 0.3,
  },
  pickedDate: {
    fontSize: normalize(18),
    color: "#a59cae",
  },

  // This only works on iOS
  datePicker: {
    width: width * 0.8,
    height: height * 0.2,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export default DriverProfile;
