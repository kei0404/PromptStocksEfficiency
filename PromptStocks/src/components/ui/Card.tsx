import React from 'react';
import {
  View,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
  Platform,
} from 'react-native';

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
        baseStyle.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        if (Platform.OS === 'ios') {
          // iOS backdrop filter equivalent using shadow and opacity
          baseStyle.shadowColor = '#000';
          baseStyle.shadowOffset = { width: 0, height: 2 };
          baseStyle.shadowOpacity = 0.1;
          baseStyle.shadowRadius = 20;
        } else {
          baseStyle.elevation = 8;
        }
        baseStyle.borderWidth = 1;
        baseStyle.borderColor = 'rgba(255, 255, 255, 0.2)';
        break;
      case 'elevated':
        baseStyle.backgroundColor = '#FFFFFF';
        if (Platform.OS === 'ios') {
          baseStyle.shadowColor = '#000';
          baseStyle.shadowOffset = { width: 0, height: 4 };
          baseStyle.shadowOpacity = 0.15;
          baseStyle.shadowRadius = 12;
        } else {
          baseStyle.elevation = 6;
        }
        break;
      default:
        baseStyle.backgroundColor = '#FFFFFF';
        if (Platform.OS === 'ios') {
          baseStyle.shadowColor = '#000';
          baseStyle.shadowOffset = { width: 0, height: 1 };
          baseStyle.shadowOpacity = 0.1;
          baseStyle.shadowRadius = 3;
        } else {
          baseStyle.elevation = 2;
        }
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