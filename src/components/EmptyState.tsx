import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';

type Props = {
  message?: string;
};

const EmptyState = ({ message = 'No products found' }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⌕</Text>

      <Text style={styles.title}>{message}</Text>

      <Text style={styles.subtitle}>Try changing your search or category.</Text>
    </View>
  );
};

export default EmptyState;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },

  icon: {
    fontSize: 40,
    color: COLORS.muted,
  },

  title: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginTop: 12,
  },

  subtitle: {
    marginTop: 6,
    color: COLORS.secondary,
    textAlign: 'center',
  },
});
