import { getColorByValue } from "@/components/NETRTheme";
import PodItemForm from "@/components/PodItemForm";
import type { PodItem } from "@/util/db";
import { fetchSinglePodItem, updatePodItem } from "@/util/db";
import { Stack, useLocalSearchParams, useRouter, useTheme } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useState } from "react";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type PodItemInfoParams = {
  pod_id?: string | string[];
  pod_item_id?: string | string[];
  pod_item_color?: string | string[];
  pod_item_title?: string | string[];
  pod_item_quantity?: string | string[];
  pod_item_quantity_unit?: string | string[];
  pod_item_date?: string | string[];
  pod_item_category?: string | string[];
};

function normalizeParam(param: string | string[] | undefined): string {
  if (Array.isArray(param)) {
    return param[0] ?? "";
  }

  return param ?? "";
}

export default function PodItemInfo() {
  const db = useSQLiteContext();
  const router = useRouter();
  const { colors } = useTheme();
  const params = useLocalSearchParams<PodItemInfoParams>();

  const podItemTitle = normalizeParam(params.pod_item_title);
  const podItemColor = normalizeParam(params.pod_item_color);
  const podItemQuantity = normalizeParam(params.pod_item_quantity);
  const podItemQuantityUnit = normalizeParam(params.pod_item_quantity_unit);
  const podItemDate = normalizeParam(params.pod_item_date);
  const podItemCategory = normalizeParam(params.pod_item_category);

  const podID = normalizeParam(params.pod_id);
  const podItemID = normalizeParam(params.pod_item_id);

  const [isFormVisible, setFormVisible] = useState(false);

const initialItem: PodItem = {
  id: Number(podItemID),
  pod_id: Number(podID),
  pod_color: podItemColor,
  pod_item_name: podItemTitle,
  pod_item_quantity: Number(podItemQuantity),
  pod_item_quantity_unit: podItemQuantityUnit,
  pod_item_date: podItemDate,
  pod_category: podItemCategory,
};

const [item, setItem] = useState<PodItem>(initialItem);
  /*
   * This recreates the PodItem represented by this screen's
   * route parameters so PodItemForm can populate its fields.
   */
  const editingItem: PodItem = {
    id: Number(podItemID),
    pod_id: Number(podID),
    pod_color: podItemColor,
    pod_item_name: podItemTitle,
    pod_item_quantity: Number(podItemQuantity),
    pod_item_quantity_unit: podItemQuantityUnit,
    pod_item_date: podItemDate,
    pod_category: podItemCategory,
  };

  const openEditForm = () => {
    setFormVisible(true);
  };

  const handleFormSubmit = async (values: {
    podItemName: string;
    podItemQuantity: number;
    podItemQuantityUnit: string;
    podItemDate: string;
    podCategory: string;
  }) => {
    try {
      await updatePodItem(
        db,
        item.id,
        podItemColor,
        values.podItemName,
        values.podItemQuantity,
        values.podItemQuantityUnit,
        values.podItemDate,
        values.podCategory,
      );

      const updatedItems = await fetchSinglePodItem(db, item.id);

      if (updatedItems.length > 0) {
        setItem(updatedItems[0]);
      }

      setFormVisible(false);
    } catch (error) {
      console.error("Failed to update pod item:", error);
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: item.pod_item_name || "Pod Info",
          headerRight: () => (
            <Pressable
              onPress={openEditForm}
              style={({ pressed }) => [
                styles.headerButton,
                { backgroundColor: colors.primary },
                pressed && styles.headerButtonPressed,
              ]}
            >
              <Text
                style={[styles.headerButtonText, { color: colors.background }]}
              >
                Edit
              </Text>
            </Pressable>
          ),
        }}
      />

      <ScrollView
        style={[styles.wrapper, { backgroundColor: colors.background }]}
      >
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={styles.label}>Name</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {item.pod_item_name || "—"}
          </Text>

          <Text style={styles.label}>Category</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {item.pod_category || "—"}
          </Text>

          <Text style={styles.label}>Quantity</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {item.pod_item_quantity
              ? `${item.pod_item_quantity} ${item.pod_item_quantity_unit}`
              : "—"}
          </Text>

          <Text style={styles.label}>Best by date</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {item.pod_item_date || "—"}
          </Text>
        </View>
      </ScrollView>

      <PodItemForm
        visible={isFormVisible}
        existingPodItem={editingItem}
        onClose={() => {
          setFormVisible(false);
        }}
        onSubmit={handleFormSubmit}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },

  card: {
    borderRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
  },

  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#7D929A",
    marginTop: 16,
  },

  value: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 6,
  },

  headerButton: {
    minWidth: 72,
    height: 36,
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },

  headerButtonPressed: {
    opacity: 0.7,
    transform: [{ scale: 0.97 }],
  },

  headerButtonText: {
    fontSize: 15,
    fontWeight: "700",
  },
});
