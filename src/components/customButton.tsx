import React from "react";
import { Pressable, StyleSheet, Text, TextStyle } from "react-native";

type Props = {
  onPress: () => void;
  title: string;
  color?: string;
  textStyle?: TextStyle;
};

const CustomButton = ({
  onPress,
  title,
  color = "black",
  textStyle,
}: Props) => {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, { backgroundColor: color }]}
    >
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 5,
    borderRadius: 8,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
});

export default CustomButton;
