import { NativeTabs } from "expo-router/unstable-native-tabs";
import { useTheme } from "expo-router/react-navigation";

export default function TabLayout() {
  const { colors } = useTheme();

  return (
    <NativeTabs
      backgroundColor={colors.card}
      tintColor={colors.primary}
      indicatorColor={colors.background}
    >
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon sf="house.fill" md="home" />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="items">
        <NativeTabs.Trigger.Icon sf="circle.grid.3x3.fill" md="apps" />
        <NativeTabs.Trigger.Label>Pod Items</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="calendar">
        <NativeTabs.Trigger.Icon sf="calendar" md="calendar_month" />
        <NativeTabs.Trigger.Label>Calendar</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
