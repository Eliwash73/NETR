import { getColorByValue } from "@/components/NETRTheme";
import { Stack, useLocalSearchParams, useRouter, useTheme } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

type PodItemInfoParams = {
  pod_id?: string | string[];
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

  const backgroundColor = getColorByValue(podItemColor || "Grey");

  return (
    <>
      <Stack.Screen options={{ title: podItemTitle ?? "Pod Info" }} />

      <ScrollView
        style={[styles.wrapper, { backgroundColor: colors.background }]}
      >
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <Text style={styles.label}>Name</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {podItemTitle || "—"}
          </Text>

          <Text style={styles.label}>Category</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {podItemCategory || "—"}
          </Text>

          <Text style={styles.label}>Quantity</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {podItemQuantity
              ? `${podItemQuantity} ${podItemQuantityUnit}`
              : "—"}
          </Text>

          <Text style={styles.label}>Best by date</Text>
          <Text style={[styles.value, { color: colors.text }]}>
            {podItemDate || "—"}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  header: {
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "700",
    color: "#030301",
  },
  card: {
    backgroundColor: "#fff",
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
    color: "#20251E",
    marginTop: 6,
  },
  button: {
    marginTop: 28,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 22,
    alignItems: "center",
  },
  buttonText: {
    color: "#030301",
    fontSize: 16,
    fontWeight: "700",
  },
});
