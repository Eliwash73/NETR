import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  onPress: () => void;
  buttonText: string;
};

const AddPod = ({ onPress, buttonText }: Props) => {
  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} style={styles.button}>
        <Text style={styles.buttonText}>{buttonText}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    backgroundColor: "black",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});

export default AddPod;
