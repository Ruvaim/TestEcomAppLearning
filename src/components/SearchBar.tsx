import React from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';

import { COLORS } from '../constants/colors';

type Props = {
  value: string;
  onChangeText: (text: string) => void;
};

const SearchBar = ({ value, onChangeText }: Props) => {
  return (
    <View style={styles.container}>
      <Text style={styles.icon}>⌕</Text>

      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder="Search products..."
        placeholderTextColor={COLORS.muted}
        style={styles.input}
        returnKeyType="search"
      />
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  container: {
    height: 52,
    backgroundColor: COLORS.white,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },

  icon: {
    fontSize: 25,
    color: COLORS.secondary,
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: COLORS.text,
  },
});
