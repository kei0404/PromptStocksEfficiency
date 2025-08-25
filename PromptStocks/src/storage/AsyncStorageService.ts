import AsyncStorage from '@react-native-async-storage/async-storage';
import { StorageMetrics, BackupData, CacheItem } from '../types/storage';
import { Prompt } from '../models/Prompt';
import { Category } from '../models/Category';

// ExpoGo compatible storage service using only AsyncStorage
class AsyncStorageService {
  private cache = new Map<string, CacheItem>();
  private readonly CACHE_EXPIRY = 5 * 60 * 1000; // 5 minutes

  async initialize(): Promise<void> {
    try {
      await this.cleanExpiredCache();
      console.log('AsyncStorage initialized successfully');
    } catch (error) {
      console.error('Failed to initialize AsyncStorage:', error);
      throw error;
    }
  }

  // Cache Management
  private getCacheKey(type: string, id?: string): string {
    return id ? `${type}:${id}` : type;
  }

  private setCache<T>(key: string, data: T, ttl?: number): void {
    const expiresAt = ttl ? Date.now() + ttl : Date.now() + this.CACHE_EXPIRY;
    this.cache.set(key, {
      key,
      data,
      timestamp: Date.now(),
      expiresAt,
      size: JSON.stringify(data).length
    });
  }

  private getCache<T>(key: string): T | null {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.data as T;
  }

  private cleanExpiredCache(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (item.expiresAt && now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // AsyncStorage Helpers
  async saveData(key: string, data: any): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      await AsyncStorage.setItem(key, jsonData);
      this.setCache(key, data);
    } catch (error) {
      console.error(`Failed to save data for key ${key}:`, error);
      throw error;
    }
  }

  async getData<T>(key: string): Promise<T | null> {
    try {
      // Check cache first
      const cached = this.getCache<T>(key);
      if (cached) return cached;

      const jsonData = await AsyncStorage.getItem(key);
      if (!jsonData) return null;

      const data = JSON.parse(jsonData);
      this.setCache(key, data);
      return data;
    } catch (error) {
      console.error(`Failed to get data for key ${key}:`, error);
      return null;
    }
  }

  async deleteData(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
      this.cache.delete(key);
    } catch (error) {
      console.error(`Failed to delete data for key ${key}:`, error);
      throw error;
    }
  }

  // Prompt Operations using AsyncStorage keys
  async savePrompt(prompt: Prompt): Promise<void> {
    try {
      // Save individual prompt
      await this.saveData(`prompt:${prompt.id}`, prompt);
      
      // Update prompts list
      const allPrompts = await this.getAllPrompts();
      const existingIndex = allPrompts.findIndex(p => p.id === prompt.id);
      
      if (existingIndex >= 0) {
        allPrompts[existingIndex] = prompt;
      } else {
        allPrompts.push(prompt);
      }
      
      await this.saveData('prompts:all', allPrompts);
      
      // Clear related cache
      this.cache.delete('prompts:all');
      this.cache.delete(`prompts:category:${prompt.categoryId}`);
    } catch (error) {
      console.error('Failed to save prompt:', error);
      throw error;
    }
  }

  async getPrompt(id: string): Promise<Prompt | null> {
    try {
      const cacheKey = `prompt:${id}`;
      const cached = this.getCache<Prompt>(cacheKey);
      if (cached) return cached;

      const prompt = await this.getData<Prompt>(`prompt:${id}`);
      if (prompt) {
        // Convert date strings back to Date objects
        prompt.createdAt = new Date(prompt.createdAt);
        prompt.updatedAt = new Date(prompt.updatedAt);
        prompt.lastAccessed = new Date(prompt.lastAccessed);
        
        this.setCache(cacheKey, prompt);
      }
      return prompt;
    } catch (error) {
      console.error('Failed to get prompt:', error);
      return null;
    }
  }

  async getAllPrompts(): Promise<Prompt[]> {
    try {
      const cacheKey = 'prompts:all';
      const cached = this.getCache<Prompt[]>(cacheKey);
      if (cached) return cached;

      const prompts = await this.getData<Prompt[]>('prompts:all') || [];
      
      // Convert date strings back to Date objects
      const processedPrompts = prompts.map(prompt => ({
        ...prompt,
        createdAt: new Date(prompt.createdAt),
        updatedAt: new Date(prompt.updatedAt),
        lastAccessed: new Date(prompt.lastAccessed)
      }));

      this.setCache(cacheKey, processedPrompts);
      return processedPrompts;
    } catch (error) {
      console.error('Failed to get all prompts:', error);
      return [];
    }
  }

  async getPromptsByCategory(categoryId: string): Promise<Prompt[]> {
    try {
      const cacheKey = `prompts:category:${categoryId}`;
      const cached = this.getCache<Prompt[]>(cacheKey);
      if (cached) return cached;

      const allPrompts = await this.getAllPrompts();
      const categoryPrompts = allPrompts.filter(prompt => prompt.categoryId === categoryId);

      this.setCache(cacheKey, categoryPrompts);
      return categoryPrompts;
    } catch (error) {
      console.error('Failed to get prompts by category:', error);
      return [];
    }
  }

  async deletePrompt(id: string): Promise<void> {
    try {
      // Delete individual prompt
      await this.deleteData(`prompt:${id}`);
      
      // Update prompts list
      const allPrompts = await this.getAllPrompts();
      const updatedPrompts = allPrompts.filter(p => p.id !== id);
      await this.saveData('prompts:all', updatedPrompts);
      
      // Clear cache
      this.cache.delete(`prompt:${id}`);
      this.cache.delete('prompts:all');
    } catch (error) {
      console.error('Failed to delete prompt:', error);
      throw error;
    }
  }

  // Category Operations
  async saveCategory(category: Category): Promise<void> {
    try {
      // Save individual category
      await this.saveData(`category:${category.id}`, category);
      
      // Update categories list
      const allCategories = await this.getAllCategories();
      const existingIndex = allCategories.findIndex(c => c.id === category.id);
      
      if (existingIndex >= 0) {
        allCategories[existingIndex] = category;
      } else {
        allCategories.push(category);
      }
      
      await this.saveData('categories:all', allCategories);
      this.cache.delete('categories:all');
    } catch (error) {
      console.error('Failed to save category:', error);
      throw error;
    }
  }

  async getAllCategories(): Promise<Category[]> {
    try {
      const cacheKey = 'categories:all';
      const cached = this.getCache<Category[]>(cacheKey);
      if (cached) return cached;

      const categories = await this.getData<Category[]>('categories:all') || [];
      
      // Convert date strings back to Date objects
      const processedCategories = categories.map(category => ({
        ...category,
        createdAt: new Date(category.createdAt),
        updatedAt: new Date(category.updatedAt)
      }));

      this.setCache(cacheKey, processedCategories);
      return processedCategories;
    } catch (error) {
      console.error('Failed to get all categories:', error);
      return [];
    }
  }

  // Storage Metrics (simplified for AsyncStorage)
  async getStorageMetrics(): Promise<StorageMetrics> {
    try {
      const allPrompts = await this.getAllPrompts();
      const allCategories = await this.getAllCategories();
      
      const totalSize = allPrompts.reduce((sum, prompt) => sum + (prompt.size || 0), 0);
      const maxSize = allPrompts.reduce((max, prompt) => Math.max(max, prompt.size || 0), 0);
      const avgSize = allPrompts.length > 0 ? totalSize / allPrompts.length : 0;
      
      const maxStorageSize = 50 * 1024 * 1024; // 50MB limit for ExpoGo

      return {
        totalSize: maxStorageSize,
        usedSize: totalSize,
        availableSize: maxStorageSize - totalSize,
        promptCount: allPrompts.length,
        categoryCount: allCategories.length,
        largestPromptSize: maxSize,
        averagePromptSize: avgSize
      };
    } catch (error) {
      console.error('Failed to get storage metrics:', error);
      return {
        totalSize: 0,
        usedSize: 0,
        availableSize: 0,
        promptCount: 0,
        categoryCount: 0,
        largestPromptSize: 0,
        averagePromptSize: 0
      };
    }
  }

  // Backup and Restore
  async createBackup(): Promise<BackupData> {
    try {
      const prompts = await this.getAllPrompts();
      const categories = await this.getAllCategories();
      const settings = await this.getData('app_settings') || {};

      return {
        version: '1.0.0',
        exportedAt: new Date(),
        prompts,
        categories,
        settings,
        metadata: {
          totalSize: prompts.reduce((sum, p) => sum + (p.size || 0), 0),
          promptCount: prompts.length,
          categoryCount: categories.length
        }
      };
    } catch (error) {
      console.error('Failed to create backup:', error);
      throw error;
    }
  }

  async restoreBackup(backup: BackupData): Promise<void> {
    try {
      // Clear existing data
      await this.deleteData('prompts:all');
      await this.deleteData('categories:all');

      // Restore categories
      for (const category of backup.categories) {
        await this.saveCategory(category);
      }

      // Restore prompts
      for (const prompt of backup.prompts) {
        await this.savePrompt(prompt);
      }

      // Restore settings
      await this.saveData('app_settings', backup.settings);

      // Clear all cache
      this.cache.clear();
    } catch (error) {
      console.error('Failed to restore backup:', error);
      throw error;
    }
  }
}

export default new AsyncStorageService();