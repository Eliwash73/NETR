import PodWidget from "@/components/PodWidget";
import { View, Text, StyleSheet, FlatList } from "react-native";

const data = [
  { id: "1", title: "Item 1" },
  { id: "2", title: "Item 2" },
  { id: "3", title: "Item 3" }, 
  { id: "4", title: "Item 4" },
  { id: "5", title: "Item 5" },
  { id: "6", title: "Item 6" },
  { id: "7", title: "Item 7" },
  { id: "8", title: "Item 8" },


]

export default function Tab() {
  return (
       <View style={styles.container}>
        {/* <Text>Home</Text> */}
        <FlatList
          data={data}
          keyExtractor={(item) => item.id} 
          // numColumns={1}
          renderItem={({ item }) => (
            <PodWidget
              onPress={function (): void {
                // throw new Error("Function not implemented.");
              }}
            />
          )}
        />

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 100,
  },
});
