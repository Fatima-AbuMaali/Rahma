//galio
import { Block, GalioProvider, theme } from "galio-framework";

// React
import React, { Component, useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  ScrollView,
  Pressable,
  FlatList,
  Text,
  SafeAreaView,
  View,
  TouchableOpacity,
  Modal,
  StatusBar,
  Image,
} from "react-native";
import { DataTable } from "react-native-paper";

import { Card, Divider } from "@rneui/themed";

// Dropdown
import { Dropdown } from "react-native-element-dropdown";

// const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;

// Icons
import Icon from "react-native-vector-icons/FontAwesome";
// //////// DB ///////////
import { db } from "../../config";
import {
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  setDocs,
  addDoc,
  onSnapshot,
} from "firebase/firestore";
import { Button, Header } from "@rneui/base";
import { Touchable } from "react-native";
import Theme from "../../constants/Theme";
import {
  ClothTypeData as ClothTypeData,
  SizeData as SizeData,
  ColorData as ColorData,
  GenderData as GenderData,
  QualityData as QualityData,
  AgeCategory as AgeCategory,
} from "../../components/Fatima/Data";
import { signOut } from "firebase/auth";
import { auth } from "../../config";

const { height, width } = Dimensions.get("screen");
const scale = width / 830;
export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

const InventoryClerkHomePage = ({ navigation }) => {
  const [deviceType, setDeviceType] = useState("");
  useEffect(() => {
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
  }, []);
  // const
  // const [selectedItem, setSelectedItem] = useState();
  let selectedItem = {};
  const [items, setItems] = useState([]);
  const [id, setID] = useState("");
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [quality, setQuality] = useState("");
  const [color, setColor] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  //
  const [addModalVisible, setAddModalVisible] = useState(false);

  //
  const onSignOut = () => {
    signOut(auth)
      .then(() => navigation.navigate("Login"))
      .catch((error) => console.log("Error logging out: ", error));
  };
  // ////////////////////////////////////////// //
  // DB
  const reformat = (doc) => {
    return { id: doc.id, ...doc.data() };
  };

  useEffect(() => {
    const listenAll = () => {
      onSnapshot(collection(db, "inventory"), (snap) =>
        setItems(snap.docs.map(reformat))
      );
    };
    listenAll();
  }, []);

  const set = async () => {
    await addDoc(collection(db, "inventory"), {
      type: type,
      size: size,
      quality: quality,
      color: color,
      gender: gender,
      available: true,
      age: age,
    })
      .then(() => {
        console.log("data submitted");
      })
      .catch((error) => {
        console.log(error.message);
      });
    setID("");
    setType("");
    setSize("");
    setQuality("");
    setColor("");
    setGender("");
    setAge("");
    if (addModalVisible) {
      setAddModalVisible(!addModalVisible);
    }
  };

  // change edit
  const changeEdit = (item) => {
    setEditModalVisible(!editModalVisible);
    setID(item.id);
    setType(item.type);
    setSize(item.size);
    setQuality(item.quality);
    setColor(item.color);
    setGender(item.gender);
    setAge(item.age);
    console.log(item);
    for (let i in item) {
      selectedItem[i] = item[i];
    }
    console.log(selectedItem);
  };
  // Update -- edit
  const update = async () => {
    const docRef = doc(db, "inventory", id);
    await setDoc(
      docRef,
      {
        type: type,
        size: size,
        quality: quality,
        color: color,
        gender: gender,
        age: age,
        available: true,
      },
      { merge: true }
    )
      .then(() => {
        submit();
        console.log("data updated");
        setEditModalVisible(!editModalVisible);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // edit modal
  const [editModalVisible, setEditModalVisible] = useState(false);

  // validations
  const [error, setError] = useState({ satus: false, key: null, msg: "" });
  const submit = () => {
    type == null || type == ""
      ? setError({ satus: true, key: "type", msg: "Chose type!" })
      : size == null || size == ""
      ? setError({ satus: true, key: "size", msg: "Chose size!" })
      : color == null || color == ""
      ? setError({
          satus: true,
          key: "color",
          msg: "Choose Color!",
        })
      : gender == null || gender == ""
      ? setError({
          satus: true,
          key: "gender",
          msg: "Choose Gender!",
        })
      : age == null || age == ""
      ? setError({
          satus: true,
          key: "age",
          msg: "Choose Age Category!",
        })
      : quality == null || quality == ""
      ? setError({
          satus: true,
          key: "quality",
          msg: "Choose Quality!",
        })
      : set() && setError({ satus: false, key: null, msg: "" });
  };

  const cancel = () => {
    setID("");
    setType("");
    setSize("");
    setQuality("");
    setColor("");
    setGender("");
    setAge("");
    setAddModalVisible(!addModalVisible);
  };
  return (
    <SafeAreaView
      style={{
        overflow: "scroll",
        height: height,
      }}
    >
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
            source={require("../../assets/Fatima/white.png")}
            style={{ width: "1%", height: "2%" }}
            width={width * 0.23}
            height={height * 0.05}
          />
        </Block>
        <Block style={{ justifyContent: "center", marginLeft: "21%" }}>
          <Text style={{ color: "white", fontSize: 20 }}>Inventory Clerk</Text>
        </Block>
        <Block style={{ marginLeft: "30%", width: "5%" }}>
          <Icon name="sign-out" size={30} color="white" onPress={onSignOut} />
        </Block>
        <Block style={{ width: "5%" }}>
          <Icon
            name="user"
            size={30}
            color="white"
            onPress={() => navigation.navigate("InventoryClerkProfile")}
            // onPress={<InventoryClerkProfile id={id} />}
          />
        </Block>
      </View>
      <Card>
        <Button
          shadowless
          color={Theme.COLORS.SUCCESS}
          onPress={() => setAddModalVisible(!addModalVisible)}
          style={{ marginLeft: "1%", marginBottom: "2%" }}
        >
          Add Item
        </Button>
        <Card.Divider />
        <DataTable>
          <DataTable.Header>
            <DataTable.Title>ID</DataTable.Title>
            <DataTable.Title>Type</DataTable.Title>
            <DataTable.Title>Size</DataTable.Title>
            <DataTable.Title>Color</DataTable.Title>
            <DataTable.Title>Gender</DataTable.Title>
            <DataTable.Title>Age</DataTable.Title>
            <DataTable.Title>Quality</DataTable.Title>
            <DataTable.Title>Edit</DataTable.Title>
          </DataTable.Header>
          <ScrollView vertical="true" style={{ height: height / 1.35 }}>
            {items.map((i, x) =>
              i.available == true ? (
                <DataTable.Row key={x} style={{ height: "1%" }}>
                  <DataTable.Cell id={i.id}>{[x + 1]}</DataTable.Cell>
                  <DataTable.Cell id={i.id}>{i.type}</DataTable.Cell>
                  <DataTable.Cell id={i.id}>{i.size}</DataTable.Cell>
                  <DataTable.Cell id={i.id}>{i.color}</DataTable.Cell>
                  <DataTable.Cell id={i.id}>{i.gender}</DataTable.Cell>
                  <DataTable.Cell id={i.id}>{i.age}</DataTable.Cell>
                  <DataTable.Cell id={i.id}>{i.quality}</DataTable.Cell>
                  <DataTable.Cell>
                    <Button
                      shadowless
                      color={Theme.COLORS.WARNING}
                      onPress={() => changeEdit(i)}
                      style={{
                        alignSelf: "center",
                        marginTop: "9%",
                        borderRadius: 20,
                      }}
                    >
                      Edit
                    </Button>
                  </DataTable.Cell>
                </DataTable.Row>
              ) : null
            )}
          </ScrollView>
        </DataTable>
      </Card>
      {/* Add Data Modal */}
      <Modal animationType="slide" transparent={true} visible={addModalVisible}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={{
                fontSize: 20,
                alignSelf: "center",
                fontWeight: "bold",
                margin: 20,
              }}
            >
              Add Items
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={ClothTypeData}
              labelField="label"
              valueField="value"
              id="value"
              maxHeight={200}
              search
              searchPlaceholder="Search..."
              animated={false}
              value={type}
              placeholder={"Type"}
              onChange={(item) => {
                setType(item.value);
              }}
            />
            {/* {console.log(ClothTypeData)} */}
            {error.key == "type" && error.satus && (
              <Text style={styles.errorMessage}>{error.msg}</Text>
            )}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={SizeData}
              labelField="label"
              valueField="value"
              maxHeight={200}
              id="value"
              search
              searchPlaceholder="Search..."
              animated={false}
              value={size}
              placeholder={"Size"}
              onChange={(item) => {
                setSize(item.value);
              }}
            />
            {error.key == "size" && error.satus && (
              <Text style={styles.errorMessage}>{error.msg}</Text>
            )}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={ColorData}
              labelField="label"
              valueField="value"
              id="value"
              maxHeight={200}
              search
              searchPlaceholder="Search..."
              animated={false}
              value={color}
              placeholder={"Color"}
              onChange={(item) => {
                setColor(item.value);
              }}
            />
            {error.key == "color" && error.satus && (
              <Text style={styles.errorMessage}>{error.msg}</Text>
            )}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={GenderData}
              labelField="label"
              valueField="value"
              id="value"
              maxHeight={200}
              search
              searchPlaceholder="Search..."
              animated={false}
              value={gender}
              placeholder={"Gender"}
              onChange={(item) => {
                setGender(item.value);
              }}
            />
            {error.key == "gender" && error.satus && (
              <Text style={styles.errorMessage}>{error.msg}</Text>
            )}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={AgeCategory}
              labelField="label"
              valueField="value"
              id="value"
              maxHeight={200}
              search
              searchPlaceholder="Search..."
              animated={false}
              value={age}
              placeholder={"Age Category"}
              onChange={(item) => {
                setAge(item.value);
              }}
            />
            {error.key == "age" && error.satus && (
              <Text style={styles.errorMessage}>{error.msg}</Text>
            )}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={QualityData}
              labelField="label"
              valueField="value"
              id="value"
              maxHeight={200}
              search
              searchPlaceholder="Search..."
              animated={false}
              value={quality}
              placeholder={"Quality"}
              onChange={(item) => {
                setQuality(item.value);
              }}
            />
            {error.key == "quality" && error.satus && (
              <Text style={styles.errorMessage}>{error.msg}</Text>
            )}
            <Block
              style={{
                // borderWidth: 1,
                width: width * 0.6,
                flexDirection: "row",
                alignSelf: "center",
                justifyContent: "space-between",
              }}
            >
              <Pressable
                color={Theme.COLORS.PRIMARY}
                style={[styles.cancelButton]}
                onPress={() => {
                  cancel();
                }}
              >
                <Text
                  style={{
                    color: "white",
                    alignSelf: "center",
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                color={Theme.COLORS.PRIMARY}
                style={[styles.button]}
                onPress={() => {
                  submit();
                }}
              >
                <Text
                  style={{
                    color: "white",
                    alignSelf: "center",
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Done
                </Text>
              </Pressable>
            </Block>
          </View>
        </View>
      </Modal>
      {/* Update Data Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text
              style={{
                fontSize: 20,
                alignSelf: "center",
                fontWeight: "bold",
                margin: 20,
              }}
            >
              Edit Item
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={ClothTypeData}
              labelField="label"
              valueField="value"
              id="value"
              maxHeight={200}
              search
              searchPlaceholder="Search..."
              animated={false}
              value={type}
              placeholder={selectedItem.type}
              onChange={(item) => {
                setType(item.value);
              }}
            />
            {/* {console.log(ClothTypeData)} */}
            {error.key == "type" && error.satus && (
              <Text style={styles.errorMessage}>{error.msg}</Text>
            )}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={SizeData}
              labelField="label"
              valueField="value"
              maxHeight={200}
              id="value"
              search
              searchPlaceholder="Search..."
              animated={false}
              value={size}
              placeholder={"Size"}
              onChange={(item) => {
                setSize(item.value);
              }}
            />
            {error.key == "size" && error.satus && (
              <Text style={styles.errorMessage}>{error.msg}</Text>
            )}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={ColorData}
              labelField="label"
              valueField="value"
              id="value"
              maxHeight={200}
              search
              searchPlaceholder="Search..."
              animated={false}
              value={color}
              placeholder={"Color"}
              onChange={(item) => {
                setColor(item.value);
              }}
            />
            {error.key == "color" && error.satus && (
              <Text style={styles.errorMessage}>{error.msg}</Text>
            )}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={GenderData}
              labelField="label"
              valueField="value"
              id="value"
              maxHeight={200}
              search
              searchPlaceholder="Search..."
              animated={false}
              value={gender}
              placeholder={"Gender"}
              onChange={(item) => {
                setGender(item.value);
              }}
            />
            {error.key == "gender" && error.satus && (
              <Text style={styles.errorMessage}>{error.msg}</Text>
            )}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={AgeCategory}
              labelField="label"
              valueField="value"
              id="value"
              maxHeight={200}
              search
              searchPlaceholder="Search..."
              animated={false}
              value={age}
              placeholder={"Age Category"}
              onChange={(item) => {
                setAge(item.value);
              }}
            />
            {error.key == "age" && error.satus && (
              <Text style={styles.errorMessage}>{error.msg}</Text>
            )}
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              data={QualityData}
              labelField="label"
              valueField="value"
              id="value"
              maxHeight={200}
              search
              searchPlaceholder="Search..."
              animated={false}
              value={quality}
              placeholder={"Quality"}
              onChange={(item) => {
                setQuality(item.value);
              }}
            />
            {error.key == "quality" && error.satus && (
              <Text style={styles.errorMessage}>{error.msg}</Text>
            )}

            <Block
              style={{
                // borderWidth: 1,
                width: width * 0.6,
                flexDirection: "row",
                alignSelf: "center",
                justifyContent: "space-between",
              }}
            >
              <Pressable
                color={Theme.COLORS.PRIMARY}
                style={[styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text
                  style={{
                    color: "white",
                    alignSelf: "center",
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Cancel
                </Text>
              </Pressable>
              <Pressable
                color={Theme.COLORS.PRIMARY}
                style={[styles.button]}
                onPress={() => {
                  update(selectedItem);
                }}
              >
                <Text
                  style={{
                    color: "white",
                    alignSelf: "center",
                    fontSize: 15,
                    fontWeight: "bold",
                  }}
                >
                  Done
                </Text>
              </Pressable>
            </Block>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};
export default InventoryClerkHomePage;

const styles = StyleSheet.create({
  productItem: {
    width: cardWidth - theme.SIZES.BASE * 2,
    marginHorizontal: theme.SIZES.BASE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 7 },
    shadowRadius: 10,
    shadowOpacity: 0.2,
  },
  vertical: {
    marginBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  centeredView: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 170,
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: "5%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 10,
    width: 100,
    padding: 10,
    backgroundColor: "#1a1f87",
    alignSelf: "center",
    marginTop: "10%",
  },
  cancelButton: {
    borderRadius: 10,
    width: 100,
    padding: 10,
    backgroundColor: "#F5365C",
    alignSelf: "center",
    // marginLeft: "30%",
    marginTop: "10%",
  },
  dropdown: {
    margin: "2%",
    height: height / 18,
    backgroundColor: "white",
    borderRadius: 12,
    padding: "1.2%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  inputSearchStyle: {
    // height: "30%",
    fontSize: 16,
  },
  errorMessage: {
    color: "red",
    paddingLeft: "3%",
    fontSize: 16,
    fontWeight: "bold",
  },
});
