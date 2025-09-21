import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { BlueTheme } from '../../styles/theme';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  onPress?: () => void;
  variant?: 'default' | 'glass' | 'elevated';
  padding?: number;
  margin?: number;
  borderRadius?: number;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  onPress,
  variant = 'default',
  padding = 16,
  margin = 0,
  borderRadius = 24,
}) => {
  const getCardStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius,
      padding,
      margin,
    };

    switch (variant) {
      case 'glass':
        baseStyle.backgroundColor = BlueTheme.primary[50];
        if (Platform.OS === 'ios') {
          baseStyle.shadowColor = BlueTheme.primary[500];
          baseStyle.shadowOffset = { width: 0, height: 2 };
          baseStyle.shadowOpacity = 0.1;
          baseStyle.shadowRadius = 20;
        } else {
          baseStyle.elevation = 8;
        }
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = BlueTheme.primary[200];
        break;
      case 'elevated':
        baseStyle.backgroundColor = BlueTheme.neutral[50];
        if (Platform.OS === 'ios') {
          baseStyle.shadowColor = BlueTheme.primary[400];
          baseStyle.shadowOffset = { width: 0, height: 4 };
          baseStyle.shadowOpacity = 0.15;
          baseStyle.shadowRadius = 12;
        } else {
          baseStyle.elevation = 6;
        }
        break;
      default:
        baseStyle.backgroundColor = BlueTheme.neutral[50];
        if (Platform.OS === 'ios') {
          baseStyle.shadowColor = BlueTheme.primary[300];
          baseStyle.shadowOffset = { width: 0, height: 1 };
          baseStyle.shadowOpacity = 0.1;
          baseStyle.shadowRadius = 3;
        } else {
          baseStyle.elevation = 2;
        }
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = BlueTheme.primary[100];
    }

    return baseStyle;
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={[getCardStyle(), style]}
        onPress={onPress}
        activeOpacity={0.8}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return (
    <View style={[getCardStyle(), style]}>
      {children}
    </View>
  );
};

export default Card;