import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
  Keyboard,
  TouchableWithoutFeedback
} from 'react-native';
import CategoryManager from '../services/CategoryManager';
import PromptManager from '../services/PromptManager';
import { Category } from '../models/Category';
import Input from '../components/ui/Input';
import Button from '../components/ui/Button';

interface Props {
  navigation: any;
  route: any;
}

const CreatePromptScreen: React.FC<Props> = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  useEffect(() => {
    loadCategories();
    // Pre-fill category if passed from navigation
    if (route.params?.categoryId) {
      const categoryId = route.params.categoryId;
      CategoryManager.getCategoryById(categoryId).then(category => {
        if (category) setSelectedCategory(category);
      });
    }
  }, [route.params]);

  const loadCategories = async () => {
    try {
      const categoryList = await CategoryManager.getAllCategories();
      setCategories(categoryList);
      if (!selectedCategory && categoryList.length > 0) {
        setSelectedCategory(categoryList[0]);
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('エラー', 'タイトルを入力してください');
      return;
    }
    if (!content.trim()) {
      Alert.alert('エラー', 'プロンプトの内容を入力してください');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('エラー', 'カテゴリを選択してください');
      return;
    }

    setLoading(true);
    try {
      const tagsArray = tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      await PromptManager.createPrompt({
        title: title.trim(),
        content: content.trim(),
        category: selectedCategory.id,
        tags: tagsArray,
        isFavorite: false,
        isArchived: false
      });

      Alert.alert('成功', 'プロンプトを作成しました', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      console.error('Failed to create prompt:', error);
      Alert.alert('エラー', 'プロンプトの作成に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCategorySelect = (category: Category) => {
    setSelectedCategory(category);
    setShowCategories(false);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.cancelText}>キャンセル</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>新しいプロンプト</Text>
          <TouchableOpacity
            style={[styles.saveButton, (!title || !content) && styles.saveButtonDisabled]}
            onPress={handleSave}
            disabled={loading || !title || !content}
          >
            <Text style={[styles.saveText, (!title || !content) && styles.saveTextDisabled]}>
              {loading ? '保存中...' : '保存'}
            </Text>
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.scrollView} keyboardShouldPersistTaps="handled">
          <View style={styles.form}>
            {/* Title Input */}
            <Input
              label="タイトル *"
              value={title}
              onChangeText={setTitle}
              placeholder="プロンプトのタイトルを入力"
              variant="glass"
              required
            />

            {/* Content Input */}
            <Input
              label="プロンプト内容 *"
              value={content}
              onChangeText={setContent}
              placeholder="プロンプトの内容を入力..."
              multiline
              numberOfLines={8}
              variant="glass"
              required
              style={styles.textArea}
            />

            {/* Category Selection */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>カテゴリ *</Text>
              <TouchableOpacity
                style={styles.categorySelector}
                onPress={() => setShowCategories(!showCategories)}
              >
                <View style={styles.categoryDisplay}>
                  {selectedCategory && (
                    <View style={[styles.categoryIcon, { backgroundColor: selectedCategory.color }]}>
                      <Text style={styles.categoryIconText}>{selectedCategory.icon || '📁'}</Text>
                    </View>
                  )}
                  <Text style={styles.categoryName}>
                    {selectedCategory?.name || 'カテゴリを選択'}
                  </Text>
                </View>
                <Text style={styles.dropdownArrow}>{showCategories ? '↑' : '↓'}</Text>
              </TouchableOpacity>
              
              {showCategories && (
                <View style={styles.categoryList}>
                  {categories.map((category) => (
                    <TouchableOpacity
                      key={category.id}
                      style={styles.categoryOption}
                      onPress={() => handleCategorySelect(category)}
                    >
                      <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                        <Text style={styles.categoryIconText}>{category.icon || '📁'}</Text>
                      </View>
                      <Text style={styles.categoryName}>{category.name}</Text>
                      {selectedCategory?.id === category.id && (
                        <Text style={styles.checkmark}>✓</Text>
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>

            {/* Tags Input */}
            <Input
              label="タグ (カンマ区切り)"
              value={tags}
              onChangeText={setTags}
              placeholder="例: ライティング, 翻訳, チャット"
              variant="glass"
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </TouchableWithoutFeedback>
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
  cancelButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  cancelText: {
    fontSize: 16,
    color: '#6B7280',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    fontFamily: '-apple-system',
  },
  saveButton: {
    backgroundColor: '#1DB584',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  saveTextDisabled: {
    color: '#D1D5DB',
  },
  scrollView: {
    flex: 1,
  },
  form: {
    padding: 20,
  },
  textArea: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    fontFamily: '-apple-system',
  },
  categorySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  categoryDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  categoryIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  categoryIconText: {
    fontSize: 16,
  },
  categoryName: {
    fontSize: 16,
    color: '#374151',
    fontFamily: '-apple-system',
  },
  dropdownArrow: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  categoryList: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    marginTop: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    maxHeight: 200,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  checkmark: {
    fontSize: 16,
    color: '#1DB584',
    fontWeight: 'bold',
    marginLeft: 'auto',
  },
});

export default CreatePromptScreen;