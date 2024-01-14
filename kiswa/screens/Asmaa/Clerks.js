//galio
import { Block, Text, theme } from "galio-framework";
import {
  Dimensions,
  Image,
  ImageBackground,
  PixelRatio,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  View,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
  Table,
  Modal,
} from "react-native";
import { DataTable, Searchbar } from "react-native-paper";
import { Button } from "galio-framework";

//FireBase
import { auth } from "../../config";

import {
  doc,
  query,
  getDocs,
  getDoc,
  addDoc,
  collection,
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
const Clerks = ({ navigation }) => {
  const [deviceType, setDeviceType] = useState("");

  useEffect(() => {
    readAllWhere();
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
  }, []);

  const [clerk, setClerk] = useState([]);
  const [allClerk, setAllClerk] = useState([]);

  const readAllWhere = async () => {
    const collectionRef = collection(db, "inventoryWorkers");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setClerk(querySnapshot.docs.map((doc) => doc.data()));
      setAllClerk(querySnapshot.docs.map((doc) => doc.data()));
    });

    return () => unsubscribe();
  };

  // >>>>>>>>>>>>>> Search functions <<<<<<<<<<<<<<
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value.length === 0) {
      setClerk(allClerk);
    }

    const filteredData = allClerk.filter(
      (item) =>
        item.fname && item.fname.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredData.length === 0) {
      setClerk([]);
    } else {
      setClerk(filteredData);
    }
  };
  const [modalVisible2, setModalVisible2] = useState(false);

  const [idDel, setIdDel] = useState("");
  const [del, setDel] = useState(false);

  const check = (id) => {
    setModalVisible2(!modalVisible2);
    deletClerk(id);
  };
  const deletClerk = async (id) => {
    const driverDoc = doc(db, "inventoryWorkers", id); //remove clerk
    await deleteDoc(driverDoc)
      .then(() => {
        alert("Worker removed");
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
                name="user"
                size={deviceType == "mobile" ? 30 : 45}
              />
              <Text
                style={{
                  fontSize: deviceType == "mobile" ? 20 : 30,
                  marginLeft: "5%",
                }}
              >
                Workers
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
                  borderRadius: 25,
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
                onPress={() => navigation.navigate("AddClerk")}
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
            key={30000}
            style={{
              borderTopWidth: 0,
              borderBottomWidth: 2,
              borderColor: "black",
              width: "100%",
              height: 50,
              // marginLeft: "3%",
              backgroundColor: "white",
            }}
          >
            <DataTable.Title
              textStyle={{
                fontSize: deviceType == "mobile" ? width * 0.04 : width * 0.025,
                fontWeight: "bold",
              }}
            >
              Name
            </DataTable.Title>
            <DataTable.Title
              textStyle={{
                fontSize: deviceType == "mobile" ? width * 0.04 : width * 0.025,
                fontWeight: "bold",
              }}
            >
              Email
            </DataTable.Title>
            <DataTable.Title
              numeric
              textStyle={{
                fontSize: deviceType == "mobile" ? width * 0.04 : width * 0.025,
                fontWeight: "bold",
              }}
            >
              Phone
            </DataTable.Title>
            <DataTable.Title
              numeric
              textStyle={{
                fontSize: deviceType == "mobile" ? width * 0.04 : width * 0.025,
                fontWeight: "bold",
              }}
            >
              Delete
            </DataTable.Title>
          </DataTable.Header>
          {clerk &&
            clerk.map((x) => (
              <DataTable.Row
                key={x.email}
                style={{
                  width: "100%",
                  height: "12%",
                  // marginLeft: "3%",
                  backgroundColor: "white",
                }}
              >
                <DataTable.Cell textStyle={{ fontSize: normalize(25) }}>
                  {x.fname}
                </DataTable.Cell>
                <DataTable.Cell textStyle={{ fontSize: normalize(25) }}>
                  {x.email}
                </DataTable.Cell>
                <DataTable.Cell numeric textStyle={{ fontSize: normalize(25) }}>
                  {x.phone}
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
                    <AntDesign name="delete" size={normalize(37)} color="red" />
                  </Pressable>
                </DataTable.Cell>
              </DataTable.Row>
            ))}
        </DataTable>
      </View>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBEBEB",
    paddingHorizontal: "5%",
  },
  head: {
    flexDirection: "row",
    padding: "1%",
    marginTop: "3%",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
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
  title: {
    fontSize: 30,
    marginLeft: 20,
    textAlign: "left",
  },
  formContent: {
    flexDirection: "row",
    marginTop: 30,
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
  notificationList: {
    marginTop: 20,
    padding: 10,
  },
  notificationBox: {
    paddingTop: 10,
    paddingBottom: 10,
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    borderRadius: 10,
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
  rowData: { color: "black", fontSize: width * 0.04 },
});

export default Clerks;
