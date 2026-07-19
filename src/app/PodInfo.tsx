import { colorChanger, getColorByValue } from "@/components/NETRTheme";
import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

export default function PodInfo() {
  const { title, color, podID } = useLocalSearchParams();
  const colorString = Array.isArray(color) ? color.join('/') : color;
  const colorScheme = useColorScheme();
  const colorchanged = colorChanger(colorString)
  const isDark = colorScheme === "dark";
  return (
    <View
      style={[styles.container, { backgroundColor: getColorByValue(colorString)}]}
    >
      <Stack.Screen options={{ title: (title as string) || "Pod Details" }} />
      <Text style={[ { color: isDark ? "#fff" : "#000" }]}>
        {title}
      </Text>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
