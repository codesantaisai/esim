// HomeScreen.js
import React from 'react';
import { View, Button } from 'react-native';

const HomeScreen = ({ navigation }:any) => {
  return (
    <View>
      <Button
        title="Go to My New Screen"
        onPress={() => navigation.navigate('productlist')}
      />
    </View>
  );
};

export default HomeScreen;
