import { Text, View } from "react-native";

export const BusinessStatusBadge: React.FC<{ status: string }> = ({ status }) => {
    const getStatusConfig = (status: string) => {
        switch (status.toUpperCase()) {
            case 'ACTIVE':
                return { bg: 'bg-green-100', text: 'text-green-700', dot: 'bg-green-500', label: 'Active' };
            case 'PENDING':
                return { bg: 'bg-amber-100', text: 'text-amber-700', dot: 'bg-amber-500', label: 'Under Review' };
            case 'SUSPENDED':
                return { bg: 'bg-red-100', text: 'text-red-700', dot: 'bg-red-500', label: 'Suspended' };
            default:
                return { bg: 'bg-gray-100', text: 'text-gray-700', dot: 'bg-gray-500', label: status };
        }
    };

    const config = getStatusConfig(status);

    return (
        <View className={`flex-row items-center ${config.bg} px-4 py-2 rounded-full shadow-sm`}>
            <View className={`w-2 h-2 rounded-full ${config.dot} mr-2`} />
            <Text className={`${config.text} font-semibold text-sm`}>{config.label}</Text>
        </View>
    );
};