import { Category, CategoryStats, DEFAULT_CATEGORIES } from '../models/Category';
import StorageService from '../storage/AsyncStorageService';
import { generateUUID } from '../utils/uuid';

class CategoryManager {
  async initializeDefaultCategories(): Promise<void> {
    const existingCategories = await StorageService.getAllCategories();
    
    if (existingCategories.length === 0) {
      const now = new Date();
      
      for (const categoryData of DEFAULT_CATEGORIES) {
        const category: Category = {
          id: generateUUID(),
          ...categoryData,
          createdAt: now,
          updatedAt: now,
          promptCount: 0,
          totalSize: 0
        };
        
        await StorageService.saveCategory(category);
      }
    }
  }

  async createCategory(categoryData: Omit<Category, 'id' | 'createdAt' | 'updatedAt' | 'promptCount' | 'totalSize'>): Promise<Category> {
    const now = new Date();
    const category: Category = {
      id: generateUUID(),
      ...categoryData,
      createdAt: now,
      updatedAt: now,
      promptCount: 0,
      totalSize: 0
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
      // Move prompts to "その他" category or prevent deletion
      const otherCategory = await this.getOtherCategory();
      if (otherCategory) {
        // Move all prompts to "その他" category
        const { default: PromptManager } = require('./PromptManager');
        for (const prompt of prompts) {
          await PromptManager.updatePrompt(prompt.id, { categoryId: otherCategory.id });
        }
      } else {
        throw new Error('Cannot delete category with prompts and no "その他" category exists');
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
      const totalSize = prompts.reduce((sum, prompt) => sum + prompt.size, 0);
      const averagePromptSize = prompts.length > 0 ? totalSize / prompts.length : 0;
      const lastModified = prompts.length > 0 
        ? new Date(Math.max(...prompts.map(p => p.updatedAt.getTime())))
        : category.updatedAt;

      categoriesWithStats.push({
        ...category,
        categoryId: category.id,
        promptCount: prompts.length,
        totalSize,
        averagePromptSize,
        lastModified,
        usageFrequency: this.calculateUsageFrequency(prompts)
      });
    }

    return categoriesWithStats;
  }

  async updateCategoryStats(categoryId: string): Promise<void> {
    const prompts = await StorageService.getPromptsByCategory(categoryId);
    const totalSize = prompts.reduce((sum, prompt) => sum + prompt.size, 0);
    
    await this.updateCategory(categoryId, {
      promptCount: prompts.length,
      totalSize
    });
  }

  async getPopularCategories(limit: number = 5): Promise<Category[]> {
    const categoriesWithStats = await this.getCategoriesWithStats();
    
    return categoriesWithStats
      .sort((a, b) => b.usageFrequency - a.usageFrequency)
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
    
    const recentAccesses = prompts.filter(prompt => 
      prompt.lastAccessed.getTime() > thirtyDaysAgo
    ).length;
    
    return recentAccesses;
  }

  async searchCategories(query: string): Promise<Category[]> {
    const categories = await StorageService.getAllCategories();
    const searchTerm = query.toLowerCase();
    
    return categories.filter(category =>
      category.name.toLowerCase().includes(searchTerm) ||
      (category.description && category.description.toLowerCase().includes(searchTerm))
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