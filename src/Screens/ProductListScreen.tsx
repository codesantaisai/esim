import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, ActivityIndicator, Image, StyleSheet, Dimensions } from 'react-native';
import ApiService from '../Services/ApiService';

const { width } = Dimensions.get('window');
const numColumns = 2;
const imageSize = width / numColumns - 20; // 20 is for padding

const ProductListScreen = ({ navigation }: any) => {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const apiService = new ApiService();
    try {
      setLoading(true);
      const response = await apiService.getImage();
      setProducts(response.data.slice(0, 10)); // Limit to 10 items
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('An error occurred while fetching products.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loadingContainer}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id.toString()}
      numColumns={numColumns}
      renderItem={({ item }) => (
        <View style={styles.itemContainer}>
          <Image
            source={{ uri: item.download_url }}
            style={styles.image}
            resizeMode="cover"
            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          />
          <Text style={styles.title}>{item.author}</Text>
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemContainer: {
    flex: 1,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 5,
    textAlign: 'center',
  },
  image: {
    width: imageSize,
    height: imageSize,
    backgroundColor: '#f0f0f0',
  },
});

export default ProductListScreen;