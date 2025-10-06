import { Text } from "react-native";
import { TouchableOpacity, View } from "react-native";

interface QuickActionProps {
    icon: React.ReactNode;
    label: string;
    onPress: () => void;
    color: string;
    bgColor: string;
}

export const QuickAction: React.FC<QuickActionProps> = ({ icon, label, onPress, color, bgColor }) => (
    <TouchableOpacity
        onPress={onPress}
        className={`${bgColor} rounded-2xl p-4 items-center justify-center shadow-sm border border-gray-100`}
        style={{ minHeight: 80, flex: 1, marginHorizontal: 4 }}
    >
        <View className="mb-2">{icon}</View>
        <Text className={`${color} font-semibold text-xs text-center`} numberOfLines={2}>
            {label}
        </Text>
    </TouchableOpacity>
);