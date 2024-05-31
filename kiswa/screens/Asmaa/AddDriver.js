import React, { useState } from "react";
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
} from "react-native";
import { Block, Checkbox, Text, theme } from "galio-framework";

import { Button, Icon, Input, Select } from "../../components";
import { Images, argonTheme } from "../../constants";

import { Dropdown } from "react-native-element-dropdown";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";

import validator from "validator";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../../config";

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

import { db, storage } from "../../config";

const { width, height } = Dimensions.get("screen");

const AddDriver = ({ navigation }) => {
  const [chosenDate, setChosenDate] = useState(new Date());
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
      //setFileName(result.uri.substring(result.uri.toString().lastIndexOf("/") +1));
      let c = result.uri.substring(result.uri.toString().lastIndexOf("/") + 1);
      setFileName(c);
    }
  };

  const storage = getStorage();
  const storageRef = ref(storage, "some-child");

  const uploadImage = async () => {
    console.log("got in upload");
    const imgRef = ref(storage, fileName);
    const img = await fetch(image);
    const bytes = await img.blob();
    await uploadBytesResumable(imgRef, bytes);
  };

  const max = new Date();
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [qId, setQId] = useState("");
  const [dob, setDob] = useState(new Date());
  const [zone, setZone] = useState("");

  // const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false);

  // const [image, setImage] = useState();
  const [url, setUrl] = useState();
  //const [fileName, setFileName] = useState();
  const [datePicker, setDatePicker] = useState(false);

  const [FnameError, setFnameError] = useState();
  const [LnameError, setLnameError] = useState();
  const [phoneError, setPhoneError] = useState();
  const [emailError, setEmailError] = useState();
  const [qIdError, setQIdError] = useState();
  const [dobError, setDobError] = useState();
  const [msg, setMsg] = useState(false);
  const [flag, setFlag] = useState(true);

  const [ZoneError, setZoneError] = useState(true);

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
    if (Platform.OS === "android") {
      setIsPickerShow(false);
    }
  };

  const zones = [
    { label: " All Zones", value: "0" },
    { label: "Duhail", value: "1" },
    { label: "Al Rayyan", value: "2" },
    { label: "Rumeilah", value: "3" },
    { label: "Wadi Al Sail", value: "4" },
    { label: "Al Daayen", value: "5" },
    { label: "Umm Salal", value: "6" },
    { label: "Al Wakra", value: "7" },
    { label: "Al Khor", value: "8" },
    { label: "Al Shamal", value: "9" },
    { label: "Al Shahaniya", value: "10" },
  ];

  const add = async () => {
    alert("Driver Added");
    try {
      uploadImage();
      const docRef = doc(db, "drivers", email.toLowerCase());
      await setDoc(docRef, {
        fname: Fname,
        email: email,
        lname: Lname,
        phone: phone,
        qId: qId,
        dob: dob,
        zone: zone,
        image: fileName,
      });
      handleRegister();
      console.log("Document written with ID: ", docRef.id);
      navigation.goBack();
    } catch (err) {
      console.log(err.message);
    }
  };

  const password = 123456;
  const handleRegister = () => {
    console.log("in regstr...");
    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        console.log("registend done");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  const validOne = (x) => {
    setFlag(false);
    switch (x) {
      case 1:
        Fname == "" ? setFnameError(true) : setFnameError(false);
        //setFname(value)
        break;
      case 2:
        Lname == "" ? setLnameError(true) : setLnameError(false);
        // setLname(value)
        break;
      case 3:
        qId.length != 11 ? setQIdError(true) : setQIdError(false);
        // setQId(value)
        break;
      case 4:
        phone.length != 8 ? setPhoneError(true) : setPhoneError(false);
        // setPhone(value)
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
        alert(zone);
    }
  };

  const validCreate = () => {
    try {
      !FnameError &&
      !LnameError &&
      !emailError &&
      !phoneError &&
      !qIdError &&
      zone &&
      image &&
      !flag &&
      !dobError
        ? add()
        : setMsg(true);
    } catch (err) {
      console.log("Errrorrrrr is", err.message);
    }
  };

  const cheack = (value, type) => {
    if (type == "phone") {
      if (value.length == 8) {
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
    }
  };

  return (
    <Block flex middle>
      <Block safe flex style={{ marginTop: 50 }}>
        <Text style={{ fontSize: 30 }}>Add</Text>

        <Block style={styles.registerContainer}>
          <Block flex>
            <Block center width={width * 0.4} style={styles.box}>
              <Pressable onPress={pickImage}>
                <Image
                  style={styles.profileImage}
                  source={{
                    uri: image
                      ? image
                      : "https://static.vecteezy.com/system/resources/previews/000/376/489/original/add-user-vector-icon.jpg",
                  }}
                />
                {image ? (
                  <Text style={styles.name}>Change</Text>
                ) : (
                  <Text style={styles.name}>Add </Text>
                )}
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
                  Please Fill al feilds and select image!
                </Text>
              ) : null}
            </View>

            {/*------- Form ---------*/}
            <Block flex center>
              <ScrollView>
                <KeyboardAvoidingView
                  style={{ flex: 1 }}
                  behavior="padding"
                  enabled
                >
                  <Block
                    width={width * 0.8}
                    style={{
                      marginTop: 15,
                      marginBottom: 5,
                      flexDirection: width > 500 ? "row" : "",
                    }}
                  >
                    <View
                      style={{
                        width: width > 500 ? width / 2.5 : width - 10,
                        marginRight: width > 500 ? 5 : 0,
                      }}
                    >
                      <Text style={styles.text}>First Name</Text>
                      <TextInput
                        autoCorrect={false}
                        style={[
                          styles.smallInput,
                          { borderColor: FnameError ? "red" : "black" },
                        ]}
                        placeholder="Joe"
                        value={Fname}
                        onChangeText={setFname}
                        onBlur={() => validOne(1)}
                      />
                    </View>

                    <View
                      style={{
                        width: width > 500 ? width / 2.5 : width - 10,
                        marginLeft: width > 500 ? 15 : 0,
                      }}
                    >
                      <Text style={styles.text}>Last Name</Text>
                      <TextInput
                        autoCorrect={false}
                        style={[
                          styles.smallInput,
                          { borderColor: LnameError ? "red" : "black" },
                        ]}
                        placeholder="Grek"
                        value={Lname}
                        onChangeText={setLname}
                        onBlur={() => validOne(2)}
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
                        width: width > 500 ? width / 2.5 : width - 10,
                        marginRight: width > 500 ? 5 : 0,
                      }}
                    >
                      <Text style={styles.text}>Qatar ID</Text>
                      <TextInput
                        autoCorrect={false}
                        keyboardType="number-pad"
                        inputMode="numeric"
                        style={[
                          styles.smallInput,
                          { borderColor: qIdError ? "red" : "black" },
                        ]}
                        placeholder="30101200033"
                        value={qId}
                        onChangeText={(value) => cheack(value, "id")}
                        onBlur={() => validOne(3)}
                        maxLength={11}
                      />
                    </View>

                    <View
                      style={{
                        width: width > 500 ? width / 2.5 : width - 10,
                        marginLeft: width > 500 ? 15 : 0,
                      }}
                    >
                      <Text style={styles.text}>Phone</Text>
                      <TextInput
                        autoCorrect={false}
                        keyboardType="number-pad"
                        style={[
                          styles.smallInput,
                          { borderColor: phoneError ? "red" : "black" },
                        ]}
                        placeholder="66005500"
                        value={phone}
                        onChangeText={(value) => cheack(value, "phone")}
                        onBlur={() => validOne(4)}
                        maxLength={8}
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
                        width: width > 500 ? width / 2.5 : width - 10,
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
                        value={email}
                        onChangeText={(value) => cheack(value, "email")}
                        onBlur={() => validOne(5)}
                      />
                    </View>

                    {/* <View style={styles.con}> */}
                    <View
                      style={{
                        width: width > 500 ? width / 2.5 : width - 10,
                        marginLeft: width > 500 ? 16 : 0,
                      }}
                    >
                      {/* Display the selected date */}
                      <Text style={styles.text}>Date of Birth</Text>
                      <Pressable
                        style={styles.pickedDateContainer}
                        onPress={showPicker}
                      >
                        <Text style={styles.pickedDate}>
                          {date.toDateString()}
                        </Text>
                      </Pressable>

                      {/* The date picker */}
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
                        />
                      )}
                      {isPickerShow && (
                        <View
                          style={{
                            flexDirection: "row",
                            justifyContent: "space-between",
                            width: "70%",
                            padding: 5,
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
                    </View>
                  </Block>

                  {/*--------- Buttons ----------*/}

                  <Block
                    right
                    width={width * 0.84}
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      borderWidth: 0,
                    }}
                  >
                    <Block
                      width={width > 500 ? width / 2.5 : width - 10}
                      style={{ marginTop: 10 }}
                    >
                      <Text style={styles.text}>Zone</Text>

                      <Dropdown
                        style={[styles.smallInput, { padding: 11 }]}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        data={zones}
                        maxHeight={160}
                        labelField="label"
                        valueField="value"
                        placeholder={zone ? zone : "Select zone"}
                        value={zone}
                        onChange={(item) => {
                          setZone(item.label);
                          setZoneError(false);
                        }}
                      ></Dropdown>
                      <Text
                        style={{
                          textAlign: "center",
                          color: "red",
                          fontSize: 12,
                        }}
                      >
                        {ZoneError}
                      </Text>
                    </Block>
                    <Button
                      color="success"
                      style={styles.createButton}
                      onPress={validCreate}
                    >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Add
                      </Text>
                    </Button>
                    <Button
                      style={styles.cancelButton}
                      onPress={() => navigation.goBack()}
                    >
                      <Text bold size={14} color={argonTheme.COLORS.WHITE}>
                        Cancel
                      </Text>
                    </Button>
                  </Block>
                </KeyboardAvoidingView>
              </ScrollView>
            </Block>
          </Block>
        </Block>
      </Block>
    </Block>
  );
};

const styles = StyleSheet.create({
  smallInput: {
    // width: {100%},
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    fontSize: 20,
    borderWidth: 0.3,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
  },
  text: {
    fontSize: 20,
  },
  registerContainer: {
    width: width * 0.9,
    height: height * 0.875,
    backgroundColor: "#F4F5F7",
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

  inputIcons: {
    marginRight: 12,
  },
  passwordCheck: {
    paddingLeft: 15,
    paddingTop: 13,
    paddingBottom: 30,
  },
  createButton: {
    width: width * 0.18,
    marginBottom: 20,
  },
  cancelButton: {
    width: width * 0.18,
    marginBottom: 20,
    backgroundColor: theme.COLORS.MUTED,
  },

  imageContainer: {
    // width: "100%",
    // height: "20%",
    borderWidth: 2,
  },
  box: {
    marginTop: 10,
    backgroundColor: "white",
    alignItems: "center",
    shadowColor: "black",
    shadowOpacity: 0.3,
    shadowOffset: {
      height: 1,
      width: -2,
    },
    elevation: 2,
    paddingTop: 10,
    paddingBottom: 0,
  },
  profileImage: {
    width: width * 0.3,
    height: width * 0.3,
    marginBottom: 0,
  },
  name: {
    fontSize: 35,
    marginBottom: 0,
    fontWeight: "bold",
    color: "#1E90FF",
    textAlign: "center",
  },

  dropdown: {
    //marginBottom: 10,
    padding: 7,
    borderRadius: 4,
    borderColor: argonTheme.COLORS.INPUT_ERROR,
    height: 44,
    backgroundColor: "#FFFFFF",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
    elevation: 2,
  },

  con: {
    // borderWidth:1,
    //height:"30%",
    // width: "70%",
    borderRadius: 10,
    paddingHorizontal: 13,
    fontSize: 20,
  },
  pickedDateContainer: {
    // width: "100%",
    padding: 17,
    backgroundColor: "#FFF",
    borderRadius: 10,
    borderWidth: 0.3,
  },
  pickedDate: {
    fontSize: 18,
    color: "black",
  },
  btnContainer: {
    padding: 30,
  },
  // This only works on iOS
  datePicker: {
    width: 320,
    height: 260,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
});

export default AddDriver;
