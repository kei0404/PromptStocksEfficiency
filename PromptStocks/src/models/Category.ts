export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon?: string;
  createdAt: Date;
  updatedAt: Date;
  promptCount: number;
  totalSize: number; // Total storage size of prompts in this category
}

export interface CategoryStats {
  categoryId: string;
  promptCount: number;
  totalSize: number;
  averagePromptSize: number;
  lastModified: Date;
  usageFrequency: number;
}

export const DEFAULT_CATEGORIES: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'promptCount' | 'totalSize'>[] = [
  {
    name: '作業効率',
    description: 'タスク管理・効率化',
    color: '#1DB584',
    icon: '🎯'
  },
  {
    name: '文章作成',
    description: 'コンテンツ制作・編集',
    color: '#3B82F6',
    icon: '✍️'
  },
  {
    name: 'データ分析',
    description: '洞察・調査・レポート',
    color: '#8B5CF6',
    icon: '📊'
  },
  {
    name: 'コミュニケーション',
    description: 'メール・会話・交渉',
    color: '#EC4899',
    icon: '💬'
  },
  {
    name: 'クリエイティブ',
    description: 'デザイン・アート・創作',
    color: '#F59E0B',
    icon: '🎨'
  },
  {
    name: 'その他',
    description: '未分類のプロンプト',
    color: '#6B7280',
    icon: '📁'
  }
];