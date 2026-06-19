import Pod from "@/components/PodWidget";
import { View, Text, StyleSheet } from "react-native";

export default function Tab() {
  return (
    <View>
        <View style={styles.container}>
      <Text>Home</Text>
    </View>
      <Pod onPress={function (): void {
        // throw new Error("Function not implemented.");
      } }></Pod>

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
