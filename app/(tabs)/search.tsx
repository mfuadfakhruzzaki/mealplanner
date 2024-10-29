// app/(tabs)/search.tsx
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from "react-native";
import MealCard from "../../components/MealCard";
import NutritionInfo from "../../components/NutritionInfo";
import { API_KEY, BASE_URL } from "../../constants";
import axios from "axios";

interface MealDetail {
  id: number;
  title: string;
  image: string;
  nutrition: {
    nutrients: Array<{
      title: string;
      amount: number;
      unit: string;
    }>;
  };
}

const Search = () => {
  const [query, setQuery] = useState<string>("");
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert(
        "Input Kosong",
        "Silakan masukkan nama makanan untuk dicari."
      );
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${BASE_URL}/food/products/search`, {
        params: {
          query,
          apiKey: API_KEY,
        },
      });

      if (response.data.results.length === 0) {
        Alert.alert(
          "Tidak Ditemukan",
          "Tidak ada makanan yang sesuai dengan pencarian Anda."
        );
        setMeal(null);
      } else {
        const selectedMeal = response.data.results[0];
        // Ambil detail nutrisi
        const detailResponse = await axios.get(
          `${BASE_URL}/food/products/${selectedMeal.id}`,
          {
            params: {
              apiKey: API_KEY,
            },
          }
        );
        setMeal(detailResponse.data);
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Terjadi kesalahan saat mencari makanan.");
      setMeal(null);
    } finally {
      setLoading(false);
    }
  };

  const renderMeal = () => {
    if (!meal) return null;

    const calories =
      meal.nutrition.nutrients.find((n) => n.title === "Calories")?.amount || 0;
    const protein =
      meal.nutrition.nutrients.find((n) => n.title === "Protein")?.amount || 0;
    const fat =
      meal.nutrition.nutrients.find((n) => n.title === "Fat")?.amount || 0;
    const carbohydrates =
      meal.nutrition.nutrients.find((n) => n.title === "Carbohydrates")
        ?.amount || 0;

    return (
      <View style={styles.resultContainer}>
        <MealCard
          meal={{
            id: meal.id,
            title: meal.title,
            image: meal.image,
            calories,
          }}
        />
        <NutritionInfo
          calories={calories}
          protein={protein}
          fat={fat}
          carbohydrates={carbohydrates}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cari Informasi Nutrisi</Text>
      <TextInput
        style={styles.input}
        placeholder="Masukkan nama makanan..."
        value={query}
        onChangeText={setQuery}
      />
      <Button title="Cari" onPress={handleSearch} color="#4CAF50" />
      {loading ? (
        <ActivityIndicator size="large" color="#4CAF50" style={styles.loader} />
      ) : (
        <FlatList
          data={meal ? [meal] : []}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderMeal}
          contentContainerStyle={styles.list}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  input: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  loader: {
    marginTop: 16,
  },
  list: {
    paddingTop: 16,
  },
  resultContainer: {
    marginTop: 16,
  },
});

export default Search;
