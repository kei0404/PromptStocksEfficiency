import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native';
import PromptManager from '../services/PromptManager';
import { Prompt } from '../models/Prompt';
import Input from '../components/ui/Input';
import Card from '../components/ui/Card';

interface Props {
  navigation: any;
  route: any;
}

const SearchScreen: React.FC<Props> = ({ navigation, route }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    // Initialize with query from route params if provided
    if (route.params?.initialQuery) {
      setSearchQuery(route.params.initialQuery);
      handleSearch(route.params.initialQuery);
    }
  }, [route.params]);

  const handleSearch = async (query?: string) => {
    const searchTerm = query || searchQuery;
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const results = await PromptManager.searchPrompts(searchTerm.trim());
      setSearchResults(results);
      
      // Add to recent searches
      setRecentSearches(prev => {
        const updated = [searchTerm, ...prev.filter(s => s !== searchTerm)].slice(0, 5);
        return updated;
      });
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePromptPress = (promptId: string) => {
    navigation.navigate('PromptDetail', { promptId });
  };

  const handleRecentSearchPress = (query: string) => {
    setSearchQuery(query);
    handleSearch(query);
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
        <Text style={styles.headerTitle}>検索</Text>
        <View style={styles.placeholder} />
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="プロンプトを検索..."
          variant="glass"
          onSubmitEditing={() => handleSearch()}
          returnKeyType="search"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.searchButton}
            onPress={() => handleSearch()}
          >
            <Text style={styles.searchButtonText}>検索</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>検索中...</Text>
          </View>
        ) : searchResults.length > 0 ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsTitle}>
              検索結果 ({searchResults.length}件)
            </Text>
            {searchResults.map((prompt) => (
              <Card
                key={prompt.id}
                style={styles.promptCard}
                onPress={() => handlePromptPress(prompt.id)}
                variant="glass"
              >
                <View style={styles.promptHeader}>
                  <Text style={styles.promptTitle}>{prompt.title}</Text>
                  {prompt.isFavorite && (
                    <Text style={styles.favoriteIcon}>♥</Text>
                  )}
                </View>
                <Text style={styles.promptPreview}>
                  {prompt.content.length > 100
                    ? prompt.content.substring(0, 100) + '...'
                    : prompt.content
                  }
                </Text>
                {prompt.tags && prompt.tags.length > 0 && (
                  <View style={styles.tagsContainer}>
                    {prompt.tags.slice(0, 3).map((tag, index) => (
                      <View key={index} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </Card>
            ))}
          </View>
        ) : searchQuery && !loading ? (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsTitle}>結果が見つかりません</Text>
            <Text style={styles.noResultsSubtitle}>
              「{searchQuery}」に一致するプロンプトが見つかりませんでした。
            </Text>
          </View>
        ) : (
          <View style={styles.initialContainer}>
            {recentSearches.length > 0 && (
              <View style={styles.recentSearches}>
                <Text style={styles.recentTitle}>最近の検索</Text>
                {recentSearches.map((query, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.recentItem}
                    onPress={() => handleRecentSearchPress(query)}
                  >
                    <Text style={styles.recentQuery}>{query}</Text>
                    <Text style={styles.recentArrow}>→</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            <View style={styles.tipsContainer}>
              <Text style={styles.tipsTitle}>検索のコツ</Text>
              <Text style={styles.tipText}>・ キーワードでタイトルや内容を検索</Text>
              <Text style={styles.tipText}>・ タグ名で絞り込み</Text>
              <Text style={styles.tipText}>・ 部分一致でも検索可能</Text>
            </View>
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
  placeholder: {
    width: 40,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  searchButton: {
    backgroundColor: '#1DB584',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    marginLeft: 12,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingTop: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  resultsContainer: {
    padding: 20,
  },
  resultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    fontFamily: '-apple-system',
  },
  promptCard: {
    marginBottom: 16,
  },
  promptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  promptTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    flex: 1,
    fontFamily: '-apple-system',
  },
  favoriteIcon: {
    fontSize: 18,
    color: '#EF4444',
    marginLeft: 8,
  },
  promptPreview: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 8,
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
  noResultsContainer: {
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 50,
  },
  noResultsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    textAlign: 'center',
  },
  noResultsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 20,
  },
  initialContainer: {
    padding: 20,
  },
  recentSearches: {
    marginBottom: 30,
  },
  recentTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    fontFamily: '-apple-system',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  recentQuery: {
    fontSize: 15,
    color: '#374151',
    flex: 1,
  },
  recentArrow: {
    fontSize: 16,
    color: '#9CA3AF',
  },
  tipsContainer: {
    backgroundColor: 'rgba(29, 181, 132, 0.1)',
    padding: 16,
    borderRadius: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
    fontFamily: '-apple-system',
  },
  tipText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
    marginBottom: 4,
  },
});

export default SearchScreen;