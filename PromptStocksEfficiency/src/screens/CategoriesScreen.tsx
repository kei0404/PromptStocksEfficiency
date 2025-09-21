import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform
} from 'react-native';
import CategoryManager from '../services/CategoryManager';
import { Category } from '../models/Category';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Props {
  navigation: any;
}

const CategoriesScreen: React.FC<Props> = ({ navigation }) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const categoryList = await CategoryManager.getAllCategories();
      setCategories(categoryList);
    } catch (error) {
      console.error('Failed to load categories:', error);
      Alert.alert('エラー', 'カテゴリの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryPress = (category: Category) => {
    navigation.navigate('CategoryDetail', { categoryId: category.id });
  };

  const handleCreateCategory = () => {
    Alert.prompt(
      '新しいカテゴリ',
      'カテゴリ名を入力してください',
      async (text) => {
        if (text && text.trim()) {
          try {
            await CategoryManager.createCategory({
              name: text.trim(),
              color: '#1DB584',
              icon: 'folder',
              isDefault: false
            });
            loadCategories();
          } catch (error) {
            Alert.alert('エラー', 'カテゴリの作成に失敗しました');
          }
        }
      }
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>カテゴリ管理</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleCreateCategory}
        >
          <Text style={styles.addIcon}>+</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>読み込み中...</Text>
          </View>
        ) : categories.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>カテゴリがありません</Text>
            <Text style={styles.emptySubtitle}>新しいカテゴリを作成してプロンプトを整理しましょう</Text>
            <Button
              title="カテゴリを作成"
              onPress={handleCreateCategory}
              variant="primary"
            />
          </View>
        ) : (
          <View style={styles.categoriesContainer}>
            {categories.map((category) => (
              <Card
                key={category.id}
                style={styles.categoryCard}
                onPress={() => handleCategoryPress(category)}
                variant="glass"
              >
                <View style={styles.categoryHeader}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                    <Text style={styles.categoryIconText}>{category.icon || '📁'}</Text>
                  </View>
                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryStats}>
                      {category.promptCount || 0} プロンプト
                    </Text>
                  </View>
                  <Text style={styles.categoryArrow}>→</Text>
                </View>
              </Card>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: Platform.OS === 'ios' ? 10 : 20,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: '#374151',
    fontWeight: 'bold',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    fontFamily: '-apple-system',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1DB584',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  categoriesContainer: {
    padding: 20,
  },
  categoryCard: {
    marginBottom: 16,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryIconText: {
    fontSize: 20,
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
    fontFamily: '-apple-system',
  },
  categoryStats: {
    fontSize: 14,
    color: '#6B7280',
  },
  categoryArrow: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 12,
    lineHeight: 20,
  },
});

export default CategoriesScreen;