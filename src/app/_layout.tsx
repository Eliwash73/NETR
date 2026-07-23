import { Stack } from "expo-router/stack";
import { ThemeProvider, DarkTheme, DefaultTheme } from "expo-router";
import { useColorScheme } from "react-native";
import { NETRTheme } from "@/components/NETRTheme";
import { SafeAreaProvider } from 'react-native-safe-area-context';


export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ title: "Back" }} />
        <Stack.Screen name="PodInfo" options={{ headerShown: true }} />
      </Stack>
    </ThemeProvider>
    </SafeAreaProvider>
  );
}
