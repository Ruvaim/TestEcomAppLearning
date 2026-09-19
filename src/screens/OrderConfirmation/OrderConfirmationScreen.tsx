import React from 'react';

import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';

import { COLORS } from '../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'OrderConfirmation'>;

const OrderConfirmationScreen = ({ navigation, route }: Props) => {
  const { orderId } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.successCircle}>
          <Text style={styles.check}>✓</Text>
        </View>

        <Text style={styles.title}>Order Confirmed!</Text>

        <Text style={styles.message}>
          Thank you for your purchase. Your order has been placed successfully.
        </Text>

        <View style={styles.orderCard}>
          <Text style={styles.orderLabel}>Order ID</Text>

          <Text style={styles.orderId}>{orderId}</Text>
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.replace('ProductList')}
        >
          <Text style={styles.buttonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default OrderConfirmationScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  successCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#E8F7ED',
    justifyContent: 'center',
    alignItems: 'center',
  },

  check: {
    fontSize: 46,
    color: COLORS.success,
    fontWeight: '700',
  },

  title: {
    marginTop: 24,
    fontSize: 28,
    fontWeight: '800',
    color: COLORS.text,
  },

  message: {
    marginTop: 12,
    fontSize: 15,
    lineHeight: 22,
    color: COLORS.secondary,
    textAlign: 'center',
  },

  orderCard: {
    width: '100%',
    marginTop: 30,
    padding: 20,
    borderRadius: 16,
    backgroundColor: COLORS.background,
    alignItems: 'center',
  },

  orderLabel: {
    fontSize: 13,
    color: COLORS.muted,
  },

  orderId: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },

  button: {
    width: '100%',
    height: 54,
    marginTop: 24,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
