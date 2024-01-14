import { Modal, Text, View } from "react-native";

const Test = (props) => {
  if (props.show) {
    return (
      <View>
        <Text>Hi</Text>
      </View>
    );
  } else {
    return null;
  }
};

export default Test;
