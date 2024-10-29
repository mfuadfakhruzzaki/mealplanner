// components/MealCard.tsx
import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Linking,
} from "react-native";

interface Meal {
  id: number;
  title: string;
  image: string;
  sourceUrl?: string;
}

interface Props {
  meal: Meal;
  onPress?: () => void;
}

const MealCard: React.FC<Props> = ({ meal, onPress }) => {
  const handlePress = () => {
    if (meal.sourceUrl) {
      Linking.openURL(meal.sourceUrl);
    }
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity style={styles.card} onPress={handlePress}>
      <Image source={{ uri: meal.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.title}>{meal.title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    backgroundColor: "#f1f1f1",
    borderRadius: 12,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
});

export default MealCard;
