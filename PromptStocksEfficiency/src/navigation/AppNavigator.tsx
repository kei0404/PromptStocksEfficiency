import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { BlueTheme } from '../styles/theme';

// Import screens
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import CreatePromptScreen from '../screens/CreatePromptScreen';
import EditPromptScreen from '../screens/EditPromptScreen';
import PromptListScreen from '../screens/PromptListScreen';
import PromptDetailScreen from '../screens/PromptDetailScreen';
import SettingsScreen from '../screens/SettingsScreen';
import CategoryDetailScreen from '../screens/CategoryDetailScreen';
import SearchScreen from '../screens/SearchScreen';

const Stack = createStackNavigator();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer
      theme={{
        dark: false,
        colors: {
          primary: BlueTheme.primary[500],
          background: BlueTheme.neutral[50],
          card: BlueTheme.neutral[50],
          text: BlueTheme.neutral[800],
          border: BlueTheme.primary[100],
          notification: BlueTheme.semantic.info,
        },
      }}
    >
      <StatusBar style="dark" backgroundColor={BlueTheme.primary[50]} />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: true,
          gestureEnabled: true,
          headerStyle: {
            backgroundColor: BlueTheme.primary[50],
            borderBottomWidth: 1,
            borderBottomColor: BlueTheme.primary[100],
          },
          headerTintColor: BlueTheme.primary[700],
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
            color: BlueTheme.primary[800],
          },
          cardStyleInterpolator: ({ current, layouts }) => {
            return {
              cardStyle: {
                transform: [
                  {
                    translateX: current.progress.interpolate({
                      inputRange: [0, 1],
                      outputRange: [layouts.screen.width, 0],
                    }),
                  },
                ],
              },
            };
          },
        }}
      >
        <Stack.Screen 
          name="Splash" 
          component={SplashScreen} 
          options={{ headerShown: false }}
        />
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'プロンプト管理',
            headerShown: false 
          }}
        />
        <Stack.Screen 
          name="Categories" 
          component={CategoriesScreen}
          options={{ title: 'カテゴリ一覧' }}
        />
        <Stack.Screen 
          name="CreatePrompt" 
          component={CreatePromptScreen}
          options={{
            title: '新規プロンプト作成',
            presentation: 'modal',
            cardStyleInterpolator: ({ current, layouts }) => {
              return {
                cardStyle: {
                  transform: [
                    {
                      translateY: current.progress.interpolate({
                        inputRange: [0, 1],
                        outputRange: [layouts.screen.height, 0],
                      }),
                    },
                  ],
                },
              };
            },
          }}
        />
        <Stack.Screen 
          name="EditPrompt" 
          component={EditPromptScreen}
          options={{
            title: 'プロンプト編集',
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="PromptList" 
          component={PromptListScreen}
          options={{ title: 'プロンプト一覧' }}
        />
        <Stack.Screen 
          name="PromptDetail" 
          component={PromptDetailScreen}
          options={{ title: 'プロンプト詳細' }}
        />
        <Stack.Screen 
          name="Settings" 
          component={SettingsScreen}
          options={{ title: '設定' }}
        />
        <Stack.Screen 
          name="CategoryDetail" 
          component={CategoryDetailScreen}
          options={{ title: 'カテゴリ詳細' }}
        />
        <Stack.Screen 
          name="Search" 
          component={SearchScreen}
          options={{
            title: 'プロンプト検索',
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;