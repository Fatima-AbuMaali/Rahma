//galio
import { Block, Text, theme } from "galio-framework";
import {
  Dimensions,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  Platform,
  PixelRatio,
  View,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
  Table,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import { DataTable, Searchbar } from "react-native-paper";

// import { DataTable } from "react-native-paper";
import { Button } from "galio-framework";
import { Dropdown } from "react-native-element-dropdown";

//FireBase
import { auth } from "../../config";

import {
  doc,
  query,
  getDocs,
  getDoc,
  addDoc,
  collection,
  setDoc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../../config";
//argon
import { Images, argonTheme, articles } from "../../constants";

import { Card, Header } from "../../components";

import { Icon, AntDesign, FontAwesome } from "react-native-vector-icons";
import ArButton from "../../components/Button";

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

const Drivers = ({ navigation }) => {
  const [deviceType, setDeviceType] = useState("");
  const [hover, setHover] = useState(false);

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
  const [zone, setZone] = useState("");
  const [ZoneError, setZoneError] = useState(true);

  useEffect(() => {
    readAllWhere();
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
  }, []);

  const [drivers, setDrivers] = useState([]);
  const [allDrivers, setAllDrivers] = useState([]);

  const [flag, setFlag] = useState(false);

  const readAllWhere = async () => {
    const collectionRef = collection(db, "drivers");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setDrivers(querySnapshot.docs.map((doc) => doc.data()));
      setAllDrivers(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  };

  const [orders, setOrders] = useState([]);

  const readOne = async (user) => {
    setHover(user);
    const q = query(collection(db, "drivers", user, "orders"));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setOrders(querySnapshot.docs.map((doc) => doc.data()));
      //  setFamilies(querySnapshot.docs.map((doc) => doc.data()));
      setFlag(true);
    });

    return () => unsubscribe();
  };

  const [modalVisible2, setModalVisible2] = useState(false);

  const [idDel, setIdDel] = useState("");
  const [del, setDel] = useState(false);

  const check = (id) => {
    setModalVisible2(!modalVisible2);
    deletClerk(id);
  };
  const deletClerk = async (id) => {
    const driverDoc = doc(db, "drivers", id); //remove clerk
    await deleteDoc(driverDoc)
      .then(() => {
        alert("Driver removed");
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  // >>>>>>>>>>>>>> Search functions <<<<<<<<<<<<<<
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value.length === 0) {
      setDrivers(allDrivers);
    }

    const filteredData = allDrivers.filter((item) =>
      item.fname.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredData.length === 0) {
      setDrivers([]);
    } else {
      setDrivers(filteredData);
    }
  };

  const renderCards = () => {
    return (
      <Block style={{ borderWidth: 0, height: height }}>
        <ScrollView>
          <Text
            style={{
              fontSize: deviceType == "mobile" ? 20 : 30,
              marginLeft: "5%",
              // marginTop: "3%",
            }}
          >
            Orders
          </Text>
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              width: width,
            }}
          >
            {orders.map((item, i) => (
              <View style={styles.notificationBox} key={item.trackId}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    paddingHorizontal: "2%",
                    paddingVertical: "1%",
                  }}
                >
                  <Text style={styles.description}>{item.type} </Text>
                  <Text style={styles.description}>{item.date}</Text>
                </View>

                <View
                  style={{
                    borderWidth: 0.6,
                    width: width * 0.84,
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
                  {item.type == "pickup" ? (
                    <Image
                      style={styles.icon}
                      source={require("../../assets/imgs/pick.png")}
                    />
                  ) : (
                    <Image
                      style={styles.icon}
                      source={require("../../assets/imgs/deliv.png")}
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
                        // flexDirection: "row",
                        //   width: "50%",
                        // borderWidth: 1,
                        padding: "1%",
                        justifyContent: "space-between",
                      }}
                    >
                      {/* <MaterialIcons name="location-pin" size={25} />
                        <Text style={styles.description}>{item.location}</Text>
                        <Text style={styles.description}>{item.location}</Text> */}
                      <Text style={styles.description}>{item.userName}</Text>

                      <Text style={styles.description}>{item.location}</Text>
                      <Text style={styles.description}>{item.timeSlot}</Text>
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
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
        {/* </View> */}
      </Block>
    );
  };

  const update = async (zone, obj) => {
    const { email, ...rest } = obj;
    await setDoc(
      doc(db, "drivers", email),
      {
        zone: zone,
      },
      { merge: true }
    )
      .then(() => {
        console.log("data updated");
        readAllWhere();
        //setEditModalVisible(!editModalVisible);
        // setSelectedItem(null);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <Block flex>
      <View style={styles.container}>
        <Modal
          style={{ flex: 1 }}
          animationType="slide"
          transparent={true}
          visible={modalVisible2}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible2(!modalVisible2);
          }}
        >
          <View>
            <View style={styles.modalView2}>
              <Text style={styles.modalText}>Delete</Text>
              <Text style={[styles.ct, { color: "black" }]}>
                Are you sure you want to delete this Worker?
              </Text>
              <Text></Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "70%",
                }}
              >
                <Pressable
                  style={[
                    styles.button,
                    styles.buttonClose,
                    { backgroundColor: "#808080" },
                  ]}
                  onPress={() => setModalVisible2(!modalVisible2)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>

                <Pressable
                  style={[
                    styles.button,
                    styles.buttonClose,
                    { backgroundColor: "red" },
                  ]}
                  onPress={() => check(idDel)}
                >
                  <Text style={styles.textStyle}>Delete</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
        <DataTable>
          <Block
            style={[
              styles.head,
              {
                width: width,
                height: height * 0.08,
                justifyContent: "space-between",
                // borderWidth: 1,
              },
            ]}
          >
            <View style={{ flexDirection: "row" }}>
              <FontAwesome
                name="drivers-license-o"
                size={deviceType == "mobile" ? 30 : 45}
              />
              <Text
                style={{
                  fontSize: deviceType == "mobile" ? 20 : 30,
                  marginLeft: "5%",
                }}
              >
                Driverss
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <Searchbar
                placeholder={width > 500 ? "Search" : ""}
                onChangeText={handleSearch}
                value={searchQuery}
                style={{
                  backgroundColor: "#D2E6FA",
                  width: width * 0.33,
                  borderRadius: 20,
                  height:
                    deviceType == "mobile" ? height * 0.039 : height * 0.043,
                  marginTop: "2%",
                }}
                autoCorrect={false}
              />
              <Button
                // color="#6a1b9a"
                color="#5AA15A"
                style={{ width: "20%", height: height * 0.033 }}
                onPress={() => navigation.navigate("AddDriver")}
              >
                <Text
                  style={{
                    fontSize: deviceType == "mobile" ? 15 : 24,
                    color: "#FFF",
                  }}
                >
                  Add
                </Text>
              </Button>
            </View>
          </Block>

          <DataTable.Header
            // key={10000}
            style={{
              borderTopWidth: 0,
              borderBottomWidth: 2,
              borderColor: "black",
              width: "100%",
              height: 50,
              // marginLeft: "3%",
              // backgroundColor: "#4b0095",
              // borderWidth: 1,
            }}
          >
            <DataTable.Title textStyle={{ fontSize: normalize(25) }}>
              Name
            </DataTable.Title>

            <DataTable.Title textStyle={{ fontSize: normalize(25) }}>
              Phone
            </DataTable.Title>
            {/* <DataTable.Title  textStyle={{fontSize:normalize(25) }}>Email</DataTable.Title> */}
            {/* <DataTable.Title numeric textStyle={{fontSize:normalize(25) }}>Phone</DataTable.Title> */}
            <DataTable.Title numeric textStyle={{ fontSize: normalize(25) }}>
              Zone
            </DataTable.Title>
            <DataTable.Title numeric textStyle={{ fontSize: normalize(25) }}>
              Delete
            </DataTable.Title>
          </DataTable.Header>

          <View height={flag ? height * 0.16 : height * 0.5}>
            <ScrollView>
              {drivers &&
                drivers.map((x, i) => (
                  <DataTable.Row
                    key={x.email}
                    onPress={() => readOne(x.email)}
                    style={{
                      width: "100%",
                      height: "10%",
                      // marginLeft: "3%",
                      backgroundColor: hover == x.email ? "#C6E1FC" : "white",
                    }}
                  >
                    <DataTable.Cell textStyle={{ fontSize: normalize(25) }}>
                      {x.fname}
                    </DataTable.Cell>

                    <DataTable.Cell textStyle={{ fontSize: normalize(25) }}>
                      {x.phone}
                    </DataTable.Cell>
                    {/* <DataTable.Cell textStyle={{fontSize:normalize(25) }}>{x.email}</DataTable.Cell> */}
                    <DataTable.Cell numeric>
                      <Dropdown
                        style={[styles.smallInput, { padding: 11 }]}
                        placeholderStyle={{
                          fontSize: normalize(23),
                          textAlign: "right",
                        }}
                        selectedTextStyle={{ fontSize: normalize(10) }}
                        data={zones}
                        maxHeight={160}
                        labelField="label"
                        valueField="value"
                        placeholder={x.zone ? x.zone : "Select zone"}
                        value={x.zone}
                        onChange={(item) => {
                          update(item.label, x);
                          setZone(item.label);
                          setZoneError(false);
                        }}
                      ></Dropdown>
                    </DataTable.Cell>
                    <DataTable.Cell numeric>
                      <Pressable
                        onPress={() => {
                          setModalVisible2(true);
                          setIdDel(x.email);
                        }}
                        style={{
                          paddingLeft: "70%",
                        }}
                      >
                        <AntDesign
                          name="delete"
                          size={normalize(37)}
                          color="red"
                        />
                      </Pressable>
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
            </ScrollView>
            <View style={{ width: width }}></View>
          </View>

          {flag && orders.length == 0 ? (
            <View
              style={{
                width: width * 0.5,
                height: height * 0.2,
                // borderWidth: 2,
                justifyContent: "center",
                margin: "25%",
                marginTop: "6%",
                alignContent: "center",
                textAlign: "center",
              }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: normalize(50),
                  color: "#5e1e7f",
                }}
              >
                No Orders Yet
              </Text>
            </View>
          ) : flag && orders.length != 0 ? (
            renderCards()
          ) : null}
        </DataTable>
      </View>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    // borderWidth: 2,
    // borderColor:"red",
    backgroundColor: "#EBEBEB",
    //paddingTop: 50,
    paddingHorizontal: "5%",
    width: width,
  },
  head: {
    // flexDirection:"row",
    // borderWidth:1,
    // padding:"1%",
    // justifyContent:"space-between",
    // marginBottom:0

    flexDirection: "row",
    padding: "1%",
    marginTop: "3%",
    width: "100%",
    // marginLeft: "3%",
    alignItems: "center",
    // borderWidth: 2,
    justifyContent: "space-between",
  },
  title: {
    fontSize: 30,
    marginLeft: 20,
    textAlign: "left",
  },
  profileImage: {
    width: width * 0.03,
    height: width * 0.03,
    borderRadius: 40,
  },
  tabletitle: {
    fontWeight: "bold",
    color: "white",
  },
  formContent: {
    flexDirection: "row",
    marginTop: 30,
  },
  ct: {
    color: "#1a1f87",
    fontSize: normalize(25),
    // fontWeight: "bold",
  },
  modalView2: {
    // margin: 35,
    width: "80%",
    marginTop: height / 3,
    height: height / 5,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 35,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#1d2f6f",
    shadowOpacity: 3,
    shadowRadius: 10,
    elevation: 10,
    borderColor: "#1a1f87",
    borderWidth: 2,
    marginLeft: "10%",
  },
  modalText: {
    marginBottom: 18,
    textAlign: "center",
    fontSize: normalize(35),
    fontWeight: "bold",
    color: "#1a1f87",
  },
  button: {
    borderRadius: 20,
    padding: 10,
    marginHorizontal: 5,
    elevation: 2,
    width: width / 4,
  },
  buttonClose: {
    backgroundColor: "#1a1f87",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
    padding: 2,
    fontSize: normalize(25),
  },
  inputContainer: {
    borderBottomColor: "#F5FCFF",
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    borderBottomWidth: 1,
    height: 45,
    alignItems: "right",
    width: "50%",

    margin: 5,
  },
  icon: {
    width: 30,
    height: 30,
  },
  iconBtnSearch: {
    alignSelf: "center",
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: "#FFFFFF",
    //flex: 1,
  },
  inputIcon: {
    marginLeft: 15,
    justifyContent: "center",
  },

  image: {
    width: 45,
    height: 45,
    borderRadius: 20,
    marginLeft: 20,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#000000",
    marginLeft: 10,
    alignSelf: "center",
  },
  rowTitle: {
    fontSize: width * 0.03,
    //color:"purple",
    fontWeight: "bold",
  },
  rowData: {
    color: "black",
    fontSize: width * 0.04,
  },

  smallInput: {
    width: width * 0.24,
    // borderWidth:2,
    fontSize: normalize(20),
    textAlign: "right",
  },
  notificationList: {
    // marginTop: "1%",
    // padding: "3%",
    borderWidth: 1,
    backgroundColor: "white",
    flexDirection: "row",
  },
  notificationBox: {
    width: width * 0.84,
    // padding: "5%",
    // paddingTop: "1%",
    marginTop: "2%",
    marginBottom: "3%",
    marginLeft: "4%",
    backgroundColor: "#E9F2FA",
    // flexDirection: "row",
    borderRadius: 20,
    borderWidth: 0.3,
  },
  icon: {
    width: 60,
    height: 60,
  },
  description: {
    fontSize: normalize(26),
    // color: "#3498db",
    marginLeft: "3%",
    // textAlign: "center",
  },
});

export default Drivers;
