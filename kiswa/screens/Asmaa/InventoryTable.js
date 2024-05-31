//galio
import { Block, Text, theme } from "galio-framework";
import {
  Dimensions,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Alert,
  TextInput,
  FlatList,
  TouchableOpacity,
  Table,
  Platform,
  PixelRatio,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  ClothTypeData as ClothTypeData,
  SizeData as SizeData,
  ColorData as ColorData,
  GenderData as GenderData,
  QualityData as QualityData,
  AgeCategory as AgeCategory,
} from "../../components/Fatima/Data";
import {
  BarChart,
  PieChart,
  StackedBarChart,
  LineChart,
  ProgressChart,
} from "react-native-chart-kit";
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
} from "firebase/firestore";
import { db } from "../../config";
//argon
import { Images, argonTheme, articles } from "../../constants";

import { Card, Header } from "../../components";

import {
  Icon,
  Feather,
  FontAwesome,
  Octicons,
} from "react-native-vector-icons";
import ArButton from "../../components/Button";
// import { normalize } from "@rneui/themed";
import { Dropdown } from "react-native-element-dropdown";

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
const thumbMeasure = (width - 48 - 32) / 3;
const cardWidth = width - theme.SIZES.BASE * 2;

const InventoryTable = ({ navigation }) => {
  const [deviceType, setDeviceType] = useState("");
  const [open, setOpen] = useState(false);
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [quality, setQuality] = useState("");
  const [color, setColor] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [inventory, setInventory] = useState([]);
  const [allinventory, setAllInventory] = useState([]);

  useEffect(() => {
    readAllWhere();
    width < 500 ? setDeviceType("mobile") : setDeviceType("ipad");
  }, []);

  // >>>>>>>>>>>>>> Read functions <<<<<<<<<<<<<<
  const readAllWhere = async () => {
    let temp = [];
    const q = query(collection(db, "inventory"));
    const docs = await getDocs(q);
    // console.log(docs)
    docs.forEach((doc) => {
      temp.push(doc.data());
    });
    setInventory(temp);
    setAllInventory(temp);
  };
  // >>>>>>>>>>>>>> Search functions <<<<<<<<<<<<<<
  const [searchQuery, setSearchQuery] = React.useState("");

  const handleSearch = (value) => {
    setSearchQuery(value);
    if (value.length === 0) {
      setInventory(allinventory);
    }

    const filteredData = allinventory.filter((item) =>
      item.type.toLowerCase().includes(value.toLowerCase())
    );

    if (filteredData.length === 0) {
      setInventory([]);
    } else {
      setInventory(filteredData);
    }
  };

  // >>>>>>>>>>>>>> Filter functions <<<<<<<<<<<<<<
  const [filterd, setFilterd] = useState([]);
  const select = (name, type) => {
    var all;
    // filterd.length == 0 ? (all = [...allinventory]) : (all = [...filterd]);
    if (type == "type") {
      var filteredData = allinventory.filter((item) => item.type == name);
    } else if (type == "size") {
      var filteredData = allinventory.filter((item) => item.size == name);
    } else if (type == "color") {
      var filteredData = allinventory.filter((item) => item.color == name);
    } else if (type == "gender") {
      var filteredData = allinventory.filter((item) => item.gender == name);
    } else if (type == "age") {
      var filteredData = allinventory.filter((item) => item.age == name);
    } else if (type == "available") {
      var filteredData = allinventory.filter((item) => item.available == name);
    } else if (type == "quality") {
      var filteredData = allinventory.filter((item) => item.quality == name);
    }

    setInventory(filteredData);
    setFilterd(filteredData);
  };

  return (
    <Block flex>
      <View style={styles.container}>
        <DataTable>
          <Block
            style={[
              styles.head,
              { height: height * 0.08, justifyContent: "space-between" },
            ]}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                width: width * 0.9,
                // borderWidth: 1,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                {/* <Feather name="box" size={deviceType == "mobile" ? 30 : 45} /> */}
                <Text
                  style={{
                    fontSize: deviceType == "mobile" ? 20 : 30,
                    marginLeft: "5%",
                  }}
                >
                  Inventory
                </Text>
              </View>
              <View style={{ flexDirection: "row" }}>
                <Searchbar
                  placeholder={width > 500 ? "Search" : ""}
                  onChangeText={handleSearch}
                  value={searchQuery}
                  fontSize={deviceType == "mobile" ? 17 : normalize(25)}
                  style={{
                    backgroundColor: "#D2E6FA",
                    fontSize: 50,
                    width: normalize(300),
                    height: deviceType == "mobile" ? 45 : 50,
                    borderRadius: 25,
                    marginRight: "3%",
                  }}
                  autoCorrect={false}
                />
                <Pressable
                  onPress={() => navigation.navigate("AdminHome", "graph")}
                >
                  <Octicons
                    name="graph"
                    color="green"
                    size={deviceType == "mobile" ? 40 : 45}
                    style={{ marginTop: deviceType == "mobile" ? "5%" : "2%" }}
                  />
                  {/* <Text>See graphs</Text> */}
                </Pressable>
              </View>
            </View>
          </Block>
          <DataTable.Header
            style={{
              width: width - 20,
              borderWidth: 1,
              backgroundColor: "#1a1f87",
              marginTop: 10,
              height: 50,
            }}
          >
            <DataTable.Title textStyle={styles.title}>ID</DataTable.Title>
            <DataTable.Title textStyle={styles.title}>
              <Dropdown
                autoScroll
                style={[
                  styles.smallInput,
                  // { padding: 0, width: open ? width * 0.6 : width * 0.2 },
                ]}
                placeholderStyle={{
                  fontSize: normalize(20),
                  textAlign: "left",
                  color: "white",
                  fontWeight: "bold",
                }}
                selectedTextStyle={styles.title}
                inputSearchStyle={styles.inputSearchStyle}
                data={ClothTypeData}
                labelField="label"
                valueField="value"
                id="value"
                maxHeight={400}
                search
                searchPlaceholder="Search..."
                animated={false}
                // value={type}
                placeholder={"Type"}
                onChange={(item) => {
                  select(item.value, "type");
                  setOpen(true);
                }}
              />
            </DataTable.Title>
            <DataTable.Title textStyle={styles.title}>
              <Dropdown
                style={[
                  styles.smallInput,
                  // { padding: 0, width: open ? width * 0.6 : width * 0.2 },
                ]}
                placeholderStyle={{
                  fontSize: normalize(20),
                  textAlign: "left",
                  color: "white",
                  fontWeight: "bold",
                }}
                selectedTextStyle={{
                  fontSize: normalize(20),
                  textAlign: "left",
                  color: "white",
                  fontWeight: "bold",
                }}
                inputSearchStyle={styles.inputSearchStyle}
                data={SizeData}
                labelField="label"
                valueField="value"
                maxHeight={200}
                id="value"
                search
                searchPlaceholder="Search..."
                animated={false}
                // value={size}
                placeholder={"Size"}
                onChange={(item) => {
                  select(item.value, "size");
                  // setOpen(true);
                }}
              />
            </DataTable.Title>
            <DataTable.Title textStyle={styles.title}>
              <Dropdown
                style={[
                  styles.smallInput,
                  // { padding: 0, width: open ? width * 0.6 : width * 0.2 },
                ]}
                placeholderStyle={{
                  fontSize: normalize(20),
                  textAlign: "left",
                  color: "white",
                  fontWeight: "bold",
                }}
                selectedTextStyle={{
                  fontSize: normalize(20),
                  textAlign: "left",
                  color: "white",
                  fontWeight: "bold",
                }}
                inputSearchStyle={styles.inputSearchStyle}
                data={ColorData}
                labelField="label"
                valueField="value"
                maxHeight={200}
                id="value"
                search
                searchPlaceholder="Search..."
                animated={false}
                // value={size}
                placeholder={"Color"}
                onChange={(item) => {
                  select(item.value, "color");
                  // setOpen(true);
                }}
              />
            </DataTable.Title>
            <DataTable.Title textStyle={styles.title}>
              <Dropdown
                style={[
                  styles.smallInput,
                  // { padding: 0, width: open ? width * 0.6 : width * 0.2 },
                ]}
                placeholderStyle={{
                  fontSize: normalize(20),
                  textAlign: "left",
                  color: "white",
                  fontWeight: "bold",
                }}
                selectedTextStyle={{
                  fontSize: normalize(20),
                  textAlign: "left",
                  color: "white",
                  fontWeight: "bold",
                }}
                inputSearchStyle={styles.inputSearchStyle}
                data={GenderData}
                labelField="label"
                valueField="value"
                maxHeight={200}
                id="value"
                search
                searchPlaceholder="Search..."
                animated={false}
                // value={size}
                placeholder={"Gender"}
                onChange={(item) => {
                  select(item.value, "gender");
                  // setOpen(true);
                }}
              />
            </DataTable.Title>
            <DataTable.Title textStyle={styles.title}>
              <Dropdown
                style={[
                  styles.smallInput,
                  // { padding: 0, width: open ? width * 0.6 : width * 0.2 },
                ]}
                placeholderStyle={{
                  fontSize: normalize(20),
                  textAlign: "left",
                  color: "white",
                  fontWeight: "bold",
                }}
                selectedTextStyle={{
                  fontSize: normalize(20),
                  textAlign: "left",
                  color: "white",
                  fontWeight: "bold",
                }}
                inputSearchStyle={styles.inputSearchStyle}
                data={AgeCategory}
                labelField="label"
                valueField="value"
                maxHeight={200}
                id="value"
                search
                searchPlaceholder="Search..."
                animated={false}
                // value={size}
                placeholder={"age"}
                onChange={(item) => {
                  select(item.value, "age");
                  // setOpen(true);
                }}
              />
            </DataTable.Title>
            <DataTable.Title textStyle={styles.title}>
              <Dropdown
                autoScroll
                style={[
                  styles.smallInput,
                  // { padding: 0, width: open ? width * 0.6 : width * 0.2 },
                ]}
                placeholderStyle={{
                  fontSize: normalize(20),
                  textAlign: "left",
                  color: "white",
                  fontWeight: "bold",
                }}
                selectedTextStyle={styles.title}
                inputSearchStyle={styles.inputSearchStyle}
                data={QualityData}
                labelField="label"
                valueField="value"
                id="value"
                maxHeight={400}
                search
                searchPlaceholder="Search..."
                // animated={false}
                // value={type}
                placeholder={"Quality"}
                onChange={(item) => {
                  select(item.value, "quality");
                  setOpen(true);
                }}
              />
            </DataTable.Title>
          </DataTable.Header>
          <View
            style={{
              height: height * 0.5,
              borderWidth: 0,
            }}
          >
            <ScrollView>
              {inventory &&
                inventory.map((i, x) => (
                  <DataTable.Row
                    key={x}
                    style={{
                      height: "1%",
                      borderWidth: 0.5,
                      width: width - 20,
                    }}
                  >
                    <DataTable.Cell
                      id={i.id}
                      textStyle={{
                        fontSize: width > 500 ? normalize(20) : normalize(30),
                      }}
                    >
                      {x + 1}
                    </DataTable.Cell>
                    <DataTable.Cell
                      id={i.id}
                      textStyle={{
                        fontSize: width > 500 ? normalize(20) : normalize(24),
                      }}
                    >
                      {i.type}
                    </DataTable.Cell>
                    <DataTable.Cell
                      id={i.id}
                      textStyle={{
                        fontSize: width > 500 ? normalize(20) : normalize(24),
                      }}
                    >
                      {i.size}
                    </DataTable.Cell>
                    <DataTable.Cell
                      id={i.id}
                      textStyle={{
                        fontSize: width > 500 ? normalize(20) : normalize(24),
                      }}
                    >
                      {i.color}
                    </DataTable.Cell>
                    <DataTable.Cell
                      id={i.id}
                      textStyle={{
                        fontSize: width > 500 ? normalize(20) : normalize(24),
                      }}
                    >
                      {i.gender}
                    </DataTable.Cell>
                    <DataTable.Cell
                      id={i.id}
                      textStyle={{
                        fontSize: width > 500 ? normalize(20) : normalize(24),
                      }}
                    >
                      {i.age}
                    </DataTable.Cell>
                    <DataTable.Cell
                      id={i.id}
                      textStyle={{
                        fontSize: width > 500 ? normalize(20) : normalize(24),
                      }}
                    >
                      {i.quality}
                    </DataTable.Cell>
                  </DataTable.Row>
                ))}
            </ScrollView>
          </View>
        </DataTable>
      </View>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EBEBEB",
    //paddingTop: 50,
    paddingHorizontal: 7,
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
    width: "90%",
    // marginLeft: "3%",
    alignItems: "center",
    // borderWidth: 2,
    justifyContent: "space-between",
  },
  title: {
    fontSize: normalize(20),
    color: "white",
    fontWeight: "bold",
  },
  smallInput: {
    width: width * 0.2,
    // borderWidth: 2,
    fontSize: normalize(30),
    // textAlign: "right",
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

export default InventoryTable;
