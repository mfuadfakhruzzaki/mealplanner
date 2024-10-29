// app/(tabs)/index.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  TextInput,
  SafeAreaView,
  TouchableOpacity,
  Modal,
} from "react-native";
import MealCard from "../../components/MealCard";
import CustomButton from "../../components/CustomButton";
import { useCalorieContext } from "../../contexts/CalorieContext";
import { API_KEY, BASE_URL } from "../../constants";
import axios from "axios";

interface Meal {
  id: number;
  title: string;
  image: string;
  calories: number;
  fat: number;
  carbs: number;
  protein: number;
  sourceUrl?: string;
}

interface Nutrients {
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
}

const Home = () => {
  const { calorieTarget, setCalorieTarget } = useCalorieContext();
  const [timeFrame, setTimeFrame] = useState<string | null>(null);
  const [diet, setDiet] = useState<string | null>(null);
  const [exclude, setExclude] = useState<string>("");
  const [mealPlan, setMealPlan] = useState<{
    meals: Meal[];
    nutrients: Nutrients;
  } | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isTimeFrameModalVisible, setTimeFrameModalVisible] = useState(false);
  const [isDietModalVisible, setDietModalVisible] = useState(false);

  const generateMealPlan = async () => {
    if (!calorieTarget) {
      Alert.alert("Target Kalori Kosong", "Silakan masukkan target kalori.");
      return;
    }

    setLoading(true);
    setMealPlan(null);

    try {
      const response = await axios.get(`${BASE_URL}/mealplanner/generate`, {
        headers: {
          "x-api-key": API_KEY,
        },
        params: {
          timeFrame: timeFrame || "day", // Default to "day" if not selected
          targetCalories: calorieTarget,
          diet: diet || undefined,
          exclude: exclude || undefined,
        },
      });

      const data = response.data;

      // Mapping data dari API sesuai struktur yang tersedia
      const meals: Meal[] = (data.meals || []).map((meal: any) => ({
        id: meal.id,
        title: meal.title,
        image: `https://spoonacular.com/recipeImages/${meal.id}-312x231.${meal.imageType}`,
        calories: 0, // Tidak ada data kalori spesifik pada meal individual
        fat: 0, // Nutrisi per makanan tidak tersedia, jadi diatur ke 0
        carbs: 0, // Nutrisi per makanan tidak tersedia, jadi diatur ke 0
        protein: 0, // Nutrisi per makanan tidak tersedia, jadi diatur ke 0
        sourceUrl: meal.sourceUrl,
      }));

      // Nutrisi total untuk hari atau minggu
      const nutrients: Nutrients = {
        calories: data.nutrients.calories || 0,
        carbohydrates: data.nutrients.carbohydrates || 0,
        fat: data.nutrients.fat || 0,
        protein: data.nutrients.protein || 0,
      };

      setMealPlan({ meals, nutrients });
    } catch (err) {
      console.error(err);
      Alert.alert(
        "Error",
        "Terjadi kesalahan saat menghasilkan rencana makan."
      );
    } finally {
      setLoading(false);
    }
  };

  const renderMeal = ({ item }: { item: Meal }) => <MealCard meal={item} />;

  const CustomDropdown = ({
    title,
    value,
    options,
    onSelect,
    visible,
    setVisible,
  }: any) => (
    <>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => setVisible(true)}
      >
        <Text style={{ color: value ? "#000" : "#888" }}>
          {value ? value : title}
        </Text>
      </TouchableOpacity>
      <Modal visible={visible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {options.map((option: string) => (
              <TouchableOpacity
                key={option}
                style={styles.modalItem}
                onPress={() => {
                  onSelect(option);
                  setVisible(false);
                }}
              >
                <Text style={styles.modalText}>{option}</Text>
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setVisible(false)}
            >
              <Text style={styles.modalCloseText}>Tutup</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={mealPlan?.meals || []}
        keyExtractor={(item: Meal) => item.id.toString()}
        renderItem={renderMeal}
        ListHeaderComponent={
          <View style={styles.form}>
            <Text style={styles.title}>Bingung Makan Apa??</Text>

            <CustomDropdown
              title="Jangka Waktu"
              value={timeFrame}
              options={["Harian", "Mingguan"]}
              onSelect={setTimeFrame}
              visible={isTimeFrameModalVisible}
              setVisible={setTimeFrameModalVisible}
            />

            <CustomDropdown
              title="Jenis Diet"
              value={diet}
              options={["Vegetarian", "Vegan", "Paleo", "Ketogenic"]}
              onSelect={setDiet}
              visible={isDietModalVisible}
              setVisible={setDietModalVisible}
            />

            <TextInput
              style={styles.input}
              placeholder="Bahan yang Dikecualikan"
              placeholderTextColor="#888"
              value={exclude}
              onChangeText={setExclude}
            />

            <TextInput
              style={styles.input}
              placeholder="Target Kalori Harian"
              placeholderTextColor="#888"
              keyboardType="numeric"
              value={calorieTarget?.toString()}
              onChangeText={(text) => setCalorieTarget(Number(text))}
            />

            <CustomButton title="Buat Rencana" onPress={generateMealPlan} />

            {loading && (
              <View style={styles.loader}>
                <ActivityIndicator size="large" color="#4CAF50" />
              </View>
            )}

            {mealPlan && (
              <View style={styles.nutrientContainer}>
                <Text style={styles.nutrientTitle}>Total Nutrisi Harian</Text>
                <Text>Kalori: {mealPlan.nutrients.calories} kcal</Text>
                <Text>
                  Karbohidrat: {mealPlan.nutrients.carbohydrates} gram
                </Text>
                <Text>Lemak: {mealPlan.nutrients.fat} gram</Text>
                <Text>Protein: {mealPlan.nutrients.protein} gram</Text>
              </View>
            )}
          </View>
        }
        contentContainerStyle={styles.list}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  form: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    alignItems: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#4CAF50",
    textAlign: "center",
  },
  dropdown: {
    width: "100%",
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
    paddingHorizontal: 10,
    marginBottom: 12,
    backgroundColor: "#fafafa",
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 12,
    width: "100%",
    color: "#333",
    backgroundColor: "#fafafa",
  },
  loader: {
    marginVertical: 16,
  },
  nutrientContainer: {
    padding: 16,
    backgroundColor: "#f1f1f1",
    borderRadius: 8,
    marginBottom: 16,
    width: "100%",
  },
  nutrientTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  list: {
    paddingBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 20,
  },
  modalItem: {
    paddingVertical: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
  },
  modalCloseButton: {
    paddingVertical: 10,
    marginTop: 10,
    backgroundColor: "#4CAF50",
    borderRadius: 8,
  },
  modalCloseText: {
    color: "#fff",
    textAlign: "center",
  },
});

export default Home;
