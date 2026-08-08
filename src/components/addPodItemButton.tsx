import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GREY } from "../components/NETRTheme";

type AddPodItemButtonProps = {
  onPress: () => void;
  buttonText: string;
};

const AddPodItemButton = ({ onPress, buttonText }: AddPodItemButtonProps) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} style={[styles.button]}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 10,
    // padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    width: "20%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "black",
    paddingVertical: 10,
    // paddingHorizontal: 30,
    borderRadius: 16,
    width: "90%",
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 32,
  },
});

export default AddPodItemButton;
