import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { COLORS } from '../constants/colors';
import { formatCurrency } from '../utils/currency';

type CartItemData = {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
};

type Props = {
  item: CartItemData;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
};

const CartItem = ({ item, onIncrease, onDecrease, onRemove }: Props) => {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.thumbnail }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.titleRow}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>

          <TouchableOpacity onPress={onRemove} hitSlop={10}>
            <Text style={styles.remove}>×</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.price}>{formatCurrency(item.price)}</Text>

        <View style={styles.bottomRow}>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={onDecrease}
            >
              <Text style={styles.quantityButtonText}>−</Text>
            </TouchableOpacity>

            <Text style={styles.quantity}>{item.quantity}</Text>

            <TouchableOpacity
              style={styles.quantityButton}
              onPress={onIncrease}
            >
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>

          <Text style={styles.itemTotal}>
            {formatCurrency(item.price * item.quantity)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default CartItem;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
  },

  image: {
    width: 90,
    height: 90,
    borderRadius: 12,
    backgroundColor: COLORS.background,
  },

  content: {
    flex: 1,
    marginLeft: 12,
  },

  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  title: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
    color: COLORS.text,
    paddingRight: 8,
  },

  remove: {
    fontSize: 25,
    lineHeight: 22,
    color: COLORS.muted,
  },

  price: {
    marginTop: 7,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.secondary,
  },

  bottomRow: {
    marginTop: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 8,
    padding: 3,
  },

  quantityButton: {
    width: 28,
    height: 28,
    backgroundColor: COLORS.white,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },

  quantityButtonText: {
    fontSize: 18,
    color: COLORS.text,
  },

  quantity: {
    width: 32,
    textAlign: 'center',
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  itemTotal: {
    fontSize: 15,
    fontWeight: '700',
    color: COLORS.text,
  },
});
