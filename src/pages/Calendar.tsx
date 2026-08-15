import { useIsFocused } from "@react-navigation/native";
import * as Calendar from "expo-calendar";
import { useTheme } from "expo-router/react-navigation";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar as RNCalendar, DateData } from "react-native-calendars";
import { getColorByValue } from "../components/NETRTheme";
import { fetchExpirations } from "../util/db";
import { useSQLiteContext } from "expo-sqlite";
import { SafeAreaView } from "react-native-safe-area-context";
interface PodItemExpiration {
  pod_item_name: string;
  pod_item_date: string; // "YYYY-MM-DD"
  pod_color: string;
}

interface MarkedDates {
  [date: string]: {
    dots: { key: string; color: string; selectedColor?: string }[];
    selected?: boolean;
  };
}

const todayDate = new Date().toISOString().split("T")[0];

export default function CalendarScreen() {
  const db = useSQLiteContext();
  
  const { colors: themeColors } = useTheme();
  const colors = themeColors as Record<keyof typeof themeColors, string>;
  const isFocused = useIsFocused();

  const [loading, setLoading] = useState(true);
  const [expirations, setExpirations] = useState<PodItemExpiration[]>([]);
  const [selectedDay, setSelectedDay] = useState(todayDate);

  useEffect(() => {
    if (!isFocused) return;

    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const data: PodItemExpiration[] = await fetchExpirations(db);
        if (!cancelled) {
          setExpirations(data);
          setSelectedDay(todayDate);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [isFocused]);

const markedDates = useMemo<MarkedDates>(() => {
  const result: MarkedDates = {};

  expirations.forEach(({ pod_item_name, pod_item_date, pod_color }) => {
    const dot = {
      key: pod_item_name,
      color: getColorByValue(pod_color),
      selectedColor: colors.primary as string,
    };

    if (result[pod_item_date]) {
      result[pod_item_date].dots.push(dot);
    } else {
      result[pod_item_date] = { dots: [dot] };
    }
  });

  result[selectedDay] = {
    ...(result[selectedDay] ?? { dots: [] }),
    selected: true,
  };

  return result;
}, [expirations, selectedDay, colors.primary]);

  const selectedItems = useMemo(
    () => expirations.filter((item) => item.pod_item_date === selectedDay),
    [expirations, selectedDay],
  );

  const addToDeviceCalendar = async (item: PodItemExpiration) => {
    try {
      const { status, canAskAgain } =
        await Calendar.requestCalendarPermissions();

      if (status !== "granted") {
        Alert.alert(
          "Calendar access needed",
          canAskAgain
            ? "Allow NETR to access your calendar to add expiration reminders."
            : "Enable calendar access for NETR in your device Settings to add expiration reminders.",
          canAskAgain
            ? undefined
            : [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Open Settings",
                  onPress: () => Linking.openSettings(),
                },
              ],
        );
        return;
      }

      const calendars = await Calendar.getCalendars(Calendar.EntityTypes.EVENT);
      const targetCalendar =
        calendars.find((c) => c.isPrimary && c.allowsModifications) ??
        calendars.find((c) => c.allowsModifications);

      if (!targetCalendar) {
        Alert.alert(
          "No writable calendar found",
          "Couldn't find a calendar on this device to add the event to.",
        );
        return;
      }

      const eventDate = new Date(item.pod_item_date);

      await targetCalendar.createEvent({
        title: `${item.pod_item_name} expires`,
        startDate: eventDate,
        endDate: eventDate,
        allDay: true,
      });

      Alert.alert(
        "Added to calendar",
        `"${item.pod_item_name}" was added to your calendar.`,
      );
    } catch (error) {
      console.error("Failed to add event to calendar", error);
      Alert.alert(
        "Something went wrong",
        "Couldn't add this item to your calendar.",
      );
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <RNCalendar
        style={styles.calendar}
        current={todayDate}
        onDayPress={(day: DateData) => setSelectedDay(day.dateString)}
        monthFormat="MMMM yyyy"
        firstDay={0}
        enableSwipeMonths
        markingType="multi-dot"
        markedDates={markedDates}
        theme={{
          calendarBackground: colors.card,
          dayTextColor: colors.text,
          monthTextColor: colors.text,
          textSectionTitleColor: colors.text,
          textDisabledColor: colors.border,
          todayTextColor: colors.primary,
          arrowColor: colors.primary,
          selectedDayBackgroundColor: colors.primary,
          selectedDayTextColor: colors.card,
        }}
      />

      <View style={styles.underCalendar}>
        {loading ? (
          <ActivityIndicator style={{ marginTop: 24 }} color={colors.primary} />
        ) : (
          <FlatList
            data={selectedItems}
            keyExtractor={(item) =>
              `${item.pod_item_date}-${item.pod_item_name}`
            }
            ListHeaderComponent={
              <Text style={[styles.header, { color: colors.text }]}>
                {selectedDay === todayDate
                  ? "Expiring Today"
                  : `Expiring on ${selectedDay}`}
              </Text>
            }
            ListEmptyComponent={
              <Text style={[styles.emptyText, { color: colors.text }]}>
                Nothing expiring on this day.
              </Text>
            }
            renderItem={({ item }) => (
              <View
                style={[
                  styles.expireDayItem,
                  { backgroundColor: colors.card, borderColor: colors.border },
                ]}
              >
                <View style={styles.itemRow}>
                  <View
                    style={[
                      styles.dot,
                      { backgroundColor: getColorByValue(item.pod_color) },
                    ]}
                  />
                  <Text
                    style={[styles.expireDayItemText, { color: colors.text }]}
                  >
                    {item.pod_item_name}
                  </Text>
                </View>
                {Platform.OS !== "web" && (
                  <TouchableOpacity
                    onPress={() => addToDeviceCalendar(item)}
                    style={[styles.addButton, { borderColor: colors.primary }]}
                  >
                    <Text style={{ color: colors.primary, fontSize: 13 }}>
                      Add to Calendar
                    </Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  calendar: { borderRadius: 8, margin: 10 },
  underCalendar: { flex: 1, marginHorizontal: 10 },
  header: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  emptyText: { fontSize: 14, opacity: 0.6, marginTop: 8 },
  itemRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 8 },
  expireDayItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
  },
  expireDayItemText: { fontSize: 16 },
  addButton: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
});
