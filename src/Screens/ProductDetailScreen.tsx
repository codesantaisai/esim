import React, { useEffect, useState } from 'react';
import { View, Text, Image, TextInput, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CardField, useStripe } from '@stripe/stripe-react-native';
import axios from 'axios';
import QRCode from 'react-native-qrcode-svg'; // Import QRCode component

interface Product {
  id: number;
  name: string;
  images: { src: string }[];
  price: string;
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

const API_URL = 'https://test2.dipuravana.com/wp-json/wc/v3';
const CUSTOM_API_URL = 'https://test2.dipuravana.com/wp-json/custom/v1';
const CONSUMER_KEY = 'ck_cb72230520df05cba55821827cc733ae9b9f0f14';
const CONSUMER_SECRET = 'cs_f885f18f4b565742ff16ed71a01dd705bfca8c7d';

const api = axios.create({
  baseURL: API_URL,
  auth: {
    username: CONSUMER_KEY,
    password: CONSUMER_SECRET,
  },
});

const ProductDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { product } = route.params;
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const { confirmPayment } = useStripe();
  const [isLoading, setIsLoading] = useState(false);
  const [qrCodeValue, setQRCodeValue] = useState('');

  
  const createOrder = async () => {
    try {
      const response = await api.post('/orders', {
        payment_method: 'stripe',
        payment_method_title: 'Credit Card',
        set_paid: false,
        billing: {
          first_name: name,
          email: email,
        },
        line_items: [
          {
            product_id: product.id,
            quantity: 1,
          },
        ],
      });
      return response.data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      await api.put(`/orders/${orderId}`, { status });
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  };

  const handlePurchase = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      // Create order
      const order = await createOrder();
      console.log('Order created:', order);

      // Get Stripe client secret
      console.log("before")
      const clientSecretResponse = await api.post(`/stripe/create-payment-intent/${order.id}`);
      console.log("before")
      const { client_secret } = clientSecretResponse.data;
console.log("clientSecretResponse",clientSecretResponse)
      // Confirm payment with Stripe
      const { error, paymentIntent } = await confirmPayment(client_secret, {
        type: 'Card',
        billingDetails: {
          name: name,
          email: email,
        },
      });

      if (error) {
        throw new Error('Payment failed: ' + error.message);
      }

      if (paymentIntent.status !== 'Succeeded') {
        throw new Error('Payment not successful');
      }

      // Update order status to processing
      await updateOrderStatus(order.id, 'processing');
      console.log('Order status updated to processing');

      // Generate QR code value
      const qrCode = `Order ID: ${order.id}, Product: ${product.name}, Price: ${product.price}`;
      console.log('QR code generated:', qrCode);
      setQRCodeValue(qrCode);

      // Display QR code to user
      Alert.alert(
        'QR Code Generated',
        'Please scan the QR code to activate your eSIM.',
        [
          {
            text: 'OK',
            onPress: async () => {
              // Simulate QR code scan by waiting for a few seconds
              await new Promise(resolve => setTimeout(resolve, 10000));

              // Update order status to completed
              await updateOrderStatus(order.id, 'completed');
              console.log('Order status updated to completed');

              Alert.alert('Purchase Successful', 'Your eSIM has been activated successfully!');
              navigation.goBack(); // Or navigate to a success screen
            }
          }
        ]
      );
    } catch (e) {
      console.error('Error in purchase process:', e);
      Alert.alert('Error', 'An error occurred during the purchase process. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.images[0]?.src }} style={styles.image} />
      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>${parseFloat(product.price).toFixed(2)}</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Your Name"
        value={name}
        onChangeText={setName}
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

      <Button
        title={isLoading ? 'Processing...' : 'Complete Purchase'}
        disabled={isLoading}
        onPress={handlePurchase}
      />

      {qrCodeValue ? (
        <View style={styles.qrCodeContainer}>
          <Text>Scan this QR code to activate your eSIM:</Text>
          <QRCode value={qrCodeValue} size={200} />
        </View>
      ) : null}
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
  price: {
    fontSize: 18,
    color: '#888',
    marginBottom: 20,
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
  },
  qrCodeContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
});

export default ProductDetailScreen;
