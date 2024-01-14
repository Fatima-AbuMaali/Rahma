import {
  ClothTypeData as ClothTypeData,
  SizeData as SizeData,
  ColorData as ColorData,
  GenderData as GenderData,
  QualityData as QualityData,
  AgeCategory as AgeCategory,
} from "../../components/Fatima/Data";
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
import { Dropdown } from "react-native-element-dropdown";
const cardWidth = width - theme.SIZES.BASE * 2;
const { width } = Dimensions.get("screen");
import { Block, GalioProvider, theme } from "galio-framework";

export default AddItemModal = () => {
  const [IDs, setIDs] = useState([]);
  const [selectedItem, setSelectedItem] = useState([]);
  const [items, setItems] = useState([]);
  const [type, setType] = useState("");
  const [size, setSize] = useState("");
  const [quality, setQuality] = useState("");
  const [color, setColor] = useState("");
  const [gender, setGender] = useState("");
  const [age, setAge] = useState("");
  const [addModalVisible, setAddModalVisible] = useState(false);
  return (
    <Modal animationType="slide" transparent={true} visible={addModalVisible}>
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
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
          <Pressable
            color={Theme.COLORS.PRIMARY}
            style={[styles.button]}
            onPress={() => {
              submit();
            }}
          >
            <Text style={{ color: "white", alignSelf: "center" }}>Done</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
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
    borderRadius: 2,
    width: 100,
    padding: 10,
    backgroundColor: "#5E72E4",

    alignSelf: "center",
  },
  dropdown: {
    margin: "2%",
    height: "10%",
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
