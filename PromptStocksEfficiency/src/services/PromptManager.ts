import { Prompt } from '../models/Prompt';
import { Template } from '../models/Template';
import StorageService from '../storage/AsyncStorageService';
import * as Clipboard from 'expo-clipboard';
import { generateUUID } from '../utils/uuid';

class PromptManager {
  async createPrompt(promptData: Omit<Prompt, 'id' | 'createdAt' | 'updatedAt' | 'usageCount' | 'lastUsedAt'>): Promise<Prompt> {
    const now = new Date();
    const prompt: Prompt = {
      id: generateUUID(),
      ...promptData,
      createdAt: now,
      updatedAt: now,
      usageCount: 0,
      lastUsedAt: now,
      isFavorite: promptData.isFavorite || false,
      isArchived: false
    };

    await StorageService.savePrompt(prompt);
    await this.updateCategoryStats(prompt.category);
    
    return prompt;
  }

  async updatePrompt(id: string, updates: Partial<Omit<Prompt, 'id' | 'createdAt'>>): Promise<Prompt | null> {
    const existingPrompt = await StorageService.getPrompt(id);
    if (!existingPrompt) return null;

    const updatedPrompt: Prompt = {
      ...existingPrompt,
      ...updates,
      updatedAt: new Date()
    };

    await StorageService.savePrompt(updatedPrompt);
    
    // Update category stats if category changed
    if (updates.category && updates.category !== existingPrompt.category) {
      await this.updateCategoryStats(existingPrompt.category);
      await this.updateCategoryStats(updates.category);
    } else {
      await this.updateCategoryStats(updatedPrompt.category);
    }

    return updatedPrompt;
  }

  async deletePrompt(id: string): Promise<boolean> {
    const prompt = await StorageService.getPrompt(id);
    if (!prompt) return false;

    await StorageService.deletePrompt(id);
    await this.updateCategoryStats(prompt.category);
    
    return true;
  }

  async getPrompt(id: string): Promise<Prompt | null> {
    const prompt = await StorageService.getPrompt(id);
    
    // Update usage stats when accessing prompt
    if (prompt) {
      await StorageService.updatePromptUsage(id);
    }
    
    return prompt;
  }

  async getAllPrompts(): Promise<Prompt[]> {
    return await StorageService.getAllPrompts();
  }

  async getPromptsByCategory(category: string): Promise<Prompt[]> {
    return await StorageService.getPromptsByCategory(category);
  }

  async getFavoritePrompts(): Promise<Prompt[]> {
    return await StorageService.getFavoritePrompts();
  }

  async getRecentPrompts(limit: number = 10): Promise<Prompt[]> {
    return await StorageService.getRecentPrompts(limit);
  }

  async searchPrompts(query: string): Promise<Prompt[]> {
    const allPrompts = await StorageService.getAllPrompts();
    const searchTerm = query.toLowerCase();
    
    return allPrompts.filter(prompt => 
      prompt.title.toLowerCase().includes(searchTerm) ||
      prompt.content.toLowerCase().includes(searchTerm) ||
      prompt.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
    );
  }

  async copyPromptToClipboard(promptId: string): Promise<boolean> {
    try {
      const prompt = await this.getPrompt(promptId);
      if (!prompt) return false;

      await Clipboard.setStringAsync(prompt.content);
      
      // Update usage stats
      await StorageService.updatePromptUsage(promptId);
      
      return true;
    } catch (error) {
      console.error('Failed to copy prompt to clipboard:', error);
      return false;
    }
  }

  async toggleFavorite(promptId: string): Promise<boolean> {
    const prompt = await StorageService.getPrompt(promptId);
    if (!prompt) return false;

    await this.updatePrompt(promptId, { isFavorite: !prompt.isFavorite });
    return true;
  }

  async duplicatePrompt(promptId: string): Promise<Prompt | null> {
    const originalPrompt = await StorageService.getPrompt(promptId);
    if (!originalPrompt) return null;

    const duplicatedPrompt = await this.createPrompt({
      title: `${originalPrompt.title} (コピー)`,
      content: originalPrompt.content,
      category: originalPrompt.category,
      templateId: originalPrompt.templateId,
      tags: originalPrompt.tags ? [...originalPrompt.tags] : [],
      isFavorite: false,
      isArchived: false,
      effectivenessRating: originalPrompt.effectivenessRating
    });

    return duplicatedPrompt;
  }

  private async updateCategoryStats(categoryId: string): Promise<void> {
    try {
      // Skip category stats update for now to avoid circular dependency
      console.log('Category stats update skipped for:', categoryId);
    } catch (error) {
      console.error('Failed to update category stats:', error);
    }
  }

  // Template-related methods
  async getAvailableTemplates(): Promise<Template[]> {
    // Import templates from Template model
    try {
      const { getAllTemplates } = require('../models/Template');
      return getAllTemplates();
    } catch (error) {
      console.error('Failed to load templates:', error);
      return [];
    }
    
    // Legacy templates (can be removed)
    /*return [
      {
        id: 'task-analysis',
        name: 'タスク分析エンジン',
        description: 'プロジェクト管理とタスク分析のためのテンプレート',
        category: 'productivity',
        preview: 'あなたは高度なプロジェクト管理AIです。以下のタスクを分析し、タイムライン、リソース、最適化戦略を含む包括的な分析を提供してください。',
        fields: [
          {
            id: 'context',
            label: 'プロジェクトの背景',
            type: 'textarea',
            placeholder: 'プロジェクトの背景と制約を説明...'
          },
          {
            id: 'task',
            label: 'タスクの詳細',
            type: 'textarea',
            placeholder: '詳細なタスク説明...',
            required: true
          },
          {
            id: 'deadline',
            label: '期限',
            type: 'text',
            placeholder: '目標完了日'
          },
          {
            id: 'resources',
            label: '利用可能なリソース',
            type: 'textarea',
            placeholder: 'チーム、予算、ツールなど'
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'blog-writing',
        name: 'ブログコンテンツ作成',
        description: 'SEO最適化されたブログ記事作成のためのテンプレート',
        category: 'writing',
        preview: 'あなたはプロのコンテンツクリエイターです。読者に価値を提供しながら、優れた読みやすさと流れを保った、魅力的でSEO最適化されたブログ記事を書いてください。',
        fields: [
          {
            id: 'topic',
            label: 'トピック',
            type: 'text',
            placeholder: '記事のメインテーマ',
            required: true
          },
          {
            id: 'audience',
            label: 'ターゲット読者',
            type: 'text',
            placeholder: '理想的な読者は誰ですか？'
          },
          {
            id: 'keywords',
            label: 'SEOキーワード',
            type: 'text',
            placeholder: 'カンマ区切りのキーワード'
          },
          {
            id: 'length',
            label: '記事の長さ',
            type: 'select',
            options: ['短文 (500-800文字)', '中文 (800-1200文字)', '長文 (1200-2000文字)', '長文+ (2000文字以上)']
          },
          {
            id: 'tone',
            label: '文体',
            type: 'select',
            options: ['フォーマル', 'カジュアル', '技術的', 'フレンドリー', '権威的']
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: 'data-analysis',
        name: 'データ分析ハブ',
        description: 'データ分析と洞察抽出のためのテンプレート',
        category: 'analysis',
        preview: 'あなたはデータサイエンスの専門家です。提供されたデータセットを分析し、意味のある洞察、パターン、実行可能な推奨事項を抽出してください。',
        fields: [
          {
            id: 'data-type',
            label: 'データタイプ',
            type: 'select',
            options: ['売上データ', 'ユーザー行動', 'アンケート結果', '財務データ', 'その他'],
            required: true
          },
          {
            id: 'objective',
            label: '分析目標',
            type: 'textarea',
            placeholder: 'どのような洞察を求めていますか？',
            required: true
          },
          {
            id: 'period',
            label: '期間',
            type: 'text',
            placeholder: 'データ収集の期間'
          },
          {
            id: 'format',
            label: '出力形式',
            type: 'select',
            options: ['エグゼクティブサマリー', '詳細レポート', 'ビジュアルダッシュボード', 'プレゼンテーション']
          }
        ],
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];*/
  }

  async createPromptFromTemplate(templateId: string, fieldValues: Record<string, string>): Promise<string> {
    const templates = await this.getAvailableTemplates();
    const template = templates.find(t => t.id === templateId);
    
    if (!template) {
      throw new Error('Template not found');
    }

    let promptContent = template.structure + '\n\n';
    
    // Replace placeholders with field values
    for (const placeholder of template.placeholders) {
      const value = fieldValues[placeholder] || `[${placeholder}]`;
      promptContent = promptContent.replace(new RegExp(`\\[${placeholder}\\]`, 'g'), value);
    }

    return promptContent;
  }
}

export default new PromptManager();