import { Stack } from "expo-router/stack";
import { ThemeProvider, DarkTheme, DefaultTheme } from "expo-router";
import { useColorScheme } from "react-native";
import { SQLiteProvider } from "expo-sqlite";
import { NETRDarkTheme, NETRLightTheme } from "@/components/NETRTheme";
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initializeDatabase } from "@/util/db";

export default function RootLayout() {
  const theme =  NETRLightTheme;
  const colorScheme = useColorScheme();
  // const theme = colorScheme === "dark" ? NETRDarkTheme : NETRLightTheme;

  return (
    <SafeAreaProvider>
      <SQLiteProvider
        databaseName="pod.db"
        onInit={initializeDatabase}
      >
        <ThemeProvider
          value={theme}
        >
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ title: "Pods" }} />
            <Stack.Screen name="PodInfo" options={{ title: "Pod Info", headerShown: true }} />
            <Stack.Screen name="PodItemInfo" options={{ title: "Pod Item Info", headerShown: true }} />
          </Stack>
        </ThemeProvider>
      </SQLiteProvider>
    </SafeAreaProvider>
  );
}
