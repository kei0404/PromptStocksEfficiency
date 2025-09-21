export interface Category {
  id: string;
  name: string;
  description?: string;
  color: string;
  icon: string;
  promptCount: number;
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryStats {
  categoryId: string;
  promptCount: number;
  totalUsage: number;
  lastModified: Date;
  averageEffectiveness: number;
}

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'email-creation',
    name: 'Eメール作成',
    color: '#2196F3',
    icon: 'mail',
    promptCount: 0,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'meeting-summary',
    name: '議事録要約',
    color: '#1976D2',
    icon: 'document-text',
    promptCount: 0,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'document-summary',
    name: '文書要約',
    color: '#1565C0',
    icon: 'document',
    promptCount: 0,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'planning-creation',
    name: '企画作成',
    color: '#0D47A1',
    icon: 'lightbulb',
    promptCount: 0,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'data-aggregation',
    name: '集計',
    color: '#42A5F5',
    icon: 'bar-chart',
    promptCount: 0,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'translation',
    name: '翻訳',
    color: '#64B5F6',
    icon: 'language',
    promptCount: 0,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'information-gathering',
    name: '情報収集',
    color: '#90CAF9',
    icon: 'search',
    promptCount: 0,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'document-creation',
    name: '資料作成',
    color: '#BBDEFB',
    icon: 'create',
    promptCount: 0,
    isDefault: true,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];