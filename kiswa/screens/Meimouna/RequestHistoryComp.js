import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Card, ListItem, Button, Icon } from "react-native-elements";
import { useState, useEffect } from "react";
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
import { db } from "../../config";
import { DataTable } from "react-native-paper";
export default function RequestHistoryComp({ itemsid, navigation }) {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    getCartItems();
  }, [itemsid]);
  const getCartItems = async () => {
    const collectionRef = collection(db, "familyRequests", itemsid, "Items");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setCart(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
    });
    return () => unsubscribe();
  };
  console.log(cart);

  return (
    <View>
      {cart.map((elem, i) => (
        <DataTable.Row style={{ textAlign: "center" }} key={i}>
          <DataTable.Cell style={{}}>
            <Image
              style={{ width: 30, height: 30, position: "relative" }}
              source={{ uri: elem.data.icon }}
            />
          </DataTable.Cell>
          <DataTable.Cell numeric style={{}}>
            {elem.data.type}
          </DataTable.Cell>
          <DataTable.Cell numeric style={{}}>
            {elem.data.color}
          </DataTable.Cell>
          <DataTable.Cell numeric style={{}}>
            {elem.data.ageGroup}
          </DataTable.Cell>

          <DataTable.Cell numeric style={{}}>
            {elem.data.size}
          </DataTable.Cell>
          <DataTable.Cell numeric style={{}}>
            {elem.data.quantity}
          </DataTable.Cell>
        </DataTable.Row>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  smallImage: {
    width: 60,
    height: 60,
    //borderRadius: 10,
  },
});
