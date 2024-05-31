import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Image,
  TextInput,
  View,
  Pressable,
  Platform,
  ScrollView,
  PixelRatio,
  SafeAreaView,
} from "react-native";
import { Block, Text, theme } from "galio-framework";

import Icon from "react-native-vector-icons/FontAwesome";
import { argonTheme } from "../../constants";
import Theme from "../../constants/Theme";
import DateTimePicker from "@react-native-community/datetimepicker";
import * as ImagePicker from "expo-image-picker";
import validator from "validator";

//Firebase
import { signOut } from "firebase/auth";
import { auth, db } from "../../config";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable } from "firebase/storage";

const { width, height } = Dimensions.get("screen");
const scale = width / 700;
export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

const InventoryClerkProfile = ({ navigation }) => {
  // user
  let user = auth.currentUser.email;
  // data
  const [data, setData] = useState({});

  // read from db
  const read = async () => {
    const docRef = doc(db, "inventoryWorkers", user);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data());
      setData(docSnap.data());
      setFname(docSnap.data().fname);
      setLname(docSnap.data().lname);
      setPhone(docSnap.data().phone);
      setEmail(docSnap.data().email);
      setImage(docSnap.data().image);
      setDob(docSnap.data().dob.toDate());
      setQId(docSnap.data().qId);
    } else {
      console.log("No such document!");
    }
  };

  // update data ------------------------
  const update = async () => {
    setEditFlag(false);
    hidePicker();
    await updateImage();
    console.log(Fname, Lname, phone, dob);
    const docRef = doc(db, "inventoryWorkers", user);
    await setDoc(
      docRef,
      { fname: Fname, lname: Lname, phone: phone, dob: dob },
      { merge: true }
    )
      .then(() => {
        console.log("data updated");
        read();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  // update image
  const updateImage = async () => {
    const docRef = doc(db, "inventoryWorkers", user);
    await setDoc(docRef, { image: image }, { merge: true })
      .then(() => {
        console.log("data updated");
        read();
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    read();
  }, []);

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
  // upload image
  const uploadImage = async () => {
    console.log("got in upload");
    const imgRef = ref(storage, fileName);
    const img = await fetch(image);
    const bytes = await img.blob();
    await uploadBytesResumable(imgRef, bytes);
  };

  //Date pick ----------------------------------
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
  // constants ----------------------------------
  const [Fname, setFname] = useState("");
  const [Lname, setLname] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [qId, setQId] = useState("");
  const [dob, setDob] = useState();
  const [zone, setZone] = useState("");
  // Eroors
  const [FnameError, setFnameError] = useState();
  const [LnameError, setLnameError] = useState();
  const [phoneError, setPhoneError] = useState();
  const [emailError, setEmailError] = useState();
  const [qIdError, setQIdError] = useState();
  const [dobError, setDobError] = useState();
  const [msg, setMsg] = useState(false);
  const [flag, setFlag] = useState(true);

  // Add data ----------------------------------
  const add = async () => {
    alert("add");
    uploadImage();
    const docRef = doc(db, "inventoryWorkers", email);
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
    console.log("Document written with ID: ", docRef.id);
    navigation.goBack();
  };

  // validations
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
    }
  };

  const validCreate = () => {
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

  const onSignOut = () => {
    signOut(auth)
      .then(() => navigation.navigate("Login"))
      .catch((error) => console.log("Error logging out: ", error));
  };

  const [editFlag, setEditFlag] = useState(false);

  return (
    <SafeAreaView>
      <View
        style={{
          backgroundColor: "#3C4DBD",
          height: height / 10,
          padding: "5%",
          flexDirection: "row",
        }}
      >
        <Block>
          <Image
            source={require("../../assets/Fatima/WhiteLogo.png")}
            style={{ width: "1%", height: "2%" }}
            width={width * 0.2}
            height={height * 0.04}
          />
        </Block>
        <Block
          style={{
            justifyContent: "center",
            marginLeft: "17%",
            alignItems: "center",
          }}
          width={width * 0.2}
          height={height * 0.04}
        >
          <Text style={{ color: "white", fontSize: 20 }}>Profile</Text>
        </Block>
        <Block
          style={{ alignSelf: "right", marginLeft: "28%", width: "5%" }}
          width={width * 0.2}
          height={height * 0.04}
        >
          <Icon name="sign-out" size={30} color="white" onPress={onSignOut} />
        </Block>
        <Block
          style={{ justifyContent: "right", width: "5%" }}
          width={width * 0.2}
          height={height * 0.04}
        >
          <Icon name="user" size={30} color="white" />
        </Block>
      </View>
      <Block
        safe
        flex
        style={{
          marginTop: 50,
          flex: 1,
        }}
      >
        <Block style={[styles.registerContainer]}>
          <Block flex>
            <Pressable onPress={() => navigation.goBack()}>
              <Text style={{ color: "blue", fontSize: 20 }}> Back</Text>
            </Pressable>

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

                {/* {image?<Text style={styles.name}>Change</Text>:<Text style={styles.name}>Add photo</Text>} */}
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
                            marginLeft: "6%",
                          },
                        ]}
                        placeholder="Joe"
                        value={Fname}
                        onChangeText={setFname}
                        onBlur={() => validOne(1)}
                        editable={false}
                      />
                    </View>

                    <View style={{ width: "45%" }}>
                      <Text style={styles.text}>Last Name</Text>
                      <TextInput
                        editable={false}
                        autoCorrect={false}
                        style={[
                          styles.xsmalInput,
                          {
                            marginLeft: "5%",
                          },
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
                    <View style={styles.con}>
                      {/* Display the selected date */}
                      <Text style={[styles.text, { marginLeft: "8%" }]}>
                        Date of Birth
                      </Text>
                      <Pressable
                        style={[
                          styles.pickedDateContainer,
                          {
                            marginLeft: "9%",
                          },
                        ]}
                        onPress={editFlag ? showPicker : null}
                      >
                        <Text style={styles.pickedDate}>
                          {dob
                            ? dob.toLocaleDateString()
                            : date.toLocaleDateString()}
                        </Text>
                      </Pressable>
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
                          {
                            borderColor: emailError ? "red" : "black",
                            borderWidth: editFlag ? 0.3 : 0,
                          },
                        ]}
                        placeholder="abc@example"
                        value={data.email}
                        onChangeText={(value) => cheack(value, "email")}
                        onBlur={() => validOne(5)}
                        // editable={false}
                      />
                    </View>

                    <View
                      style={{
                        width: width > 500 ? "50%" : "100%",
                        marginLeft: width > 500 ? 15 : 0,
                      }}
                    >
                      <Text style={[styles.text, { marginLeft: "7%" }]}>
                        Phone
                      </Text>
                      <TextInput
                        autoCorrect={false}
                        keyboardType="number-pad"
                        style={[
                          styles.smallInput,
                          {
                            borderColor: phoneError ? "red" : "black",
                            borderWidth: editFlag ? 0.3 : 0,
                            marginLeft: "8%",
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
                      justifyContent: "center",
                    }}
                  >
                    {editFlag ? (
                      <View style={{ flexDirection: "row" }}>
                        <Pressable
                          mode="contained"
                          color={Theme.COLORS.SUCCESS}
                          style={[styles.CancelButton]}
                          onPress={() => setEditFlag(false)}
                        >
                          <Text style={styles.ButtonText}>Cancel</Text>
                        </Pressable>
                        <Pressable style={styles.DoneButton} onPress={update}>
                          <Text style={styles.ButtonText}>Save</Text>
                        </Pressable>
                      </View>
                    ) : (
                      <View
                        style={{
                          marginLeft: "60%",
                        }}
                      >
                        {/* <Pressable
                          color={Theme.COLORS.SUCCESS}
                          style={[styles.CancelButton]}
                          onPress={() =>
                            navigation.navigate("InventoryClerkHomePage")
                          }
                        >
                          <Text style={styles.ButtonText}>Cancel</Text>
                        </Pressable> */}
                        <Pressable
                          style={styles.EditButton}
                          onPress={() => setEditFlag(!editFlag)}
                        >
                          <Text style={styles.ButtonText}>Edit</Text>
                        </Pressable>
                      </View>
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
  // Container
  registerContainer: {
    backgroundColor: "white",
    width: width * 0.9,
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
    marginLeft: "5%",
    padding: "4%",
  },
  box: {
    marginTop: 10,
  },
  // Inputs
  xsmalInput: {
    width: "100%",
    backgroundColor: "#EBEBEB",
    color: "#878083",
    borderRadius: 10,
    padding: "5%",
    fontSize: normalize(18),
    marginLeft: "6%",
  },
  smallInput: {
    width: "90%",
    backgroundColor: "#EBEBEB",
    borderRadius: 10,
    padding: "5%",
    fontSize: 20,
    color: "#878083",
    marginLeft: "5%",
  },
  text: {
    fontSize: normalize(20),
    color: "#111",
    marginLeft: "3%",
  },
  // Image
  profileImage: {
    width: width * 0.2,
    height: width * 0.2,
    marginBottom: 0,
    borderRadius: 100,
    borderWidth: 0.3,
  },
  con: {
    width: "70%",
    borderRadius: 10,
    fontSize: 20,
  },
  // Date Picker
  pickedDateContainer: {
    width: width * 0.37,
    height: height * 0.05,
    padding: "4%",
    borderRadius: 10,
    backgroundColor: "#EBEBEB",
    fontSize: 26,
  },
  pickedDate: {
    fontSize: normalize(18),
    color: "#878083",
  },
  btnContainer: {
    padding: 30,
  },
  // This only works on iOS
  datePicker: {
    width: width * 0.4,
    height: height * 0.2,
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  },
  // Buttons
  DoneButton: {
    borderRadius: 50,
    width: 120,
    padding: 10,
    backgroundColor: Theme.COLORS.SUCCESS,
    marginLeft: "40%",
    alignSelf: "center",
  },
  CancelButton: {
    borderRadius: 50,
    width: 120,
    padding: 10,
    backgroundColor: Theme.COLORS.ERROR,
    alignSelf: "center",
    marginLeft: "10%",
  },
  EditButton: {
    borderRadius: 50,
    width: 130,
    padding: 10,
    // marginLeft: "40%",
    backgroundColor: "#3C4DBD",
    alignSelf: "center",
  },
  ButtonText: { color: "white", alignSelf: "center", fontSize: 22 },
});

export default InventoryClerkProfile;
