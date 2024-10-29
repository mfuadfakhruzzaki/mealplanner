// components/NutritionInfo.tsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface NutritionInfoProps {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

const NutritionInfo: React.FC<NutritionInfoProps> = ({
  calories,
  protein,
  fat,
  carbohydrates,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Informasi Nutrisi</Text>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Kalori:</Text>
        <Text style={styles.value}>{calories} kcal</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Protein:</Text>
        <Text style={styles.value}>{protein} g</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Lemak:</Text>
        <Text style={styles.value}>{fat} g</Text>
      </View>
      <View style={styles.infoRow}>
        <Text style={styles.label}>Karbohidrat:</Text>
        <Text style={styles.value}>{carbohydrates} g</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    elevation: 2, // Android
    shadowColor: "#000", // iOS
    shadowOffset: { width: 0, height: 2 }, // iOS
    shadowOpacity: 0.2, // iOS
    shadowRadius: 2, // iOS
    marginTop: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#555",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
});

export default NutritionInfo;
