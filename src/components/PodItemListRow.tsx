import { getColorByValue } from "@/components/NETRTheme";
import { useTheme } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

type Props = {
  podColor: string;
  podItemName: string;
  podItemQuantity: number;
  podItemQuantityUnit: string;
  podItemDate: string;
  podCategory: string;
  onPress: () => void;
};

export default function PodItemListRow({
  podColor,
  podItemName,
  podItemQuantity,
  podItemQuantityUnit,
  podItemDate,
  podCategory,
  onPress,
}: Props) {
  const { colors } = useTheme();
  const swatchColor = getColorByValue(podColor);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.row,
        { backgroundColor: colors.card },
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <View style={[styles.swatch, { backgroundColor: swatchColor }]} />

      <View style={styles.content}>
        <Text style={[styles.title, { color: colors.text }]} numberOfLines={1}>
          {podItemName}
        </Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {podCategory}
        </Text>
      </View>

      <View style={styles.trailing}>
        <Text style={[styles.date, { color: colors.text }]}>
          {podItemDate || "—"}
        </Text>
        {podItemQuantity > 0 && (
          <Text style={styles.quantity}>
            {podItemQuantity} {podItemQuantityUnit}
          </Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pressed: {
    opacity: 0.7,
  },
  swatch: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 14,
  },
  content: {
    flex: 1,
    marginRight: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
  subtitle: {
    fontSize: 13,
    color: "#7D929A",
    marginTop: 2,
  },
  trailing: {
    alignItems: "flex-end",
  },
  date: {
    fontSize: 14,
    fontWeight: "500",
  },
  quantity: {
    fontSize: 12,
    color: "#7D929A",
    marginTop: 2,
  },
});
