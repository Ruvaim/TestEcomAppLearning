import React from 'react';

import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { useDispatch, useSelector } from 'react-redux';

import {
  decreaseQuantity,
  increaseQuantity,
  removeFromCart,
} from '../../store/cartSlice';

import { RootState } from '../../store/store';

import { RootStackParamList } from '../../navigation/types';

import CartItem from '../../components/CartItem';

import EmptyState from '../../components/EmptyState';

import { COLORS } from '../../constants/colors';

import { formatCurrency } from '../../utils/currency';

type Props = NativeStackScreenProps<RootStackParamList, 'Cart'>;

const DELIVERY_CHARGE = 50;

const CartScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const delivery = cartItems.length > 0 ? DELIVERY_CHARGE : 0;

  const total = subtotal + delivery;

  const totalItems = cartItems.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('ProductList');
              }
            }}
          >
            <Text style={styles.back}>‹</Text>
          </TouchableOpacity>

          <Text style={styles.headerTitle}>My Cart</Text>

          <View style={styles.headerSpacer} />
        </View>

        <EmptyState message="Your cart is empty" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('ProductList');
            }
          }}
        >
          <Text style={styles.back}>‹</Text>
        </TouchableOpacity>

        <View>
          <Text style={styles.headerTitle}>My Cart</Text>

          <Text style={styles.itemCount}>{totalItems} items</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      <FlatList
        data={cartItems}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onIncrease={() => dispatch(increaseQuantity(item.id))}
            onDecrease={() => dispatch(decreaseQuantity(item.id))}
            onRemove={() => dispatch(removeFromCart(item.id))}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Order Summary</Text>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Subtotal</Text>

          <Text style={styles.value}>{formatCurrency(subtotal)}</Text>
        </View>

        <View style={styles.summaryRow}>
          <Text style={styles.label}>Delivery</Text>

          <Text style={styles.value}>{formatCurrency(delivery)}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>

          <Text style={styles.total}>{formatCurrency(total)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('Checkout')}
        >
          <Text style={styles.checkoutText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    height: 70,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.white,
  },

  back: {
    fontSize: 36,
    color: COLORS.text,
    lineHeight: 40,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: COLORS.text,
    textAlign: 'center',
  },

  itemCount: {
    marginTop: 2,
    fontSize: 12,
    color: COLORS.muted,
    textAlign: 'center',
  },

  headerSpacer: {
    width: 30,
  },

  listContent: {
    padding: 16,
    paddingBottom: 20,
  },

  summary: {
    padding: 20,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },

  summaryTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 16,
  },

  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 19,
    fontWeight: '800',
    color: COLORS.text,
  },

  checkoutButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 14,
  },

  checkoutText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },
});
