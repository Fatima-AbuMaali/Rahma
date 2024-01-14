import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from "react-native";
import { db } from "../../config";
import { auth } from "../../config";
import { addDoc, collection } from "firebase/firestore";

const feedbackEmojis = [
  {
    id: 1,
    name: "very-bad",
    link: "https://cdn-icons-png.flaticon.com/512/2691/2691051.png",
    value: 1,
  },
  {
    id: 2,
    name: "bad",
    link: "https://cdn-icons-png.flaticon.com/512/2461/2461878.png",
    value: 2,
  },
  {
    id: 3,
    name: "neutral",
    link: "https://cdn-icons-png.flaticon.com/512/1933/1933511.png",
    value: 3,
  },
  {
    id: 4,
    name: "good",
    link: "https://cdn-icons-png.flaticon.com/512/3129/3129282.png",
    value: 4,
  },
  {
    id: 5,
    name: "very-good",
    link: "https://cdn-icons-png.flaticon.com/512/2584/2584606.png",
    value: 5,
  },
];

const Feedback = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEmoji, setSelectedEmoji] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");

  useEffect(() => {
    setModalVisible(true);
  }, []);

  const handleSelectEmoji = (emoji) => {
    setSelectedEmoji(emoji);
    setFeedbackText("");
  };

  const exit = () => {
    setModalVisible(false);
    navigation.navigate("Home");
  };

  const handleSubmit = () => {
    console.log("Selected Emoji:", selectedEmoji);
    console.log("Feedback Text:", feedbackText);
    add();
    setModalVisible(false);
    navigation.navigate("Home");
  };

  const add = async () => {
    const docRef = await addDoc(collection(db, "donorFeedback"), {
      rating: selectedEmoji.name,
      feedbackText: feedbackText,
    });
    console.log("Document written with ID: ", docRef.id);
  };

  const renderFeedbackInput = () => {
    if (!selectedEmoji || selectedEmoji.value >= 4) {
      return null;
    }

    return (
      <View style={styles.feedbackInputContainer}>
        <TextInput
          style={styles.feedbackInput}
          placeholder="How can we improve?"
          value={feedbackText}
          onChangeText={setFeedbackText}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <TouchableOpacity
        style={styles.button}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.buttonText}>Open Modal</Text>
      </TouchableOpacity> */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.closeButton} onPress={exit}>
              <Text style={styles.closeButtonText}>X</Text>
            </TouchableOpacity>
            <Text style={styles.modalText}>How was your experience?</Text>
            <View style={styles.emojiContainer}>
              {feedbackEmojis.map((emoji) => (
                <TouchableOpacity
                  key={emoji.id}
                  style={styles.emojiButton}
                  onPress={() => handleSelectEmoji(emoji)}
                >
                  <Image source={{ uri: emoji.link }} style={styles.emoji} />
                  {selectedEmoji?.id === emoji.id && (
                    <View style={styles.selectedIndicator} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
            {renderFeedbackInput()}
            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmit}
              disabled={!selectedEmoji}
            >
              <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    padding: 10,
    backgroundColor: "purple",
    borderRadius: 5,
  },
  buttonText: {
    color: "white",
    fontSize: 20,
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    width: "97%",
    alignItems: "center",
  },
  modalText: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 20,
  },
  emojiContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
    width: "100%",
  },
  emojiButton: {
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 10,
  },
  emoji: {
    width: 35,
    height: 35,
  },
  selectedIndicator: {
    position: "absolute",
    width: 20,
    height: 20,
    backgroundColor: "purple",
    borderRadius: 10,
    bottom: -5,
    right: -5,
  },
  feedbackInputContainer: {
    width: "100%",
    marginBottom: 20,
  },
  feedbackInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 10,
    height: 100,
  },
  submitButton: {
    backgroundColor: "#1a1f87",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  submitButtonText: {
    color: "white",
    fontSize: 20,
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  closeButtonText: {
    color: "black",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
});

export default Feedback;
