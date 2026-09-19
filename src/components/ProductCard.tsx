import React from 'react';
import { Image, TouchableOpacity, StyleSheet, Text, View } from 'react-native';

import { Product } from '../types/product';
import { COLORS } from '../constants/colors';
import { formatCurrency } from '../utils/currency';

type Props = {
  product: Product;
  onPress: () => void;
  onAddToCart: () => void;
};

const ProductCard = ({ product, onPress, onAddToCart }: Props) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: product.thumbnail }}
          style={styles.image}
          resizeMode="cover"
        />

        <TouchableOpacity
          style={styles.addButton}
          onPress={event => {
            event.stopPropagation();
            onAddToCart();
          }}
        >
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.category} numberOfLines={1}>
          {product.category}
        </Text>

        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.bottomRow}>
          <Text style={styles.price}>{formatCurrency(product.price)}</Text>

          <View style={styles.ratingContainer}>
            <Text style={styles.star}>★</Text>

            <Text style={styles.rating}>{product.rating.toFixed(1)}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    marginHorizontal: 6,
  },

  imageContainer: {
    height: 180,
    backgroundColor: COLORS.background,
    position: 'relative',
  },

  image: {
    width: '100%',
    height: '100%',
  },

  addButton: {
    position: 'absolute',
    right: 10,
    bottom: 10,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  addButtonText: {
    color: COLORS.white,
    fontSize: 24,
    fontWeight: '500',
    lineHeight: 28,
  },

  content: {
    padding: 12,
  },

  category: {
    fontSize: 11,
    color: COLORS.muted,
    textTransform: 'uppercase',
    marginBottom: 5,
  },

  title: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
    lineHeight: 20,
    minHeight: 40,
  },

  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
  },

  price: {
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  star: {
    fontSize: 13,
    marginRight: 3,
  },

  rating: {
    fontSize: 12,
    color: COLORS.secondary,
  },
});
