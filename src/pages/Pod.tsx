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
import { router, useFocusEffect, useLocalSearchParams } from "expo-router";
import { SetStateAction, useCallback, useEffect, useState } from "react";
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

import { addPod, deletePod, fetchPods } from "@/util/db";

type Pod = {
  id: number;
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

  const handleModal = () => setModalVisible(!isModalVisible);
  const handleMenuModal = () => setMenuVisible(!isMenuVisible);

  const loadPods = useCallback(async () => {
    try {
      const result = await fetchPods(db);
      setPods(result);
    } catch (error) {
      console.error("Failed to load pods:", error);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const load = async () => {
        const result = await fetchPods(db);

        if (isActive) {
          setPods(result);
        }
      };

      load();

      return () => {
        isActive = false;
      };
    }, [db]),
  );

  const addPodToDB = async () => {
    if (!podName.trim()) return;

    try {
      await addPod(db, podName.trim(), selectedColor);

      await loadPods();

      setModalVisible(false);
      setPodName("");
    } catch (error) {
      console.error(error);
    }
  };

const handleDeletePod = (podID: string) => {
  // e.g. call your API/store, then update local state
  try {
    // + converts the string to number
    deletePod(db,+podID)
  } catch (error) {
        console.error(error);

  }
  setPods((prev) => prev.filter((p) => String(p.id) !== podID));
};  return (
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
                deletePod={handleDeletePod} 
                editPod={function (podID: string): void {
                    throw new Error("Function not implemented.");
                } }          />
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
              placeholder={"Enter a Pod Name"}
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
                placeholder={"Select a Color"}
                boxStyles={colorChanged}
              />
            </View>
          </ScrollView>
          <View style={{ paddingTop: 30 }}>
            <CustomButton title="Create" onPress={addPodToDB} color={TEAL} />
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
