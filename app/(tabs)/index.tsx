import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert,
  Linking,
} from "react-native";
import axios from "axios";
import { API_KEY, BASE_URL } from "../../constants";

interface Meal {
  id: number;
  title: string;
  image: string;
  sourceUrl?: string;
}

interface Nutrients {
  calories: number;
  carbohydrates: number;
  fat: number;
  protein: number;
}

export default function HomeScreen() {
  const [timePeriod, setTimePeriod] = useState<string | null>(null);
  const [dietType, setDietType] = useState<string | null>(null);
  const [excludedIngredients, setExcludedIngredients] = useState<string>("");
  const [dailyCalorieTarget, setDailyCalorieTarget] = useState<string>("2400");
  const [mealPlan, setMealPlan] = useState<{
    meals: Meal[];
    nutrients: Nutrients;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleBlurCalorieInput = () => {
    if (dailyCalorieTarget.trim() === "") {
      setDailyCalorieTarget("2400");
    }
  };

  const generateMealPlan = async () => {
    if (!dailyCalorieTarget) {
      Alert.alert("Empty Calorie Target", "Please enter a calorie target.");
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
          timeFrame: timePeriod || "day",
          targetCalories: parseInt(dailyCalorieTarget),
          diet: dietType || undefined,
          exclude: excludedIngredients || undefined,
        },
      });

      const data = response.data;
      const meals: Meal[] = data.meals.map((meal: any) => ({
        id: meal.id,
        title: meal.title,
        image: `https://spoonacular.com/recipeImages/${meal.id}-312x231.${meal.imageType}`,
        sourceUrl: meal.sourceUrl,
      }));

      const nutrients: Nutrients = {
        calories: data.nutrients.calories || 0,
        carbohydrates: data.nutrients.carbohydrates || 0,
        fat: data.nutrients.fat || 0,
        protein: data.nutrients.protein || 0,
      };

      setMealPlan({ meals, nutrients });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "An error occurred while generating the meal plan.");
    } finally {
      setLoading(false);
    }
  };

  const openRecipeUrl = (url: string) => {
    Linking.openURL(url).catch((err) =>
      console.error("Failed to open URL:", err)
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#DA8359" barStyle="light-content" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>What to Eat Today?</Text>
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Time Period"
            placeholderTextColor="#5B5B5B"
            onChangeText={setTimePeriod}
          />
          <TextInput
            style={styles.input}
            placeholder="Diet Type"
            placeholderTextColor="#5B5B5B"
            onChangeText={setDietType}
          />
          <TextInput
            style={styles.input}
            placeholder="Excluded Ingredients"
            placeholderTextColor="#5B5B5B"
            onChangeText={setExcludedIngredients}
          />
          <View style={styles.calorieInputContainer}>
            <TextInput
              style={styles.calorieInput}
              placeholder="Daily Calorie Target"
              placeholderTextColor="#5B5B5B"
              keyboardType="numeric"
              value={dailyCalorieTarget}
              onChangeText={setDailyCalorieTarget}
              onBlur={handleBlurCalorieInput}
            />
            <Text style={styles.kcalText}>kcal</Text>
          </View>

          <TouchableOpacity
            style={styles.generateButton}
            onPress={generateMealPlan}
          >
            <Text style={styles.generateButtonText}>Generate Menu</Text>
          </TouchableOpacity>
        </View>

        {loading && (
          <ActivityIndicator
            size="large"
            color="#DA8359"
            style={{ marginVertical: 20 }}
          />
        )}

        {mealPlan && (
          <>
            <View style={styles.nutrientsCard}>
              <Text style={styles.nutrientsTitle}>
                Daily Amount of Nutrients
              </Text>
              <View style={styles.nutrientRow}>
                <Text style={styles.nutrientLabel}>Calorie</Text>
                <Text style={styles.nutrientValue}>
                  : {mealPlan.nutrients.calories} kcal
                </Text>
              </View>
              <View style={styles.nutrientRow}>
                <Text style={styles.nutrientLabel}>Carbohydrate</Text>
                <Text style={styles.nutrientValue}>
                  : {mealPlan.nutrients.carbohydrates} g
                </Text>
              </View>
              <View style={styles.nutrientRow}>
                <Text style={styles.nutrientLabel}>Fat</Text>
                <Text style={styles.nutrientValue}>
                  : {mealPlan.nutrients.fat} g
                </Text>
              </View>
              <View style={styles.nutrientRow}>
                <Text style={styles.nutrientLabel}>Protein</Text>
                <Text style={styles.nutrientValue}>
                  : {mealPlan.nutrients.protein} g
                </Text>
              </View>
            </View>

            <View style={styles.recipeContainer}>
              {mealPlan.meals.map((meal) => (
                <TouchableOpacity
                  key={meal.id}
                  style={styles.recipeCard}
                  onPress={() => openRecipeUrl(meal.sourceUrl || "")}
                >
                  <Image
                    source={{ uri: meal.image }}
                    style={styles.recipeImage}
                  />
                  <View style={styles.recipeInfo}>
                    <Text style={styles.recipeName}>{meal.title}</Text>
                    <Text style={styles.recipeDetails}>
                      Click to see the details
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  titleContainer: {
    backgroundColor: "#DA8359",
    paddingTop: StatusBar.currentHeight,
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
  },
  title: {
    fontSize: 24,
    marginTop: 70,
    fontWeight: "700",
    color: "#fafcee",
  },
  content: {
    flex: 1,
    paddingVertical: 5,
    marginHorizontal: 4,
  },
  inputContainer: {
    backgroundColor: "#A5B68D",
    borderRadius: 32,
    padding: 25,
  },
  calorieInputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    backgroundColor: "#FAFCEE",
    borderRadius: 12,
    borderColor: "#DA8359",
    borderWidth: 2,
    padding: 12,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 10,
    flex: 1,
  },
  calorieInput: {
    backgroundColor: "#FAFCEE",
    borderRadius: 12,
    borderColor: "#DA8359",
    borderWidth: 2,
    padding: 12,
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 10,
    flex: 1,
  },
  kcalText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: "800",
    color: "#FAFCEE",
    alignSelf: "center",
  },
  generateButton: {
    backgroundColor: "#DA8359",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 10,
  },
  generateButtonText: {
    color: "#fafcee",
    fontSize: 16,
    fontWeight: "800",
  },
  nutrientsCard: {
    backgroundColor: "#fafcee",
    borderRadius: 32,
    padding: 25,
    marginVertical: 5,
  },
  nutrientsTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#DA8359",
    marginBottom: 10,
  },
  nutrientRow: {
    flexDirection: "row",
    marginVertical: 2,
  },
  nutrientLabel: {
    color: "#5B5B5B",
    fontWeight: "600",
    flex: 1,
  },
  nutrientValue: {
    color: "#5B5B5B",
    fontWeight: "600",
    flex: 1,
  },
  recipeContainer: {
    backgroundColor: "#fafcee",
    borderRadius: 32,
    padding: 20,
    marginBottom: 70,
    gap: 5,
  },
  recipeCard: {
    flexDirection: "row",
    backgroundColor: "#8B9D7D",
    borderRadius: 16,
    padding: 10,
    alignItems: "center",
  },
  recipeImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  recipeInfo: {
    marginLeft: 15,
    flex: 1,
  },
  recipeName: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  recipeDetails: {
    color: "#fff",
    fontSize: 14,
    opacity: 0.8,
  },
});
