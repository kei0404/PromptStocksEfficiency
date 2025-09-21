import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  RefreshControl,
  Alert,
  FlatList,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { Prompt } from '../models/Prompt';
import CategoryManager from '../services/CategoryManager';
import StorageService from '../storage/AsyncStorageService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { BlueTheme, Typography } from '../styles/theme';

interface Props {
  navigation: any;
}

const { width } = Dimensions.get('window');

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [recentPrompts, setRecentPrompts] = useState<Prompt[]>([]);
  const [favoritePrompts, setFavoritePrompts] = useState<Prompt[]>([]);
  const [selectedTab, setSelectedTab] = useState<'recent' | 'favorite' | 'mostUsed'>('recent');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [storageStats, setStorageStats] = useState({
    promptCount: 0,
    categoryCount: 0,
    totalSize: '0B',
    usagePercentage: 0,
  });

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const loadData = async () => {
    try {
      // Force update categories to ensure latest version is loaded
      await CategoryManager.forceUpdateCategories();
      
      const [allPrompts, recentPrompts, favoritePrompts, metrics] = await Promise.all([
        StorageService.getAllPrompts(),
        StorageService.getRecentPrompts(10),
        StorageService.getFavoritePrompts(),
        StorageService.getStorageMetrics(),
      ]);

      setPrompts(allPrompts);
      setRecentPrompts(recentPrompts);
      setFavoritePrompts(favoritePrompts);
      setStorageStats({
        promptCount: metrics.promptCount,
        categoryCount: metrics.categoryCount,
        totalSize: formatBytes(metrics.usedSize),
        usagePercentage: Math.round((metrics.usedSize / metrics.totalSize) * 100),
      });
    } catch (error) {
      console.error('Failed to load data:', error);
      Alert.alert('エラー', 'データの読み込みに失敗しました');
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadData();
    setIsRefreshing(false);
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + sizes[i];
  };

  const handlePromptPress = (promptId: string) => {
    navigation.navigate('PromptDetail', { promptId });
  };

  const handleCopyPrompt = async (promptId: string) => {
    try {
      const prompt = await StorageService.getPrompt(promptId);
      if (prompt) {
        await Clipboard.setStringAsync(prompt.content);
        await StorageService.updatePromptUsage(promptId);
        Alert.alert('成功', 'プロンプトをクリップボードにコピーしました');
        // Refresh data to reflect updated usage
        await loadData();
      }
    } catch (error) {
      console.error('Failed to copy prompt:', error);
      Alert.alert('エラー', 'コピーに失敗しました');
    }
  };

  const handleSearch = () => {
    navigation.navigate('Search', { initialQuery: searchQuery });
  };

  const getDisplayPrompts = () => {
    switch (selectedTab) {
      case 'recent':
        return recentPrompts;
      case 'favorite':
        return favoritePrompts;
      case 'mostUsed':
        return prompts.filter(p => !p.isArchived).sort((a, b) => (b.usageCount || 0) - (a.usageCount || 0)).slice(0, 10);
      default:
        return recentPrompts;
    }
  };


  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F8F9FA" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View style={styles.logoSection}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>📝</Text>
            </View>
            <View>
              <Text style={styles.appTitle}>PromptStocksEfficiency</Text>
              <Text style={styles.appSubtitle}>作業効率化プロンプト管理</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Text style={styles.headerButtonIcon}>🔍</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => navigation.navigate('Settings')}
            >
              <Text style={styles.headerButtonIcon}>⚙️</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="プロンプトを検索..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity style={styles.searchIcon} onPress={handleSearch}>
            <Text>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
      >

        {/* Storage Stats */}
        <Card style={styles.statsCard}>
          <View style={styles.statsHeader}>
            <Text style={styles.statsTitle}>ライブラリ統計</Text>
            <View style={styles.statusIndicator}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>オンライン</Text>
            </View>
          </View>
          
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{storageStats.promptCount}</Text>
              <Text style={styles.statLabel}>プロンプト</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: BlueTheme.primary[600] }]}>{storageStats.categoryCount}</Text>
              <Text style={styles.statLabel}>カテゴリ</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={[styles.statValue, { color: BlueTheme.primary[400] }]}>{storageStats.totalSize}</Text>
              <Text style={styles.statLabel}>ストレージ</Text>
            </View>
          </View>
        </Card>

        {/* Prompt Tabs */}
        <View style={styles.tabsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'recent' && styles.activeTab]}
              onPress={() => setSelectedTab('recent')}
            >
              <Text style={[styles.tabText, selectedTab === 'recent' && styles.activeTabText]}>
                最近使用
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'mostUsed' && styles.activeTab]}
              onPress={() => setSelectedTab('mostUsed')}
            >
              <Text style={[styles.tabText, selectedTab === 'mostUsed' && styles.activeTabText]}>
                よく使用
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tab, selectedTab === 'favorite' && styles.activeTab]}
              onPress={() => setSelectedTab('favorite')}
            >
              <Text style={[styles.tabText, selectedTab === 'favorite' && styles.activeTabText]}>
                お気に入り
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Prompt Cards */}
        <View style={styles.promptsContainer}>
          {getDisplayPrompts().map((prompt, index) => (
            <Card
              key={prompt.id}
              style={styles.promptCard}
              onPress={() => handlePromptPress(prompt.id)}
            >
              <View style={styles.promptHeader}>
                <View style={styles.promptMeta}>
                  <View style={[styles.categoryBadge, { backgroundColor: BlueTheme.primary[100] }]}>
                    <Text style={[styles.badgeText, { color: BlueTheme.primary[700] }]}>{prompt.category}</Text>
                  </View>
                  <Text style={styles.usageCount}>{prompt.usageCount || 0}回使用</Text>
                </View>
                <TouchableOpacity 
                  style={styles.favoriteButton}
                  onPress={async () => {
                    const updatedPrompt = { ...prompt, isFavorite: !prompt.isFavorite };
                    await StorageService.savePrompt(updatedPrompt);
                    await loadData();
                  }}
                >
                  <Text style={styles.favoriteIcon}>{prompt.isFavorite ? '⭐' : '☆'}</Text>
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
                    {prompt.lastUsedAt ? new Date(prompt.lastUsedAt).toLocaleDateString('ja-JP') : '未使用'}
                  </Text>
                </View>
                <View style={styles.promptActions}>
                  <TouchableOpacity 
                    style={styles.editButton}
                    onPress={() => navigation.navigate('EditPrompt', { promptId: prompt.id })}
                  >
                    <Text style={styles.editButtonText}>✏️</Text>
                  </TouchableOpacity>
                  <Button
                    title="コピー"
                    onPress={() => handleCopyPrompt(prompt.id)}
                    size="small"
                    variant="primary"
                  />
                </View>
              </View>
            </Card>
          ))}

          {getDisplayPrompts().length === 0 && (
            <Card style={styles.emptyCard} variant="glass">
              <View style={styles.emptyContent}>
                <Text style={styles.emptyIcon}>🚀</Text>
                <Text style={styles.emptyTitle}>最初のプロンプトを作成</Text>
                <Text style={styles.emptyDescription}>
                  インテリジェントなテンプレートと提案でAIプロンプトライブラリの構築を開始しましょう。
                </Text>
                <Button
                  title="🚀 はじめる"
                  onPress={() => navigation.navigate('CreatePrompt', {})}
                  variant="primary"
                />
              </View>
            </Card>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.bottomNav}>
        <TouchableOpacity style={[styles.navItem, styles.activeNavItem]}>
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>🏠</Text>
          </View>
          <Text style={[styles.navLabel, styles.activeNavLabel]}>ホーム</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Categories')}
        >
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>🏷️</Text>
          </View>
          <Text style={styles.navLabel}>カテゴリ</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.fabButton}
          onPress={() => navigation.navigate('CreatePrompt', {})}
        >
          <Text style={styles.fabIcon}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('PromptList')}
        >
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>✏️</Text>
          </View>
          <Text style={styles.navLabel}>編集</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.navItem}
          onPress={() => navigation.navigate('Settings')}
        >
          <View style={styles.navIcon}>
            <Text style={styles.navIconText}>⚙️</Text>
          </View>
          <Text style={styles.navLabel}>設定</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BlueTheme.neutral[50],
  },
  categoriesSection: {
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  sectionTitle: {
    ...Typography.h3,
    marginBottom: 16,
  },
  categoriesGrid: {
    gap: 12,
  },
  usageCount: {
    ...Typography.caption,
    color: BlueTheme.neutral[500],
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 24,
    backgroundColor: BlueTheme.primary[50],
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  logoSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: BlueTheme.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  logoEmoji: {
    fontSize: 24,
  },
  appTitle: {
    ...Typography.h2,
  },
  appSubtitle: {
    ...Typography.caption,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  headerButtonIcon: {
    fontSize: 18,
  },
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    backgroundColor: BlueTheme.neutral[50],
    borderRadius: 16,
    paddingHorizontal: 48,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: BlueTheme.primary[200],
    fontSize: 16,
    color: BlueTheme.neutral[800],
  },
  searchIcon: {
    position: 'absolute',
    left: 16,
    top: 12,
  },
  scrollView: {
    flex: 1,
  },
  statsCard: {
    margin: 24,
    marginBottom: 16,
  },
  statsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  statsTitle: {
    ...Typography.h3,
  },
  statusIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: BlueTheme.semantic.success,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: BlueTheme.semantic.success,
    fontWeight: '500',
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: BlueTheme.primary[600],
  },
  statLabel: {
    ...Typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: BlueTheme.primary[400],
    borderRadius: 4,
  },
  tabsContainer: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  tab: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    marginRight: 12,
    borderRadius: 20,
    backgroundColor: BlueTheme.neutral[100],
  },
  activeTab: {
    backgroundColor: BlueTheme.primary[500],
  },
  tabText: {
    ...Typography.body2,
    fontWeight: '500',
  },
  activeTabText: {
    color: BlueTheme.neutral[50],
  },
  promptsContainer: {
    paddingHorizontal: 24,
    paddingBottom: 100,
  },
  promptCard: {
    marginBottom: 16,
  },
  featuredCard: {
    borderWidth: 2,
    borderColor: '#1DB584',
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  promptMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  promptIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1DB584',
    marginRight: 12,
  },
  featuredBadge: {
    backgroundColor: 'rgba(29, 181, 132, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(29, 181, 132, 0.2)',
  },
  categoryBadge: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(139, 92, 246, 0.2)',
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1DB584',
    fontFamily: '-apple-system',
  },
  favoriteButton: {
    padding: 8,
  },
  favoriteIcon: {
    fontSize: 20,
  },
  promptContent: {
    marginBottom: 16,
  },
  promptTitle: {
    ...Typography.body1,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  promptDescription: {
    ...Typography.body2,
    lineHeight: 20,
  },
  promptFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  promptInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  promptActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
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
  promptDate: {
    ...Typography.caption,
  },
  emptyCard: {
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(29, 181, 132, 0.3)',
    borderStyle: 'dashed',
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  emptyTitle: {
    ...Typography.body1,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emptyDescription: {
    ...Typography.body2,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  bottomNav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: BlueTheme.neutral[50],
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderTopColor: BlueTheme.primary[100],
    paddingHorizontal: 16,
    paddingVertical: 16,
    paddingBottom: 32,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  navItem: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  activeNavItem: {
    backgroundColor: BlueTheme.primary[100],
    borderRadius: 16,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: BlueTheme.primary[300],
  },
  navIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  navIconText: {
    fontSize: 20,
  },
  navLabel: {
    fontSize: 10,
    color: BlueTheme.neutral[600],
    fontWeight: '500',
  },
  activeNavLabel: {
    color: BlueTheme.primary[600],
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: BlueTheme.primary[500],
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: BlueTheme.primary[500],
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabIcon: {
    fontSize: 24,
    color: BlueTheme.neutral[50],
    fontWeight: 'bold',
  },
});

export default HomeScreen;