import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

import { Product } from '../types/product';

type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export const productsApi = createApi({
  reducerPath: 'productsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com',
  }),

  endpoints: builder => ({
    getProducts: builder.query<ProductsResponse, void>({
      query: () => '/products?limit=30',
    }),

    getProductById: builder.query<Product, number>({
      query: (id: number) => `/products/${id}`,
    }),

    searchProducts: builder.query<ProductsResponse, string>({
      query: (search: string) =>
        `/products/search?q=${encodeURIComponent(search)}`,
    }),

    getCategories: builder.query<string[], void>({
      query: () => '/products/category-list',
    }),

    getProductsByCategory: builder.query<ProductsResponse, string>({
      query: (category: string) =>
        `/products/category/${encodeURIComponent(category)}`,
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useSearchProductsQuery,
  useGetCategoriesQuery,
  useGetProductsByCategoryQuery,
} = productsApi;
