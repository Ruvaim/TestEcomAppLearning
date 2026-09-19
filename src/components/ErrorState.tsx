import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';

type Props = {
  onRetry: () => void;
};

const ErrorState = ({ onRetry }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Something went wrong</Text>

      <Text style={styles.message}>We couldn't load the products.</Text>

      <TouchableOpacity onPress={onRetry} style={styles.button}>
        <Text style={styles.buttonText}>Try Again</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },

  message: {
    marginTop: 8,
    color: COLORS.secondary,
    textAlign: 'center',
  },

  button: {
    marginTop: 20,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 10,
    backgroundColor: COLORS.primary,
  },

  buttonText: {
    color: COLORS.white,
    fontWeight: '600',
  },
});
