import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../constants/colors';

type Props = {
  message?: string;
  onRetry?: () => void;
};

const ErrorState = ({ message = 'Something went wrong.', onRetry }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oops!</Text>

      <Text style={styles.message}>{message}</Text>

      {onRetry && (
        <Pressable style={styles.button} onPress={onRetry}>
          <Text style={styles.buttonText}>Try Again</Text>
        </Pressable>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    backgroundColor: COLORS.background,
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.text,
  },

  message: {
    marginTop: 8,
    fontSize: 14,
    textAlign: 'center',
    color: COLORS.secondary,
  },

  button: {
    marginTop: 18,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
  },

  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.white,
  },
});

export default ErrorState;
