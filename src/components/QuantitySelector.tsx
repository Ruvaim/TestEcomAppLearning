import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';

import { COLORS } from '../constants/colors';

type Props = {
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
};

const QuantitySelector = ({ quantity, onIncrease, onDecrease }: Props) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={onDecrease}>
        <Text style={styles.buttonText}>−</Text>
      </TouchableOpacity>

      <Text style={styles.quantity}>{quantity}</Text>

      <TouchableOpacity style={styles.button} onPress={onIncrease}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

export default QuantitySelector;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.background,
    borderRadius: 12,
    padding: 4,
  },

  button: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },

  buttonText: {
    fontSize: 22,
    color: COLORS.text,
  },

  quantity: {
    width: 42,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: COLORS.text,
  },
});
