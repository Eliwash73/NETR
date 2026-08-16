import { useRouter, useTheme } from "expo-router";
import React, { useState } from "react";
import {
  ActionSheetIOS,
  Alert,
  Platform,
  Pressable,
  StyleSheet,
  Text,
} from "react-native";

type Props = {
  podID: string; // parent pod's id — used for navigation
  itemID: string; // this pod item's own id — used for edit/delete
  podColor: string;
  podItemName: string;
  podItemQuantity: number;
  podItemQuantityUnit: string;
  podItemDate: string;
  podCategory: string;
  editPodItem: (itemID: string) => void;
  deletePodItem: (itemID: string) => void;
};

export default function PodItemWidget({
  podID,
  itemID,
  podColor,
  podItemName,
  podItemQuantity,
  podItemQuantityUnit,
  podItemDate,
  podCategory,
  editPodItem,
  deletePodItem,
}: Props) {
  const router = useRouter();
  const { colors } = useTheme();
  const [isPressed, setIsPressed] = useState(false);

  const openItem = () => {
    router.push({
      pathname: "/PodItemInfo",
      params: {
        pod_id: podID,
        pod_item_color: podColor,
        pod_item_title: podItemName,
        pod_item_quantity: String(podItemQuantity),
        pod_item_quantity_unit: podItemQuantityUnit,
        pod_item_date: podItemDate,
        pod_item_category: podCategory,
      },
    });
  };

  const confirmDelete = () => {
    Alert.alert(
      "Delete Item",
      `Are you sure you want to delete "${podItemName}"?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Delete", style: "destructive", onPress: () => deletePodItem(itemID) },
      ],
    );
  };

  const handleLongPress = () => {
    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Cancel", "Edit", "Delete"],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) editPodItem(itemID);
          if (buttonIndex === 2) confirmDelete();
        },
      );
    } else {
      Alert.alert(podItemName, undefined, [
        { text: "Edit", onPress: () => editPodItem(itemID) },
        { text: "Delete", style: "destructive", onPress: confirmDelete },
        { text: "Cancel", style: "cancel" },
      ]);
    }
  };

  return (
    <Pressable
      style={[
        styles.itemContainer,
        isPressed && styles.active,
        { backgroundColor: colors.background },
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      onLongPress={handleLongPress}
      onPress={openItem}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {podItemName}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flex: 1,
    height: 100,
    margin: 5,
    padding: 15,
    borderRadius: 16,
    justifyContent: "center",
  },
  active: {
    transform: [{ scale: 0.98 }],
    opacity: 0.9,
  },
  title: {
    fontSize: 24,
    color: "#030301",
  },
});