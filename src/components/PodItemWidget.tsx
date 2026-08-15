import { useRouter, useTheme } from "expo-router";
import React, { useState } from "react";
import {  Pressable, StyleSheet, Text,  } from "react-native";
import { colorChanger } from "./NETRTheme";

type Props = {
  podColor: string;
  podID: string;
  podItemName: string;
  podItemQuantity: number;
  podItemQuantityUnit: string;
  podItemDate: string;
  podCategory: string;
};

export default function PodItemWidget({
  podColor,
  podID,
  podItemName,
  podItemQuantity,
  podItemQuantityUnit,
  podItemDate,
  podCategory,
}: Props) {
  const router = useRouter();
  const { colors } = useTheme();

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
  const [isPressed, setIsPressed] = useState(false);



  return (
    <Pressable
      style={[
        styles.itemContainer,
        isPressed && styles.active,
        { backgroundColor: colors.background },
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => setIsPressed(false)}
      //    onLongPress={handleLongPress}
      onLongPress={() => {}} // Does nothing on long press
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