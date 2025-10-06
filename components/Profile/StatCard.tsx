import { AntDesign } from "@expo/vector-icons";
import { Text, View } from "react-native";

interface StatCardProps {
    icon: React.ReactNode;
    value: string | number;
    label: string;
    color: string;
    bgColor: string;
    trend?: {
        value: number;
        isPositive: boolean;
    };
}

export const StatCard: React.FC<StatCardProps> = ({ icon, value, label, color, bgColor, trend }) => (
    <View className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 min-w-[140px]" style={{ marginHorizontal: 6 }}>
        <View className="flex-row items-center justify-between mb-3">
            <View className={`w-12 h-12 rounded-xl ${bgColor} items-center justify-center`}>
                {icon}
            </View>
            {trend && (
                <View className={`flex-row items-center px-2 py-1 rounded-full ${trend.isPositive ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                    <AntDesign
                        name={trend.isPositive ? 'arrowup' : 'arrowdown'}
                        size={10}
                        color={trend.isPositive ? '#059669' : '#DC2626'}
                    />
                    <Text className={`text-xs font-semibold ml-1 ${trend.isPositive ? 'text-green-700' : 'text-red-700'
                        }`}>
                        {Math.abs(trend.value)}%
                    </Text>
                </View>
            )}
        </View>
        <Text className="text-gray-900 font-bold text-xl mb-1" numberOfLines={1}>
            {value}
        </Text>
        <Text className="text-gray-600 text-sm font-medium" numberOfLines={2}>
            {label}
        </Text>
    </View>
);