import { Redirect } from "expo-router";

export default function IndexFallback() {
  return <Redirect href="/(tabs)" />;
}
