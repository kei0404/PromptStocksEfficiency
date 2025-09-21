import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
  Splash: undefined;
  Home: undefined;
  Categories: undefined;
  CreatePrompt: {
    categoryId?: string;
    templateId?: string;
  };
  EditPrompt: {
    promptId: string;
  };
  PromptDetail: {
    promptId: string;
  };
  Settings: undefined;
  CategoryDetail: {
    categoryId: string;
  };
  Templates: undefined;
  Search: {
    initialQuery?: string;
  };
};

export type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;
export type CategoriesScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Categories'>;
export type CreatePromptScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CreatePrompt'>;
export type EditPromptScreenNavigationProp = StackNavigationProp<RootStackParamList, 'EditPrompt'>;
export type PromptDetailScreenNavigationProp = StackNavigationProp<RootStackParamList, 'PromptDetail'>;
export type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

export type CreatePromptScreenRouteProp = RouteProp<RootStackParamList, 'CreatePrompt'>;
export type EditPromptScreenRouteProp = RouteProp<RootStackParamList, 'EditPrompt'>;
export type PromptDetailScreenRouteProp = RouteProp<RootStackParamList, 'PromptDetail'>;
export type CategoryDetailScreenRouteProp = RouteProp<RootStackParamList, 'CategoryDetail'>;