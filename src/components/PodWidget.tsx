import { router } from "expo-router";
import { useState } from "react";
import { ActionSheetIOS, Alert, Platform, Pressable, StyleSheet, Text } from "react-native";
import { colorChanger } from "./NETRTheme";

type Props = {
  podTitle: string;
  podColor: string;
  podID: string;
  deletePod: (podID: string) => void;
  editPod: (podID: string) => void;
};

export default function PodWidget({
  podTitle,
  podColor,
  podID,
  deletePod,
  editPod,
}: Props) {
  const [isPressed, setIsPressed] = useState(false);

  const confirmDelete = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this Pod?\n\nThis action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deletePod(podID) },
      ],
      { cancelable: true },
    );
  };

  const showOptions = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Edit Pod", "Delete Pod"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) editPod(podID);
          if (buttonIndex === 2) confirmDelete();
        },
      );
    } else {
      // Android fallback — Alert with multiple buttons
      Alert.alert("Pod Options", podTitle, [
        { text: "Cancel", style: "cancel" },
        { text: "Edit Pod", onPress: () => editPod(podID) },
        { text: "Delete Pod", style: "destructive", onPress: confirmDelete },
      ]);
    }
  };

  return (
    <Pressable
      style={[
        styles.itemContainer,
        colorChanger(podColor),
        isPressed && styles.active,
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onLongPress={showOptions}
      onPress={() =>
        router.push({
          pathname: "/PodInfo",
          params: { title: podTitle, color: podColor, podID },
        })
      }
    >
      <Text style={styles.title}>{podTitle}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    height: 80,
    marginVertical: 10,
    borderRadius: 20,
    padding: 15,
  },
  active: {
    transform: [{ scale: 1.03 }],
    opacity: 0.95,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
  },
});