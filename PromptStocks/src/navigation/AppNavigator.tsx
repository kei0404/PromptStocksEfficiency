import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

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
    <NavigationContainer>
      <StatusBar style="dark" backgroundColor="#F8F9FA" />
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          gestureEnabled: true,
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
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Categories" component={CategoriesScreen} />
        <Stack.Screen 
          name="CreatePrompt" 
          component={CreatePromptScreen}
          options={{
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
            presentation: 'modal',
          }}
        />
        <Stack.Screen 
          name="PromptList" 
          component={PromptListScreen}
        />
        <Stack.Screen name="PromptDetail" component={PromptDetailScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
        <Stack.Screen 
          name="Search" 
          component={SearchScreen}
          options={{
            presentation: 'modal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;