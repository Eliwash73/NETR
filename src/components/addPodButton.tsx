import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { useTheme } from "expo-router";

type Props = {
  onPress: () => void;
  buttonText: string;
};

const AddPod = ({ onPress, buttonText }: Props) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Pressable onPress={onPress} style={styles.button}>
        <Text style={[styles.buttonText, { color: colors.text }]}>{buttonText}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  button: {
    // height: 40,

    backgroundColor: "#1B998B",
    padding: 15,
    marginVertical: 10,
    // marginHorizontal: 16,
    borderRadius: 16,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 20,
  },
});

export default AddPod;
