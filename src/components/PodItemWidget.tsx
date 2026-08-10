import { useRouter } from "expo-router";
import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
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
} : Props) {
  const router = useRouter();
  const colorChanged = colorChanger(podColor);

  return (
    <View>
      <Pressable
        style={[styles.itemContainer, colorChanged]}
        onPress={() =>
          router.push({
            pathname: "/PodItemInfo",
            params: {
              pod_id: podID,
              pod_item_color: podColor,
              pod_item_title: podItemName,
              pod_item_quantity: podItemQuantity,
              pod_item_quantity_unit: podItemQuantityUnit,
              pod_item_date: podItemDate,
              pod_item_category: podCategory,
            },
          })
        }
      >
        <Text style={styles.title}>{podItemName}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    color: "#030301",
  },
  itemContainer: {
    backgroundColor: "red",
    padding: 10,
    marginVertical: 4,
    marginHorizontal: 6,
    borderRadius: 16,
  },
});
