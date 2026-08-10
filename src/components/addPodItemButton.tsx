import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { GREY } from "../components/NETRTheme";
import { useTheme } from "expo-router";

type AddPodItemButtonProps = {
  onPress: () => void;
  buttonText: string;
  podColor: string;
};

const AddPodItemButton = ({ onPress, buttonText, podColor }: AddPodItemButtonProps) => {
  const { colors } = useTheme();
    
    return (
    <View style={styles.container}>
      <Pressable onPress={onPress} style={[styles.button, { backgroundColor: podColor }]}>
        <Text style={[styles.buttonText, { color: colors.text }]}>{buttonText}</Text>
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
    // backgroundColor: "black",
    paddingVertical: 10,
    // paddingHorizontal: 30,
    borderRadius: 16,
    width: "90%",
    alignItems: "center",
  },

  buttonText: {
    color: "black",
    fontSize: 32,
  },
});

export default AddPodItemButton;
