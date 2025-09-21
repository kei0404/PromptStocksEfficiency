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

export const DEFAULT_TEMPLATES: Template[] = [
  {
    id: 'professional-email',
    name: 'Professional Email',
    category: 'email-creation',
    structure: `件名: [SUBJECT]

[RECIPIENT_NAME]様

いつもお世話になっております。[YOUR_NAME]です。

[MAIN_CONTENT]

ご確認のほど、よろしくお願いいたします。

[YOUR_NAME]`,
    placeholders: ['SUBJECT', 'RECIPIENT_NAME', 'YOUR_NAME', 'MAIN_CONTENT'],
    description: 'ビジネスメール用の基本テンプレート',
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'meeting-minutes-summary',
    name: 'Meeting Minutes Summary',
    category: 'meeting-summary',
    structure: `以下の議事録を要約してください：

議事録内容：
[MEETING_CONTENT]

要約形式：
- 主要議題
- 決定事項
- 次回までのアクションアイテム
- 参加者：[PARTICIPANTS]`,
    placeholders: ['MEETING_CONTENT', 'PARTICIPANTS'],
    description: '議事録要約用テンプレート',
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'document-summary',
    name: 'Document Summary',
    category: 'document-summary',
    structure: `以下の文書を[SUMMARY_LENGTH]で要約してください：

文書内容：
[DOCUMENT_CONTENT]

要約のポイント：
- [KEY_POINTS]

対象読者：[TARGET_AUDIENCE]`,
    placeholders: ['SUMMARY_LENGTH', 'DOCUMENT_CONTENT', 'KEY_POINTS', 'TARGET_AUDIENCE'],
    description: '文書要約用テンプレート',
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'sns-content-planning',
    name: 'SNS Content Planning',
    category: 'sns-planning',
    structure: `[PLATFORM]用のコンテンツを作成してください：

テーマ：[THEME]
ターゲット：[TARGET_AUDIENCE]
投稿目的：[PURPOSE]
トーン：[TONE]

要求事項：
- 文字数制限：[CHARACTER_LIMIT]
- ハッシュタグ：[HASHTAGS]
- 投稿時期：[TIMING]`,
    placeholders: ['PLATFORM', 'THEME', 'TARGET_AUDIENCE', 'PURPOSE', 'TONE', 'CHARACTER_LIMIT', 'HASHTAGS', 'TIMING'],
    description: 'SNS企画生成用テンプレート',
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'data-analysis',
    name: 'Data Analysis',
    category: 'data-aggregation',
    structure: `以下のデータを分析してください：

データ：
[DATA_CONTENT]

分析観点：
- [ANALYSIS_POINTS]

出力形式：
- 概要
- 主要な傾向
- 注目すべき点
- 推奨アクション

対象期間：[TIME_PERIOD]`,
    placeholders: ['DATA_CONTENT', 'ANALYSIS_POINTS', 'TIME_PERIOD'],
    description: 'データ集計・分析用テンプレート',
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: 'translation-request',
    name: 'Translation Request',
    category: 'translation',
    structure: `以下のテキストを[SOURCE_LANGUAGE]から[TARGET_LANGUAGE]に翻訳してください：

翻訳対象：
[TEXT_TO_TRANSLATE]

翻訳の要求事項：
- スタイル：[STYLE] (フォーマル/カジュアル/技術的など)
- 読者：[TARGET_READER]
- 特記事項：[SPECIAL_NOTES]`,
    placeholders: ['SOURCE_LANGUAGE', 'TARGET_LANGUAGE', 'TEXT_TO_TRANSLATE', 'STYLE', 'TARGET_READER', 'SPECIAL_NOTES'],
    description: '翻訳リクエスト用テンプレート',
    usageCount: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

export const getTemplatesByCategory = (category: string): Template[] => {
  return DEFAULT_TEMPLATES.filter(template => template.category === category);
};

export const getTemplateById = (id: string): Template | undefined => {
  return DEFAULT_TEMPLATES.find(template => template.id === id);
};

export const getAllTemplates = (): Template[] => {
  return DEFAULT_TEMPLATES;
};