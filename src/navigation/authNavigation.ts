import { NavigationProp } from '@react-navigation/native';

import { Redirect, RootStackParamList } from './types';

export const navigateWithAuth = (
  navigation: NavigationProp<RootStackParamList>,
  isAuthenticated: boolean,
  redirect: Redirect,
) => {
  if (isAuthenticated) {
    navigation.navigate(redirect.screen as any, redirect.params as any);

    return;
  }

  navigation.navigate('Login', {
    redirect,
  });
};
