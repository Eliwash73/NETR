import { fetchAllPodsItems } from "@/util/db";
import type { PodItem } from "@/util/db";
import PodItemWidget from "@/components/PodItemWidget";
import useScreenDimensions from "@/hooks/useScreenDimensions";
import { useFocusEffect, useTheme } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

export default function Items() {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const { horizontalPadding } = useScreenDimensions();
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

  const numColumns = 2;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {items.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={{ color: colors.text }}>No items yet.</Text>
        </View>
      ) : (
        <FlatList
          data={items}
          keyExtractor={(item) => String(item.id)}
          numColumns={numColumns}
          contentContainerStyle={{
            paddingHorizontal: horizontalPadding,
            paddingTop: 10,
            paddingBottom: 150,
          }}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <View style={{ flex: 1, margin: 5 }}>
              <PodItemWidget
                podColor={item.pod_color}
                podID={String(item.pod_id)}
                podItemName={item.pod_item_name}
                podItemQuantity={item.pod_item_quantity}
                podItemQuantityUnit={item.pod_item_quantity_unit}
                podItemDate={item.pod_item_date}
                podCategory={item.pod_category}
              />
            </View>
          )}
          bounces={true}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
