import React from 'react';
import { Linking } from 'react-native';

import {
  getStateFromPath,
  NavigationContainer,
} from '@react-navigation/native';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { store } from '../store/store';

import ProductListScreen from '../screens/ProductList/ProductListScreen';
import ProductDetailsScreen from '../screens/ProductDetails/ProductDetailsScreen';
import CartScreen from '../screens/Cart/CartScreen';
import CheckoutScreen from '../screens/Checkout/CheckoutScreen';
import OrderConfirmationScreen from '../screens/OrderConfirmation/OrderConfirmationScreen';
import LoginScreen from '../screens/Login/LoginScreen';

import { RootStackParamList } from './types';
import { navigationRef } from './navigationRef';

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

      OrderConfirmation: {
        path: 'order/:orderId',
      },

      Login: 'login',
    },
  },

  getStateFromPath: (path: string, options: any) => {
    const isAuthenticated = store.getState().auth.isAuthenticated;
    const cartItems = store.getState().cart.items;

    if (path === 'checkout' && cartItems.length === 0) {
      return {
        routes: [
          {
            name: 'Cart',
          },
        ],
        index: 0,
      };
    }
    if (path === 'checkout' && !isAuthenticated) {
      return {
        routes: [
          {
            name: 'Login',
            params: {
              redirect: {
                screen: 'Checkout',
                params: undefined,
                resetAfterLogin: true,
              },
            },
          },
        ],
        index: 0,
      };
    }

    return getStateFromPath(path, options);
  },

  subscribe(listener: (url: string) => void) {
    const subscription = Linking.addEventListener('url', ({ url }) => {
      console.log('DEEP LINK RECEIVED:', url);

      const isAuthenticated = store.getState().auth.isAuthenticated;
      const cartItems = store.getState().cart.items;

      if (url === 'myapp://checkout') {
        if (cartItems.length === 0) {
          navigationRef.reset({
            index: 0,
            routes: [
              {
                name: 'Cart',
              },
            ],
          });

          return;
        }

        if (!isAuthenticated) {
          navigationRef.reset({
            index: 0,
            routes: [
              {
                name: 'Login',
                params: {
                  redirect: {
                    screen: 'Checkout',
                    params: undefined,
                    resetAfterLogin: true,
                  },
                },
              },
            ],
          });

          return;
        }
      }

      listener(url);
    });

    return () => {
      subscription.remove();
    };
  },
};

const RootNavigator = () => {
  return (
    <NavigationContainer
      ref={navigationRef}
      linking={linking}
      onStateChange={state => {
        console.log('NAVIGATION STATE:', JSON.stringify(state, null, 2));
      }}
    >
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
        <Stack.Screen name="Login" component={LoginScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default RootNavigator;
