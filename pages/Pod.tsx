import {
  View,
  Text,
  StyleSheet,
  FlatList,
  useColorScheme,
  ScrollView,
  Pressable,
  TextInput,
} from "react-native";
import { router, useIsFocused, useLocalSearchParams } from "expo-router";
import { SetStateAction, useState } from "react";
import Modal from "react-native-modal";
import { SelectList } from "react-native-dropdown-select-list";
import useScreenDimensions from "@/hooks/useScreenDimensions";
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
import PodWidget from "@/components/PodWidget";
import AddPodButton from "@/components/addPodButton";
import CustomButton from "@/components/customButton";

type Pod = {
  id: string;
  pod_name: string;
  pod_color: string;
};
const data = [
  { id: "1", pod_name: "Fridge", pod_color: "Grey" },
  { id: "2", pod_name: "Freezer", pod_color: "Honeydew" },
  { id: "3", pod_name: "Shelf", pod_color: "Peach" },
  { id: "4", pod_name: "Cabinet", pod_color: "Purple" },
  { id: "5", pod_name: "Pod 5", pod_color: "Red" },
  { id: "6", pod_name: "Pod 6", pod_color: "Teal" },
  { id: "7", pod_name: "Pod 7", pod_color: "Yellow" },
  { id: "8", pod_name: "Pod 8", pod_color: "Purple" },
];

export default function PodScreen() {
  const { title, color, podID } = useLocalSearchParams();
  const { horizontalPadding } = useScreenDimensions();
  const [isModalVisible, setModalVisible] = useState(false);
  const [isMenuVisible, setMenuVisible] = useState(false);
  const [pods, setPods] = useState<Pod[]>([]);
  const [selectedColor, setSelectedColor] = useState("Honeydew");
  const colorString = Array.isArray(color) ? color.join("/") : color;

  const colorScheme = useColorScheme();
  const colorChanged = colorChanger(colorString);
  const [delID, setDelID] = useState(0);
  // const [podOrder, setPodOrder] = useState(0);
  const [podName, setPodName] = useState("");
  const isFocused = useIsFocused();

  const handleModal = () => setModalVisible(!isModalVisible);
  const handleMenuModal = () => setMenuVisible(!isMenuVisible);
  const addPodtoDB = async () => {
    try {
      // newPodId is the return of addPod.
      // const newPodId = await addPod(podName.trim(), selectedColor);

      // Create the new pod object using the ID, podName, and selectedColor
      const newPod = {
        // id: newPodId,
        id: String(Date.now()),
        pod_name: podName.trim(),
        pod_color: selectedColor,
        // pod_order: podOrder,
      };

      // Add the new pod to the state array.
      // setPods((existingPods) => [...existingPods, newPod]);
      setPods((existingPods) => [...existingPods, newPod]);
      // setPodOrder(newPod.pod_order);

      // Reset the state of the Modal.
      setModalVisible(false);
      // Reset the state of podName.
      setPodName("");
      console.log(newPod);
    } catch (error) {
      console.error(error);
      // console.log("Error adding pod to database: ", error.message);
    }
  };

  return (
    <View style={styles.container}>
      {/* <Text>Home</Text> */}
      <FlatList
        data={pods}
        // data={data}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
        ListFooterComponent={
          <View style={{ paddingBottom: 150 }}>
            <AddPodButton onPress={handleModal} buttonText={"Add a new Pod"} />
          </View>
        }
        renderItem={({ item }) => (
          <PodWidget
            podID={item.id}
            podTitle={item.pod_name}
            podColor={item.pod_color}
          />
        )}
      />
      <Modal
        isVisible={isModalVisible}
        avoidKeyboard={true}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={styles.addPodModal}>
          <ScrollView>
            <TextInput
              style={styles.input}
              placeholder="Enter a Pod Name"
              onChangeText={(text) => setPodName(text)}
              maxLength={20}
              value={podName}
            />
            {/* <Text style={styles.title}>Color:</Text> */}
            <View style={styles.addPodModalColor}>
              <SelectList
                setSelected={(val: SetStateAction<string>) =>
                  setSelectedColor(val)
                }
                data={colorSelect}
                save="value"
                search={false}
                placeholder="Select a Color"
                boxStyles={colorChanged}
              />
            </View>
          </ScrollView>
          <View style={{ paddingTop: 30 }}>
            <CustomButton title="Create" onPress={addPodtoDB} color={TEAL} />
          </View>
        </View>
      </Modal>
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

  editButton: {
    padding: 5,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: GREY,
    alignItems: "center",
  },
  podContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10, // Adjust as needed
  },
  menuModal: {
    width: "100%",
    backgroundColor: HONEYDEW,
    borderRadius: 16,
    padding: 25,
  },
  addPodModal: {
    width: "100%",
    backgroundColor: HONEYDEW,
    borderRadius: 16,
    padding: 25,
  },
  item: {
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 16,
  },
  title: {
    fontSize: 24,
    color: "black",
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    color: "white",
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    padding: 10,
  },
  addPodModalColor: {
    marginTop: 20,
  },
});
