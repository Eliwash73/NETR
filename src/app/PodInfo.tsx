import { getColorByValue } from "@/components/NETRTheme";
import PodItemWidget from "@/components/PodItemWidget";
import AddPodItemButton from "@/components/addPodItemButton";
import useScreenDimensions from "@/hooks/useScreenDimensions";
import { Stack, useFocusEffect, useLocalSearchParams, useTheme } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
  FlatList,
  StyleSheet,
  View,
} from "react-native";
import PodItemForm from "@/components/PodItemForm";
import type { PodItem } from "@/util/db";
import { addPodItem, deletePodItem, fetchPodsItems, updatePodItem } from "@/util/db";

export default function PodInfo() {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const { title, color, podID } = useLocalSearchParams();
  const podTitle = Array.isArray(title) ? title[0] : title;
  const colorString = Array.isArray(color) ? color.join("/") : color;
  const numericPodID = typeof podID === "string" ? parseInt(podID, 10) : 0;

  const { horizontalPadding } = useScreenDimensions();
  const [podItems, setPodItems] = useState<PodItem[]>([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<PodItem | undefined>(undefined);

  const loadPodItems = useCallback(async () => {
    if (!numericPodID) return;
    try {
      setPodItems(await fetchPodsItems(db, numericPodID));
    } catch (error) {
      console.error("Failed to load pod items:", error);
    }
  }, [db, numericPodID]);

  useFocusEffect(
    useCallback(() => {
      loadPodItems();
    }, [loadPodItems]),
  );

  const openCreateForm = () => {
    setEditingItem(undefined);
    setFormVisible(true);
  };

  const openEditForm = (itemID: string) => {
    const item = podItems.find((i) => String(i.id) === itemID);
    if (item) {
      setEditingItem(item);
      setFormVisible(true);
    }
  };

  const handleFormSubmit = async (values: {
    podItemName: string;
    podItemQuantity: number;
    podItemQuantityUnit: string;
    podItemDate: string;
    podCategory: string;
  }) => {
    try {
      if (editingItem) {
        await updatePodItem(
          db,
          editingItem.id,
          colorString,
          values.podItemName,
          values.podItemQuantity,
          values.podItemQuantityUnit,
          values.podItemDate,
          values.podCategory,
        );
      } else {
        await addPodItem(
          db,
          numericPodID,
          colorString,
          values.podItemName,
          values.podItemQuantity,
          values.podItemQuantityUnit,
          values.podItemDate,
          values.podCategory,
        );
      }
      await loadPodItems();
    } catch (error) {
      console.error("Failed to save pod item:", error);
    } finally {
      setFormVisible(false);
      setEditingItem(undefined);
    }
  };

  const deletePodItemFromDB = async (id: string) => {
    try {
      await deletePodItem(db, +id);
      setPodItems((prev) => prev.filter((item) => String(item.id) !== id));
    } catch (error) {
      console.error(`Failed to delete pod item ${id}:`, error);
    }
  };

  return (
    <>
      <Stack.Screen options={{ title: podTitle ?? "Pod Info" }} />
      <View style={[styles.container, { backgroundColor: getColorByValue(colorString) }]}>
        <FlatList
          data={podItems}
          keyExtractor={(item) => String(item.id)}
          contentContainerStyle={{ paddingHorizontal: horizontalPadding, paddingBottom: 150 }}
          renderItem={({ item }) => (
            <View style={{ flex: 1, margin: 5 }}>
              <PodItemWidget
                podColor={colorString}
                podID={String(item.pod_id)}
                itemID={String(item.id)}
                podItemName={item.pod_item_name}
                podItemQuantity={item.pod_item_quantity}
                podItemQuantityUnit={item.pod_item_quantity_unit}
                podItemDate={item.pod_item_date}
                podCategory={item.pod_category}
                editPodItem={openEditForm}
                deletePodItem={deletePodItemFromDB}
              />
            </View>
          )}
        />
        <AddPodItemButton
          onPress={openCreateForm}
          buttonText="+"
          podColor={getColorByValue(colorString)}
        />

        <PodItemForm
          visible={isFormVisible}
          existingPodItem={editingItem}
          onClose={() => {
            setFormVisible(false);
            setEditingItem(undefined);
          }}
          onSubmit={handleFormSubmit}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  gridView: {
    marginTop: 10,
    padding: 20,
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 16,
    padding: 10,
    height: 150,
    margin: 5,
  },
  quantityUnitContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
  },
  modal: {
    borderRadius: 16,
    justifyContent: "flex-end",
    padding: 25,
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    height: 45,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  nameInput: {
    borderBottomWidth: 1,
    height: 45,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  datePickerButton: {
    color: "black",
    borderWidth: 1,
    borderRadius: 4,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
