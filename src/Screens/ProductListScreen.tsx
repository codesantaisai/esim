import React, { useState, useEffect } from 'react';
import { FlatList, Text, View, ActivityIndicator, Image, StyleSheet, Dimensions } from 'react-native';
import axios from 'axios';

const { width } = Dimensions.get('window');
const numColumns = 2;
const imageSize = width / numColumns - 20; // 20 is for padding

const API_URL = 'https://test2.dipuravana.com/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_cb72230520df05cba55821827cc733ae9b9f0f14';
const CONSUMER_SECRET = 'cs_f885f18f4b565742ff16ed71a01dd705bfca8c7d';

const api = axios.create({
  baseURL: `${API_URL}/products`,
  auth: {
    username: CONSUMER_KEY,
    password: CONSUMER_SECRET,
  },
});

interface Product {
  id: number;
  name: string;
  images: { src: string }[];
}

const ProductListScreen: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('', { params: { per_page: 10 } });
      setProducts(response.data);
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
            source={{ uri: item.images[0]?.src }}
            style={styles.image}
            resizeMode="cover"
            onError={(e) => console.log('Image load error:', e.nativeEvent.error)}
          />
          <Text style={styles.title}>{item.name}</Text>
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