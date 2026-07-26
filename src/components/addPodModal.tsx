import React from "react";
import { ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
// import { SelectList } from "react-native-dropdown-select-list";
import Modal from "react-native-modal";
import { HONEYDEW, PURPLE, TEAL } from "./NETRTheme";
import CustomButton from "./customButton";

type SelectOption = {
  key: string;
  value: string;
};

type Props = {
  isModalVisible: boolean;
  onBackButtonPress: () => void;
  onBackdropPress: () => void;
  onChangeText: (text: string) => void;
  value: string;
  setSelected: (value: string) => void;
  colorSelect: SelectOption[];
  addPod: () => void;
};

export default function AddPodModal({
  isModalVisible,
  onBackButtonPress,
  onBackdropPress,
  onChangeText,
  value,
  setSelected,
  colorSelect,
  addPod,
}: Props) {
  return (
    <Modal
      isVisible={isModalVisible}
      avoidKeyboard={true}
      onBackButtonPress={onBackButtonPress}
      onBackdropPress={onBackdropPress}
    >
      <View style={styles.modal}>
        <ScrollView>
          <TextInput
            style={styles.input}
            placeholder="Enter Pod name"
            onChangeText={onChangeText}
            maxLength={20}
            value={value}
          />
          <Text style={styles.title}>Color:</Text>
        </ScrollView>
        <CustomButton title="Create Pod" onPress={addPod} color={TEAL} />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "100%",
    height: "60%",
    backgroundColor: HONEYDEW,
    borderRadius: 16,
    padding: 25,
  },
  input: {
    borderWidth: 1,
    height: 40,
    borderRadius: 8,
    padding: 10,
  },
  title: {
    fontSize: 24,
    color: PURPLE,
  },
});
