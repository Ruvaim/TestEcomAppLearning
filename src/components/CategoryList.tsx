import React from 'react';
import { TouchableOpacity, ScrollView, StyleSheet, Text } from 'react-native';

import { COLORS } from '../constants/colors';

type Props = {
  categories: string[];
  selectedCategory: string;
  onSelect: (category: string) => void;
};

const CategoryList = ({ categories, selectedCategory, onSelect }: Props) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.container}
    >
      {categories.map(category => {
        const selected = category === selectedCategory;

        return (
          <TouchableOpacity
            key={category}
            onPress={() => onSelect(category)}
            style={[styles.category, selected && styles.selectedCategory]}
          >
            <Text style={[styles.text, selected && styles.selectedText]}>
              {category === 'all' ? 'All' : category}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

export default CategoryList;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },

  category: {
    minWidth: 80,
    height: 44,

    paddingHorizontal: 16,

    borderRadius: 22,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.white,

    marginRight: 8,

    alignItems: 'center',
    justifyContent: 'center',
  },

  selectedCategory: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },

  text: {
    fontSize: 14,
    lineHeight: 20,
    color: '#111111',
    textAlign: 'center',
  },

  selectedText: {
    color: '#FFFFFF',
  },
});
