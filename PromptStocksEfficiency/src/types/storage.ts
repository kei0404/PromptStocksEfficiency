export interface StorageMetrics {
  totalSize: number;
  usedSize: number;
  availableSize: number;
  promptCount: number;
  categoryCount: number;
  largestPromptSize: number;
  averagePromptSize: number;
}

export interface BackupData {
  version: string;
  exportedAt: Date;
  prompts: any[];
  categories: any[];
  settings: any;
  metadata: {
    totalSize: number;
    promptCount: number;
    categoryCount: number;
  };
}

export interface StorageConfig {
  maxStorageSize: number; // in bytes
  warningThreshold: number; // percentage
  cleanupThreshold: number; // percentage
  autoCleanup: boolean;
  compressionEnabled: boolean;
}

export interface CacheItem<T = any> {
  key: string;
  data: T;
  timestamp: number;
  expiresAt?: number;
  size: number;
}

export interface SyncState {
  lastSync: Date;
  syncInProgress: boolean;
  conflictCount: number;
  pendingChanges: number;
}