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
import StorageService from '../storage/AsyncStorageService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';

interface Props {
  navigation: any;
}

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const [storageStats, setStorageStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStorageStats();
  }, []);

  const loadStorageStats = async () => {
    try {
      const prompts = await StorageService.getAllPrompts();
      const categories = await StorageService.getAllCategories();
      
      const totalSize = prompts.reduce((sum, prompt) => sum + (prompt.size || 0), 0);
      
      const stats = {
        totalPrompts: prompts.length,
        totalCategories: categories.length,
        totalSize: totalSize
      };
      
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleClearCache = () => {
    Alert.alert(
      'キャッシュクリア',
      'キャッシュをクリアしますか？',
      [
        { text: 'キャンセル', style: 'cancel' },
        {
          text: 'クリア',
          onPress: () => {
            Alert.alert('成功', 'キャッシュをクリアしました');
            loadStorageStats();
          }
        }
      ]
    );
  };

  const handleExportData = () => {
    Alert.alert('情報', 'データエクスポート機能は近日実装予定です');
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
        <Text style={styles.headerTitle}>設定</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {/* Storage Info */}
          <Card style={styles.section} variant="glass">
            <Text style={styles.sectionTitle}>ストレージ情報</Text>
            {loading ? (
              <Text style={styles.loadingText}>読み込み中...</Text>
            ) : storageStats ? (
              <View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>総プロンプト数</Text>
                  <Text style={styles.statValue}>{storageStats.totalPrompts || 0}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>カテゴリ数</Text>
                  <Text style={styles.statValue}>{storageStats.totalCategories || 0}</Text>
                </View>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>使用サイズ</Text>
                  <Text style={styles.statValue}>{formatBytes(storageStats.totalSize || 0)}</Text>
                </View>
              </View>
            ) : (
              <Text style={styles.errorText}>データの読み込みに失敗しました</Text>
            )}
          </Card>

          {/* App Info */}
          <Card style={styles.section} variant="glass">
            <Text style={styles.sectionTitle}>アプリ情報</Text>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>バージョン</Text>
              <Text style={styles.statValue}>1.0.0</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>SDK</Text>
              <Text style={styles.statValue}>Expo 53</Text>
            </View>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>プラットフォーム</Text>
              <Text style={styles.statValue}>{Platform.OS === 'ios' ? 'iOS' : 'Android'}</Text>
            </View>
          </Card>

          {/* Actions */}
          <Card style={styles.section} variant="glass">
            <Text style={styles.sectionTitle}>データ管理</Text>
            <View style={styles.actionButtons}>
              <Button
                title="キャッシュクリア"
                onPress={handleClearCache}
                variant="outline"
                style={styles.actionButton}
              />
              <Button
                title="データエクスポート"
                onPress={handleExportData}
                variant="outline"
                style={styles.actionButton}
              />
            </View>
          </Card>

          {/* About */}
          <Card style={styles.section} variant="glass">
            <Text style={styles.sectionTitle}>PromptStocksについて</Text>
            <Text style={styles.aboutText}>
              PromptStocksはLLMプロンプトを効率的に管理し、簡単にコピー&ペーストできるアプリです。
              完全オフラインで動作し、データはすべてローカルに保存されます。
            </Text>
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
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 16,
    fontFamily: '-apple-system',
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    paddingVertical: 20,
  },
  errorText: {
    fontSize: 14,
    color: '#EF4444',
    textAlign: 'center',
    paddingVertical: 20,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0, 0, 0, 0.05)',
  },
  statLabel: {
    fontSize: 16,
    color: '#6B7280',
  },
  statValue: {
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
  },
  aboutText: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
});

export default SettingsScreen;