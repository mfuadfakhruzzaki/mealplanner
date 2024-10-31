import React, { useState } from "react";
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

const SearchScreen = () => {
  const [query, setQuery] = useState<string>("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [nutritionData, setNutritionData] = useState<{
    [key: number]: NutritionInfo;
  }>({});
  const [loading, setLoading] = useState<boolean>(false);

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
        Alert.alert("Not found", "No ingredient match your search.");
        setIngredients([]);
      } else {
        setIngredients(response.data.results);
        response.data.results.forEach((ingredient: Ingredient) => {
          fetchIngredientInfo(ingredient.id);
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Error",
        "An error occurred while searching for ingredients."
      );
      setIngredients([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchIngredientInfo = async (id: number) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/food/ingredients/${id}/information`,
        {
          params: {
            amount: 1,
            apiKey: API_KEY,
          },
        }
      );
      const nutrients = response.data.nutrition.nutrients;
      const calories =
        nutrients.find((n: any) => n.name === "Calories")?.amount || 0;
      const fat = nutrients.find((n: any) => n.name === "Fat")?.amount || 0;
      const carbohydrates =
        nutrients.find((n: any) => n.name === "Carbohydrates")?.amount || 0;
      const protein =
        nutrients.find((n: any) => n.name === "Protein")?.amount || 0;

      setNutritionData((prevData) => ({
        ...prevData,
        [id]: { calories, fat, carbohydrates, protein },
      }));
    } catch (error) {
      console.error(
        `Error fetching nutrition data for ingredient ${id}:`,
        error
      );
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
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <StatusBar backgroundColor="#DA8359" barStyle="light-content" />
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Search Ingredients</Text>
      </View>
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
        <ActivityIndicator size="large" color="#DA8359" style={styles.loader} />
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
  );
};

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
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    marginTop: 70,
    fontWeight: "700",
    color: "#fafcee",
  },
  searchContainer: {
    paddingHorizontal: 16,
    backgroundColor: "#A5B68D",
    borderRadius: 32,
    padding: 25,
    marginHorizontal: 4,
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
    fontWeight: "800",
    alignItems: "center",
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
    marginHorizontal: 4,
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
    fontWeight: "700",
    color: "#fafcee",
  },
  nutritionInfo: {
    marginTop: 4,
  },
  nutritionText: {
    fontSize: 12,
    color: "#fafcee",
    fontWeight: "500",
  },
  loadingText: {
    fontSize: 12,
    color: "#fafcee",
    fontStyle: "italic",
  },
});

export default SearchScreen;
