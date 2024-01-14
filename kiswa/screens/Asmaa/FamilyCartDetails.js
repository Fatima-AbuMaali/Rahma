import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  SafeAreaView,
  ScrollView,
  Dimensions,
  Platform,
  PixelRatio,
  Image,
} from "react-native";
import {
  Fontisto,
  AntDesign,
  FontAwesome5,
  FontAwesome,
  Entypo,
  Feather,
} from "react-native-vector-icons";

import React from "react";
import { useState, useEffect } from "react";
import { Block, Checkbox, theme, NavBar, Icon } from "galio-framework";
import NumericInput from "react-native-numeric-input";
import { Dropdown } from "react-native-element-dropdown";
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
  deleteDoc,
  updateDoc,
  deleteField,
} from "firebase/firestore";
import { db } from "../../config";
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
const FamilyCartDetails = ({ route, navigation }) => {
  const { cartId } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [modalVisible2, setModalVisible2] = useState(false);

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
      label: "Blouse",
      value: "Blouse",
      icon: "https://cdn-icons-png.flaticon.com/512/8323/8323136.png",
      uri: "https://i.pinimg.com/564x/d9/1b/87/d91b87a86b9924cdce26b631bd3a968e.jpg",
    },
    {
      label: "Caftan",
      value: "Caftan",
      icon: "https://cdn-icons-png.flaticon.com/512/5238/5238311.png",
      uri: "https://i.etsystatic.com/31945487/r/il/2aadec/3870275767/il_fullxfull.3870275767_od8t.jpg",
    },
    {
      label: "Cardigan",
      value: "Cardigan",
      icon: "https://cdn-icons-png.flaticon.com/128/3345/3345635.png",
      uri: "https://i.pinimg.com/564x/a5/84/9d/a5849d187e57e693c6d765436893030a.jpg",
    },
    {
      label: "Cloak",
      value: "Cloak",
      icon: "https://cdn-icons-png.flaticon.com/512/5102/5102093.png",
      uri: "https://i.pinimg.com/564x/67/db/97/67db97f356fc31a34f7cc01df7b8ea64.jpg",
    },
    {
      label: "Coat",
      value: "Coat",
      icon: "https://cdn-icons-png.flaticon.com/128/7157/7157441.png",
      uri: "https://i.pinimg.com/564x/f6/73/7d/f6737d49a2571e063cd811812c3a922c.jpg",
    },
    {
      label: "Dress",
      value: "Dress",
      icon: "https://cdn-icons-png.flaticon.com/128/9833/9833994.png",
      uri: "https://i.pinimg.com/564x/a9/1b/cb/a91bcb63b4c31333a9402f74200a36a3.jpg",
    },
    {
      label: "Dungarees",
      value: "Dungarees",
      icon: "https://cdn-icons-png.flaticon.com/128/2161/2161057.png",
      uri: "https://i.ytimg.com/vi/soPPAhMPHtY/maxresdefault.jpg",
    },
    {
      label: "Jacket",
      value: "Jacket",
      icon: "https://cdn-icons-png.flaticon.com/128/2806/2806051.png",
      uri: "https://i.etsystatic.com/11147089/c/2250/2250/342/0/il/adfdf1/3588743348/il_300x300.3588743348_2ol1.jpg",
    },
    {
      label: "Jeans",
      value: "Jeans",
      icon: "https://cdn-icons-png.flaticon.com/128/599/599388.png",
      uri: "https://i.pinimg.com/564x/a2/3c/13/a23c134ebdc47581fa854c248633a8f5.jpg",
    },
    {
      label: "Jumper",
      value: "Jumper",
      icon: "https://cdn-icons-png.flaticon.com/128/9774/9774105.png",
      uri: "https://i.pinimg.com/564x/65/70/13/65701369d99d39458f99e4d04f80ab4d.jpg",
    },
    {
      label: "Jumpsuit",
      value: "Jumpsuit",
      icon: "https://cdn-icons-png.flaticon.com/128/2290/2290478.png",
      uri: "https://i.pinimg.com/564x/04/00/83/040083896aaf020fa83aa12dbac805fe.jpg",
    },
    {
      label: "Leggings",
      value: "Leggings",
      icon: "https://cdn-icons-png.flaticon.com/128/9381/9381563.png",
      uri: "https://i.pinimg.com/564x/9c/51/11/9c5111b9a77206aa76698ae2c41884a1.jpg",
    },
    {
      label: "Legwarmers",
      value: "Legwarmers",
      icon: "https://cdn-icons-png.flaticon.com/128/8853/8853176.png",
      uri: "https://i.pinimg.com/564x/a1/aa/38/a1aa3845e69b70935f9ed6d8c39b90fa.jpg",
    },
    {
      label: "Pants",
      value: "Pants",
      icon: "https://cdn-icons-png.flaticon.com/128/2390/2390116.png",
      uri: "https://media.istockphoto.com/id/530930442/photo/row-of-black-pants-hangs-in-wardrobe-at-home.jpg?s=612x612&w=0&k=20&c=ZFM23HW4i3gKgfT5PplBTTajAq3L1qGG30MCjWqZliA=",
    },
    {
      label: "Playsuit",
      value: "Playsuit",
      icon: "https://cdn-icons-png.flaticon.com/128/122/122709.png",
      uri: "https://ae01.alicdn.com/kf/HTB1W34cPxnaK1RjSZFtq6zC2VXai/Korean-Style-2019-New-Fashion-Women-s-Playsuits-Chic-Double-Pocket-Skinny-Strap-Long-sleeved-Casual.jpg_Q90.jpg_.webp",
    },
    {
      label: "Poncho",
      value: "Poncho",
      icon: "https://cdn-icons-png.flaticon.com/512/1319/1319774.png",
      uri: "https://i.pinimg.com/564x/50/b3/70/50b37094d3839e4aede85fc1e2c359f9.jpg",
    },
    {
      label: "Pajamas",
      value: "Pajamas",
      icon: "https://cdn-icons-png.flaticon.com/128/4446/4446182.png",
      uri: "https://m.media-amazon.com/images/I/71K03lV+jIL._AC_UL1500_.jpg",
    },
    {
      label: "Shawl",
      value: "Shawl",
      icon: "https://cdn-icons-png.flaticon.com/512/2806/2806217.png",
      uri: "https://i.pinimg.com/564x/1d/3f/f2/1d3ff25944a6377fecdb049bdef2a77e.jpg",
    },
    {
      label: "Shirt",
      value: "Shirt",
      icon: "https://cdn-icons-png.flaticon.com/128/2503/2503380.png",
      uri: "https://i.pinimg.com/564x/5c/16/17/5c1617cc8f266adfd425e452773dddaf.jpg",
    },
    {
      label: "Shorts",
      value: "Shorts",
      icon: "https://cdn-icons-png.flaticon.com/128/2237/2237015.png",
      uri: "https://i.pinimg.com/474x/89/1b/c7/891bc76dfb42ae14d5fbda7b92f7247b.jpg",
    },
    {
      label: "Skirt",
      value: "Skirt",
      icon: "https://cdn-icons-png.flaticon.com/512/4507/4507761.png",
      uri: "https://i.pinimg.com/564x/29/c9/3f/29c93f07aeb7051935cc86ac74842964.jpg",
    },
    {
      label: "Sock",
      value: "Sock",
      icon: "https://cdn-icons-png.flaticon.com/128/843/843877.png",
      uri: "https://i.pinimg.com/564x/2b/ca/5f/2bca5f01f7fb038d12d5a6f9fa4127d4.jpg",
    },
    {
      label: "Sweater",
      value: "Sweater",
      icon: "https://cdn-icons-png.flaticon.com/128/9385/9385884.png",
      uri: "https://i.pinimg.com/564x/d3/b2/51/d3b2515feca557aff75d23077b2479e8.jpg",
    },
    {
      label: "Tie",
      value: "Tie",
      icon: "https://cdn-icons-png.flaticon.com/512/1950/1950558.png",
      uri: "https://i.pinimg.com/564x/a1/6e/be/a16ebe082cb7329391b8940c8ebd07bd.jpg",
    },
    {
      label: "Tights",
      value: "Tights",
      icon: "https://cdn-icons-png.flaticon.com/512/3343/3343878.png",
      uri: "https://i.pinimg.com/564x/c2/95/db/c295dba7990a244ab5e56eb52578ce92.jpg",
    },
    {
      label: "Tops",
      value: "Tops",
      icon: "https://cdn-icons-png.flaticon.com/128/3258/3258170.png",
      uri: "https://i.pinimg.com/564x/5c/ad/15/5cad15407e6c1e9b393337dc7d17c530.jpg",
    },
    {
      label: "Tracksuit",
      value: "Tracksuit",
      icon: "https://cdn-icons-png.flaticon.com/128/5783/5783203.png",
      uri: "https://i.pinimg.com/564x/bd/be/d1/bdbed16a24645a3ad9f42d2a528f6b3b.jpg",
    },
    {
      label: "T-Shirt",
      value: "T-Shirt",
      icon: "https://cdn-icons-png.flaticon.com/128/892/892458.png",
      uri: "https://i.pinimg.com/564x/d6/9c/5a/d69c5a1ba98ce97c40a16ff506233f7a.jpg",
    },
  ];
  const [ageGroup, setAgeGroup] = useState("");
  const [type, setType] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [color, setColor] = useState(colors[0].label);
  const [size, setSize] = useState("");

  const [cart, setCart] = useState([]);
  useEffect(() => {
    getCartItems();
  }, []);

  // const items = [];
  const [items, setItems] = useState([]);

  const getCartItems = async () => {
    console.log(cartId);
    const collectionRef = collection(db, "familyRequests", cartId, "Items");
    const q = query(collectionRef);
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      console.log("snapshot");
      setCart(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }))
      );
      setItems(querySnapshot.docs.map((doc) => doc.data()));
      // console.log(cart);
    });
    return () => unsubscribe();
  };

  const itemcount = cart.reduce((total, item) => total + item.data.quantity, 0);
  const renderArticles = () => {
    return (
      <SafeAreaView style={{ height: "103%" }}>
        <View
          style={{ backgroundColor: "white", width: "100%", height: "100%" }}
        >
          <View style={styles.main}>
            <Block style={styles.hed1}>
              <Text style={styles.text1}>Cart Items</Text>
            </Block>
            <Text
              style={{
                fontSize: normalize(30),
                fontWeight: "bold",
                margin: "2%",
                marginLeft: "5%",
                padding: "2%",
              }}
            >
              Total:
              <Text
                style={{
                  fontSize: normalize(30),
                  fontWeight: "normal",
                }}
              >
                {itemcount} items
              </Text>
            </Text>
            {cart.length >= 1 ? (
              <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
              >
                <View>
                  {cart.map((x, i) => (
                    <View key={i}>
                      <View key={i} style={styles.board1}>
                        <Text style={styles.ct}>
                          {x.data.ageGroup} <Text> </Text>
                          {x.data.type}
                        </Text>
                        <Text style={styles.ct}></Text>
                      </View>
                      <View key={i + 2} style={styles.board2}>
                        <Image
                          style={styles.smallImage}
                          source={{ uri: x.data.icon }}
                        />
                        <Text style={styles.ctt}>{x.data.color}</Text>
                        <Text style={styles.ctt}>{x.data.size}</Text>
                        <Text style={styles.ctt}>{x.data.quantity}</Text>
                      </View>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </SafeAreaView>
    );
  };
  return (
    <Block flex center style={styles.home}>
      {renderArticles()}
    </Block>
  );
};

export default FamilyCartDetails;

const styles = StyleSheet.create({
  home: {
    width: width,
    // backgroundColor: "#490066",
    height: "90%",
  },
  smallImage: {
    width: normalize(80),
    height: normalize(80),
  },
  main: {
    // backgroundColor: "#F3E8EA",
    // backgroundColor: "#F7F3F0",
    margin: "5%",
    marginTop: "3%",
    paddingTop: "2%",
    height: "90%",
  },
  scrollView: {
    // backgroundColor: "#fbe5ff",
    backgroundColor: "#E9F2FA",
    marginHorizontal: 20,
    borderRadius: 10,
    height: height * 0.7,
  },
  hed1: {
    // backgroundColor: "yellow",
    height: "7%",
    // padding: "5%",
    alignItems: "center",
    justifyContent: "center",
  },
  text1: {
    color: "#1a1f87",
    fontSize: normalize(35),
    fontWeight: "bold",
  },
  board1: {
    width: "50%",
    margin: "2%",
    borderColor: "black",
    // borderWidth: 5, #FDEEF4
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor: "lightpink",
    alignItems: "center",
    // borderBottomWidth: 1,
  },
  board2: {
    width: "90%",
    marginLeft: "6%",
    marginBottom: "5%",
    paddingBottom: "5%",
    borderColor: "black",
    paddingLeft: "5%",
    // borderWidth: 5, #FDEEF4
    flexDirection: "row",
    justifyContent: "space-around",
    // backgroundColor: "lightpink",
    alignItems: "center",
    borderBottomWidth: 1,
  },

  ct: {
    color: "#1a1f87",
    fontSize: normalize(24),
    // fontWeight: "bold",
  },
  ctt: {
    fontSize: normalize(24),
    // fontWeight: "bold",
  },
});
