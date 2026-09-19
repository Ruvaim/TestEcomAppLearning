import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const productsApi = createApi({
  reducerPath: 'productsApi',

  baseQuery: fetchBaseQuery({
    baseUrl: 'https://dummyjson.com',
  }),

  endpoints: builder => ({
    getProducts: builder.query({
      query: () => '/products?limit=30',
    }),

    getProductById: builder.query({
      query: (id: number) => `/products/${id}`,
    }),

    searchProducts: builder.query({
      query: (search: string) =>
        `/products/search?q=${encodeURIComponent(search)}`,
    }),

    getCategories: builder.query({
      query: () => '/products/category-list',
    }),

    getProductsByCategory: builder.query({
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
