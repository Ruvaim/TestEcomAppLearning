import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  Image,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';

import { useGetProductByIdQuery } from '../../api/productsApi';

import QuantitySelector from '../../components/QuantitySelector';

import { COLORS } from '../../constants/colors';

import { formatCurrency } from '../../utils/currency';

import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../store/store';

import { addToCart } from '../../store/cartSlice';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductDetails'>;

const ProductDetailsScreen = ({ route, navigation }: Props) => {
  const { productId } = route.params;

  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const [quantity, setQuantity] = useState(1);

  const [showToast, setShowToast] = useState(false);

  const {
    data: product,
    isLoading,
    isError,
    refetch,
  } = useGetProductByIdQuery(productId);

  useEffect(() => {
    if (!showToast) {
      return;
    }

    const timer = setTimeout(() => {
      setShowToast(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [showToast]);

  if (isLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={COLORS.primary} />

        <Text style={styles.loadingText}>Loading product...</Text>
      </View>
    );
  }

  if (isError || !product) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>Unable to load product</Text>

        <Text style={styles.errorMessage}>Please try again.</Text>

        <TouchableOpacity style={styles.retryButton} onPress={refetch}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleIncrease = () => {
    if (quantity < product.stock) {
      setQuantity(previous => previous + 1);
    }
  };

  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(previous => previous - 1);
    }
  };

  const handleAddToCart = () => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity,
      }),
    );

    setShowToast(true);
  };

  const discountedPrice =
    product.price - (product.price * product.discountPercentage) / 100;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.imageContainer}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => {
              if (navigation.canGoBack()) {
                navigation.goBack();
              } else {
                navigation.navigate('ProductList');
              }
            }}
          >
            <Text style={styles.backButtonText}>‹</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cartTopButton}
            onPress={() => navigation.navigate('Cart')}
          >
            <Text style={styles.cartTopIcon}>🛒</Text>

            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>

          <Image
            source={{ uri: product.thumbnail }}
            style={styles.image}
            resizeMode="contain"
          />
        </View>

        <View style={styles.content}>
          <Text style={styles.category}>{product.category}</Text>

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingRow}>
            <View style={styles.rating}>
              <Text style={styles.star}>★</Text>

              <Text style={styles.ratingText}>{product.rating.toFixed(1)}</Text>
            </View>

            <Text style={styles.stock}>{product.stock} in stock</Text>
          </View>

          <View style={styles.priceRow}>
            <Text style={styles.price}>{formatCurrency(discountedPrice)}</Text>

            {product.discountPercentage > 0 && (
              <>
                <Text style={styles.originalPrice}>
                  {formatCurrency(product.price)}
                </Text>

                <View style={styles.discountBadge}>
                  <Text style={styles.discountText}>
                    {Math.round(product.discountPercentage)}% OFF
                  </Text>
                </View>
              </>
            )}
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>

            <Text style={styles.description}>{product.description}</Text>
          </View>

          {product.brand && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Brand</Text>

              <Text style={styles.brand}>{product.brand}</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <View style={styles.quantityContainer}>
          <QuantitySelector
            quantity={quantity}
            onIncrease={handleIncrease}
            onDecrease={handleDecrease}
          />
        </View>

        <TouchableOpacity style={styles.cartButton} onPress={handleAddToCart}>
          <Text style={styles.cartButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>

      {showToast && (
        <View style={styles.toast}>
          <Text style={styles.toastIcon}>✓</Text>

          <Text style={styles.toastText}>Product added to cart</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

export default ProductDetailsScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  scrollContent: {
    paddingBottom: 30,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  loadingText: {
    marginTop: 12,
    color: COLORS.secondary,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },

  errorMessage: {
    marginTop: 8,
    color: COLORS.secondary,
  },

  retryButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
  },

  retryText: {
    color: COLORS.white,
    fontWeight: '600',
  },

  imageContainer: {
    height: 360,
    backgroundColor: COLORS.background,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '90%',
    height: '90%',
  },

  content: {
    padding: 20,
  },

  category: {
    color: COLORS.muted,
    textTransform: 'uppercase',
    fontSize: 12,
    fontWeight: '600',
  },

  title: {
    marginTop: 8,
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    color: COLORS.text,
  },

  ratingRow: {
    marginTop: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  star: {
    fontSize: 18,
    marginRight: 5,
  },

  ratingText: {
    fontSize: 15,
    fontWeight: '600',
    color: COLORS.text,
  },

  stock: {
    fontSize: 13,
    color: COLORS.success,
    fontWeight: '600',
  },

  priceRow: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },

  price: {
    fontSize: 26,
    fontWeight: '800',
    color: COLORS.text,
  },

  originalPrice: {
    marginLeft: 10,
    fontSize: 15,
    color: COLORS.muted,
    textDecorationLine: 'line-through',
  },

  discountBadge: {
    marginLeft: 10,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#E8F7ED',
  },

  discountText: {
    fontSize: 11,
    color: COLORS.success,
    fontWeight: '700',
  },

  section: {
    marginTop: 26,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },

  description: {
    fontSize: 15,
    lineHeight: 23,
    color: COLORS.secondary,
  },

  brand: {
    fontSize: 15,
    color: COLORS.text,
    fontWeight: '600',
  },

  /* Top Back Button */
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  backButtonText: {
    fontSize: 36,
    lineHeight: 40,
    color: COLORS.text,
    marginTop: -4,
  },

  /* Top Cart Button */
  cartTopButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  cartTopIcon: {
    fontSize: 20,
  },

  /* Sticky Bottom Bar */
  bottomBar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  quantityContainer: {
    flexShrink: 0,
  },

  cartButton: {
    flex: 1,
    height: 52,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '700',
  },

  /* Toast */
  toast: {
    position: 'absolute',
    left: 20,
    right: 20,
    top: 100,
    minHeight: 50,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 100,
    elevation: 8,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },

  toastIcon: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: '800',
    marginRight: 8,
  },

  toastText: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '600',
  },

  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    minWidth: 20,
    height: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
  },

  cartBadgeText: {
    color: COLORS.white,
    fontSize: 10,
    fontWeight: '700',
  },
});
