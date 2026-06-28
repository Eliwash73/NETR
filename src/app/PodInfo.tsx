import { Stack, useLocalSearchParams } from "expo-router";
import { StyleSheet, Text, useColorScheme, View } from "react-native";

export default function PodInfo() {
  const { title, color, podID } = useLocalSearchParams();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <View
      style={[styles.container, { backgroundColor: color[0]}]}
    >
      <Stack.Screen options={{ title: (title as string) || "Pod Details" }} />
      <Text style={[ { color: isDark ? "#fff" : "#000" }]}>
        {title}
      </Text>
      <Text style={[ { color: isDark ? "#fff" : "#000" }]}>
        {color}
      </Text>
      <Text style={[ { color: isDark ? "#fff" : "#000" }]}>
        {podID}
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
