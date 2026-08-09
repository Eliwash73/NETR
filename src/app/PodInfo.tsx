import AddPodItemButton from "@/components/addPodItemButton";
import CustomButton from "@/components/customButton";
import { PodItemCategories, PodItemUnits } from "@/components/NETRCategories";
import { colorChanger,  
   GREY,
  HONEYDEW,
  PEACH,
  PURPLE,
  RED,
  TEAL,
  YELLOW,
  getColorByValue
 } from "@/components/NETRTheme";
import { Stack, useLocalSearchParams, useTheme } from "expo-router";
import { SetStateAction,  useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";

import { SelectList } from "react-native-dropdown-select-list";
import Modal from "react-native-modal";
export default function PodInfo() {
  const { colors } = useTheme();
  const { title, color, podID } = useLocalSearchParams();
  const colorString = Array.isArray(color) ? color.join("/") : color;
  const colorScheme = useColorScheme();
  const colorChanged = colorChanger(colorString);
  const isDark = colorScheme === "dark";
  const [isModalVisible, setModalVisible] = useState(false);

  const handleModal = () => setModalVisible(() => !isModalVisible);
  const [podItems, setPodItems] = useState([]);
  const [podItemName, setPodItemName] = useState("");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [podItemQuantity, setPodItemQuantity] = useState(0);
  const [podItemQuantityUnit, setPodItemQuantityUnit] = useState("Other");
  const [selectedCategory, setSelectedCategory] = useState("Other");
  const [show, setShow] = useState(false);
  const handleQuantityChange = (text: string) => {
    // Remove any characters that are not digits or decimal points
    const cleanedText = text.replace(/[^0-9.]/g, "");

    // Ensure there is at most one decimal point
    const decimalCount = (cleanedText.match(/\./g) || []).length;
    if (decimalCount > 1) {
      return; // Do nothing if there's more than one decimal point
    }

    // Set the cleaned and valid text
    setPodItemQuantity(Number(cleanedText));
  };
    const onChangeDate = (event: any, selectedDate: any) => {
      const currentDate = selectedDate;
      setShow(false);
      setSelectedDate(currentDate);
    };

    const showDatePicker = () => {
      setShow(true);
    };

    const numColumns = 2;
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={{ color: colors.text }}>{title}</Text>
      <AddPodItemButton onPress={handleModal} buttonText={"+"} />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // alignItems: "center",
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
    // backgroundColor: GREY,
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
    // color: "#fff",
    fontWeight: "600",
  },
  itemCode: {
    fontWeight: "600",
    fontSize: 12,
    color: "#fff",
  },
  modal: {
    // height: "30%",
    backgroundColor: HONEYDEW,
    borderRadius: 16,
    // margin: 0,
    justifyContent: "flex-end",
    padding: 25,
  },
  quantityInput: {
    flex: 1,
    borderWidth: 1,
    height: 40,
    borderRadius: 8,
    padding: 10,
    // marginBottom: 20,
    marginRight: 10,
  },
  nameInput: {
    flex: 1,
    borderBottomWidth: 1,
    height: 40,
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
