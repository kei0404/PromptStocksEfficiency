import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';
import StorageService from './src/storage/AsyncStorageService';
import CategoryManager from './src/services/CategoryManager';

export default function App() {
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      // Initialize storage
      await StorageService.initialize();
      
      // Initialize default categories
      await CategoryManager.initializeDefaultCategories();
      
      setIsInitialized(true);
    } catch (error) {
      console.error('Failed to initialize app:', error);
      Alert.alert(
        'エラー',
        'アプリの初期化に失敗しました。再起動してください。',
        [{ text: 'OK' }]
      );
    }
  };

  if (!isInitialized) {
    // Return a loading screen component
    return null; // SplashScreen will handle the loading state
  }

  return <AppNavigator />;
}