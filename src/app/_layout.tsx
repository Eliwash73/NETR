import { Stack } from "expo-router/stack";
import { ThemeProvider, DarkTheme, DefaultTheme } from "expo-router";
import { useColorScheme } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import { NETRTheme } from "@/components/NETRTheme";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initPodDb } from "@/util/db";

export default function RootLayout() {
  const colorScheme = useColorScheme();
  return (
    <SafeAreaProvider>
      <SQLiteProvider
        databaseName="pod.db"
        onInit={initPodDb}
        useSuspense={false}
      >
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ title: "Back" }} />
            <Stack.Screen name="PodInfo" options={{ headerShown: true }} />
          </Stack>
        </ThemeProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
