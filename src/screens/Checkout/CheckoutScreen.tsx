import React from 'react';

import {
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useDispatch, useSelector } from 'react-redux';

import { Controller, useForm } from 'react-hook-form';

import { z } from 'zod';

import { zodResolver } from '@hookform/resolvers/zod';

import { RootStackParamList } from '../../navigation/types';

import { RootState } from '../../store/store';

import { clearCart } from '../../store/cartSlice';

import FormInput from '../../components/FormInput';

import { COLORS } from '../../constants/colors';

import { formatCurrency } from '../../utils/currency';

type Props = NativeStackScreenProps<RootStackParamList, 'Checkout'>;

const checkoutSchema = z.object({
  name: z.string().min(2, 'Please enter your name'),

  email: z.string().email('Please enter a valid email'),

  address: z.string().min(10, 'Please enter a valid address'),

  city: z.string().min(2, 'Please enter your city'),

  postalCode: z
    .string()
    .regex(/^[0-9]{6}$/, 'Enter a valid 6-digit postal code'),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

const DELIVERY_CHARGE = 50;

const CheckoutScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const total = subtotal + DELIVERY_CHARGE;

  const { control, handleSubmit } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),

    defaultValues: {
      name: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
    },
  });

  const handlePlaceOrder = (data: CheckoutForm) => {
    console.log('Order data:', data);

    const orderId = `ORD-${Date.now()}`;

    dispatch(clearCart());

    navigation.replace('OrderConfirmation', {
      orderId,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('Cart');
            }
          }}
        >
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Checkout</Text>

        <View style={styles.spacer} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
      >
        <Text style={styles.sectionTitle}>Delivery Information</Text>

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormInput
              label="Full Name"
              placeholder="Enter your full name"
              value={value}
              onChangeText={onChange}
              autoCapitalize="words"
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormInput
              label="Email"
              placeholder="you@example.com"
              value={value}
              onChangeText={onChange}
              keyboardType="email-address"
              autoCapitalize="none"
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormInput
              label="Address"
              placeholder="House no, street, area"
              value={value}
              onChangeText={onChange}
              multiline
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="city"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormInput
              label="City"
              placeholder="Enter your city"
              value={value}
              onChangeText={onChange}
              autoCapitalize="words"
              error={error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="postalCode"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <FormInput
              label="Postal Code"
              placeholder="6-digit postal code"
              value={value}
              onChangeText={text => {
                const numericValue = text.replace(/[^0-9]/g, '');
                onChange(numericValue);
              }}
              keyboardType="number-pad"
              maxLength={6}
              error={error?.message}
            />
          )}
        />

        <View style={styles.summary}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.row}>
            <Text style={styles.label}>Items</Text>

            <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Delivery</Text>

            <Text style={styles.value}>{formatCurrency(DELIVERY_CHARGE)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>

            <Text style={styles.total}>{formatCurrency(total)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={() => handleSubmit(handlePlaceOrder)}
        >
          <Text style={styles.placeOrderText}>Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CheckoutScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: 70,
    paddingHorizontal: 20,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  back: {
    fontSize: 36,
    lineHeight: 40,
    color: COLORS.text,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
  },

  spacer: {
    width: 30,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 18,
  },

  summary: {
    marginTop: 12,
    padding: 18,
    borderRadius: 16,
    backgroundColor: COLORS.white,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },

  label: {
    fontSize: 14,
    color: COLORS.secondary,
  },

  value: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: '500',
  },

  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },

  totalLabel: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
  },

  total: {
    fontSize: 18,
    fontWeight: '800',
    color: COLORS.text,
  },

  placeOrderButton: {
    height: 54,
    marginTop: 20,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeOrderText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
