import React, { useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CardField, useStripe } from '@stripe/stripe-react-native';

// Define the Product interface
interface Product {
  id: number;
  name: string;
  images: { src: string }[];
  price:string
  // Add other properties as needed
}

type RootStackParamList = {
  ProductDetail: { product: Product };
};

type ProductDetailScreenRouteProp = RouteProp<RootStackParamList, 'ProductDetail'>;

type ProductDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'ProductDetail'>;

type Props = {
  route: ProductDetailScreenRouteProp;
  navigation: ProductDetailScreenNavigationProp;
};

const ProductDetailScreen: React.FC<Props> = ({ route }) => {
  const { product } = route.params;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { confirmPayment } = useStripe();
  const handlePayment = async () => {
    // Here you would typically create a payment intent on your server
    // and then confirm the payment on the client side
    // This is just a placeholder for the actual implementation
    try {
      const { error } = await confirmPayment('client_secret_from_server', {
        type: 'Card',
      });

      if (error) {
        console.error('Payment failed:', error);
      } else {
        console.log('Payment successful');
        // Handle successful payment (e.g., show a success message, navigate to a confirmation screen)
      }
    } catch (e) {
      console.error('Error in payment process:', e);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.images[0]?.src }} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.title}>{product.price} $</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Enter Your Name"
        value={name}
        onChangeText={setName}
        keyboardType="default"
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email Address"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <CardField
        postalCodeEnabled={false}
        placeholders={{
          number: '4242 4242 4242 4242',
        }}
        cardStyle={styles.cardStyle}
        style={styles.cardField}
      />
      
      <Button title="Pay Now" onPress={handlePayment} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 10,
  },
  cardField: {
    width: '100%',
    height: 50,
    marginVertical: 10,
  },
  cardStyle: {
    backgroundColor: '#FFFFFF',
    // textColor: '#000000',
  },
});

export default ProductDetailScreen;