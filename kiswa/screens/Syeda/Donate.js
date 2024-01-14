import React, { useEffect, useState } from "react";

import {
  StyleSheet,
  ImageBackground,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  TextInput,
  View,
  Platform,
  PixelRatio,
  Image,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Block, Checkbox, Text, theme, Button } from "galio-framework";
import { Dropdown } from "react-native-element-dropdown";
import { auth, db } from "../../config";
import {
  MaterialCommunityIcons,
  Ionicons,
  FontAwesome5,
  Feather,
  Entypo,
} from "react-native-vector-icons";
import { doc, getDoc } from "firebase/firestore";

const { width, height } = Dimensions.get("screen");
const scale = width / 428;
export function normalize(size) {
  const newSize = size * scale;
  if (Platform.OS === "ios") {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
}

const Donate = ({ route, navigation }) => {
  const [selected, setSelected] = useState("Donate");

  useEffect(() => handleDonatePress(), []);

  useEffect(() => {
    // alert("donate");
    if (
      route.params &&
      route.params.type &&
      route.params.quantity &&
      route.params.uri
    ) {
      setCloth(route.params.type);
      setAmount(route.params.quantity);
      console.log("quantity route: ", route.params.quantity);
      setItemURI(route.params.uri);
      console.log("uri route: ", route.params.uri);
      console.log("exists");
    } else {
      setCloth("");
      setAmount("");
      setItemURI("");
      console.log("doesnt exit"); //most probably a problem with the stack navigator, will fix later
    }
  }, [ItemURI]);

  const [ItemURI, setItemURI] = useState("");

  const changeCloth = (itemValue) => {
    console.log(itemValue);
    setCloth(itemValue);
    console.log("cloth: ", cloth);

    const selectedData = ClothTypeData.find((item) => item.value === itemValue);
    console.log("selectedData: ", selectedData);
    console.log("selectedDataURI: ", selectedData.uri);
    setItemURI(selectedData.uri);
  };

  useEffect(() => {
    user != undefined ? getZone() : null;
    console.log(cloth);
    console.log(amount);
  });
  let user = auth?.currentUser?.email;

  const [Dzone, setDZone] = useState("");
  const getZone = async () => {
    // alert("hiii");
    const docRef = doc(db, "donors", user);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setDZone(docSnap.data().zone);
      // alert(Dzone);

      // setLat(docSnap.data().location.coords.latitude);
      // setLog(docSnap.data().location.coords.longitude);
    } else {
      console.log("No such document!");
    }
  };

  //dropdown

  const [cloth, setCloth] = useState("");

  const ClothTypeData = [
    {
      label: "🧕🏻Abaya",
      value: "Abaya",
      icon: "https://cdn-icons-png.flaticon.com/512/4185/4185577.png",
      uri: "https://i.pinimg.com/564x/bd/be/d1/bdbed16a24645a3ad9f42d2a528f6b3b.jpg",
    },
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
      label: "👕T-Shirt",
      value: "T-Shirt",
      icon: "https://cdn-icons-png.flaticon.com/128/892/892458.png",
      uri: "https://i.pinimg.com/564x/d6/9c/5a/d69c5a1ba98ce97c40a16ff506233f7a.jpg",
    },
  ];

  //amount numeric text box

  const [amount, setAmount] = useState("");

  const handleNumberChange = (text) => {
    if (/^\d+$/.test(text) || text === "") {
      setAmount(text);
    }
  };

  //time intervals

  const [time, setTime] = useState("");

  const [flag1, setFlag1] = useState(0);
  const [flag2, setFlag2] = useState(0);
  const [flag3, setFlag3] = useState(0);

  const changeColor1 = () => {
    setFlag1(1);
    setFlag2(0);
    setFlag3(0);
    setTime("8AM - 12PM");
  };

  const changeColor2 = () => {
    setFlag1(0);
    setFlag2(1);
    setFlag3(0);
    setTime("12PM - 6PM");
  };

  const changeColor3 = () => {
    setFlag1(0);
    setFlag2(0);
    setFlag3(1);
    setTime("6PM - 10PM");
  };

  const [dropError, setDropError] = useState("");

  const [amountError, setAmountError] = useState("");

  const [dateError, setDateError] = useState("");

  const [timeError, setTimeError] = useState("");

  const [confirm, setConfirm] = useState([]);
  console.log("confirm OUTSIFE: ", confirm);

  const error = () => {
    // alert(Dzone);
    if (confirm.length > 0) {
      if (time === "") {
        setTimeError("Please select a time interval");
        return;
      } else {
        setTimeError("");
      }
      if (date === "") {
        setDateError("Please select a date interval");
        return;
      } else {
        setDateError("");
      }
      if (time !== "" && date !== "") {
        navigation.navigate("CheckOut", {
          itemsArray: confirm,
          time: time,
          date: date,
          Dzone: Dzone,
        });
      }
    } else {
      if (cloth === "" || cloth === undefined) {
        setDropError("Please select a clothing item");
        return;
      } else {
        setDropError("");
      }
      if (amount === "") {
        setAmountError("Please enter amount");
        return;
      } else {
        setAmountError("");
      }

      if (time === "") {
        setTimeError("Please select a time interval");
        return;
      } else {
        setTimeError("");
      }
      if (date === "") {
        setDateError("Please select a date interval");
        return;
      } else {
        setDateError("");
      }
      if (
        cloth !== "" &&
        cloth !== undefined &&
        amount !== "" &&
        time !== "" &&
        date !== ""
      ) {
        navigation.navigate("CheckOut", {
          itemsArray: confirm,
          time: time,
          date: date,
        });
      }
    }

    // handleDonatePress();
  };

  const handleDonatePress = () => {
    setCloth("");
    setItemURI("https://cdn-icons-png.flaticon.com/128/6834/6834320.png");
    setAmount("");
    setTime("");
    setDate("");
    setConfirm([]);
    setFlag(0);
    setCheck1(0);
    setCheck2(0);
    setCheck3(0);
    setFlag1(0);
    setFlag2(0);
    setFlag3(0);
  };

  //dates

  //todays date
  const currentDate = new Date();
  const day = currentDate.getDate();
  const month = currentDate.getMonth() + 1; // add 1 to get the correct month (0-indexed)
  const year = currentDate.getFullYear();

  // Format the date as a string
  const dateString = `${day}/${month}/${year}`;
  console.log("date string: ", dateString);

  const first2 = new Date();
  first2.setDate(currentDate.getDate() + 3);
  console.log("first2", first2);
  const first2day = first2.getDate();
  const first2month = first2.getMonth() + 1; // add 1 to get the correct month (0-indexed)
  const first2year = first2.getFullYear();
  const first2date = `${first2day}/${first2month}/${first2year}`;
  console.log("first2date: ", first2date);

  console.log("currentdate: ", currentDate);

  const sec1 = new Date();
  sec1.setDate(currentDate.getDate() + 4);
  const sec1day = sec1.getDate();
  const sec1month = sec1.getMonth() + 1;
  const sec1year = sec1.getFullYear();
  const sec1date = `${sec1day}/${sec1month}/${sec1year}`;
  console.log("sec1date: ", sec1date);

  const sec2 = new Date();
  sec2.setDate(currentDate.getDate() + 6);
  const sec2day = sec2.getDate();
  const sec2month = sec2.getMonth() + 1;
  const sec2year = sec2.getFullYear();
  const sec2date = `${sec2day}/${sec2month}/${sec2year}`;
  console.log("sec2date: ", sec2date);

  const third1 = new Date();
  third1.setDate(currentDate.getDate() + 7);
  const third1day = third1.getDate();
  const third1month = third1.getMonth() + 1;
  const third1year = third1.getFullYear();
  const third1date = `${third1day}/${third1month}/${third1year}`;
  console.log("third1date: ", third1date);

  const third2 = new Date();
  third2.setDate(currentDate.getDate() + 9);
  const third2day = third2.getDate();
  const third2month = third2.getMonth() + 1;
  const third2year = third2.getFullYear();
  const third2date = `${third2day}/${third2month}/${third2year}`;
  console.log("third2date: ", third2date);

  const [check1, setCheck1] = useState(0);
  const [check2, setCheck2] = useState(0);
  const [check3, setCheck3] = useState(0);

  const [date, setDate] = useState("");

  const checkColor1 = () => {
    setCheck1(1);
    setCheck2(0);
    setCheck3(0);
    setDate(`${dateString} - ${first2date}`);
  };

  const checkColor2 = () => {
    setCheck1(0);
    setCheck2(1);
    setCheck3(0);
    setDate(`${sec1date} - ${sec2date}`);
  };

  const checkColor3 = () => {
    setCheck1(0);
    setCheck2(0);
    setCheck3(1);
    setDate(`${third1date} - ${third2date}`);
  };

  const add = (cloth, amount) => {
    if (cloth === "" || cloth === undefined) {
      setDropError("Please select a clothing item");
      return;
    } else {
      setDropError("");
    }
    if (amount === "") {
      setAmountError("Please enter amount");
      return;
    } else {
      setAmountError("");
    }
    console.log("ADD CLOTH => ", cloth);
    console.log("ADD AMOUNT => ", amount);
    console.log(
      "ADD ICON => ",
      ClothTypeData.find((object) => object.value === cloth).icon
    );

    if ((cloth !== "" || cloth !== undefined) && amount !== "") {
      setFlag(1);
      setConfirm([
        ...confirm,
        {
          cloth: cloth,
          amount: amount,
          icon: ClothTypeData.find((object) => object.value === cloth).icon,
        },
      ]);
      console.log("confirm array: ", confirm);
    }

    handleButtonPress();
  };

  //clear input values when add button is pressed

  const handleButtonPress = () => {
    setCloth("");
    setItemURI("https://cdn-icons-png.flaticon.com/128/6834/6834320.png");
    setAmount("");
  };

  const [flag, setFlag] = useState(0);

  const handleRemoveItem = (index) => {
    const newItems = confirm.filter((item, i) => i !== index).reverse();
    setConfirm(newItems);
  };
  const [showTime, setShowTime] = useState(false);
  const [nextFlag, setNextFlag] = useState(false);

  return (
    <Block>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.articles}
      >
        {!showTime ? (
          <Block style={styles.container}>
            <ImageBackground
              style={styles.Image}
              source={{
                uri: "https://di-uploads-pod14.dealerinspire.com/thekiastores/uploads/2020/11/Donate-Clothes-Banner-768x252.jpg",
              }}
            >
              {/* <TouchableOpacity onPress={() => navigation.navigate("Home")}>
            <Image
              style={styles.backButton}
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/54/54623.png",
              }}
            ></Image>
          </TouchableOpacity> */}
            </ImageBackground>

            <Text style={{ fontSize: normalize(20), color: "red" }}>
              {dropError}
            </Text>
            <Dropdown
              style={styles.dropdown}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              inputSearchStyle={styles.inputSearchStyle}
              iconStyle={styles.iconStyle}
              data={ClothTypeData}
              search
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder="Select Clothing Item"
              searchPlaceholder="Search..."
              value={cloth === "" ? "Select Clothing Item" : cloth}
              onChange={(item) => {
                changeCloth(item.value);
              }}
            />

            <Text style={{ fontSize: normalize(20), color: "red" }}>
              {amountError}
            </Text>
            <TextInput
              style={styles.input}
              placeholder={"Enter Quantity"}
              value={amount}
              onChangeText={handleNumberChange}
              keyboardType="numeric"
            />

            <Pressable style={styles.button} onPress={() => add(cloth, amount)}>
              <Text style={styles.buttonText}>
                {confirm.length === 0 ? "Add" : "Add more Items"}
              </Text>
            </Pressable>
            {confirm.length > 0 ? (
              <Block
                style={{
                  borderWidth: 0.5,
                  borderColor: "black",
                  margin: 10,
                  width: width,
                }}
              ></Block>
            ) : null}
            {confirm.length > 0 ? (
              <Block
                style={{
                  flexDirection: "row",
                  flexWrap: "wrap",
                  height: height * 0.15,
                  // borderWidth: 1,
                  width: width,
                }}
              >
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator
                  automaticallyAdjustsScrollIndicatorInsets
                  // bouncesZoom
                  directionalLockEnabled
                  invertStickyHeaders
                  // onContentSizeChange={() => setConfirm(confirm.reverse())}
                >
                  {confirm.map((item, index) => (
                    <View key={index} style={styles.smallContainer}>
                      <View style={styles.smallSquare}>
                        <Image
                          style={styles.smallImage}
                          source={{ uri: item.icon }}
                        />
                        <Text style={styles.smallText}>{item.cloth}</Text>
                        <Text style={styles.smallText}>x{item.amount}</Text>
                        <TouchableOpacity
                          style={styles.smallCloseButton}
                          onPress={() => handleRemoveItem(index)}
                        >
                          <Text style={styles.smallCloseButtonText}>X</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ))}
                </ScrollView>
              </Block>
            ) : null}
          </Block>
        ) : (
          <Block style={{ marginTop: "9%", width: width }}>
            <Text style={{ fontSize: normalize(22), marginLeft: 6 }}>
              My cart
            </Text>
            <Block
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                height: height * 0.2,
                // borderWidth: 1,
                width: width,
              }}
            >
              <ScrollView horizontal>
                {confirm.map((item, index) => (
                  <View key={index} style={styles.smallContainer}>
                    <View style={styles.smallSquare}>
                      <Image
                        style={styles.smallImage}
                        source={{ uri: item.icon }}
                      />
                      <Text style={styles.smallText}>{item.cloth}</Text>
                      <Text style={styles.smallText}>x{item.amount}</Text>
                      <TouchableOpacity
                        style={styles.smallCloseButton}
                        onPress={() => handleRemoveItem(index)}
                      >
                        <Text style={styles.smallCloseButtonText}>X</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </Block>

            <Text style={{ fontSize: normalize(22), marginLeft: 15 }}>
              Select pick-up time interval:
            </Text>

            <Text
              style={{ fontSize: normalize(16), color: "red", marginLeft: 20 }}
            >
              {timeError}
            </Text>
            <Block
              style={{ flexDirection: "row", flexWrap: "wrap", margin: 10 }}
            >
              <Button
                onPress={changeColor1}
                style={{
                  backgroundColor: flag1 === 0 ? "#1a1f87" : "#f8a069",
                }}
              >
                <Text style={styles.timepick}>8AM - 12PM</Text>
              </Button>
              <Button
                onPress={changeColor2}
                style={{ backgroundColor: flag2 === 0 ? "#1a1f87" : "#f8a069" }}
              >
                <Text style={styles.timepick}> 12PM - 6PM</Text>
              </Button>
              <Button
                onPress={changeColor3}
                style={{ backgroundColor: flag3 === 0 ? "#1a1f87" : "#f8a069" }}
              >
                <Text style={styles.timepick}>6PM - 10PM</Text>
              </Button>
            </Block>

            <Text style={{ fontSize: normalize(22), marginLeft: 15 }}>
              Select pick-up date interval:
            </Text>
            <Text
              style={{ fontSize: normalize(16), color: "red", marginLeft: 20 }}
            >
              {dateError}
            </Text>
            <Block
              style={{ flexDirection: "row", flexWrap: "wrap", margin: 10 }}
            >
              <Button
                onPress={checkColor1}
                style={{
                  backgroundColor: check1 === 0 ? "#1a1f87" : "#f8a069",
                }}
              >
                <Text style={styles.timepick}>
                  {dateString} - {first2date}
                </Text>
              </Button>
              <Button
                onPress={checkColor2}
                style={{
                  backgroundColor: check2 === 0 ? "#1a1f87" : "#f8a069",
                }}
              >
                <Text style={styles.timepick}>
                  {sec1date} - {sec2date}
                </Text>
              </Button>
              <Button
                onPress={checkColor3}
                style={{
                  backgroundColor: check3 === 0 ? "#1a1f87" : "#f8a069",
                }}
              >
                <Text style={styles.timepick}>
                  {third1date} - {third2date}
                </Text>
              </Button>
            </Block>
          </Block>
        )}

        {!showTime ? (
          confirm.length > 0 ? (
            <TouchableOpacity
              style={styles.button}
              // onPress={() => error()}
              onPress={() => setShowTime(!showTime)}
            >
              <Text style={styles.buttonText}>Next</Text>
            </TouchableOpacity>
          ) : null
        ) : (
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              padding: "3%",
              paddingHorizontal: "5%",
            }}
          >
            <TouchableOpacity
              style={[styles.buttonSmall, { backgroundColor: "#52b69a" }]}
              // onPress={() => error()}
              onPress={() => setShowTime(!showTime)}
            >
              <Text style={styles.buttonText}>Add more</Text>
            </TouchableOpacity>

            <Pressable
              style={[styles.buttonSmall, { backgroundColor: "#f8a069" }]}
              onPress={() => error()}
            >
              <Text style={styles.buttonText}>Continue</Text>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </Block>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "#f3f0d9",
  },
  dropdown: {
    margin: 16,
    height: 50,
    borderBottomColor: "gray",
    borderBottomWidth: 0.5,
    width: "90%",
    alignSelf: "center",
    borderWidth: 0.3,
    borderRadius: 13,
    padding: 5,
  },
  timepick: {
    color: "#fff",
    fontSize: width > 500 ? normalize(12) : normalize(15),
  },
  icon: {
    marginRight: 5,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  iconStyle: {
    width: 20,
    height: 20,
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
  },
  input: {
    width: "90%",
    height: 50,
    margin: 15,
    borderBottomWidth: 0.5,
    // borderColor: "lightgray",
    borderWidth: 0.3,
    padding: 10,
    fontSize: 20,
    borderRadius: 10,
    // padding: 10,
  },
  Image: {
    width: width,
    height: height * 0.17,
    //borderRadius: 10,
    overflow: "hidden",
    alignSelf: "center",
  },
  button: {
    padding: 15,
    // paddingHorizontal: 30,
    borderRadius: 90,
    backgroundColor: "#3C4DBD",
    // position: "relative",
    // overflow: "hidden",
    width: width * 0.7,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: width > 500 ? 40 : 25,
  },
  buttonSmall: {
    padding: 15,
    paddingHorizontal: 30,
    borderRadius: 50,
    backgroundColor: "#3c4dbd",
    position: "relative",
    overflow: "hidden",
    width: width * 0.4,
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 30,
  },
  buttonText: {
    fontSize: normalize(20),
    fontWeight: "bold",
    color: "white",
  },
  backButton: {
    width: 50,
    height: 50,
    backgroundColor: "white",
    borderRadius: 25,
    margin: 20,
  },

  //add button items

  smallContainer: {
    alignItems: "center",
    justifyContent: "center",
    margin: 10,
  },
  smallSquare: {
    backgroundColor: "white",
    borderRadius: 10,
    width: width > 500 ? width * 0.25 : width * 0.3,
    height: width > 500 ? width * 0.25 : width * 0.35,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  smallImage: {
    width: width < 500 ? width * 0.15 : width * 0.1,
    height: width < 500 ? width * 0.15 : width * 0.1,
    //borderRadius: 10,
  },
  smallText: {
    //marginTop: 5,
    fontSize: normalize(18),
    //fontWeight: 'bold',
  },
  smallCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#b19cd9",
    borderRadius: 30,
    width: 23,
    height: 23,
    alignItems: "center",
    justifyContent: "center",
  },
  smallCloseButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Donate;
