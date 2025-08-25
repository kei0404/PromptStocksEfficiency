export interface Prompt {
  id: string;
  title: string;
  content: string;
  type: 'system' | 'user' | 'assistant' | 'custom';
  categoryId: string;
  templateId?: string;
  createdAt: Date;
  updatedAt: Date;
  tags?: string[];
  isFavorite: boolean;
  size: number; // Storage size in bytes
  lastAccessed: Date; // For cleanup and usage analytics
}

export interface PromptTemplate {
  id: string;
  name: string;
  description: string;
  fields: TemplateField[];
  category: string;
  preview: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TemplateField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox';
  placeholder?: string;
  options?: string[];
  required?: boolean;
  defaultValue?: string;
}

export interface PromptUsageStats {
  promptId: string;
  executionCount: number;
  lastExecuted: Date;
  averageExecutionTime: number;
  successRate: number;
}