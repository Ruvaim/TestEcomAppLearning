export type RootStackParamList = {
  ProductList: undefined;

  ProductDetails: {
    productId: number;
  };

  Cart: undefined;

  Login: {
    redirect?: Redirect;
  };

  Checkout: undefined;

  OrderConfirmation: {
    orderId: string;
  };
};

export type Redirect = {
  [K in Exclude<keyof RootStackParamList, 'Login'>]: {
    screen: K;
    params: RootStackParamList[K];
    resetAfterLogin?: boolean;
  };
}[Exclude<keyof RootStackParamList, 'Login'>];
