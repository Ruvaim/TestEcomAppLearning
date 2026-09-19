import React, { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useDispatch } from 'react-redux';

import { RootStackParamList } from '../../navigation/types';
import { loginSuccess } from '../../store/authSlice';
import { COLORS } from '../../constants/colors';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen = ({ route, navigation }: Props) => {
  const dispatch = useDispatch();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleRedirect = () => {
    const redirect = route.params?.redirect;

    if (!redirect) {
      navigation.replace('ProductList');
      return;
    }

    if (redirect.resetAfterLogin) {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: redirect.screen,
            params: redirect.params,
          } as any,
        ],
      });

      return;
    }

    navigation.replace(redirect.screen as any, redirect.params as any);
  };

  const handleLogin = () => {
    setError('');

    if (!email.trim()) {
      setError('Please enter your email');
      return;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return;
    }

    dispatch(
      loginSuccess({
        accessToken: '12345',
        user: {
          id: 1,
          username: email.split('@')[0],
          email: email.trim(),
        },
      }),
    );

    handleRedirect();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>

        <Text style={styles.subtitle}>Login to continue to checkout</Text>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor={COLORS.muted}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
          />

          <Text style={styles.label}>Password</Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={COLORS.muted}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          {error ? <Text style={styles.error}>{error}</Text> : null}

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  title: {
    fontSize: 30,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 8,
  },

  subtitle: {
    fontSize: 15,
    color: COLORS.secondary,
    marginBottom: 32,
  },

  form: {
    width: '100%',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
    marginTop: 16,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 16,
    color: COLORS.text,
  },

  error: {
    color: COLORS.danger,
    fontSize: 14,
    marginTop: 10,
  },

  loginButton: {
    height: 52,
    backgroundColor: COLORS.primary,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },

  loginButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
});
