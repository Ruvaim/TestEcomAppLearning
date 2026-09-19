import React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';

const LoadingState = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />

      <Text style={styles.text}>Loading products...</Text>
    </View>
  );
};

export default LoadingState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  text: {
    marginTop: 12,
    fontSize: 14,
    color: COLORS.secondary,
  },
});
