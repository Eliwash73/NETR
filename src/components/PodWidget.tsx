
import { Text, View, Pressable, StyleSheet } from 'react-native';
import useScreenDimensions from '@/hooks/useScreenDimensions';

type Props = {
  onPress: () => void;
};

export default function PodWidget({ onPress }: Props) {
  const { halfWidth, halfHeight, height, width } = useScreenDimensions();

  return (
    <View style={[styles.itemContainer, { width: width }]} >
      <Text>Pod Title</Text>
      <Pressable onPress={onPress}>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    height: 80,
    marginVertical: 10,
    borderWidth: 4,
    borderRadius: 20,
    padding: 30,
  },
});
