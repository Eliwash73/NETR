import { useWindowDimensions } from "react-native";

export default function useScreenDimensions() {
  const { width, height } = useWindowDimensions();

  return {
    width: width * 0.8,
    height: height * 0.8,
    halfWidth: width / 2,
    halfHeight: height / 2,
    horizontalPadding: width * 0.05,
  };
}
