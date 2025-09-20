import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Platform,
  ScrollView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useQuery } from '@tanstack/react-query';
import { getOrders } from '@/services/orderServices';

interface RecentOrder {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

const { width } = Dimensions.get('window');

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [orders, setOrders] = useState<RecentOrder[]>()

  const { sellerData } = useAuth()

  const { data, isLoading, error } = useQuery({
    queryKey: ['get-orders'],
    queryFn: () => getOrders(sellerData?.id as string),
    enabled: !!sellerData?.id
  });

  useEffect(() => {
    console.log('Orders : ',data)
  }, [data])

  useEffect(() => {
    setOrders(sellerData?.recentOrders)
    console.log("Orders : ",sellerData?.recentOrders)
  }, [sellerData])

  const tabs = ['All', 'Pending', 'Shipped', 'Delivered'];

  const filteredOrders = activeTab === 'All'
    ? orders
    : orders?.filter(order => order.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { bg: '#10B981', text: '#FFFFFF' };
      case 'shipped':
        return { bg: '#3B82F6', text: '#FFFFFF' };
      case 'pending':
        return { bg: '#F59E0B', text: '#FFFFFF' };
      default:
        return { bg: '#6B7280', text: '#FFFFFF' };
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return 'checkmark-circle';
      case 'shipped':
        return 'send';
      case 'pending':
        return 'time';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toFixed(2)}`;
  };

  const renderOrderItem = ({ item }: { item: RecentOrder }) => {
    const statusColors = getStatusColor(item.status);
    const statusIcon = getStatusIcon(item.status);

    return (
      <TouchableOpacity
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          marginHorizontal: 20,
          marginVertical: 8,
          padding: 20,
          shadowColor: '#000000',
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
          borderWidth: 1,
          borderColor: '#F3F4F6',
        }}
        activeOpacity={0.7}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
              {item.orderId}
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 2 }}>
              Customer: {item.customer}
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
              {formatDate(item.date)}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 }}>
              {formatCurrency(item.amount)}
            </Text>
            <View
              style={{
                backgroundColor: statusColors.bg,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 20,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Ionicons name={statusIcon as any} size={14} color={statusColors.text} style={{ marginRight: 4 }} />
              <Text style={{ color: statusColors.text, fontSize: 12, fontWeight: '600' }}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>

        {/* Progress indicator */}
        <View style={{ height: 1, backgroundColor: '#E5E7EB', marginTop: 12 }} />
        <TouchableOpacity style={{ paddingTop: 12, alignItems: 'center' }}>
          <Text style={{ color: '#6366F1', fontSize: 14, fontWeight: '600' }}>
            View Details
          </Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
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
              {filteredOrders?.length} {filteredOrders?.length === 1 ? 'order' : 'orders'}
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
            // backdropFilter: 'blur(10px)',
          }}>
            <Text style={{ color: '#E0E7FF', fontSize: 12, marginBottom: 4 }}>Total Revenue</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>
              ₹{orders?.reduce((sum, order) => sum + order.amount, 0).toFixed(2)}
            </Text>
          </View>
          <View style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            flex: 1,
            padding: 16,
            borderRadius: 12,
          }}>
            <Text style={{ color: '#E0E7FF', fontSize: 12, marginBottom: 4 }}>Avg Order</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700' }}>
              ₹{orders && (orders.reduce((sum, order) => sum + order.amount, 0) / orders.length).toFixed(2)}
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
              key={tab}
              style={{
                paddingVertical: 12,
                paddingHorizontal: 15,
                borderRadius: 25,
                backgroundColor: activeTab === tab ? '#6366F1' : '#FFFFFF',
                borderWidth: 1,
                borderColor: activeTab === tab ? '#6366F1' : '#E5E7EB',
                shadowColor: activeTab === tab ? '#6366F1' : 'transparent',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: activeTab === tab ? 0.2 : 0,
                shadowRadius: 4,
                elevation: activeTab === tab ? 3 : 0,
                marginRight: 8, // fallback for gap
              }}
              onPress={() => setActiveTab(tab)}
              activeOpacity={0.8}
            >
              <Text
                style={{
                  color: activeTab === tab ? '#FFFFFF' : '#6B7280',
                  fontWeight: activeTab === tab ? '600' : '500',
                  fontSize: 14,
                }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

    </View>
  );

  const renderEmptyState = () => (
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
        No {activeTab.toLowerCase()} orders
      </Text>
      <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20 }}>
        When you have {activeTab.toLowerCase()} orders, they'll appear here.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <StatusBar barStyle="light-content" backgroundColor="#6366F1" />

      <FlatList
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 20,
          flexGrow: 1
        }}
        style={{ backgroundColor: '#F9FAFB' }}
      />
    </SafeAreaView>
  );
};

export default OrdersScreen;