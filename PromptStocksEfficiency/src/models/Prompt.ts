export interface Prompt {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
  lastUsedAt: Date;
  lastAccessed?: Date;
  effectivenessRating?: number;
  isFavorite: boolean;
  isArchived: boolean;
  templateId?: string;
  size?: number;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  structure: string;
  placeholders: string[];
  description: string;
  usageCount?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageStats {
  promptId: string;
  usageCount: number;
  lastUsed: Date;
  effectivenessRating: number;
  averageRating: number;
}

export interface SearchFilters {
  category?: string;
  tags?: string[];
  isFavorite?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
  usageThreshold?: number;
}

export interface SearchResult {
  prompt: Prompt;
  relevanceScore: number;
  matchedFields: string[];
  highlightedContent: string;
}