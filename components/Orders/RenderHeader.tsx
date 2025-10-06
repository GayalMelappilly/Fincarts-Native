import { Order } from "@/types/Order";
import { formatCurrency } from "@/utils/formatCurrency";
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { Platform, ScrollView, StatusBar, Text, TouchableOpacity, View } from "react-native"

interface PaginationType {
    total: number;
    page: number;
    limit: number;
    pages: number;
}

interface SummaryType {
    totalRevenue: number;
    totalOrders: number;
    statusBreakdown: Record<string, number>;
}

const tabs = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'confirmed', label: 'Confirmed' },
    { key: 'processing', label: 'Processing' },
    { key: 'shipped', label: 'Shipped' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'cancelled', label: 'Cancelled' }
];


export const RenderHeader = (
    pagination: PaginationType | undefined,
    summary: SummaryType | undefined,
    activeTab: string,
    orders: Order[],
    handleTabChange: (tabKey: string) => void,
) => {
    return (
        <View>
            {/* Header Section */}
            <LinearGradient
                colors={['#6366F1', '#8B5CF6']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                    paddingTop: Platform.OS === 'ios' ? 60 : StatusBar.currentHeight ? StatusBar.currentHeight + 20 : 40,
                    paddingBottom: 30,
                    paddingHorizontal: 20,
                }}
            >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
                    <View>
                        <Text style={{ fontSize: 28, fontWeight: '800', color: '#FFFFFF', marginBottom: 4 }}>
                            Orders
                        </Text>
                        <Text style={{ fontSize: 16, color: '#E0E7FF', opacity: 0.9 }}>
                            {pagination?.total || 0} total orders
                        </Text>
                    </View>
                    <TouchableOpacity
                        style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.2)',
                            padding: 12,
                            borderRadius: 12,
                        }}
                    >
                        <Ionicons name="search" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                </View>

                {/* Stats Cards */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                    <View style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        flex: 1,
                        padding: 16,
                        borderRadius: 12,
                    }}>
                        <Text style={{ color: '#E0E7FF', fontSize: 12, marginBottom: 4 }}>Total Revenue</Text>
                        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>
                            {formatCurrency(summary?.totalRevenue || 0)}
                        </Text>
                    </View>
                    <View style={{
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        flex: 1,
                        padding: 16,
                        borderRadius: 12,
                    }}>
                        <Text style={{ color: '#E0E7FF', fontSize: 12, marginBottom: 4 }}>This Page</Text>
                        <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>
                            {orders.length} / {pagination?.limit || 10}
                        </Text>
                    </View>
                </View>
            </LinearGradient>

            {/* Tabs Section */}
            <View
                style={{
                    paddingHorizontal: 20,
                    paddingVertical: 20,
                    backgroundColor: '#F9FAFB',
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB',
                }}
            >
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ flexDirection: 'row', gap: 8 }}
                >
                    {tabs.map((tab) => (
                        <TouchableOpacity
                            key={tab.key}
                            style={{
                                paddingVertical: 12,
                                paddingHorizontal: 15,
                                borderRadius: 25,
                                backgroundColor: activeTab === tab.key ? '#6366F1' : '#FFFFFF',
                                borderWidth: 1,
                                borderColor: activeTab === tab.key ? '#6366F1' : '#E5E7EB',
                                shadowColor: activeTab === tab.key ? '#6366F1' : 'transparent',
                                shadowOffset: { width: 0, height: 2 },
                                shadowOpacity: activeTab === tab.key ? 0.2 : 0,
                                shadowRadius: 4,
                                elevation: activeTab === tab.key ? 3 : 0,
                                marginRight: 8,
                            }}
                            onPress={() => handleTabChange(tab.key)}
                            activeOpacity={0.8}
                        >
                            <Text
                                style={{
                                    color: activeTab === tab.key ? '#FFFFFF' : '#6B7280',
                                    fontWeight: activeTab === tab.key ? '600' : '500',
                                    fontSize: 14,
                                }}
                            >
                                {tab.label}
                                {summary?.statusBreakdown?.[tab.key] && (
                                    <Text> ({summary.statusBreakdown[tab.key]})</Text>
                                )}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>
            </View>

            {/* Pagination Info */}
            {pagination && (
                <View style={{
                    paddingHorizontal: 20,
                    paddingVertical: 12,
                    backgroundColor: '#FFFFFF',
                    borderBottomWidth: 1,
                    borderBottomColor: '#E5E7EB'
                }}>
                    <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center' }}>
                        Page {pagination.page} of {pagination.pages} • {pagination.total} total orders
                    </Text>
                </View>
            )}
        </View>
    )
}