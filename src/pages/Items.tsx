// app/Items.tsx
import PodItemListRow from "@/components/PodItemListRow";
import { fetchAllPodsItems } from "@/util/db";
import type { PodItem } from "@/util/db";
import { useFocusEffect, useRouter, useTheme } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Items() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useTheme();
  const [items, setItems] = useState<PodItem[]>([]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        try {
          const allItems = await fetchAllPodsItems(db);
          const sorted = [...allItems].sort((a, b) =>
            a.pod_item_date.localeCompare(b.pod_item_date),
          );
          if (isActive) {
            setItems(sorted);
          }
        } catch (error) {
          console.error("Failed to load all pod items:", error);
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [db]),
  );

  const openItem = (item: PodItem) => {
    router.push({
      pathname: "/PodItemInfo",
      params: {
        pod_id: String(item.pod_id),
        pod_item_color: item.pod_color,
        pod_item_title: item.pod_item_name,
        pod_item_quantity: String(item.pod_item_quantity),
        pod_item_quantity_unit: item.pod_item_quantity_unit,
        pod_item_date: item.pod_item_date,
        pod_item_category: item.pod_category,
      },
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ color: colors.text }}>No items yet.</Text>
        </View>
      ) : (
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <FlatList
            data={items}
            keyExtractor={(item) => String(item.id)}
            ItemSeparatorComponent={() => (
              <View
                style={[styles.separator, { backgroundColor: colors.border }]}
              />
            )}
            renderItem={({ item }) => (
              <PodItemListRow
                podColor={item.pod_color}
                podItemName={item.pod_item_name}
                podItemQuantity={item.pod_item_quantity}
                podItemQuantityUnit={item.pod_item_quantity_unit}
                podItemDate={item.pod_item_date}
                podCategory={item.pod_category}
                onPress={() => openItem(item)}
              />
            )}
            bounces={true}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 100,
  },
  card: {
    // flex: 1,
    marginHorizontal: 16,
    marginTop: 75,
    // marginBottom: 25,
    borderRadius: 20,
    overflow: "hidden",
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    marginLeft: 40,
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
