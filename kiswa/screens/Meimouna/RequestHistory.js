import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  SafeAreaView,
  Dimensions,
  Pressable,
} from "react-native";
import React from "react";
import { Block, Checkbox, theme, NavBar } from "galio-framework";

import { Card, ListItem, Button, Icon } from "react-native-elements";
import { useState, useEffect } from "react";
import RequestHistoryComp from "./RequestHistoryComp";
import {
  doc,
  setDoc,
  addDoc,
  collection,
  getDocs,
  getDoc,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import {
  Fontisto,
  AntDesign,
  FontAwesome5,
  Entypo,
  Feather,
  FontAwesome,
} from "react-native-vector-icons";
import { DataTable } from "react-native-paper";
import { db } from "../../config";
import { normalize } from "../Syeda/Home";
const { width } = Dimensions.get("screen");
export default function RequestHistory({ route, navigation }) {
  const id = route.params;
  console.log(id);

  const [request, setRequest] = useState([]);
  const [allRequest, setAllRequest] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "familyRequests"),
      where("familyID", "==", `${id}`),
      where("cart", "==", "closed")

      // where("status", "==", "fullfied")
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setRequest(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
      setAllRequest(
        querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }))
      );
    });

    return () => unsubscribe();
  }, [id]);
  const [cart, setCart] = useState([]);
  const [stat, setStat] = useState("pending");

  const filterStatus = (stat) => {
    setStat(stat);
    var temp = [...allRequest];
    if (stat == "done") {
      temp = temp.filter((x) => x.status == "done");
    } else {
      temp = temp.filter((x) => x.status == "pending");
    }
    setRequest(temp);
  };
  console.log(request);
  const renderArticles = () => {
    return (
      <SafeAreaView
        style={{
          // backgroundColor: "gray",
          width: "100%",
          height: "90%",
        }}
      >
        <NavBar
          title="Request History"
          style={{
            height: "9%",
            // marginBottom: "2%",
            backgroundColor: "#FFFAFA",
            borderColor: "lightgray",
            borderWidth: 1,
            marginTop: "1%",
          }}
          titleStyle={{ color: "#4C4AAB", fontSize: 22, fontWeight: "bold" }}
        />
        <View
          style={{
            // flexDirection: "row",
            // justifyContent: "space-between",
            // width: "50%",
            // marginHorizontal: "25%",
            // height: "5%",
            // padding: "2%",
            backgroundColor: "#F7CFCF",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              width: "50%",
              marginHorizontal: "25%",
              padding: "2%",
            }}
          >
            <Text
              style={{ fontSize: 18, color: "blue" }}
              onPress={() => filterStatus("done")}
            >
              Done
            </Text>
            <Text>|</Text>
            <Text
              style={{ fontSize: 18, color: "blue" }}
              onPress={() => filterStatus("pending")}
            >
              Pending
            </Text>
          </View>
        </View>
        <View
          style={{
            width: "98%",
            paddingBottom: "5%",
            paddingTop: "5%",
            height: "90%",
            backgroundColor: "#FFFAF0",
            // marginBottom: "5%",
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              marginLeft: "5%",
            }}
          >
            {request.length} {stat} Requests
          </Text>
          <Text></Text>
          {request.length == 0 ? (
            <Text
              style={{
                color: "#842DCE",
                fontSize: 22,
                fontWeight: "bold",
                width: "70%",
                marginLeft: "10%",
              }}
            >
              There are no complete requests yet!
            </Text>
          ) : null}
          <ScrollView>
            {request.map((elem, i) => (
              <Card title="cart" key={i}>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text style={{ marginBottom: 10 }}> {elem.day}</Text>
                  {/* elem.nameoftheattrbiteinDB.toDate().toDateString() */}
                  {/* <Text style={{ marginBottom: 10 }}>Mon Oct 31 2022</Text> */}
                  <Text style={{ marginBottom: 10 }}>{elem.dateSlot}</Text>
                </View>

                <DataTable>
                  <DataTable.Header style={styles.tableHeader}>
                    <DataTable.Title
                      textStyle={{ color: "white", fontSize: 15 }}
                    >
                      Icon
                    </DataTable.Title>
                    <DataTable.Title
                      numeric
                      textStyle={{ color: "white", fontSize: 15 }}
                    >
                      Type
                    </DataTable.Title>
                    <DataTable.Title
                      numeric
                      textStyle={{ color: "white", fontSize: 15 }}
                    >
                      Color
                    </DataTable.Title>
                    <DataTable.Title
                      numeric
                      textStyle={{ color: "white", fontSize: 15 }}
                    >
                      Age
                    </DataTable.Title>
                    <DataTable.Title
                      numeric
                      textStyle={{ color: "white", fontSize: 15 }}
                    >
                      Size
                    </DataTable.Title>
                    <DataTable.Title
                      numeric
                      textStyle={{ color: "white", fontSize: 15 }}
                    >
                      Qty
                    </DataTable.Title>
                  </DataTable.Header>
                  <RequestHistoryComp itemsid={elem.id} />
                </DataTable>
                <Text></Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",

                    width: "100%",
                  }}
                >
                  <Text style={{ marginBottom: 10 }}>Status {elem.status}</Text>
                </View>
              </Card>
            ))}
            <View></View>
          </ScrollView>
        </View>
        <View>
          <Text></Text>
        </View>
      </SafeAreaView>
    );
  };
  return (
    <Block flex center style={styles.home}>
      {renderArticles()}
      {/* <Block
        style={{
          height: "10%",
          backgroundColor: "#FFFAFA",
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
        <Pressable
          style={{ width: "14%" }}
          onPress={() => navigation.navigate("FamilyHome", id)}
        >
          <FontAwesome5 name="house-user" color="#4C4AAB" size={40} />
        </Pressable>

        <Pressable
          style={{ width: "14%", marginRight: "7%", marginLeft: "7%" }}
          onPress={() => navigation.navigate("FamilyRequest", id)}
        >
          <Feather name="plus-circle" color="#4C4AAB" size={50} />
        </Pressable>

        <Pressable
          style={{ width: "14%" }}
          onPress={() => navigation.navigate("FamilyProfile", id)}
        >
          <FontAwesome name="user-circle" color="#4C4AAB" size={40} />
        </Pressable>
      </Block> */}
      <Block
        style={{
          height: "8%",
          backgroundColor: "#FFFAFA",
          width: "100%",
          flexDirection: "row",
          justifyContent: "space-evenly",
          borderColor: "lightgray",
          borderWidth: 1,
          // marginBottom: "1%",
          alignItems: "center",
        }}
      >
        <Pressable
          style={{ width: "14%" }}
          onPress={() => navigation.navigate("FamilyHome", id)}
        >
          <Entypo name="home" color={"#1a1f87"} size={42} />
        </Pressable>

        <Pressable
          style={{ width: "14%", marginRight: "7%", marginLeft: "7%" }}
          onPress={() => navigation.navigate("FamilyRequest", id)}
        >
          <FontAwesome5 name="shopping-cart" color="#1a1f87" size={38} />
        </Pressable>

        <Pressable
          style={{ width: "14%" }}
          onPress={() => navigation.navigate("FamilyProfile", id)}
        >
          <FontAwesome name="user-circle" color="#1a1f87" size={40} />
        </Pressable>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  home: {
    width: width,
    // backgroundColor: "#490066",
    height: "100%",
  },
  container: {
    padding: 15,
  },
  tableHeader: {
    backgroundColor: "#F9966B",
    borderRadius: 10,
    width: width * 0.86,
  },
});
