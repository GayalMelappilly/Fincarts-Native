import { Text, TextInput, View } from "react-native";

type InputFieldProps = {
    label: string;
    placeholder: string;
    secureTextEntry?: boolean;
    value: string;
    onChangeText: (text: string) => void;
};

export const InputField = ({ label, placeholder, secureTextEntry = false, value, onChangeText }: InputFieldProps) => (
    <View className="mb-4">
        <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
        <TextInput
            className="bg-blue-50 rounded-lg p-3 text-base text-gray-800"
            placeholder={placeholder}
            secureTextEntry={secureTextEntry}
            value={value}
            onChangeText={onChangeText}
            placeholderTextColor="#a0aec0"
        />
    </View>
);