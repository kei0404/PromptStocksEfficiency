import React from 'react';
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';

interface Props {
  navigation: any;
  route: any;
}

const CategoryDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>カテゴリ詳細</Text>
      <Text style={styles.subtitle}>Coming Soon...</Text>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
  },
});

export default CategoryDetailScreen;