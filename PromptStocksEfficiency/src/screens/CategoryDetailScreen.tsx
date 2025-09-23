import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import CategoryManager from '../services/CategoryManager';
import PromptManager from '../services/PromptManager';
import { Category } from '../models/Category';
import { Prompt } from '../models/Prompt';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Props {
  navigation: any;
  route: any;
}

const CategoryDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { categoryId } = route.params;
  const [category, setCategory] = useState<Category | null>(null);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  
  // Edit form states
  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [selectedColor, setSelectedColor] = useState('#2196F3');

  const availableColors = [
    '#2196F3', // Blue (default)
    '#3B82F6', // Blue variant
    '#8B5CF6', // Purple
    '#EC4899', // Pink
    '#F59E0B', // Orange
    '#10B981', // Emerald
    '#EF4444', // Red
    '#6366F1', // Indigo
  ];

  const availableIcons = [
    '📁', '🎯', '✍️', '📊', '💬', '🚀', '💡', '📝',
    '🎨', '💼', '🔬', '📚', '🎵', '🏆', '⚡', '🌟'
  ];

  useFocusEffect(
    useCallback(() => {
      loadCategoryData();
    }, [categoryId])
  );

  const loadCategoryData = async () => {
    try {
      const [categoryData, categoryPrompts] = await Promise.all([
        CategoryManager.getCategoryById(categoryId),
        PromptManager.getPromptsByCategory(categoryId),
      ]);

      if (categoryData) {
        setCategory(categoryData);
        setEditName(categoryData.name);
        setEditDescription(categoryData.description || '');
        setEditIcon(categoryData.icon || '📁');
        setSelectedColor(categoryData.color || '#2196F3');
        setPrompts(categoryPrompts);
      } else {
        Alert.alert('エラー', 'カテゴリが見つかりません', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Failed to load category:', error);
      Alert.alert('エラー', 'カテゴリの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editName.trim()) {
      Alert.alert('エラー', 'カテゴリ名は必須です');
      return;
    }

    if (!category) return;

    try {
      const updatedCategory = await CategoryManager.updateCategory(category.id, {
        name: editName.trim(),
        description: editDescription.trim() || undefined,
        icon: editIcon,
        color: selectedColor,
        updatedAt: new Date(),
      });

      if (updatedCategory) {
        setCategory(updatedCategory);
        setEditMode(false);
        Alert.alert('成功', 'カテゴリが更新されました');
      } else {
        Alert.alert('エラー', 'カテゴリの更新に失敗しました');
      }
    } catch (error) {
      console.error('Failed to update category:', error);
      Alert.alert('エラー', 'カテゴリの更新に失敗しました');
    }
  };


  const handlePromptPress = (promptId: string) => {
    navigation.navigate('PromptDetail', { promptId });
  };

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

  if (!category) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>カテゴリが見つかりません</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerCenter}>
          <Text style={styles.title}>
            {editMode ? 'カテゴリ編集' : 'カテゴリ情報確認'}
          </Text>
          <Text style={styles.subtitle}>
            {editMode ? '設定を変更' : `${prompts.length} プロンプト`}
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.editButton} 
          onPress={() => {
            if (editMode) {
              // Cancel edit
              setEditName(category.name);
              setEditDescription(category.description || '');
              setEditIcon(category.icon || '📁');
              setSelectedColor(category.color || '#2196F3');
              setEditMode(false);
            } else {
              setEditMode(true);
            }
          }}
        >
          <Ionicons 
            name={editMode ? "close" : "pencil"} 
            size={16} 
            color="white" 
          />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {editMode ? (
          /* Edit Mode */
          <View style={styles.content}>
            {/* Edit Form */}
            <Card style={styles.editCard} variant="glass">
              <Text style={styles.sectionTitle}>カテゴリ情報</Text>
              
              {/* Name Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>
                  カテゴリ名 <Text style={styles.required}>*</Text>
                </Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={styles.input}
                    value={editName}
                    onChangeText={setEditName}
                    placeholder="カテゴリ名を入力"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              {/* Description Input */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>説明</Text>
                <View style={styles.inputContainer}>
                  <TextInput
                    style={[styles.input, styles.multilineInput]}
                    value={editDescription}
                    onChangeText={setEditDescription}
                    placeholder="カテゴリの説明を入力"
                    placeholderTextColor="#9CA3AF"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              {/* Icon Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>アイコン</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.iconGrid}>
                    {availableIcons.map((icon, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.iconOption,
                          editIcon === icon && styles.iconOptionSelected
                        ]}
                        onPress={() => setEditIcon(icon)}
                      >
                        <Text style={styles.iconText}>{icon}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </ScrollView>
              </View>

              {/* Color Selection */}
              <View style={styles.formGroup}>
                <Text style={styles.label}>カラー</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View style={styles.colorGrid}>
                    {availableColors.map((color, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          styles.colorOption,
                          { backgroundColor: color },
                          selectedColor === color && styles.colorOptionSelected
                        ]}
                        onPress={() => setSelectedColor(color)}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>

            </Card>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <Button
                title="キャンセル"
                onPress={() => {
                  setEditName(category.name);
                  setEditDescription(category.description || '');
                  setEditIcon(category.icon || '📁');
                  setSelectedColor(category.color || '#2196F3');
                  setEditMode(false);
                }}
                variant="secondary"
                style={styles.actionButton}
              />
              <Button
                title="保存"
                onPress={handleSave}
                variant="primary"
                style={styles.actionButton}
              />
            </View>
          </View>
        ) : (
          /* View Mode */
          <View style={styles.content}>
            {/* Category Info Card */}
            <Card style={styles.infoCard} variant="glass">
              <View style={styles.categoryHeader}>
                <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                  <Text style={styles.categoryIconText}>{getCategoryIcon(category.icon)}</Text>
                </View>
                <View style={styles.categoryInfo}>
                  <Text style={styles.categoryName}>{category.name}</Text>
                  {category.description && (
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                  )}
                  <Text style={styles.categoryDate}>
                    作成日: {formatDate(category.createdAt)}
                  </Text>
                </View>
              </View>
            </Card>

            {/* Stats Card */}
            <Card style={styles.statsCard} variant="glass">
              <Text style={styles.sectionTitle}>統計</Text>
              <View style={styles.statsGrid}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{prompts.length}</Text>
                  <Text style={styles.statLabel}>プロンプト数</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: category.color }]}>
                    {formatBytes(prompts.reduce((sum, p) => sum + p.size, 0))}
                  </Text>
                  <Text style={styles.statLabel}>合計サイズ</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={[styles.statValue, { color: '#F59E0B' }]}>
                    {prompts.filter(p => p.isFavorite).length}
                  </Text>
                  <Text style={styles.statLabel}>お気に入り</Text>
                </View>
              </View>
            </Card>

            {/* Prompts List */}
            <Card style={styles.promptsCard} variant="glass">
              <Text style={styles.sectionTitle}>プロンプト一覧</Text>
              {prompts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyIcon}>📝</Text>
                  <Text style={styles.emptyTitle}>プロンプトがありません</Text>
                  <Text style={styles.emptyDescription}>
                    このカテゴリにはまだプロンプトがありません
                  </Text>
                </View>
              ) : (
                prompts.map((prompt) => (
                  <TouchableOpacity
                    key={prompt.id}
                    style={styles.promptItem}
                    onPress={() => handlePromptPress(prompt.id)}
                  >
                    <View style={styles.promptInfo}>
                      <Text style={styles.promptTitle}>{prompt.title}</Text>
                      <Text style={styles.promptPreview} numberOfLines={1}>
                        {prompt.content.substring(0, 60)}...
                      </Text>
                      <Text style={styles.promptDate}>
                        {formatDate(prompt.updatedAt)}
                      </Text>
                    </View>
                    <View style={styles.promptMeta}>
                      {prompt.isFavorite && (
                        <Text style={styles.favoriteIcon}>⭐</Text>
                      )}
                      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
                    </View>
                  </TouchableOpacity>
                ))
              )}
            </Card>

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
    paddingHorizontal: 24,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
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
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
    textAlign: 'center',
  },
  editButton: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#2196F3',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 24,
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
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  editCard: {
    marginBottom: 24,
  },
  infoCard: {
    marginBottom: 16,
  },
  statsCard: {
    marginBottom: 16,
  },
  promptsCard: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    fontFamily: '-apple-system',
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  categoryIconText: {
    fontSize: 24,
    color: 'white',
  },
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 4,
    fontFamily: '-apple-system',
  },
  categoryDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: '-apple-system',
  },
  categoryDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Menlo',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2196F3',
    fontFamily: '-apple-system',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontFamily: '-apple-system',
  },
  promptItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  promptInfo: {
    flex: 1,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
    fontFamily: '-apple-system',
  },
  promptPreview: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 4,
    fontFamily: '-apple-system',
  },
  promptDate: {
    fontSize: 12,
    color: '#9CA3AF',
    fontFamily: 'Menlo',
  },
  promptMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  emptyState: {
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
    fontFamily: '-apple-system',
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  required: {
    color: '#EF4444',
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  input: {
    padding: 16,
    fontSize: 16,
    color: '#374151',
    minHeight: 48,
  },
  multilineInput: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  iconGrid: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  iconOption: {
    width: 48,
    height: 48,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  iconOptionSelected: {
    borderColor: '#2196F3',
    backgroundColor: 'rgba(33, 150, 243, 0.1)',
  },
  iconText: {
    fontSize: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 3,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#374151',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  actionButton: {
    flex: 1,
  },
});

export default CategoryDetailScreen;