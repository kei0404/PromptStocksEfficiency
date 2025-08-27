import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import PromptManager from '../services/PromptManager';
import CategoryManager from '../services/CategoryManager';
import { Prompt } from '../models/Prompt';
import { Category } from '../models/Category';
import Card from '../components/ui/Card';

interface Props {
  navigation: any;
  route: any;
}

const PromptListScreen: React.FC<Props> = ({ navigation, route }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredPrompts, setFilteredPrompts] = useState<Prompt[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      const [allPrompts, allCategories] = await Promise.all([
        PromptManager.getAllPrompts(),
        CategoryManager.getAllCategories(),
      ]);

      setPrompts(allPrompts);
      setCategories(allCategories);
      setFilteredPrompts(allPrompts);
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('エラー', 'データの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  useEffect(() => {
    let filtered = prompts;

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(prompt => prompt.categoryId === selectedCategory);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(prompt =>
        prompt.title.toLowerCase().includes(query) ||
        prompt.content.toLowerCase().includes(query) ||
        (prompt.tags && prompt.tags.some(tag => tag.toLowerCase().includes(query)))
      );
    }

    setFilteredPrompts(filtered);
  }, [prompts, selectedCategory, searchQuery]);

  const handlePromptPress = (promptId: string) => {
    navigation.navigate('EditPrompt', { promptId });
  };

  const getCategoryById = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>読み込み中...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="chevron-back" size={20} color="#374151" />
          </TouchableOpacity>
          <View style={styles.headerTitle}>
            <Text style={styles.title}>プロンプト一覧</Text>
            <Text style={styles.subtitle}>編集するプロンプトを選択</Text>
          </View>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color="#9CA3AF" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="プロンプトを検索..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => setSearchQuery('')}
            >
              <Ionicons name="close-circle" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Category Filter */}
      <View style={styles.categoryFilterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity
            style={[
              styles.categoryFilterButton,
              selectedCategory === null && styles.categoryFilterButtonActive
            ]}
            onPress={() => setSelectedCategory(null)}
          >
            <Text style={[
              styles.categoryFilterText,
              selectedCategory === null && styles.categoryFilterTextActive
            ]}>
              すべて
            </Text>
          </TouchableOpacity>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryFilterButton,
                selectedCategory === category.id && styles.categoryFilterButtonActive
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text style={styles.categoryFilterEmoji}>{category.icon || '📁'}</Text>
              <Text style={[
                styles.categoryFilterText,
                selectedCategory === category.id && styles.categoryFilterTextActive
              ]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Prompt List */}
      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.promptsContainer}>
          {filteredPrompts.length === 0 ? (
            <Card style={styles.emptyCard} variant="glass">
              <View style={styles.emptyContent}>
                <Text style={styles.emptyIcon}>📝</Text>
                <Text style={styles.emptyTitle}>プロンプトが見つかりません</Text>
                <Text style={styles.emptyDescription}>
                  {searchQuery || selectedCategory 
                    ? '検索条件に合うプロンプトがありません。'
                    : 'まだプロンプトが作成されていません。'
                  }
                </Text>
              </View>
            </Card>
          ) : (
            filteredPrompts.map((prompt, index) => {
              const category = getCategoryById(prompt.categoryId);
              return (
                <Card
                  key={prompt.id}
                  style={styles.promptCard}
                  onPress={() => handlePromptPress(prompt.id)}
                  variant="glass"
                >
                  <View style={styles.promptHeader}>
                    <View style={styles.promptMeta}>
                      {category && (
                        <View style={[styles.categoryBadge, { backgroundColor: `${category.color}20` }]}>
                          <Text style={styles.categoryBadgeIcon}>{category.icon || '📁'}</Text>
                          <Text style={[styles.categoryBadgeText, { color: category.color }]}>
                            {category.name}
                          </Text>
                        </View>
                      )}
                      {prompt.isFavorite && (
                        <View style={styles.favoriteBadge}>
                          <Text style={styles.favoriteBadgeText}>⭐</Text>
                        </View>
                      )}
                    </View>
                    <TouchableOpacity style={styles.editButton}>
                      <Text style={styles.editButtonText}>✏️</Text>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.promptContent}>
                    <Text style={styles.promptTitle}>{prompt.title}</Text>
                    <Text style={styles.promptDescription} numberOfLines={2}>
                      {prompt.content.substring(0, 100)}...
                    </Text>
                  </View>

                  <View style={styles.promptFooter}>
                    <View style={styles.promptInfo}>
                      <Text style={styles.promptDate}>
                        {formatDate(prompt.updatedAt)}
                      </Text>
                      <Text style={styles.promptSize}>{formatBytes(prompt.size)}</Text>
                    </View>
                    {prompt.tags && prompt.tags.length > 0 && (
                      <View style={styles.tagsPreview}>
                        {prompt.tags.slice(0, 2).map((tag, tagIndex) => (
                          <View key={tagIndex} style={styles.tagPreview}>
                            <Text style={styles.tagPreviewText}>{tag}</Text>
                          </View>
                        ))}
                        {prompt.tags.length > 2 && (
                          <Text style={styles.moreTagsText}>+{prompt.tags.length - 2}</Text>
                        )}
                      </View>
                    )}
                  </View>
                </Card>
              );
            })
          )}
        </View>
        <View style={{ height: 100 }} />
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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  headerTitle: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  searchContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  clearButton: {
    padding: 4,
  },
  categoryFilterContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  categoryFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  categoryFilterButtonActive: {
    backgroundColor: '#1DB584',
    borderColor: '#1DB584',
  },
  categoryFilterEmoji: {
    fontSize: 14,
    marginRight: 6,
  },
  categoryFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryFilterTextActive: {
    color: 'white',
  },
  scrollView: {
    flex: 1,
  },
  promptsContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  promptCard: {
    marginBottom: 16,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  promptMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
  },
  categoryBadgeIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  favoriteBadge: {
    marginLeft: 4,
  },
  favoriteBadgeText: {
    fontSize: 16,
  },
  editButton: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  editButtonText: {
    fontSize: 14,
  },
  promptContent: {
    marginBottom: 12,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
    fontFamily: '-apple-system',
  },
  promptDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    fontFamily: '-apple-system',
  },
  promptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  promptDate: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Menlo',
  },
  promptSize: {
    fontSize: 12,
    color: '#6B7280',
    fontFamily: 'Menlo',
  },
  tagsPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagPreview: {
    backgroundColor: 'rgba(29, 181, 132, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  tagPreviewText: {
    fontSize: 11,
    color: '#1DB584',
    fontWeight: '500',
  },
  moreTagsText: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '500',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  emptyCard: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(29, 181, 132, 0.3)',
    borderStyle: 'dashed',
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 8,
    fontFamily: '-apple-system',
  },
  emptyDescription: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: '-apple-system',
  },
});

export default PromptListScreen;