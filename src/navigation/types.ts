export type RootStackParamList = {
  ProductList: undefined;

  ProductDetails: {
    productId: number;
  };

  Cart: undefined;

  Checkout: undefined;

  OrderConfirmation: {
    orderId: string;
  };
};
