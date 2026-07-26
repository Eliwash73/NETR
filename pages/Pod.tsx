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
import { SetStateAction, useEffect, useState } from "react";
import Modal from "react-native-modal";
import { SelectList } from "react-native-dropdown-select-list";
import useScreenDimensions from "@/hooks/useScreenDimensions";
import { useSQLiteContext } from "expo-sqlite"; 
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

export default function PodScreen() {
  const db = useSQLiteContext(); 
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
  const [podName, setPodName] = useState("");
  const isFocused = useIsFocused();

  const handleModal = () => setModalVisible(!isModalVisible);
  const handleMenuModal = () => setMenuVisible(!isMenuVisible);

  useEffect(() => {
    if (isFocused) {
      const fetchData = async () => {
        try {
          // Direct execution via context is safe because layout ensures table initialization
          const result = await db.getAllAsync<Pod>("SELECT * FROM pods;");
          setPods(result);

          console.log("items page pods loaded:", result.length);
        } catch (error) {
          console.error("Failed to query pods:", error);
        }
      };
      fetchData();
    }
  }, [isFocused, db]);

  const addPodtoDB = async () => {
    if (!podName.trim()) return;

    try {
      // Execute the insert into your structural table schema
      const result = await db.runAsync(
        "INSERT INTO pods (pod_name, pod_color) VALUES (?, ?);",
        [podName.trim(), selectedColor],
      );

      // Re-fetch clean database records to keep state flawlessly aligned
      const updatedPods = await db.getAllAsync<Pod>("SELECT * FROM pods;");
      setPods(updatedPods);

      setModalVisible(false);
      setPodName("");
    } catch (error) {
      console.error("Error writing new pod to database:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={pods}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
        ListFooterComponent={
          <View style={{ paddingBottom: 150 }}>
            <AddPodButton onPress={handleModal} buttonText={"Add a new Pod"} />
          </View>
        }
        renderItem={({ item }) => (
          <PodWidget
            podID={String(item.id)}
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
    marginBottom: 10,
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
