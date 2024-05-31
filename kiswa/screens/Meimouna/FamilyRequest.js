import {
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  FlatList,
  Dimensions,
  Pressable,
  Modal,
  TextInput,
  ScrollView,
  SafeAreaView,
  KeyboardAvoidingView,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Images, argonTheme } from "../../constants";

import NumericInput from "react-native-numeric-input";
import { normalize } from "../Syeda/Home";

import { useState, useEffect } from "react";
import { Tab, TabView } from "@rneui/themed";
import React from "react";
import { Block, Checkbox, Text, theme, NavBar, Icon } from "galio-framework";
// import { Header } from "../../components";
import {
  Fontisto,
  AntDesign,
  FontAwesome5,
  Entypo,
  Ionicons,
  EvilIcons,
} from "react-native-vector-icons";
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
} from "firebase/firestore";
import { db } from "../../config";
import { color, set } from "react-native-reanimated";
const { width } = Dimensions.get("screen");

const FamilyRequest = ({ route, navigation }) => {
  const id = route.params;
  const [index, setIndex] = React.useState(0);
  const groups = { 0: "Adults", 1: "Teenagers", 2: "Kids", 3: "Baby" };

  useEffect(() => {
    getCart();
    // console.log(index);
  }, [id]);

  const data = [
    { label: "👖Jeans", value: "Jeans" },
    { label: "👚Tops", value: "Tops" },
    { label: "🧕🏻Abaya", value: "Tracksuit" },
    { label: "🧕🏻Scarfe", value: "Abaya" },
    { label: "🧥Coat", value: "Coat" },
    { label: "👗Dress", value: "Dress" },
    { label: "😴Pajamas", value: "Pajamas" },
    { label: "👕Shirt", value: "Shirt" },
    { label: "🩳Shorts", value: "Shorts" },
    { label: "🧦Sock", value: "Sock" },
    { label: "🥶Sweater", value: "Sweater" },
    { label: "👖Leggings", value: "Leggings" },
    { label: "👖Pants", value: "Pants" },

    { label: "👔Ties", value: "Tie" },
    { label: "🧣Tights", value: "Tights" },

    { label: "👕T-Shirt", value: "T-Shirt" },
    { label: "👔Blouse", value: "Blouse" },
    { label: "👘Caftan", value: "Caftan" },
  ];
  const dataBaby = [
    // { label: "🧕🏻Abaya", value: "Abaya" },
    { label: "🧥Coat", value: "Coat" },
    { label: "👗Dress", value: "Dress" },
    // { label: "👖Jeans", value: "Jeans" },
    { label: "👖Leggings", value: "Leggings" },
    { label: "👖Pants", value: "Pants" },
    { label: "😴Pajamas", value: "Pajamas" },
    { label: "👕Shirt", value: "Shirt" },
    { label: "🩳Shorts", value: "Shorts" },
    { label: "🧦Sock", value: "Sock" },
    { label: "🥶Sweater", value: "Sweater" },
    { label: "👔Tie", value: "Tie" },
    { label: "🧣Tights", value: "Tights" },
    { label: "👚Tops", value: "Tops" },
    // { label: "🧕🏻Abaya", value: "Tracksuit" },
    { label: "👕T-Shirt", value: "T-Shirt" },
    { label: "👔Blouse", value: "Blouse" },
    { label: "👘Caftan", value: "Caftan" },
  ];

  // { label: " All Colors", value: "0" },

  const colors = [
    { label: "Black", value: "1" },
    { label: "White", value: "2" },
    { label: "Red", value: "3" },
    { label: "Green", value: "4" },
    { label: "Yellow", value: "5" },
    { label: "Blue", value: "6" },
    { label: "Pink", value: "7" },
    { label: "Gray", value: "8" },
    { label: "Brown", value: "9" },
    { label: "Orange", value: "10" },
    { label: "Purple", value: "11" },
  ];
  const ClothTypeData = [
    {
      label: "👔Blouse",
      value: "Blouse",
      icon: "https://cdn-icons-png.flaticon.com/512/8323/8323136.png",
      uri: "https://i.pinimg.com/564x/d9/1b/87/d91b87a86b9924cdce26b631bd3a968e.jpg",
    },
    {
      label: "👖Jeans",
      value: "Jeans",
      icon: "https://cdn-icons-png.flaticon.com/128/599/599388.png",
      uri: "https://i.pinimg.com/564x/a2/3c/13/a23c134ebdc47581fa854c248633a8f5.jpg",
    },
    {
      label: "👘Caftan",
      value: "Caftan",
      icon: "https://cdn-icons-png.flaticon.com/512/5238/5238311.png",
      uri: "https://i.etsystatic.com/31945487/r/il/2aadec/3870275767/il_fullxfull.3870275767_od8t.jpg",
    },
    {
      label: "🧥Coat",
      value: "Coat",
      icon: "https://cdn-icons-png.flaticon.com/128/7157/7157441.png",
      uri: "https://i.pinimg.com/564x/f6/73/7d/f6737d49a2571e063cd811812c3a922c.jpg",
    },
    {
      label: "👗Dress",
      value: "Dress",
      icon: "https://cdn-icons-png.flaticon.com/128/9833/9833994.png",
      uri: "https://i.pinimg.com/564x/a9/1b/cb/a91bcb63b4c31333a9402f74200a36a3.jpg",
    },

    {
      label: "👖Pants",
      value: "Pants",
      icon: "https://cdn-icons-png.flaticon.com/128/2390/2390116.png",
      uri: "https://media.istockphoto.com/id/530930442/photo/row-of-black-pants-hangs-in-wardrobe-at-home.jpg?s=612x612&w=0&k=20&c=ZFM23HW4i3gKgfT5PplBTTajAq3L1qGG30MCjWqZliA=",
    },

    {
      label: "😴Pajamas",
      value: "Pajamas",
      icon: "https://cdn-icons-png.flaticon.com/128/4446/4446182.png",
      uri: "https://m.media-amazon.com/images/I/71K03lV+jIL._AC_UL1500_.jpg",
    },

    {
      label: "👕Shirt",
      value: "Shirt",
      icon: "https://cdn-icons-png.flaticon.com/128/2503/2503380.png",
      uri: "https://i.pinimg.com/564x/5c/16/17/5c1617cc8f266adfd425e452773dddaf.jpg",
    },
    {
      label: "🩳Shorts",
      value: "Shorts",
      icon: "https://cdn-icons-png.flaticon.com/128/2237/2237015.png",
      uri: "https://i.pinimg.com/474x/89/1b/c7/891bc76dfb42ae14d5fbda7b92f7247b.jpg",
    },
    {
      label: "👖Leggings",
      value: "Leggings",
      icon: "https://cdn-icons-png.flaticon.com/128/9381/9381563.png",
      uri: "https://i.pinimg.com/564x/9c/51/11/9c5111b9a77206aa76698ae2c41884a1.jpg",
    },
    {
      label: "🧦Sock",
      value: "Sock",
      icon: "https://cdn-icons-png.flaticon.com/128/843/843877.png",
      uri: "https://i.pinimg.com/564x/2b/ca/5f/2bca5f01f7fb038d12d5a6f9fa4127d4.jpg",
    },
    {
      label: "🥶Sweater",
      value: "Sweater",
      icon: "https://cdn-icons-png.flaticon.com/128/9385/9385884.png",
      uri: "https://i.pinimg.com/564x/d3/b2/51/d3b2515feca557aff75d23077b2479e8.jpg",
    },
    {
      label: "👔Tie",
      value: "Tie",
      icon: "https://cdn-icons-png.flaticon.com/512/1950/1950558.png",
      uri: "https://i.pinimg.com/564x/a1/6e/be/a16ebe082cb7329391b8940c8ebd07bd.jpg",
    },
    {
      label: "🧣Tights",
      value: "Tights",
      icon: "https://cdn-icons-png.flaticon.com/512/3343/3343878.png",
      uri: "https://i.pinimg.com/564x/c2/95/db/c295dba7990a244ab5e56eb52578ce92.jpg",
    },
    {
      label: "👚Tops",
      value: "Tops",
      icon: "https://cdn-icons-png.flaticon.com/128/3258/3258170.png",
      uri: "https://i.pinimg.com/564x/5c/ad/15/5cad15407e6c1e9b393337dc7d17c530.jpg",
    },
    {
      label: "🧕🏻Abaya",
      value: "Abaya",
      icon: "https://cdn-icons-png.flaticon.com/512/4185/4185577.png",
      uri: "https://i.pinimg.com/564x/bd/be/d1/bdbed16a24645a3ad9f42d2a528f6b3b.jpg",
    },
    {
      label: "👕T-Shirt",
      value: "T-Shirt",
      icon: "https://cdn-icons-png.flaticon.com/128/892/892458.png",
      uri: "https://i.pinimg.com/564x/d6/9c/5a/d69c5a1ba98ce97c40a16ff506233f7a.jpg",
    },
  ];

  const [ageGroup, setAgeGroup] = useState(groups[index]);
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState(colors[0].label);
  const [size, setSize] = useState("S");
  const [gender, setGender] = useState("Male");

  // console.log(ageGroup, type, quantity, color, size);

  const [modalVisible, setModalVisible] = useState(false);
  console.log(index);
  // const readAllWhere = async () => {
  //   const q = query(collection(db, "families"), where("email", "==", id));
  //   const docs = await getDocs(q);
  //   docs.forEach((doc) => {
  //     console.log(doc.id, " => ", doc.data());
  //     setData(doc.data());
  //     setId(doc.id);
  //   });
  // };
  const [cartId, setCartId] = useState("");
  const getCart = async () => {
    console.log(id);
    console.log("cartt..");
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
      console.log(cartId);
    } else {
      console.log("no open cart");
      NewCart();
    }
  };
  const NewCart = async () => {
    const docRef = await addDoc(collection(db, "familyRequests"), {
      familyID: id,
      cart: "open",
      status: "pending",
    });

    console.log("Request add with ID: ", docRef.id, "for user ", id);
    setCartId(docRef.id);
  };
  const [sizeError, setSizeError] = useState("");

  const Save = async () => {
    if (size == "") {
      setSizeError("Please select size");
      return;
    }
    setSizeError("");
    setModalVisible(!modalVisible);

    console.log(cartId);
    const docRef = await addDoc(
      collection(db, "familyRequests", cartId, "Items"),
      {
        ageGroup: ageGroup,
        type: type,
        quantity: quantity,
        color: color,
        size: size,
        gender: gender,
        icon: ClothTypeData.find((object) => object.value === type).icon,
      }
    )
      .then(() => {
        console.log("Request add with ID: ", "for user ", id);
        // navigation.navigate("FamilyHome");
        setAgeGroup("");
        setType("");
        setQuantity(1);
        setColor(colors[0].label);
        setSize("");
      })
      .catch((error) => {
        console.log(error.message);
        // setRegisteerError("Email is already in use");
      });
    // alert("Thank You");
  };
  // console.log(ageGroup);
  const renderArticles = () => {
    return (
      <SafeAreaView
        style={{
          backgroundColor: modalVisible ? "#F7EEF7" : "white",
          width: "100%",
          height: "100%",
        }}
      >
        <View>
          <NavBar
            title="Request Clothes"
            style={{
              height: "9%",
              marginBottom: "5%",
              backgroundColor: "#FFFAFA",
              borderColor: "lightgray",
              borderWidth: 1,
              // marginTop: "1%",
            }}
            titleStyle={{
              color: "#4C4AAB",
              fontSize: normalize(22),
              fontWeight: "bold",
            }}
          />
          <Block style={{ alignItems: "center" }}>
            <Text style={{ color: "#3c4dbd", fontSize: normalize(20) }}>
              Please Select Catagory
            </Text>
          </Block>

          <Block
            style={{
              height: "60%",
              marginTop: "2%",
              width: "100%",
              // backgroundColor: "red",
            }}
          >
            <Tab
              style={{ width: "100%", height: "26%", marginBottom: "5%" }}
              value={index}
              onChange={(e) => {
                setIndex(e);
                setAgeGroup(groups[e]);
              }}
              // indicatorStyle={{
              //   backgroundColor: "#3042BA",
              //   height: 3,
              // }}
              // variant="defualt"

              scrollable={false}
              // iconPosition="top"
              dense={true}
              disableIndicator={true}
            >
              <Tab.Item title="Adults" titleStyle={{ fontSize: normalize(14) }}>
                <Image
                  source={require("../../assets/imgs/teens.jpeg")}
                  style={{
                    width: 88,
                    height: 88,
                    borderColor: ageGroup == "Adults" ? "#F9966B" : "lightgray",
                    borderWidth: ageGroup == "Adults" ? 3 : 2,
                    borderRadius: 40,
                  }}
                />
                <Text
                  style={{
                    color: ageGroup == "Adults" ? "#F9966B" : "black",
                    fontWeight: ageGroup == "Adults" ? "bold" : "normal",
                    fontSize: normalize(16),
                  }}
                >
                  Adults
                </Text>
              </Tab.Item>
              <Tab.Item
                title="Teenagers"
                titleStyle={{ fontSize: normalize(12) }}
              >
                <Image
                  source={require("../../assets/imgs/adult.png")}
                  style={{
                    width: 88,
                    height: 90,
                    borderColor:
                      ageGroup == "Teenagers" ? "#F9966B" : "lightgray",
                    borderWidth: ageGroup == "Teenagers" ? 3 : 2,
                    borderRadius: 43,
                  }}
                />
                <Text
                  style={{
                    color: ageGroup == "Teenagers" ? "#F9966B" : "black",
                    fontWeight: ageGroup == "Teenagers" ? "bold" : "normal",
                    fontSize: normalize(15),
                  }}
                >
                  Teenagers
                </Text>
              </Tab.Item>
              <Tab.Item title="Kids" titleStyle={{ fontSize: normalize(12) }}>
                <Image
                  source={require("../../assets/imgs/kidss.jpeg")}
                  style={{
                    width: 90,
                    height: 90,
                    borderColor: ageGroup == "Kids" ? "#F9966B" : "lightgray",
                    borderWidth: ageGroup == "Kids" ? 3 : 2,
                    borderRadius: 43,
                  }}
                />
                <Text
                  style={{
                    color: ageGroup == "Kids" ? "#F9966B" : "black",
                    fontWeight: ageGroup == "Kids" ? "bold" : "normal",
                    fontSize: normalize(16),
                  }}
                >
                  Kids
                </Text>
              </Tab.Item>
              <Tab.Item title="Baby" titleStyle={{ fontSize: normalize(12) }}>
                <Image
                  source={require("../../assets/imgs/baby.png")}
                  style={{
                    width: 88,
                    height: 88,
                    borderColor: ageGroup == "Baby" ? "#F9966B" : "white",
                    borderWidth: 3,
                    borderRadius: 43,
                  }}
                />
                <Text
                  style={{
                    color: ageGroup == "Baby" ? "#F9966B" : "black",
                    fontWeight: ageGroup == "Baby" ? "bold" : "normal",
                    fontSize: normalize(16),
                  }}
                >
                  Babys
                </Text>
              </Tab.Item>
            </Tab>
            {/* ..............tab View..................... */}
            <TabView value={index} onChange={setIndex} animationType="spring">
              <TabView.Item
                style={{
                  width: "100%",
                  height: "83%",
                  // backgroundColor: "lightgray",
                }}
              >
                <View>
                  <ScrollView style={{}}>
                    <View style={styles.board}>
                      {data.map((x, i) => (
                        <Pressable
                          key={i}
                          style={[styles.circle]}
                          onPress={() => {
                            setModalVisible(true);
                            setSizeError("");
                            setType(x.value);
                            setAgeGroup(groups[index]);
                          }}
                        >
                          <Text style={styles.ct}>{x.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </TabView.Item>
              <TabView.Item style={{ width: "100%", height: "83%" }}>
                <View>
                  <ScrollView>
                    <View style={styles.board}>
                      {data.map((x, i) => (
                        <Pressable
                          key={i}
                          style={[styles.circle]}
                          onPress={() => {
                            setModalVisible(true);
                            setType(x.value);
                            setAgeGroup(groups[index]);
                          }}
                        >
                          <Text style={styles.ct}>{x.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </TabView.Item>
              <TabView.Item style={{ width: "100%", height: "83%" }}>
                <View>
                  <ScrollView>
                    <View style={styles.board}>
                      {data.map((x, i) => (
                        <Pressable
                          key={i}
                          style={[styles.circle]}
                          onPress={() => {
                            setModalVisible(true);
                            setType(x.value);
                            setAgeGroup(groups[index]);
                          }}
                        >
                          <Text style={styles.ct}>{x.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </TabView.Item>
              <TabView.Item style={{ width: "100%", height: "83%" }}>
                <View>
                  <ScrollView>
                    <View style={styles.board}>
                      {dataBaby.map((x, i) => (
                        <Pressable
                          key={i}
                          style={[styles.circle]}
                          onPress={() => {
                            setModalVisible(true);
                            setType(x.value);
                            setAgeGroup(groups[index]);
                          }}
                        >
                          <Text style={styles.ct}>{x.label}</Text>
                        </Pressable>
                      ))}
                    </View>
                  </ScrollView>
                </View>
              </TabView.Item>
            </TabView>

            {/*............ add item modual................................................... */}
            <Modal
              animationType="slide"
              transparent={true}
              visible={modalVisible}
              onRequestClose={() => {
                Alert.alert("Modal has been closed.");
                setModalVisible(!modalVisible);
              }}
            >
              <View style={styles.centeredView}>
                <View style={styles.modalView}>
                  <Block style={styles.modalblock}>
                    <Pressable onPress={() => setModalVisible(!modalVisible)}>
                      <Entypo
                        name="chevron-with-circle-left"
                        color="#3c4dbd"
                        size={40}
                      />
                    </Pressable>
                    <View>
                      <Text style={{ color: "gray", textAlign: "right" }}>
                        Request Items,
                      </Text>
                      <Text
                        style={{
                          fontSize: normalize(18),
                          fontWeight: "bold",
                          textAlign: "right",
                        }}
                      >
                        Add Item Details
                      </Text>
                    </View>
                  </Block>
                  <Block style={styles.modalblock2}>
                    <Text style={styles.modalText}>
                      {ageGroup}'s {type}
                    </Text>
                    <Block>
                      <Text
                        style={{
                          fontSize: normalize(16),
                          marginBottom: "3%",
                          marginTop: "3%",
                        }}
                      >
                        What Gender?
                      </Text>
                      <View style={styles.modalblocksize1}>
                        <Pressable
                          style={[
                            styles.size,
                            {
                              backgroundColor:
                                gender == "Male" ? "#3042BA" : "#BAD9FC",
                            },
                          ]}
                          onPress={() => setGender("Male")}
                        >
                          <Text
                            style={{
                              fontSize: normalize(13),
                              color: gender == "Male" ? "white" : "black",
                            }}
                          >
                            M
                          </Text>
                        </Pressable>
                        <Pressable
                          style={[
                            styles.size,
                            {
                              backgroundColor:
                                gender == "Female" ? "#3042BA" : "#BAD9FC",
                            },
                          ]}
                          onPress={() => setGender("Female")}
                        >
                          <Text
                            style={{
                              fontSize: normalize(13),
                              color: gender == "Female" ? "white" : "black",
                            }}
                          >
                            F
                          </Text>
                        </Pressable>
                      </View>
                      <Text
                        style={{
                          fontSize: normalize(16),
                          marginBottom: "3%",
                          marginTop: "3%",
                        }}
                      >
                        How Many {type}s?
                      </Text>
                      <NumericInput
                        iconStyle={{
                          color: "white",
                          fontWeight: "bold",
                          fontSize: normalize(22),
                        }}
                        minValue={1}
                        value={quantity}
                        // initValue={null}
                        onChange={setQuantity}
                        rounded
                        rightButtonBackgroundColor="#BAD9FC"
                        leftButtonBackgroundColor="#BAD9FC"
                        totalWidth={width > 500 ? width / 2.3 : width / 1.5}
                        totalHeight={width < 500 ? 40 : 50}
                        iconSize={20}
                        // step={1.5}
                      />
                      <KeyboardAvoidingView>
                        <Text
                          style={{
                            fontSize: normalize(16),
                            marginBottom: "3%",
                            marginTop: "7%",
                          }}
                        >
                          What Color?
                        </Text>
                        <Dropdown
                          // search
                          // selectedTextStyle={{ fontSize:normalize(30) }}
                          // searchPlaceholder="Search..."
                          style={styles.dropdown}
                          placeholderStyle={styles.placeholderStyle}
                          selectedTextStyle={styles.selectedTextStyle}
                          data={colors}
                          maxHeight={200}
                          labelField="label"
                          valueField="value"
                          placeholder={color}
                          value={color}
                          onChange={(item) => {
                            setColor(item.label);
                          }}
                        ></Dropdown>
                      </KeyboardAvoidingView>
                      <Text
                        style={{
                          fontSize: normalize(16),
                          marginBottom: "3%",
                          marginTop: "3%",
                        }}
                      >
                        What Size?
                      </Text>
                      <Text style={{ color: "red", fontSize: normalize(15) }}>
                        {sizeError}
                      </Text>
                      <View style={styles.modalblocksize}>
                        <Pressable
                          style={[
                            styles.size,
                            {
                              backgroundColor:
                                size == "S" ? "#3042BA" : "#BAD9FC",
                            },
                          ]}
                          onPress={() => {
                            setSize("S");
                            setSizeError("");
                          }}
                        >
                          <Text
                            style={{
                              fontSize: normalize(12),
                              color: size == "S" ? "white" : "black",
                            }}
                          >
                            S
                          </Text>
                        </Pressable>
                        <Pressable
                          style={[
                            styles.size,
                            {
                              backgroundColor:
                                size == "M" ? "#3042BA" : "#BAD9FC",
                            },
                          ]}
                          onPress={() => {
                            setSize("M");
                            setSizeError("");
                          }}
                        >
                          <Text
                            style={{
                              fontSize: normalize(12),
                              color: size == "M" ? "white" : "black",
                            }}
                          >
                            M
                          </Text>
                        </Pressable>
                        <Pressable
                          style={[
                            styles.size,
                            {
                              backgroundColor:
                                size == "L" ? "#3042BA" : "#BAD9FC",
                            },
                          ]}
                          onPress={() => {
                            setSize("L");
                            setSizeError("");
                          }}
                        >
                          <Text
                            style={{
                              fontSize: normalize(12),
                              color: size == "L" ? "white" : "black",
                            }}
                          >
                            L
                          </Text>
                        </Pressable>
                        <Pressable
                          style={[
                            styles.size,
                            {
                              backgroundColor:
                                size == "XL" ? "#3042BA" : "#BAD9FC",
                            },
                          ]}
                          onPress={() => {
                            setSize("XL");

                            setSizeError("");
                          }}
                        >
                          <Text
                            style={{
                              fontSize: normalize(12),
                              color: size == "XL" ? "white" : "black",
                            }}
                          >
                            XL
                          </Text>
                        </Pressable>
                      </View>
                    </Block>
                    <Pressable
                      style={[
                        styles.button,
                        styles.buttonClose,
                        { marginTop: 40 },
                      ]}
                      onPress={() => {
                        // setModalVisible(!modalVisible);
                        Save();
                      }}
                    >
                      <Text style={styles.textStyle}>Add Item</Text>
                    </Pressable>
                  </Block>
                </View>
              </View>
            </Modal>
          </Block>
          <Block>
            <Pressable
              onPress={() => navigation.navigate("FamilyCart", { cartId, id })}
              style={{
                // marginTop: "1%",
                marginBottom: "1%",
                backgroundColor: "#F9966B",
                height: "15%",
                width: "60%",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "20%",
                borderRadius: 8,
                // padding: 5,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: normalize(16),
                }}
              >
                View Cart
              </Text>
            </Pressable>
            <Pressable
              onPress={() => navigation.navigate("FamilyHome", id)}
              style={{
                marginTop: "2%",
                marginBottom: "1%",
                backgroundColor: "#1a1f87",
                height: "15%",
                width: "60%",
                alignItems: "center",
                justifyContent: "center",
                marginLeft: "20%",
                borderRadius: 8,
                // padding: 5,
              }}
            >
              <Text
                style={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: normalize(16),
                }}
              >
                Home
              </Text>
            </Pressable>
          </Block>
        </View>
      </SafeAreaView>
    );
  };
  return (
    <Block flex center style={styles.home}>
      {renderArticles()}
      {/* <Block
        style={{
          height: "8%",
          backgroundColor: "#FFFAFA",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          borderColor: "lightgray",
          borderWidth: 1,
          marginBottom: "1%",
          alignItems: "center",
          // paddingLeft: "1%",
        }}
      >
        <Pressable
          style={{ width: "14%" }}
          onPress={() => navigation.navigate("FamilyHome", id)}
        >
          <Ionicons name="home-outline" color={"#f8a069"} size={40} />
        </Pressable>

        <Pressable
          style={{ width: "14%", marginRight: "7%", marginLeft: "7%" }}
          onPress={() => navigation.navigate("FamilyCart", { cartId, id })}
        >
          <Ionicons name="cart-outline" color="#1a1f87" size={45} />
        </Pressable>

        <Pressable
          style={{ width: "14%" }}
          onPress={() => navigation.navigate("FamilyProfile", id)}
        >
          <EvilIcons name="user" color="#1a1f87" size={50} />
        </Pressable>
      </Block> */}
    </Block>
  );
};

export default FamilyRequest;

const styles = StyleSheet.create({
  home: {
    width: width,
    // backgroundColor: "#490066",
    height: "100%",
  },
  container: {
    flex: 1,
    marginVertical: 20,
  },
  item: {
    backgroundColor: "#6495ED",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 1,
  },
  itemInvisible: {
    backgroundColor: "transparent",
  },
  itemText: {
    color: "#fff",
    fontSize: normalize(30),
    fontWeight: "bold",
  },
  board: {
    width: "95%",
    marginLeft: "2%",
    height: "80%",
    // borderColor: "white",
    // borderWidth: 5,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-evenly",
    // backgroundColor: "lightpink",
    alignItems: "center",
  },

  circle: {
    width: 110,
    height: 70,
    justifyContent: "center",
    margin: 2,
    backgroundColor: "#3c4dbd",
    borderRadius: 8,
  },
  ct: {
    textAlign: "center",
    color: "white",
    fontSize: width > 500 ? normalize(11) : normalize(16),
    fontWeight: "bold",
  },
  scr: {
    borderColor: "blue",
    borderWidth: 2,
    width: 50,
    textAlign: "center",
  },
  txt: {
    fontSize: normalize(20),
    color: "blue",
  },
  modalView: {
    margin: 15,
    marginTop: "20%",
    height: "84%",
    backgroundColor: "white",
    borderRadius: 15,
    padding: "5%",
    alignItems: "center",
    shadowColor: "#1a1f87",
    // shadowOffset: {
    //   width: 5,
    //   height: 10,
    // },
    shadowOpacity: 3,
    shadowRadius: 10,
    elevation: 10,
    borderColor: "#1a1f87",
    borderWidth: 2,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#1a1f87",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    padding: "2%",
    fontSize: normalize(15),
  },
  modalText: {
    marginBottom: "3%",
    textAlign: "center",
    fontSize: normalize(25),
    fontWeight: "bold",
    color: "#1a1f87",
  },
  modalText1: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: normalize(18),
  },
  modalblock: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: "1%",
    marginBottom: "4%",
    width: "100%",
    // backgroundColor: "lightgray",
  },
  modalblocksize: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: "1%",
    // marginBottom: "4%",
    width: "100%",
    // backgroundColor: "lightgray",
  },
  modalblocksize1: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: "1%",
    marginBottom: "3%",
    width: "48%",
    // backgroundColor: "lightgray",
  },
  modalblock2: {
    // marginTop: "1%",
    marginBottom: "1%",
    width: "90%",
    // backgroundColor: "lightgray",
    // paddingTop: 20,
    // padding: 10,
  },
  input: {
    borderColor: "lightgray",
    borderWidth: 1,
    height: 40,
    width: 200,
    marginTop: 10,
    padding: 5,
    borderRadius: 5,
  },
  dropdown: {
    marginBottom: 20,
    padding: 7,
    borderRadius: 4,
    borderColor: argonTheme.COLORS.INPUT_ERROR,
    height: 44,
    backgroundColor: "#BAD9FC",
    shadowColor: argonTheme.COLORS.BLACK,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  placeholderStyle: {
    fontSize: normalize(14),
  },
  selectedTextStyle: {
    fontSize: normalize(16),
  },
  size: {
    backgroundColor: "#BAD9FC",
    width: 60,
    height: 60,
    alignItems: "center",
    justifyContent: "center",
  },
});
