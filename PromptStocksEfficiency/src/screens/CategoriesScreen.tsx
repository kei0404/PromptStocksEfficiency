import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  FlatList,
  RefreshControl,
  StatusBar,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CategoryManager from '../services/CategoryManager';
import { Category } from '../models/Category';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BlueTheme, Typography, ComponentStyles } from '../styles/theme';

interface Props {
  navigation: any;
}

const { width } = Dimensions.get('window');

const CategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      // Force update categories to ensure latest version is loaded
      await CategoryManager.forceUpdateCategories();
      const allCategories = await CategoryManager.getAllCategories();
      setCategories(allCategories);
    } catch (error) {
      console.error('Failed to load categories:', error);
      Alert.alert('エラー', 'カテゴリの読み込みに失敗しました');
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const handleCategoryPress = (categoryId: string) => {
    navigation.navigate('CategoryDetail', { categoryId });
  };

  const renderCategoryTile = ({ item }: { item: Category }) => (
    <TouchableOpacity
      style={[styles.categoryTile, { borderColor: item.color }]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <View style={[styles.categoryIconContainer, { backgroundColor: item.color + '20' }]}>
        <Text style={styles.categoryIcon}>{getCategoryIcon(item.icon)}</Text>
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
      <Text style={styles.categoryCount}>{item.promptCount || 0}個</Text>
    </TouchableOpacity>
  );

  const getCategoryIcon = (iconName: string) => {
    const iconMap: Record<string, string> = {
      'mail': '✉️',
      'document-text': '📋',
      'document': '📄',
      'lightbulb': '💡',
      'bar-chart': '📊',
      'language': '🌐',
      'search': '🔍',
      'create': '📑'
    };
    return iconMap[iconName] || '📁';
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>カテゴリ一覧</Text>
          <Text style={styles.headerSubtitle}>作業効率化プロンプト管理</Text>
        </View>
        <View style={styles.headerRight} />
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        {/* Categories Grid */}
        <View style={styles.categoriesSection}>
          <Text style={styles.sectionTitle}>カテゴリ ({categories.length})</Text>
          <FlatList
            data={categories}
            renderItem={renderCategoryTile}
            numColumns={2}
            horizontal={false}
            scrollEnabled={false}
            contentContainerStyle={styles.categoriesGrid}
            columnWrapperStyle={styles.categoryRow}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BlueTheme.neutral[100],
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: BlueTheme.neutral[200],
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: BlueTheme.neutral[100],
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: BlueTheme.neutral[700],
    fontWeight: 'bold',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    ...Typography.h3,
    color: BlueTheme.neutral[900],
    fontWeight: 'bold',
  },
  headerSubtitle: {
    ...Typography.caption,
    color: BlueTheme.neutral[600],
    marginTop: 2,
  },
  headerRight: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  categoriesSection: {
    padding: 24,
  },
  sectionTitle: {
    fontSize: 18,
    color: BlueTheme.neutral[900],
    marginBottom: 16,
    fontWeight: '600',
  },
  categoriesGrid: {
    gap: 12,
  },
  categoryRow: {
    justifyContent: 'space-between',
  },
  categoryTile: {
    ...ComponentStyles.categoryTile.dimensions,
    backgroundColor: ComponentStyles.categoryTile.colors.background,
    borderWidth: 1,
    borderColor: ComponentStyles.categoryTile.colors.border,
    padding: ComponentStyles.categoryTile.layout.padding,
    marginBottom: 12,
    alignItems: 'center',
  },
  categoryIconContainer: {
    width: ComponentStyles.categoryTile.layout.iconSize,
    height: ComponentStyles.categoryTile.layout.iconSize,
    borderRadius: ComponentStyles.categoryTile.layout.iconSize / 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ComponentStyles.categoryTile.layout.spacing,
  },
  categoryIcon: {
    fontSize: 20,
  },
  categoryName: {
    ...Typography.body2,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 4,
  },
  categoryCount: {
    ...Typography.caption,
    color: BlueTheme.primary[600],
  },
});

export default CategoriesScreen;