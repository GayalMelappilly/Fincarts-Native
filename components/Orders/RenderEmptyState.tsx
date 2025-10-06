import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export const renderEmptyState = (activeTab: string) => (
    <View style={{
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 80,
        paddingHorizontal: 40
    }}>
        <View style={{
            backgroundColor: '#F3F4F6',
            width: 80,
            height: 80,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20
        }}>
            <Ionicons name="receipt-outline" size={40} color="#9CA3AF" />
        </View>
        <Text style={{ fontSize: 20, fontWeight: '600', color: '#374151', marginBottom: 8 }}>
            No {activeTab} orders
        </Text>
        <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 }}>
            When you have {activeTab} orders, they'll appear here.
        </Text>
    </View>
);