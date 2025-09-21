import { Category, CategoryStats, DEFAULT_CATEGORIES } from '../models/Category';
import StorageService from '../storage/AsyncStorageService';
import { generateUUID } from '../utils/uuid';

class CategoryManager {
  async initializeDefaultCategories(): Promise<void> {
    const existingCategories = await StorageService.getAllCategories();
    
    if (existingCategories.length === 0) {
      for (const category of DEFAULT_CATEGORIES) {
        await StorageService.saveCategory(category);
      }
    }
  }

  async forceUpdateCategories(): Promise<void> {
    // Clear existing categories and reinitialize with latest DEFAULT_CATEGORIES
    try {
      // Clear the categories cache and storage
      await StorageService.deleteData('categories:all');
      
      // Save all default categories
      for (const category of DEFAULT_CATEGORIES) {
        await StorageService.saveCategory(category);
      }
      
      console.log('Categories forcefully updated to latest version');
    } catch (error) {
      console.error('Failed to force update categories:', error);
      throw error;
    }
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'promptCount'>): Promise<Category> {
    const now = new Date();
    const category: Category = {
      id: generateUUID(),
      ...categoryData,
      createdAt: now,
      updatedAt: now,
      promptCount: 0
    };

    await StorageService.saveCategory(category);
    return category;
  }

  async updateCategory(id: string, updates: Partial<Omit<Category, 'id' | 'createdAt'>>): Promise<Category | null> {
    const existingCategories = await StorageService.getAllCategories();
    const existingCategory = existingCategories.find(cat => cat.id === id);
    
    if (!existingCategory) return null;

    const updatedCategory: Category = {
      ...existingCategory,
      ...updates,
      updatedAt: new Date()
    };

    await StorageService.saveCategory(updatedCategory);
    return updatedCategory;
  }

  async deleteCategory(id: string): Promise<boolean> {
    // Check if category has prompts
    const prompts = await StorageService.getPromptsByCategory(id);
    
    if (prompts.length > 0) {
      // Move prompts to translation category as fallback
      const fallbackCategory = await this.getCategoryById('translation');
      if (fallbackCategory) {
        // Move all prompts to fallback category
        const { default: PromptManager } = require('./PromptManager');
        for (const prompt of prompts) {
          await PromptManager.updatePrompt(prompt.id, { category: fallbackCategory.id });
        }
      } else {
        throw new Error('Cannot delete category with prompts');
      }
    }

    // Delete the category (would need to implement in StorageService)
    // For now, we'll just return false if it has prompts
    return prompts.length === 0;
  }

  async getCategory(id: string): Promise<Category | null> {
    const categories = await StorageService.getAllCategories();
    return categories.find(cat => cat.id === id) || null;
  }

  async getAllCategories(): Promise<Category[]> {
    return await StorageService.getAllCategories();
  }

  async getCategoryById(id: string): Promise<Category | null> {
    const categories = await StorageService.getAllCategories();
    return categories.find(category => category.id === id) || null;
  }

  async getCategoriesWithStats(): Promise<(Category & CategoryStats)[]> {
    const categories = await StorageService.getAllCategories();
    const categoriesWithStats: (Category & CategoryStats)[] = [];

    for (const category of categories) {
      const prompts = await StorageService.getPromptsByCategory(category.id);
      const totalUsage = prompts.reduce((sum, prompt) => sum + (prompt.usageCount || 0), 0);
      const lastModified = prompts.length > 0 
        ? new Date(Math.max(...prompts.map(p => p.updatedAt.getTime())))
        : category.updatedAt;
      const averageEffectiveness = prompts.length > 0 
        ? prompts.reduce((sum, p) => sum + (p.effectivenessRating || 0), 0) / prompts.length
        : 0;

      categoriesWithStats.push({
        ...category,
        categoryId: category.id,
        promptCount: prompts.length,
        totalUsage,
        lastModified,
        averageEffectiveness
      });
    }

    return categoriesWithStats;
  }

  async updateCategoryStats(categoryId: string): Promise<void> {
    const prompts = await StorageService.getPromptsByCategory(categoryId);
    
    await this.updateCategory(categoryId, {
      promptCount: prompts.length
    });
  }

  async getPopularCategories(limit: number = 5): Promise<Category[]> {
    const categoriesWithStats = await this.getCategoriesWithStats();
    
    return categoriesWithStats
      .sort((a, b) => b.totalUsage - a.totalUsage)
      .slice(0, limit);
  }

  async getCategoryByName(name: string): Promise<Category | null> {
    const categories = await StorageService.getAllCategories();
    return categories.find(cat => cat.name === name) || null;
  }

  private async getOtherCategory(): Promise<Category | null> {
    return await this.getCategoryByName('その他');
  }

  private calculateUsageFrequency(prompts: any[]): number {
    if (prompts.length === 0) return 0;
    
    const now = Date.now();
    const thirtyDaysAgo = now - (30 * 24 * 60 * 60 * 1000);
    
    const recentUsage = prompts.filter(prompt => 
      prompt.lastUsedAt.getTime() > thirtyDaysAgo
    ).reduce((sum, prompt) => sum + (prompt.usageCount || 0), 0);
    
    return recentUsage;
  }

  async searchCategories(query: string): Promise<Category[]> {
    const categories = await StorageService.getAllCategories();
    const searchTerm = query.toLowerCase();
    
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm)
    );
  }

  async getCategoryColors(): Promise<Record<string, string>> {
    const categories = await StorageService.getAllCategories();
    const colorMap: Record<string, string> = {};
    
    categories.forEach(category => {
      colorMap[category.id] = category.color;
    });
    
    return colorMap;
  }

  async validateCategoryName(name: string, excludeId?: string): Promise<boolean> {
    const categories = await StorageService.getAllCategories();
    return !categories.some(cat => 
      cat.name.toLowerCase() === name.toLowerCase() && cat.id !== excludeId
    );
  }
}

export default new CategoryManager();