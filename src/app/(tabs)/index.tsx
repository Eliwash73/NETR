import PodWidget from "@/components/PodWidget";
import useScreenDimensions from "@/hooks/useScreenDimensions";
import { View, Text, StyleSheet, FlatList } from "react-native";
import {
  GREY,
  HONEYDEW,
  PEACH,
  PURPLE,
  RED,
  TEAL,
  YELLOW,
  colorChanger,
  colorSelect,
} from "@/components/NETRTheme";

const data = [
  { id: "1", pod_name: "Pod 1", pod_color: GREY },
  { id: "2", pod_name: "Pod 2", pod_color: HONEYDEW },
  { id: "3", pod_name: "Pod 3", pod_color: PEACH }, 
  { id: "4", pod_name: "Pod 4", pod_color: PURPLE },
  { id: "5", pod_name: "Pod 5", pod_color: RED },
  { id: "6", pod_name: "Pod 6", pod_color: TEAL },
  { id: "7", pod_name: "Pod 7", pod_color: YELLOW },
  { id: "8", pod_name: "Pod 8", pod_color: PURPLE },


]

export default function Tab() {
    const { horizontalPadding } =
      useScreenDimensions();
  
  return (
    <View style={styles.container}>
      {/* <Text>Home</Text> */}
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
        renderItem={({ item }) => (
          <PodWidget
            podID={item.id}
            podTitle={item.pod_name}
            podColor={item.pod_color}
          />
        )}
      />
      {/* <dialog
        id="my_modal_1"
        className="modal modal-bottom sm:modal-middle"></dialog> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
    justifyContent: "center",
    paddingTop: 75,
  },
});
