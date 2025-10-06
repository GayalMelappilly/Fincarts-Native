import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View, Text, TextInput } from "react-native";

interface FormInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  multiline?: boolean;
  required?: boolean;
  error?: string;
  leftIcon?: string;
}

export const FormInput: React.FC<FormInputProps> = React.memo(({
  label,
  value,
  onChangeText,
  placeholder,
  keyboardType = 'default',
  multiline = false,
  required = false,
  error,
  leftIcon
}) => (
  <View className="mb-4">
    <Text className="text-sm font-semibold text-gray-700 mb-2">
      {label}{required && <Text className="text-red-500 ml-1">*</Text>}
    </Text>
    <View className="relative">
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        className={`bg-gray-50 border rounded-2xl px-4 py-4 text-gray-900 text-base ${leftIcon ? 'pl-12' : ''
          } ${error ? 'border-red-300' : 'border-gray-200'} ${multiline ? 'h-24 text-top' : 'h-14'
          }`}
        placeholderTextColor="#9CA3AF"
        autoCorrect={false}
        autoCapitalize="none"
      />
      {leftIcon && (
        <View className="absolute left-4 top-4">
          <Ionicons name={leftIcon as any} size={20} color="#6B7280" />
        </View>
      )}
    </View>
    {error && (
      <Text className="text-red-500 text-xs mt-1 ml-1">{error}</Text>
    )}
  </View>
));