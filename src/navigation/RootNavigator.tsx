import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ProductListScreen from '../screens/ProductList/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetails/ProductDetailsScreen';
import CartScreen from '../screens/Cart/CartScreen';
import CheckoutScreen from '../screens/Checkout/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmation/OrderConfirmationScreen';

import { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['myapp://'],

  config: {
    screens: {
      ProductList: 'products',

      ProductDetails: {
        path: 'product/:productId',
        parse: {
          productId: Number,
        },
      },

      Cart: 'cart',

      Checkout: 'checkout',
    },
  },
};

const RootNavigator = () => {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        initialRouteName="ProductList"
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="ProductList" component={ProductListScreen} />

        <Stack.Screen name="ProductDetails" component={ProductDetailsScreen} />

        <Stack.Screen name="Cart" component={CartScreen} />

        <Stack.Screen name="Checkout" component={CheckoutScreen} />

        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmationScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
