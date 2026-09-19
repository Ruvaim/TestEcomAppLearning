import React from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';

import { useGetProductsByCategoryQuery } from '../../api/productsApi';
import { COLORS } from '../../constants/colors';
import { formatCurrency } from '../../utils/currency';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';
import { Product } from '../../types/product';

type RouteParams = {
  category: string;
};

const CategoryLandingScreen = () => {
  const navigation = useNavigation<any>();

  const route = useRoute();
  const { category } = route.params as RouteParams;

  const { data, isLoading, isError, refetch } =
    useGetProductsByCategoryQuery(category);

  const products = data?.products ?? [];

  const handleProductPress = (productId: number) => {
    navigation.navigate('ProductDetails', {
      productId,
    });
  };

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return (
      <ErrorState message="Unable to load this category." onRetry={refetch} />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.navigate('ProductList');
            }
          }}
        >
          <Text style={styles.backText}>‹</Text>
        </Pressable>

        <View style={styles.headerContent}>
          <Text style={styles.title}>
            {category
              .split('-')
              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
              .join(' ')}
          </Text>

          <Text style={styles.subtitle}>{products.length} products</Text>
        </View>
      </View>

      {products.length === 0 ? (
        <EmptyState message="No products found in this category." />
      ) : (
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          numColumns={2}
          contentContainerStyle={styles.list}
          columnWrapperStyle={styles.columnWrapper}
          renderItem={({ item }) => (
            <CategoryProductCard
              product={item}
              onPress={() => handleProductPress(item.id)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
};

type ProductCardProps = {
  product: Product;
  onPress: () => void;
};

const CategoryProductCard = ({ product, onPress }: ProductCardProps) => {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      <Image
        source={{ uri: product.thumbnail }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.cardContent}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {product.title}
        </Text>

        <Text style={styles.price}>{formatCurrency(product.price)}</Text>

        <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.background,
  },

  backText: {
    fontSize: 32,
    lineHeight: 34,
    color: COLORS.text,
  },

  headerContent: {
    marginLeft: 12,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },

  subtitle: {
    marginTop: 2,
    fontSize: 13,
    color: COLORS.secondary,
  },

  list: {
    padding: 14,
    paddingBottom: 30,
  },

  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  card: {
    width: '48%',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  image: {
    width: '100%',
    height: 170,
    backgroundColor: COLORS.background,
  },

  cardContent: {
    padding: 10,
  },

  productTitle: {
    minHeight: 40,
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
  },

  price: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },

  rating: {
    marginTop: 5,
    fontSize: 13,
    color: COLORS.secondary,
  },
});

export default CategoryLandingScreen;
