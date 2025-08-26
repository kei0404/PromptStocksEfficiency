import React, { useState, useEffect } from 'react';
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

interface Props {
  navigation: any;
  route: any;
}

interface PromptData {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isFavorite: boolean;
  isTemplate: boolean;
  isPrivate: boolean;
}

const EditPromptScreen: React.FC<Props> = ({ navigation, route }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('efficiency');
  const [tags, setTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [isTemplate, setIsTemplate] = useState(false);
  const [isPrivate, setIsPrivate] = useState(true);
  const [wordCount, setWordCount] = useState(0);

  // Sample prompt data
  const samplePrompts: Record<string, PromptData> = {
    'prompt-1': {
      id: 'prompt-1',
      title: '会議議事録を効率的に作成する',
      category: 'efficiency',
      content: `あなたは経験豊富な会議ファシリテーターです。以下の会議の録音内容を基に、構造化された議事録を作成してください。

## 作成する議事録に含める要素：
1. **会議基本情報**（日時、参加者、議題）
2. **主要な議論ポイント**（決定事項、課題、意見）
3. **アクションアイテム**（担当者、期限、優先度）
4. **次回までの宿題**
5. **その他の重要な情報**

## 出力形式：
- 簡潔で読みやすい箇条書き
- 重要度に応じた優先順位付け
- 期限付きタスクの明確化`,
      tags: ['効率化', '会議', '議事録', 'ビジネス'],
      isFavorite: true,
      isTemplate: false,
      isPrivate: true,
    },
    'prompt-2': {
      id: 'prompt-2',
      title: 'SEO最適化ブログ記事作成',
      category: 'writing',
      content: `専門的なSEOライターとして、指定されたキーワードを効果的に使用した高品質なブログ記事を作成してください。

## 記事要件：
1. **キーワード密度**: 1-2%の適切な配置
2. **構造**: H1, H2, H3を使った階層構造
3. **読みやすさ**: 短い段落と適切な改行
4. **価値提供**: 読者に具体的な価値を提供
5. **CTA**: 適切な行動喚起を含める`,
      tags: ['SEO', 'ブログ', 'マーケティング'],
      isFavorite: false,
      isTemplate: true,
      isPrivate: true,
    },
  };

  useEffect(() => {
    // Load prompt data if editing existing prompt
    const promptId = route.params?.promptId;
    if (promptId && samplePrompts[promptId]) {
      const promptData = samplePrompts[promptId];
      setTitle(promptData.title);
      setContent(promptData.content);
      setCategory(promptData.category);
      setTags(promptData.tags);
      setIsFavorite(promptData.isFavorite);
      setIsTemplate(promptData.isTemplate);
      setIsPrivate(promptData.isPrivate);
    }
  }, [route.params]);

  useEffect(() => {
    // Update word count
    const words = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    setWordCount(words);
  }, [content]);

  const handleSave = () => {
    if (!title.trim() || !content.trim()) {
      Alert.alert('エラー', 'タイトルとプロンプト内容は必須です。');
      return;
    }

    // In real app, save to storage here
    Alert.alert(
      '保存完了！',
      'プロンプトが正常に保存されました',
      [
        {
          text: 'OK',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  const toggleTag = (tagToToggle: string) => {
    setTags(prev => 
      prev.includes(tagToToggle) 
        ? prev.filter(tag => tag !== tagToToggle)
        : [...prev, tagToToggle]
    );
  };

  const addNewTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags(prev => [...prev, newTag.trim()]);
      setNewTag('');
    }
  };

  const getCategoryInfo = (cat: string) => {
    const categories = {
      efficiency: { icon: '🎯', name: '作業効率', color: '#1DB584' },
      writing: { icon: '✍️', name: '文章作成', color: '#3B82F6' },
      analysis: { icon: '📊', name: 'データ分析', color: '#8B5CF6' },
      communication: { icon: '💬', name: 'コミュニケーション', color: '#EC4899' },
    };
    return categories[cat] || categories.efficiency;
  };

  const categoryInfo = getCategoryInfo(category);

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
            <Text style={styles.title}>プロンプト編集</Text>
            <Text style={styles.subtitle}>
              {categoryInfo.icon} {categoryInfo.name}
            </Text>
          </View>
        </View>
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Text style={styles.saveButtonText}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Title Input */}
        <View style={styles.section}>
          <Text style={styles.label}>
            タイトル <Text style={styles.required}>*</Text>
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="プロンプトのタイトルを入力"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        {/* Category Selection */}
        <View style={styles.section}>
          <Text style={styles.label}>カテゴリ</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {Object.entries({
              efficiency: { icon: '🎯', name: '作業効率' },
              writing: { icon: '✍️', name: '文章作成' },
              analysis: { icon: '📊', name: 'データ分析' },
              communication: { icon: '💬', name: 'コミュニケーション' },
            }).map(([key, cat]) => (
              <TouchableOpacity
                key={key}
                style={[
                  styles.categoryButton,
                  category === key && styles.categoryButtonActive
                ]}
                onPress={() => setCategory(key)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={[
                  styles.categoryText,
                  category === key && styles.categoryTextActive
                ]}>
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Content Input */}
        <View style={styles.section}>
          <View style={styles.contentHeader}>
            <Text style={styles.label}>
              プロンプト内容 <Text style={styles.required}>*</Text>
            </Text>
            <Text style={styles.wordCount}>{wordCount} / 2000</Text>
          </View>
          <View style={styles.contentContainer}>
            <TextInput
              style={styles.contentInput}
              value={content}
              onChangeText={setContent}
              placeholder="あなたのプロンプトを入力してください..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Tags Section */}
        <View style={styles.section}>
          <Text style={styles.label}>タグ</Text>
          <View style={styles.tagsContainer}>
            <View style={styles.tagsWrapper}>
              {tags.map((tag, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.tag, styles.tagActive]}
                  onPress={() => toggleTag(tag)}
                >
                  <Text style={styles.tagTextActive}>{tag}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={styles.addTagContainer}>
              <TextInput
                style={styles.tagInput}
                value={newTag}
                onChangeText={setNewTag}
                placeholder="新しいタグを追加..."
                placeholderTextColor="#9CA3AF"
                onSubmitEditing={addNewTag}
              />
              <TouchableOpacity style={styles.addTagButton} onPress={addNewTag}>
                <Ionicons name="add" size={16} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.label}>設定</Text>
          <View style={styles.settingsContainer}>
            
            {/* Favorite Toggle */}
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => setIsFavorite(!isFavorite)}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FEF3F2' }]}>
                  <Text style={styles.settingEmoji}>⭐</Text>
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>お気に入り</Text>
                  <Text style={styles.settingDesc}>クイックアクセスに追加</Text>
                </View>
              </View>
              <View style={[styles.toggle, isFavorite && styles.toggleActive]}>
                <View style={[styles.toggleSlider, isFavorite && styles.toggleSliderActive]} />
              </View>
            </TouchableOpacity>

            {/* Template Toggle */}
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => setIsTemplate(!isTemplate)}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#F3F4F6' }]}>
                  <Text style={styles.settingEmoji}>📄</Text>
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>テンプレート化</Text>
                  <Text style={styles.settingDesc}>再利用可能なテンプレートとして保存</Text>
                </View>
              </View>
              <View style={[styles.toggle, isTemplate && styles.toggleActive]}>
                <View style={[styles.toggleSlider, isTemplate && styles.toggleSliderActive]} />
              </View>
            </TouchableOpacity>

            {/* Private Toggle */}
            <TouchableOpacity 
              style={styles.settingItem}
              onPress={() => setIsPrivate(!isPrivate)}
            >
              <View style={styles.settingLeft}>
                <View style={[styles.settingIcon, { backgroundColor: '#FEF3F2' }]}>
                  <Text style={styles.settingEmoji}>🔒</Text>
                </View>
                <View style={styles.settingInfo}>
                  <Text style={styles.settingTitle}>プライベート</Text>
                  <Text style={styles.settingDesc}>ローカル端末のみに保存</Text>
                </View>
              </View>
              <View style={[styles.toggle, isPrivate && styles.toggleActive]}>
                <View style={[styles.toggleSlider, isPrivate && styles.toggleSliderActive]} />
              </View>
            </TouchableOpacity>

          </View>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.previewButton}>
          <Ionicons name="eye-outline" size={16} color="#374151" />
          <Text style={styles.previewButtonText}>プレビュー</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveMainButton} onPress={handleSave}>
          <Ionicons name="checkmark" size={16} color="white" />
          <Text style={styles.saveMainButtonText}>保存して終了</Text>
        </TouchableOpacity>
      </View>
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
  saveButton: {
    backgroundColor: '#1DB584',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    shadowColor: '#1DB584',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  scrollView: {
    flex: 1,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  required: {
    color: '#EF4444',
  },
  inputContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
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
    minHeight: 56,
  },
  categoryScroll: {
    marginHorizontal: -4,
  },
  categoryButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    minWidth: 80,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  categoryButtonActive: {
    backgroundColor: '#1DB584',
    shadowColor: '#1DB584',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  categoryIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryTextActive: {
    color: 'white',
  },
  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  wordCount: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  contentContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  contentInput: {
    padding: 20,
    fontSize: 16,
    color: '#374151',
    minHeight: 200,
    lineHeight: 24,
  },
  tagsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  tagsWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  tag: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tagActive: {
    backgroundColor: '#1DB584',
    borderColor: '#1DB584',
  },
  tagText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6B7280',
  },
  tagTextActive: {
    color: 'white',
  },
  addTagContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginRight: 8,
  },
  addTagButton: {
    backgroundColor: '#1DB584',
    borderRadius: 12,
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  settingEmoji: {
    fontSize: 16,
  },
  settingInfo: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  toggle: {
    width: 48,
    height: 24,
    backgroundColor: '#D1D5DB',
    borderRadius: 12,
    justifyContent: 'center',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: 'rgba(29, 181, 132, 0.3)',
  },
  toggleSlider: {
    width: 20,
    height: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleSliderActive: {
    backgroundColor: '#1DB584',
    transform: [{ translateX: 24 }],
  },
  bottomActions: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 20,
    flexDirection: 'row',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  previewButton: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  previewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 8,
  },
  saveMainButton: {
    flex: 1,
    backgroundColor: '#1DB584',
    borderRadius: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
    shadowColor: '#1DB584',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveMainButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
    marginLeft: 8,
  },
});

export default EditPromptScreen;