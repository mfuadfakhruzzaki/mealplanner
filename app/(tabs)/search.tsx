import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  Alert,
  StatusBar,
  ScrollView,
} from "react-native";
import axios from "axios";
import { API_KEY, BASE_URL } from "../../constants";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface Ingredient {
  id: number;
  name: string;
  image: string;
}

interface NutritionInfo {
  calories: number;
  fat: number;
  carbohydrates: number;
  protein: number;
}

const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = `0${today.getMonth() + 1}`.slice(-2);
  const day = `0${today.getDate()}`.slice(-2);
  return `${year}-${month}-${day}`;
};

const SearchScreen = () => {
  const [query, setQuery] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [nutritionData, setNutritionData] = useState<{
    [key: number]: NutritionInfo;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const loadSavedSearch = async () => {
      try {
        const savedSearch = await AsyncStorage.getItem("savedSearch");
        if (savedSearch) {
          const parsedSearch = JSON.parse(savedSearch);
          const today = getTodayDateString();
          if (parsedSearch.date === today) {
            setIngredients(parsedSearch.ingredients);
            setNutritionData(parsedSearch.nutritionData);
          }
        }
      } catch (error) {
        Alert.alert("Error", "Failed to load saved search.");
      }
    };

    loadSavedSearch();
  }, []);

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert("Empty input", "Please enter an ingredient to search.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/food/ingredients/search`, {
        params: {
          query,
          number: 10,
          apiKey: API_KEY,
        },
      });

      if (response.data.results.length === 0) {
        Alert.alert("Not found", "No ingredient matches your search.");
        setIngredients([]);
        setNutritionData({});
      } else {
        setIngredients(response.data.results);
        const fetchedNutritionData: { [key: number]: NutritionInfo } = {};
        await Promise.all(
          response.data.results.map(async (ingredient: Ingredient) => {
            try {
              const nutritionResponse = await axios.get(
                `${BASE_URL}/food/ingredients/${ingredient.id}/information`,
                {
                  params: {
                    amount: 1,
                    apiKey: API_KEY,
                  },
                }
              );
              const nutrients = nutritionResponse.data.nutrition.nutrients;
              const calories =
                nutrients.find((n: any) => n.name === "Calories")?.amount || 0;
              const fat =
                nutrients.find((n: any) => n.name === "Fat")?.amount || 0;
              const carbohydrates =
                nutrients.find((n: any) => n.name === "Carbohydrates")
                  ?.amount || 0;
              const protein =
                nutrients.find((n: any) => n.name === "Protein")?.amount || 0;

              fetchedNutritionData[ingredient.id] = {
                calories,
                fat,
                carbohydrates,
                protein,
              };
            } catch {
              fetchedNutritionData[ingredient.id] = {
                calories: 0,
                fat: 0,
                carbohydrates: 0,
                protein: 0,
              };
            }
          })
        );
        setNutritionData(fetchedNutritionData);

        const today = getTodayDateString();
        const savedSearch = {
          date: today,
          ingredients: response.data.results,
          nutritionData: fetchedNutritionData,
        };
        await AsyncStorage.setItem("savedSearch", JSON.stringify(savedSearch));
      }
    } catch {
      Alert.alert(
        "Error",
        "An error occurred while searching for ingredients."
      );
      setIngredients([]);
      setNutritionData({});
    } finally {
      setLoading(false);
    }
  };

  const capitalizeFirstLetter = (text: string) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
  };

  const renderIngredient = ({ item }: { item: Ingredient }) => {
    const nutrition = nutritionData[item.id];
    return (
      <View style={styles.ingredientCard}>
        <Image
          source={{
            uri: `https://spoonacular.com/cdn/ingredients_100x100/${item.image}`,
          }}
          style={styles.ingredientImage}
        />
        <View style={styles.ingredientInfo}>
          <Text style={styles.ingredientName}>
            {capitalizeFirstLetter(item.name)}
          </Text>
          {nutrition ? (
            <View style={styles.nutritionInfo}>
              <Text style={styles.nutritionText}>
                Calories: {nutrition.calories} cal
              </Text>
              <Text style={styles.nutritionText}>Fat: {nutrition.fat} g</Text>
              <Text style={styles.nutritionText}>
                Carbs: {nutrition.carbohydrates} g
              </Text>
              <Text style={styles.nutritionText}>
                Protein: {nutrition.protein} g
              </Text>
            </View>
          ) : (
            <Text style={styles.loadingText}>Loading nutrition...</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#DA8359" barStyle="light-content" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Search Ingredients</Text>
      </View>
      <ScrollView
        style={styles.content}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.input}
            placeholder="Search Ingredients..."
            value={query}
            onChangeText={setQuery}
            placeholderTextColor="#5B5B5B"
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Text style={styles.searchButtonText}>Search</Text>
          </TouchableOpacity>
        </View>
        {loading ? (
          <ActivityIndicator
            size="large"
            color="#DA8359"
            style={styles.loader}
          />
        ) : (
          ingredients.length > 0 && (
            <View style={styles.ingredientsContainer}>
              <FlatList
                data={ingredients}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderIngredient}
                contentContainerStyle={styles.list}
                scrollEnabled={false}
              />
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  titleContainer: {
    backgroundColor: "#DA8359",
    paddingTop: StatusBar.currentHeight || 40,
    paddingVertical: 25,
    alignItems: "center",
    justifyContent: "center",
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    overflow: "hidden",
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    marginTop: 50,
    fontFamily: "popins-bold",
    color: "#fafcee",
  },
  content: {
    flex: 1,
    marginHorizontal: 4,
  },
  searchContainer: {
    backgroundColor: "#A5B68D",
    borderRadius: 32,
    padding: 25,
  },
  input: {
    backgroundColor: "#FAFCEE",
    borderRadius: 12,
    borderColor: "#DA8359",
    borderWidth: 2,
    padding: 12,
    fontSize: 14,
    fontFamily: "popins-medium",
    marginBottom: 10,
  },
  searchButton: {
    backgroundColor: "#DA8359",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginTop: 5,
  },
  searchButtonText: {
    color: "#fafcee",
    fontSize: 16,
    fontFamily: "popins-bold",
  },
  loader: {
    marginTop: 16,
  },
  ingredientsContainer: {
    backgroundColor: "#fafcee",
    borderRadius: 32,
    padding: 15,
    marginBottom: 90,
    gap: 5,
    marginTop: 5,
  },
  list: {
    paddingTop: 10,
  },
  ingredientCard: {
    flexDirection: "row",
    backgroundColor: "#A5B68D",
    padding: 15,
    borderRadius: 24,
    alignItems: "center",
    marginHorizontal: 4,
    marginBottom: 5,
  },
  ingredientImage: {
    width: 90,
    height: 90,
    borderRadius: 12,
    marginRight: 16,
  },
  ingredientInfo: {
    flex: 1,
  },
  ingredientName: {
    fontSize: 16,
    fontFamily: "popins-semibold",
    color: "#fafcee",
  },
  nutritionInfo: {
    marginTop: 4,
  },
  nutritionText: {
    fontSize: 12,
    color: "#fafcee",
    fontFamily: "popins-medium",
  },
  loadingText: {
    fontSize: 12,
    color: "#fafcee",
    fontFamily: "popins-medium",
    fontStyle: "italic",
  },
});

export default SearchScreen;
