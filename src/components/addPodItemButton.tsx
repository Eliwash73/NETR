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
      <Pressable onPress={onPress} style={[styles.button, { backgroundColor: colors.notification }]}>
        <Text style={[styles.buttonText, { color: colors.background }]}>{buttonText}</Text>
      </Pressable>
    </View> 
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    bottom: 20,
    right: 10,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
    width: "20%",
    alignItems: "center",
  },
  button: {
    paddingVertical: 10,
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
