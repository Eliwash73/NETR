import React from "react";
import { Alert, Pressable, StyleSheet, Text, View } from "react-native";
import { RED } from "./NETRTheme";

type Props = {
  onPress: () => void;
  buttonText: string;
};

const DeletePodButton = ({ onPress, buttonText }: Props) => {
  const handleDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this Pod?\n\nThis action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress,
        },
      ],
      { cancelable: true },
    );
  };

  return (
    <View style={styles.container}>
      <Pressable onPress={handleDelete} style={styles.button}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: RED,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 5,
  },
  button: {
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
  },
});

export default DeletePodButton;
