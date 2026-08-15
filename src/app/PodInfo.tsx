import { PodItemCategories, PodItemUnits } from "@/components/NETRCategories";
import { HONEYDEW, TEAL, getColorByValue } from "@/components/NETRTheme";
import PodItemWidget from "@/components/PodItemWidget";
import AddPodItemButton from "@/components/addPodItemButton";
import CustomButton from "@/components/customButton";
import DeletePodItemButton from "@/components/deletePodItemButton";
import useScreenDimensions from "@/hooks/useScreenDimensions";
import { addPodItem, deletePodItem, fetchPodsItems } from "@/util/db";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { DatePicker, Host } from "@expo/ui/swift-ui";
import { useFocusEffect, useLocalSearchParams, useTheme } from "expo-router";
import { useSQLiteContext } from "expo-sqlite";
import { useCallback, useState } from "react";
import {
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Modal from "react-native-modal";

type PodItem = {
  id: number;
  pod_id: number;
  pod_color: string;
  pod_item_name: string;
  pod_item_quantity: number;
  pod_item_quantity_unit: string;
  pod_item_date: string;
  pod_category: string;
};

export default function PodInfo() {
  const db = useSQLiteContext();
  const { colors } = useTheme();
  const { title, color, podID } = useLocalSearchParams();
  const { horizontalPadding } = useScreenDimensions();
  const colorString = Array.isArray(color) ? color.join("/") : color;
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const [isModalVisible, setModalVisible] = useState(false);
  const [podItems, setPodItems] = useState<PodItem[]>([]);
  const [podItemName, setPodItemName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [podItemQuantity, setPodItemQuantity] = useState("");
  const [podItemQuantityUnit, setPodItemQuantityUnit] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Other");
  const [show, setShow] = useState(false);

  const numericPodID = typeof podID === "string" ? parseInt(podID, 10) : 0;

  const handleModal = () => setModalVisible(!isModalVisible);

  const loadPodItems = useCallback(async () => {
    if (!numericPodID) return;

    try {
      const items = await fetchPodsItems(db, numericPodID);
      setPodItems(items);
    } catch (error) {
      console.error("Failed to load pod items:", error);
    }
  }, [db, numericPodID]);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const fetchData = async () => {
        if (!numericPodID) return;

        try {
          const items = await fetchPodsItems(db, numericPodID);
          if (isActive) {
            setPodItems(items);
          }
        } catch (error) {
          console.error("Failed to load pod items:", error);
        }
      };

      fetchData();

      return () => {
        isActive = false;
      };
    }, [db, numericPodID]),
  );

  const handleQuantityChange = (text: string) => {
    const cleanedText = text.replace(/[^0-9.]/g, "");
    const decimalCount = (cleanedText.match(/\./g) || []).length;

    if (decimalCount > 1) {
      return;
    }

    setPodItemQuantity(cleanedText);
  };

  const addPodItemToDB = async () => {
    if (!podItemName.trim()) return;

    const quantity = Number(podItemQuantity) || 0;

    try {
      await addPodItem(
        db,
        numericPodID,
        colorString,
        podItemName.trim(),
        quantity,
        podItemQuantityUnit,
        selectedDate.toLocaleDateString("fr-CA"),
        selectedCategory,
      );
      console.log(
        numericPodID,
        colorString,
        podItemName.trim(),
        quantity,
        podItemQuantityUnit,
        selectedDate.toLocaleDateString("fr-CA"),
        selectedCategory,
      );
      await loadPodItems();
      setModalVisible(false);
      setPodItemName("");
      setPodItemQuantity("");
      setPodItemQuantityUnit("");
      setSelectedCategory("Other");
      setSelectedDate(new Date());
      setShow(false);
    } catch (error) {
      console.error("Failed to add pod item:", error);
    }
  };

  const deletePodItemFromDB = async (id: number) => {
    try {
      await deletePodItem(db, id);
      setPodItems((existingItems) =>
        existingItems.filter((item) => item.id !== id),
      );
    } catch (error) {
      console.error(`Failed to delete pod item ${id}:`, error);
    }
  };

  const onChangeDate = (_event: any, selected?: Date) => {
    const currentDate = selected || selectedDate;
    setShow(false);
    setSelectedDate(currentDate);
  };

  const showDatePicker = () => {
    setShow(true);
  };

  const showOptions = () => {
    if (Platform.OS === "ios") {
      setShow(true);
    } else {
      setShow(true);
    }
  };

  const numColumns = 1;

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: getColorByValue(colorString) },
      ]}
    >
      <FlatList
        data={podItems}
        keyExtractor={(item) => String(item.id)}
        numColumns={numColumns}
        contentContainerStyle={{
          paddingHorizontal: horizontalPadding,
          paddingBottom: 150,
        }}
        // columnWrapperStyle={styles.columnWrapper}
        renderItem={({ item }) => (
          <View style={{ flex: 1, margin: 5 }}>
            <PodItemWidget
              podColor={colorString}
              podID={String(item.pod_id)}
              podItemName={item.pod_item_name}
              podItemQuantity={item.pod_item_quantity}
              podItemQuantityUnit={item.pod_item_quantity_unit}
              podItemDate={item.pod_item_date}
              podCategory={item.pod_category}
            />
          </View>
        )}
      />
      <AddPodItemButton
        onPress={handleModal}
        buttonText="+"
        podColor={getColorByValue(colorString)}
      />

      <Modal
        isVisible={isModalVisible}
        avoidKeyboard={true}
        onBackButtonPress={() => setModalVisible(false)}
        onBackdropPress={() => setModalVisible(false)}
      >
        <View style={[styles.modal, { backgroundColor: colors.card }]}>
          <TextInput
            style={[
              styles.nameInput,
              { borderColor: colors.background, color: colors.text },
            ]}
            placeholder="Enter an Item Name"
            placeholderTextColor={colors.text}
            onChangeText={(text) => setPodItemName(text)}
            maxLength={20}
            value={podItemName}
          />
          <View style={styles.quantityUnitContainer}>
            <TextInput
              style={[
                styles.quantityInput,
                { borderColor: colors.background, color: colors.text },
              ]}
              placeholder="Enter a quantity"
              placeholderTextColor={colors.text}
              keyboardType="numeric"
              onChangeText={handleQuantityChange}
              value={podItemQuantity}
            />
            <SelectList
              setSelected={(val: string) => setPodItemQuantityUnit(val)}
              data={PodItemUnits}
              save="value"
              placeholder="Select a Unit"
              inputStyles={{ color: colors.text }}
              boxStyles={{ borderColor: colors.background }}
              search={true}
            />
          </View>

          <SelectList
            setSelected={(val: string) => setSelectedCategory(val)}
            data={PodItemCategories}
            save="value"
            placeholder="Select a Category"
            inputStyles={{ color: colors.text }}
            boxStyles={{ borderColor: colors.background }}
            search={true}
          />
          <View style={{ paddingTop: 10, paddingBottom: 10, gap: 10 }}>
            {Platform.OS !== "ios" && (
              <>
                <CustomButton
                  onPress={showOptions}
                  title="Enter Best By date"
                  color={TEAL}
                />
                <Text style={{ color: colors.text }}>
                  Selected: {selectedDate.toDateString()}
                </Text>
              </>
            )}
            {Platform.OS === "ios" && (
              <View style={{ minHeight: 45, justifyContent: "center" }}>
                <Host>
                  <DatePicker
                    title="Best By Date"
                    selection={selectedDate}
                    displayedComponents={["date"]}
                    onDateChange={(date: Date) => setSelectedDate(date)}
                  />
                </Host>
              </View>
            )}
            {Platform.OS !== "ios" && show && (
              <DateTimePicker
                value={selectedDate}
                onValueChange={onChangeDate}
              />
            )}
          </View>
          <View>
            <CustomButton title="ADD" onPress={addPodItemToDB} color={TEAL} />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
  },
  gridView: {
    marginTop: 10,
    padding: 20,
    flex: 1,
  },
  itemContainer: {
    flex: 1,
    justifyContent: "flex-end",
    borderRadius: 16,
    padding: 10,
    height: 150,
    margin: 5,
  },
  quantityUnitContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  itemName: {
    fontSize: 16,
    fontWeight: "600",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
  },
  modal: {
    borderRadius: 16,
    justifyContent: "flex-end",
    padding: 25,
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    height: 45,
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
  },
  nameInput: {
    borderBottomWidth: 1,
    height: 45,
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  datePickerButton: {
    color: "black",
    borderWidth: 1,
    borderRadius: 4,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
});
