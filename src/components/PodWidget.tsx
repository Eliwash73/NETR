
import { View, Pressable, StyleSheet } from 'react-native';

type Props = {
  onPress: () => void;
};

export default function PodWidget({ onPress }: Props) {
  return (
    <View style={styles.itemContainer}>
      <Pressable onPress={onPress}>
        
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    width: 84,
    height: 84,
    marginHorizontal: 60,
    borderWidth: 4,
    borderColor: '#ffd33d',
    borderRadius: 2,
    padding: 3,
  },
  
});
