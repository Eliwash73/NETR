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
import { router, useFocusEffect, useLocalSearchParams, useTheme } from "expo-router";
import { SetStateAction, useCallback, useEffect, useState } from "react";
import useScreenDimensions from "@/hooks/useScreenDimensions";
import { useSQLiteContext } from "expo-sqlite"; 
import {
  GREY,
  HONEYDEW
} from "@/components/NETRTheme";
import PodWidget from "@/components/PodWidget";
import AddPodButton from "@/components/addPodButton";
import PodForm from "@/components/PodForm";
import { fetchPods, updatePod, addPod, deletePod } from "@/util/db";
export type Pod = {
  id: number;
  pod_name: string;
  pod_color: string;
};

export default function PodScreen() {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const { horizontalPadding } = useScreenDimensions();
  const [pods, setPods] = useState<Pod[]>([]);
  const [isFormVisible, setFormVisible] = useState(false);
  const [editingPod, setEditingPod] = useState<Pod | undefined>(undefined);

  const loadPods = useCallback(async () => {
    try {
      setPods(await fetchPods(db));
    } catch (error) {
      console.error("Failed to load pods:", error);
    }
  }, [db]);

  useFocusEffect(
    useCallback(() => {
      loadPods();
    }, [loadPods]),
  );

  const openCreateForm = () => {
    setEditingPod(undefined);
    setFormVisible(true);
  };

  const openEditForm = (podID: string) => {
    const pod = pods.find((p) => String(p.id) === podID);
    if (pod) {
      setEditingPod(pod);
      setFormVisible(true);
    }
  };

  const handleFormSubmit = async (podName: string, podColor: string) => {
    try {
      if (editingPod) {
        await updatePod(db, editingPod.id, podName, podColor);
      } else {
        await addPod(db, podName, podColor);
      }
      await loadPods();
    } catch (error) {
      console.error(error);
    } finally {
      setFormVisible(false);
      setEditingPod(undefined);
    }
  };

  const handleDeletePod = async (podID: string) => {
    try {
      await deletePod(db, +podID);
      setPods((prev) => prev.filter((p) => String(p.id) !== podID));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <FlatList
        data={pods}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={{ paddingHorizontal: horizontalPadding }}
        ListFooterComponent={
          <View style={{ paddingBottom: 150 }}>
            <AddPodButton onPress={openCreateForm} buttonText="Add a new Pod" />
          </View>
        }
        renderItem={({ item }) => (
          <PodWidget
            podID={String(item.id)}
            podTitle={item.pod_name}
            podColor={item.pod_color}
            deletePod={handleDeletePod}
            editPod={openEditForm}
          />
        )}
      />
      <PodForm
        visible={isFormVisible}
        existingPod={editingPod}
        onClose={() => {
          setFormVisible(false);
          setEditingPod(undefined);
        }}
        onSubmit={handleFormSubmit}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    marginTop: 75,
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
