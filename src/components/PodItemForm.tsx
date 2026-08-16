import { PodItemCategories, PodItemUnits } from "@/components/NETRCategories";
import { TEAL } from "@/components/NETRTheme";
import CustomButton from "@/components/customButton";
import type { PodItem } from "@/util/db";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { DatePicker, Host } from "@expo/ui/swift-ui";
import { useTheme } from "expo-router";
import { useEffect, useState } from "react";
import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import { SelectList } from "react-native-dropdown-select-list";
import Modal from "react-native-modal";
import { datePickerStyle } from "@expo/ui/swift-ui/modifiers";
export interface PodItemFormValues {
	podItemName: string;
	podItemQuantity: number;
	podItemQuantityUnit: string;
	podItemDate: string;
	podCategory: string;
}

interface PodItemFormProps {
	visible: boolean;
	onClose: () => void;
	onSubmit: (values: PodItemFormValues) => Promise<void> | void;
	existingPodItem?: PodItem; // undefined = create mode, present = edit mode
}

export default function PodItemForm({
	visible,
	onClose,
	onSubmit,
	existingPodItem,
}: PodItemFormProps) {
	const { colors } = useTheme();
	const isEditing = existingPodItem != null;

	const [podItemName, setPodItemName] = useState("");
	const [podItemQuantity, setPodItemQuantity] = useState("");
	const [podItemQuantityUnit, setPodItemQuantityUnit] = useState("");
	const [selectedCategory, setSelectedCategory] = useState("Other");
	const [selectedDate, setSelectedDate] = useState(new Date());
	const [show, setShow] = useState(false);
	const [modalReady, setModalReady] = useState(false);


	// re-sync fields any time a different item (or a fresh "create") is opened
	useEffect(() => {
		if (visible) {
			setPodItemName(existingPodItem?.pod_item_name ?? "");
			setPodItemQuantity(existingPodItem ? String(existingPodItem.pod_item_quantity) : "");
			setPodItemQuantityUnit(existingPodItem?.pod_item_quantity_unit ?? "");
			setSelectedCategory(existingPodItem?.pod_category ?? "Other");
			setSelectedDate(
				existingPodItem?.pod_item_date ? new Date(existingPodItem.pod_item_date) : new Date(),
			);
			setShow(false);
		}
	}, [visible, existingPodItem]);

	const handleQuantityChange = (text: string) => {
		const cleaned = text.replace(/[^0-9.]/g, "");
		if ((cleaned.match(/\./g) || []).length > 1) return;
		setPodItemQuantity(cleaned);
	};

	const onChangeDate = (_event: any, selected?: Date) => {
		setShow(false);
		if (!selected) return;

		const normalized = new Date(
			selected.getUTCFullYear(),
			selected.getUTCMonth(),
			selected.getUTCDate(),
		);
		setSelectedDate(normalized);
	};
	const handleSubmit = async () => {
		if (!podItemName.trim()) return;

		await onSubmit({
			podItemName: podItemName.trim(),
			podItemQuantity: Number(podItemQuantity) || 0,
			podItemQuantityUnit,
			podItemDate: selectedDate.toLocaleDateString("fr-CA"),
			podCategory: selectedCategory,
		});
	};

	return (
		<Modal
  isVisible={visible}
  avoidKeyboard
  onModalShow={() => setModalReady(true)}
  onModalHide={() => setModalReady(false)}
  onBackButtonPress={onClose}
  onBackdropPress={onClose}
>
			<View style={[styles.modal, { backgroundColor: colors.card }]}>
				<TextInput
					style={[styles.nameInput, { borderColor: colors.background, color: colors.text }]}
					placeholder="Enter an Item Name"
					placeholderTextColor={colors.text}
					onChangeText={setPodItemName}
					maxLength={20}
					value={podItemName}
				/>
				<View style={styles.quantityUnitContainer}>
					<TextInput
						style={[styles.quantityInput, { borderColor: colors.background, color: colors.text }]}
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
						search
						defaultOption={PodItemUnits.find(
							(u: any) => u.value === existingPodItem?.pod_item_quantity_unit,
						)}
					/>
				</View>

				<SelectList
					setSelected={(val: string) => setSelectedCategory(val)}
					data={PodItemCategories}
					save="value"
					placeholder="Select a Category"
					inputStyles={{ color: colors.text }}
					boxStyles={{ borderColor: colors.background }}
					search
					defaultOption={PodItemCategories.find(
						(c: any) => c.value === existingPodItem?.pod_category,
					)}
				/>

				<View style={{ paddingTop: 10, paddingBottom: 10, gap: 10 }}>
					{Platform.OS !== "ios" && (
						<>
							<CustomButton onPress={() => setShow(true)} title="Enter Best By date" color={TEAL} />
							<Text style={{ color: colors.text }}>Selected: {selectedDate.toDateString()}</Text>
						</>
					)}
					{Platform.OS === "ios" && (
						<View style={{ minHeight: 45, justifyContent: "center" }}>
						{Platform.OS === "ios" &&
							(modalReady ? (
							<Host matchContents style={{ width: "100%" }}>
								<DatePicker
								modifiers={[datePickerStyle("compact")]}
								title="Best By Date"
								selection={selectedDate}
								displayedComponents={["date"]}
								onDateChange={(date: Date) => setSelectedDate(date)}
								/>
							</Host>
							) : (
							// reserve the same space so nothing jumps once it mounts
							<View style={{ height: 45 }} />
							))}
						</View>
					)}
					{Platform.OS !== "ios" && show && (
						<DateTimePicker value={selectedDate} onValueChange={onChangeDate} />
					)}
				</View>

				<View>
					<CustomButton
						title={isEditing ? "Save" : "ADD"}
						onPress={handleSubmit}
						color={TEAL}
					/>
				</View>
			</View>
		</Modal>
	);
}

const styles = StyleSheet.create({
	modal: {
		borderRadius: 16,
		justifyContent: "flex-end",
		padding: 25,
	},
	quantityUnitContainer: {
		flexDirection: "row",
		alignItems: "center",
		marginBottom: 10,
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
});