import { router } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text } from "react-native";
import { colorChanger } from "./NETRTheme";

type Props = {
  podTitle: string;
  podColor: string;
  podID: string;
};

export default function PodWidget({ podTitle, podColor, podID }: Props) {
  const [isPressed, setIsPressed] = useState(false);
  const [isHeld, setIsHeld] = useState(false);

  return (
    <Pressable
      style={[
        styles.itemContainer,
        colorChanger(podColor),
        (isPressed || isHeld) && styles.active,
        isHeld && styles.held,
      ]}
      onPressIn={() => setIsPressed(true)}
      onPressOut={() => {
        setIsPressed(false);
        setIsHeld(false);
      }}
      onLongPress={() => setIsHeld(true)}
      onPress={() =>
        router.push({
          pathname: "/PodInfo",
          params: {
            title: podTitle,
            color: podColor,
            podID,
          },
        })
      }
    >
      <Text style={styles.title}>
        {podTitle} / {podColor}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    height: 80,
    marginVertical: 10,
    borderWidth: 4,
    borderRadius: 20,
    padding: 15,
  },
  active: {
    transform: [{ scale: 1.03 }],
    // borderColor: "#ffffff",
    opacity: 0.95,
  },
  held: {
    // transform: [{ scale: 1.05 }],
    // borderColor: "#ffffff",
    
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
  },
});
