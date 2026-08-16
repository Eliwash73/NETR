import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TextInput, View } from "react-native";
import Modal from "react-native-modal";
import { SelectList } from "react-native-dropdown-select-list";
import { useTheme } from "expo-router";
import { TEAL, colorChanger, colorSelect } from "@/components/NETRTheme";
import CustomButton from "@/components/customButton";

export type Pod = {
  id: number;
  pod_name: string;
  pod_color: string;
};

interface PodFormProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (podName: string, podColor: string) => Promise<void> | void;
  existingPod?: Pod; // undefined = create mode, present = edit mode
}

export default function PodForm({
  visible,
  onClose,
  onSubmit,
  existingPod,
}: PodFormProps) {
  const { colors } = useTheme();
  const isEditing = existingPod != null;

  const [podName, setPodName] = useState(existingPod?.pod_name ?? "");
  const [selectedColor, setSelectedColor] = useState(
    existingPod?.pod_color ?? "Honeydew",
  );

  // re-sync fields any time a different pod (or a fresh "create") is opened
  useEffect(() => {
    if (visible) {
      setPodName(existingPod?.pod_name ?? "");
      setSelectedColor(existingPod?.pod_color ?? "Honeydew");
    }
  }, [visible, existingPod]);

  const colorChanged = colorChanger(selectedColor);

  const handleSubmit = async () => {
    if (!podName.trim()) return;
    await onSubmit(podName.trim(), selectedColor);
  };

  return (
    <Modal
      isVisible={visible}
      avoidKeyboard
      onBackButtonPress={onClose}
      onBackdropPress={onClose}
    >
      <View style={[styles.podModal, { backgroundColor: colors.card }]}>
        <ScrollView>
          <TextInput
            style={[
              styles.input,
              { color: colors.text, borderColor: colors.border },
            ]}
            placeholder="Enter a Pod Name"
            placeholderTextColor={colors.text}
            onChangeText={setPodName}
            maxLength={20}
            value={podName}
          />
          <View style={styles.podModalColor}>
            <SelectList
              setSelected={(val: string) => setSelectedColor(val)}
              data={colorSelect}
              save="value"
              search={false}
              placeholder="Select a Color"
              defaultOption={colorSelect.find(
                (c) => c.value === existingPod?.pod_color,
              )}
              boxStyles={colorChanged}
            />
          </View>
        </ScrollView>
        <View style={{ paddingTop: 30 }}>
          <CustomButton
            title={isEditing ? "Save" : "Create"}
            onPress={handleSubmit}
            color={TEAL}
          />
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  podModal: {
    width: "100%",
    borderRadius: 16,
    padding: 25,
  },
  input: {
    borderBottomWidth: 1,
    height: 40,
    padding: 10,
  },
  podModalColor: {
    marginTop: 20,
  },
});
