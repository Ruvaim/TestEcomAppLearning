import React from 'react';

import {
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  View,
} from 'react-native';

import { COLORS } from '../constants/colors';

type Props = TextInputProps & {
  label: string;
  error?: string;
};

const FormInput = ({ label, error, ...props }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>

      <TextInput
        {...props}
        style={[styles.input, error && styles.errorInput]}
        placeholderTextColor={COLORS.muted}
      />

      {!!error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 7,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: COLORS.text,
    backgroundColor: COLORS.white,
  },

  errorInput: {
    borderColor: COLORS.danger,
  },

  error: {
    marginTop: 5,
    fontSize: 12,
    color: COLORS.danger,
  },
});
