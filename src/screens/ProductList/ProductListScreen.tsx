import React, { useMemo, useState } from 'react';

import {
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
  useGetProductsQuery,
  useSearchProductsQuery,
} from '../../api/productsApi';

import ProductCard from '../../components/ProductCard';
import SearchBar from '../../components/SearchBar';
import CategoryList from '../../components/CategoryList';
import LoadingState from '../../components/LoadingState';
import ErrorState from '../../components/ErrorState';
import EmptyState from '../../components/EmptyState';

import { COLORS } from '../../constants/colors';

import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/store';

import { addToCart } from '../../store/cartSlice';

import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import useDebounce from '../../hooks/useDebounce';

type Props = NativeStackScreenProps<RootStackParamList, 'ProductList'>;

const ProductListScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();

  const cartItems = useSelector((state: RootState) => state.cart.items);

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const debouncedSearch = useDebounce(search, 400);

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    refetch,
  } = useGetProductsQuery();

  const { data: searchData, isLoading: searchLoading } = useSearchProductsQuery(
    debouncedSearch,
    {
      skip: debouncedSearch.trim().length === 0,
    },
  );

  const { data: categoryData, isLoading: categoryLoading } =
    useGetProductsByCategoryQuery(selectedCategory, {
      skip: selectedCategory === 'all',
    });

  const { data: categoriesData } = useGetCategoriesQuery();

  const products = useMemo(() => {
    if (debouncedSearch.trim()) {
      return searchData?.products ?? [];
    }

    if (selectedCategory !== 'all') {
      return categoryData?.products ?? [];
    }

    return productsData?.products ?? [];
  }, [
    debouncedSearch,
    searchData,
    selectedCategory,
    categoryData,
    productsData,
  ]);
  const isLoading = productsLoading || searchLoading || categoryLoading;

  const isError = productsError && !search.trim() && selectedCategory === 'all';

  const categories = ['all', ...(categoriesData ?? [])];

  const handleAddToCart = (product: any) => {
    dispatch(
      addToCart({
        id: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      }),
    );
  };

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isInitialLoading = productsLoading && !productsData;

  if (isInitialLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <View>
          <Text style={styles.heading}>Find your products</Text>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}
        >
          <Text style={styles.cartIcon}>🛒</Text>

          {cartCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{cartCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <SearchBar
          value={search}
          onChangeText={text => {
            setSearch(text);

            if (text.trim()) {
              setSelectedCategory('all');
            }
          }}
        />
      </View>

      <Text style={styles.sectionTitle}>Categories</Text>

      <CategoryList
        categories={categories}
        selectedCategory={selectedCategory}
        onSelect={category => {
          setSelectedCategory(category);

          if (category !== 'all') {
            setSearch('');
          }
        }}
      />

      <View style={styles.productsHeader}>
        <Text style={styles.sectionTitle}>Products</Text>

        <Text style={styles.count}>{products.length} items</Text>
      </View>

      {products.length === 0 ? (
        <EmptyState
          message={
            search.trim() ? `No results for "${search}"` : 'No products found'
          }
        />
      ) : (
        <>
          <FlatList
            data={products}
            numColumns={2}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.productList}
            columnWrapperStyle={styles.columnWrapper}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.cardWrapper}>
                <ProductCard
                  product={item}
                  onPress={() =>
                    navigation.navigate('ProductDetails', {
                      productId: item.id,
                    })
                  }
                  onAddToCart={() => handleAddToCart(item)}
                />
              </View>
            )}
          />
          {searchLoading && (
            <View style={styles.searchLoading}>
              <Text style={styles.searchLoadingText}>Searching...</Text>
            </View>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

export default ProductListScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  greeting: {
    fontSize: 14,
    color: COLORS.secondary,
  },

  heading: {
    fontSize: 24,
    fontWeight: '800',
    color: COLORS.text,
    marginTop: 4,
  },

  cartButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cartIcon: {
    fontSize: 20,
  },

  badge: {
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
  },

  badgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
  },

  searchContainer: {
    paddingHorizontal: 20,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: COLORS.text,
    marginLeft: 20,
    marginTop: 20,
    marginBottom: 10,
  },

  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: 20,
  },

  count: {
    fontSize: 13,
    color: COLORS.muted,
  },

  productList: {
    paddingHorizontal: 14,
    paddingBottom: 30,
  },

  columnWrapper: {
    justifyContent: 'space-between',
    marginBottom: 14,
  },

  searchLoading: {
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  searchLoadingText: {
    fontSize: 12,
    color: COLORS.muted,
  },

  cardWrapper: {
    width: '48%',
  },
});
