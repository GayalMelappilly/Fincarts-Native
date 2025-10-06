import { Text, View } from "react-native";

interface ProfileSectionProps {
    title: string;
    children: React.ReactNode;
    icon?: React.ReactNode;
    accent?: boolean;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ title, children, icon, accent = false }) => (
    <View className={`bg-white rounded-2xl p-6 mb-6 shadow-sm border ${accent ? 'border-blue-100' : 'border-gray-100'}`}>
        <View className="flex-row items-center mb-4">
            {icon && <View className="mr-3">{icon}</View>}
            <Text className="text-gray-900 font-bold text-xl">{title}</Text>
        </View>
        {children}
    </View>
);