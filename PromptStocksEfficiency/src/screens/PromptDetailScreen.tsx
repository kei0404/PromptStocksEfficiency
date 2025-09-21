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
  Share
} from 'react-native';
import * as Clipboard from 'expo-clipboard';
import PromptManager from '../services/PromptManager';
import CategoryManager from '../services/CategoryManager';
import { Prompt } from '../models/Prompt';
import { Category } from '../models/Category';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Props {
  navigation: any;
  route: any;
}

const PromptDetailScreen: React.FC<Props> = ({ navigation, route }) => {
  const { promptId } = route.params;
  const [prompt, setPrompt] = useState<Prompt | null>(null);
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPromptDetails();
  }, [promptId]);

  const loadPromptDetails = async () => {
    try {
      const promptData = await PromptManager.getPrompt(promptId);
      if (promptData) {
        setPrompt(promptData);
        const categoryData = await CategoryManager.getCategoryById(promptData.category);
        setCategory(categoryData);
      } else {
        Alert.alert('エラー', 'プロンプトが見つかりません', [
          { text: 'OK', onPress: () => navigation.goBack() }
        ]);
      }
    } catch (error) {
      console.error('Failed to load prompt:', error);
      Alert.alert('エラー', 'プロンプトの読み込みに失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!prompt) return;
    try {
      await Clipboard.setStringAsync(prompt.content);
      Alert.alert('成功', 'プロンプトをコピーしました');
      // Update last accessed
      await PromptManager.updatePrompt(prompt.id, { lastAccessed: new Date() });
    } catch (error) {
      Alert.alert('エラー', 'コピーに失敗しました');
    }
  };

  const handleShare = async () => {
    if (!prompt) return;
    try {
      await Share.share({
        message: `${prompt.title}\n\n${prompt.content}`,
        title: prompt.title
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (!prompt) return;
    try {
      const updated = await PromptManager.updatePrompt(prompt.id, {
        isFavorite: !prompt.isFavorite
      });
      if (updated) {
        setPrompt(updated);
        Alert.alert('成功', 
          updated.isFavorite ? 'お気に入りに追加しました' : 'お気に入りから削除しました'
        );
      }
    } catch (error) {
      Alert.alert('エラー', '更新に失敗しました');
    }
  };

  const handleEdit = () => {
    navigation.navigate('EditPrompt', { promptId: prompt?.id });
  };

  const handleDelete = () => {
    Alert.alert(
      '削除確認',
      'このプロンプトを削除しますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: '削除',
          style: 'destructive',
          onPress: async () => {
            try {
              if (prompt) {
                await PromptManager.deletePrompt(prompt.id);
                Alert.alert('成功', 'プロンプトを削除しました', [
                  { text: 'OK', onPress: () => navigation.goBack() }
                ]);
              }
            } catch (error) {
              Alert.alert('エラー', '削除に失敗しました');
            }
          }
        }
      ]
    );
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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

  if (!prompt) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>プロンプトが見つかりません</Text>
        </View>
      </SafeAreaView>
    );
  }

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
        <Text style={styles.headerTitle}>プロンプト詳細</Text>
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEdit}
        >
          <Text style={styles.editIcon}>✎</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Title and Meta */}
          <Card style={styles.headerCard} variant="glass">
            <View style={styles.titleRow}>
              <Text style={styles.title}>{prompt.title}</Text>
              <TouchableOpacity
                style={styles.favoriteButton}
                onPress={handleToggleFavorite}
              >
                <Text style={[styles.favoriteIcon, prompt.isFavorite && styles.favoriteActive]}>
                  {prompt.isFavorite ? '♥' : '♡'}
                </Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.metaRow}>
              {category && (
                <View style={styles.categoryTag}>
                  <View style={[styles.categoryIcon, { backgroundColor: category.color }]}>
                    <Text style={styles.categoryIconText}>{category.icon || '📁'}</Text>
                  </View>
                  <Text style={styles.categoryName}>{category.name}</Text>
                </View>
              )}
              <Text style={styles.dateText}>{formatDate(prompt.createdAt)}</Text>
            </View>

            {prompt.tags && prompt.tags.length > 0 && (
              <View style={styles.tagsContainer}>
                {prompt.tags.map((tag, index) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>{tag}</Text>
                  </View>
                ))}
              </View>
            )}
          </Card>

          {/* Content */}
          <Card style={styles.contentCard} variant="glass">
            <Text style={styles.contentLabel}>プロンプト内容</Text>
            <Text style={styles.contentText}>{prompt.content}</Text>
          </Card>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <Button
              title="コピー"
              onPress={handleCopy}
              variant="primary"
              style={styles.actionButton}
            />
            <Button
              title="シェア"
              onPress={handleShare}
              variant="secondary"
              style={styles.actionButton}
            />
          </View>

          {/* Danger Zone */}
          <Card style={styles.dangerCard}>
            <Text style={styles.dangerTitle}>危険な操作</Text>
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleDelete}
            >
              <Text style={styles.dangerButtonText}>プロンプトを削除</Text>
            </TouchableOpacity>
          </Card>
        </View>
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
  editButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1DB584',
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIcon: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
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
  headerCard: {
    marginBottom: 20,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
    fontFamily: '-apple-system',
  },
  favoriteButton: {
    padding: 4,
  },
  favoriteIcon: {
    fontSize: 24,
    color: '#D1D5DB',
  },
  favoriteActive: {
    color: '#EF4444',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  categoryTag: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  categoryIconText: {
    fontSize: 12,
  },
  categoryName: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  dateText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#E5F3FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    fontSize: 12,
    color: '#1E40AF',
    fontWeight: '500',
  },
  contentCard: {
    marginBottom: 20,
  },
  contentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    fontFamily: '-apple-system',
  },
  contentText: {
    fontSize: 15,
    color: '#374151',
    lineHeight: 24,
    fontFamily: '-apple-system',
  },
  actionButtons: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  dangerCard: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)',
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#EF4444',
    marginBottom: 12,
    fontFamily: '-apple-system',
  },
  dangerButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
  },
  dangerButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: '-apple-system',
  },
});

export default PromptDetailScreen;