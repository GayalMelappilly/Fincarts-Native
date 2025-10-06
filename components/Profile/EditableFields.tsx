import { TextInput } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";

interface EditableFieldProps {
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder?: string;
    multiline?: boolean;
    keyboardType?: 'default' | 'email-address' | 'phone-pad' | 'numeric';
    maxLength?: number;
}

export const EditableField: React.FC<EditableFieldProps> = ({
    label,
    value,
    onChangeText,
    placeholder,
    multiline = false,
    keyboardType = 'default',
    maxLength,
}) => (
    <View className="mb-4">
        <Text className="text-gray-700 font-semibold mb-2 text-sm">{label}</Text>
        <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder}
            multiline={multiline}
            numberOfLines={multiline ? 4 : 1}
            keyboardType={keyboardType}
            maxLength={maxLength}
            className={`bg-gray-50 border border-gray-200 rounded-xl px-4 ${multiline ? 'py-3 min-h-[100px]' : 'py-3'
                } text-gray-900 font-medium`}
            placeholderTextColor="#9CA3AF"
            textAlignVertical={multiline ? 'top' : 'center'}
        />
        {maxLength && (
            <Text className="text-gray-400 text-xs mt-1 text-right">
                {value.length}/{maxLength}
            </Text>
        )}
    </View>
);