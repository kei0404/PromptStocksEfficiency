import React, { useState } from 'react';
import {
  TextInput,
  Text,
  View,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  Platform,
} from 'react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  variant?: 'default' | 'glass';
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  errorStyle?: TextStyle;
  required?: boolean;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  variant = 'default',
  containerStyle,
  labelStyle,
  errorStyle,
  required = false,
  style,
  onFocus,
  onBlur,
  ...props
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = (e: any) => {
    setIsFocused(true);
    onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    onBlur?.(e);
  };

  const getInputStyle = (): any => {
    const baseStyle: any = {
      borderRadius: 16,
      paddingHorizontal: 16,
      paddingVertical: 12,
      fontSize: 16,
      fontFamily: '-apple-system',
      minHeight: 48,
    };

    if (variant === 'glass') {
      baseStyle.backgroundColor = 'rgba(255, 255, 255, 0.9)';
      if (Platform.OS === 'ios') {
        baseStyle.shadowColor = '#000';
        baseStyle.shadowOffset = { width: 0, height: 2 };
        baseStyle.shadowOpacity = 0.1;
        baseStyle.shadowRadius = 8;
      } else {
        baseStyle.elevation = 4;
      }
      baseStyle.borderWidth = 1;
      baseStyle.borderColor = isFocused ? '#1DB584' : 'rgba(255, 255, 255, 0.2)';
    } else {
      baseStyle.backgroundColor = '#F8F9FA';
      baseStyle.borderWidth = 2;
      baseStyle.borderColor = error ? '#EF4444' : isFocused ? '#1DB584' : '#E5E7EB';
    }

    if (isFocused && Platform.OS === 'ios') {
      baseStyle.transform = [{ translateY: -2 }];
      if (variant === 'glass') {
        baseStyle.shadowOpacity = 0.15;
        baseStyle.shadowRadius = 12;
      }
    }

    return baseStyle;
  };

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, labelStyle]}>
          {label}
          {required && <Text style={styles.required}> *</Text>}
        </Text>
      )}
      <TextInput
        style={[getInputStyle(), style]}
        onFocus={handleFocus}
        onBlur={handleBlur}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {error && (
        <Text style={[styles.error, errorStyle]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
    fontFamily: '-apple-system',
  },
  required: {
    color: '#EF4444',
  },
  error: {
    fontSize: 12,
    color: '#EF4444',
    marginTop: 4,
    fontFamily: '-apple-system',
  },
});

export default Input;