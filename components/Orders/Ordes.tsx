import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
  Dimensions,
  ScrollView,
  Modal,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrders } from '@/services/orderServices';
import { renderEmptyState } from './RenderEmptyState';
import { RenderHeader } from './RenderHeader';
import { Order, OrdersResponse } from '@/types/Order';
import { formatCurrency } from '@/utils/formatCurrency';
import ActionButtons from './ActionButtons';

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: width * 0.95,
    maxHeight: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 25,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

const ModalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111827",
  },
  card: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1F2937",
    marginBottom: 10,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    color: "#6B7280",
  },
  value: {
    fontSize: 13,
    fontWeight: "600",
    color: "#374151",
  },
  amount: {
    fontSize: 15,
    fontWeight: "700",
    color: "#059669",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#0C4A6E",
  },
  subValue: {
    fontSize: 13,
    color: "#64748B",
    marginLeft: 6,
  },
  iconRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: "#E5E7EB",
    paddingVertical: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#15803D",
  },
  emptyText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontStyle: "italic",
  },
});

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [localOrders, setLocalOrders] = useState<Order[]>([]);

  const { sellerData } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, error, refetch } = useQuery<OrdersResponse>({
    queryKey: ['get-orders', currentPage, activeTab],
    queryFn: () => getOrders(sellerData?.id as string, {
      page: currentPage,
      limit: 10,
      status: activeTab === 'all' ? undefined : activeTab
    }),
    enabled: !!sellerData?.id
  });

  const orders = data?.data?.orders || [];
  const pagination = data?.data?.pagination;
  const summary = data?.data?.summary;

  // Update local orders when data changes
  useEffect(() => {
    if (orders.length > 0) {
      setLocalOrders(orders);
    }
  }, [orders]);

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    setCurrentPage(1);
  };

  const handleLoadMore = async () => {
    if (pagination && currentPage < pagination.pages && !isLoadingMore) {
      setIsLoadingMore(true);
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);
    }
  };

  const openOrderDetails = (order: Order) => {
    console.log('Opening order details for:', order.id);
    setSelectedOrder(order);
    setIsModalVisible(true);
  };

  const closeOrderDetails = () => {
    console.log('Closing order details');
    setIsModalVisible(false);
    setTimeout(() => {
      setSelectedOrder(null);
    }, 300);
  };

  // Handle order status update from ActionButtons
  const handleStatusUpdate = (orderId: string, newStatus: string) => {
    // Update local state immediately for optimistic UI
    setLocalOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );

    // Update selected order if it's the one being modified
    if (selectedOrder?.id === orderId) {
      setSelectedOrder(prev => prev ? { ...prev, status: newStatus } : null);
    }

    // Invalidate and refetch queries
    queryClient.invalidateQueries({ queryKey: ['get-orders'] });
  };

  // Utility functions
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return { bg: '#10B981', text: '#FFFFFF' };
      case 'shipped':
        return { bg: '#3B82F6', text: '#FFFFFF' };
      case 'processing':
        return { bg: '#8B5CF6', text: '#FFFFFF' };
      case 'confirmed':
        return { bg: '#06B6D4', text: '#FFFFFF' };
      case 'pending':
        return { bg: '#F59E0B', text: '#FFFFFF' };
      case 'cancelled':
        return { bg: '#EF4444', text: '#FFFFFF' };
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
      case 'processing':
        return 'sync';
      case 'confirmed':
        return 'checkmark';
      case 'pending':
        return 'time';
      case 'cancelled':
        return 'close-circle';
      default:
        return 'help-circle';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'No date';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      return 'Invalid date';
    }
  };

  const renderOrderItem = ({ item }: { item: Order }) => {
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
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 4,
          borderWidth: 1,
          borderColor: '#F3F4F6',
        }}
        activeOpacity={0.7}
        onPress={() => openOrderDetails(item)}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: '700', color: '#111827', marginBottom: 4 }}>
              #{(item.order_id || item.id).substring(0, 6).toUpperCase()}
            </Text>
            <Text style={{ fontSize: 14, color: '#6B7280', marginBottom: 2 }}>
              {item.users?.full_name || 'Unknown Customer'}
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF' }}>
              {formatDate(item.created_at)}
            </Text>
            <Text style={{ fontSize: 12, color: '#9CA3AF', marginTop: 2 }}>
              {item.order_items?.length || 0} item{(item.order_items?.length || 0) !== 1 ? 's' : ''}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text style={{ fontSize: 18, fontWeight: '700', color: '#111827', marginBottom: 8 }}>
              {formatCurrency(item.total_amount)}
            </Text>
            <View
              style={[styles.statusBadge, { backgroundColor: statusColors.bg }]}
            >
              <Ionicons name={statusIcon as any} size={14} color={statusColors.text} style={{ marginRight: 4 }} />
              <Text style={{ color: statusColors.text, fontSize: 12, fontWeight: '600', textTransform: 'capitalize' }}>
                {item.status}
              </Text>
            </View>
          </View>
        </View>

        <ActionButtons
          orderId={item.id}
          orderStatus={item.status.toLowerCase()}
          onStatusUpdate={(newStatus) => handleStatusUpdate(item.id, newStatus)}
        />

        <View style={{ height: 1, backgroundColor: '#E5E7EB', marginTop: 12 }} />
        <View style={{ paddingTop: 12, alignItems: 'center' }}>
          <Text style={{ color: '#6366F1', fontSize: 14, fontWeight: '600' }}>
            View Details →
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;

    return (
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent
        statusBarTranslucent
        onRequestClose={closeOrderDetails}
      >
        <View style={ModalStyles.overlay}>
          <View style={ModalStyles.modalBox}>
            <View style={ModalStyles.header}>
              <Text style={ModalStyles.headerText}>
                Order #{(selectedOrder.order_id || selectedOrder.id).substring(0, 6).toUpperCase()}
              </Text>
              <TouchableOpacity onPress={closeOrderDetails}>
                <Ionicons name="close-circle" size={28} color="#64748B" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50 }}
            >
              {/* Order Summary */}
              <View style={ModalStyles.card}>
                <Text style={ModalStyles.sectionTitle}>Order Summary</Text>
                <View style={ModalStyles.row}>
                  <Text style={ModalStyles.label}>Date</Text>
                  <Text style={ModalStyles.value}>{formatDate(selectedOrder.created_at)}</Text>
                </View>
                <View style={ModalStyles.row}>
                  <Text style={ModalStyles.label}>Status</Text>
                  <View style={[
                    ModalStyles.badge,
                    { backgroundColor: getStatusColor(selectedOrder.status).bg }
                  ]}>
                    <Ionicons
                      name={getStatusIcon(selectedOrder.status) as any}
                      size={14}
                      color={getStatusColor(selectedOrder.status).text}
                      style={{ marginRight: 6 }}
                    />
                    <Text style={{ color: getStatusColor(selectedOrder.status).text, fontWeight: "600" }}>
                      {selectedOrder.status}
                    </Text>
                  </View>
                </View>
                <View style={ModalStyles.row}>
                  <Text style={ModalStyles.label}>Total</Text>
                  <Text style={ModalStyles.amount}>{formatCurrency(selectedOrder.total_amount)}</Text>
                </View>
              </View>

              {/* Customer */}
              <View style={ModalStyles.card}>
                <Text style={ModalStyles.sectionTitle}>Customer</Text>
                {selectedOrder.users ? (
                  <>
                    <Text style={ModalStyles.customerName}>{selectedOrder.users.full_name}</Text>
                    <View style={ModalStyles.iconRow}>
                      <Text style={ModalStyles.subValue}>Email : {selectedOrder.users.email || "No email"}</Text>
                    </View>
                    <View style={ModalStyles.iconRow}>
                      <Text style={ModalStyles.subValue}>Phone : {selectedOrder.users.phone_number || "No phone"}</Text>
                    </View>
                  </>
                ) : (
                  <Text style={ModalStyles.emptyText}>No customer info</Text>
                )}
              </View>

              {/* Items */}
              <View style={ModalStyles.card}>
                <Text style={ModalStyles.sectionTitle}>Items ({selectedOrder.order_items?.length || 0})</Text>
                {selectedOrder.order_items && selectedOrder.order_items.length > 0 ? (
                  selectedOrder.order_items.map((item, index) => (
                    <View key={item.id || index} style={ModalStyles.itemRow}>
                      <View style={{ flex: 1 }}>
                        <Text style={ModalStyles.itemName}>{item.fish_listings?.name || `Item ${index + 1}`}</Text>
                        <Text style={ModalStyles.subValue}>Qty: {item.quantity} × {formatCurrency(item.fish_listings?.price)}</Text>
                      </View>
                      <Text style={ModalStyles.amount}>{formatCurrency(item.quantity * item.fish_listings?.price)}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={ModalStyles.emptyText}>No items found</Text>
                )}
              </View>

              {/* Payment */}
              <View style={ModalStyles.card}>
                <Text style={ModalStyles.sectionTitle}>Payment</Text>
                {selectedOrder.payment_details ? (
                  <>
                    <View style={ModalStyles.row}>
                      <Text style={ModalStyles.label}>Method</Text>
                      <Text style={ModalStyles.value}>{selectedOrder.payment_details.payment_method}</Text>
                    </View>
                    <View style={ModalStyles.row}>
                      <Text style={ModalStyles.label}>Status</Text>
                      <Text style={[
                        ModalStyles.value,
                        { color: selectedOrder.payment_details.status === "completed" ? "#059669" : "#D97706" }
                      ]}>
                        {selectedOrder.payment_details.status}
                      </Text>
                    </View>
                    {selectedOrder.payment_details.payment_date && (
                      <View style={ModalStyles.row}>
                        <Text style={ModalStyles.label}>Date</Text>
                        <Text style={ModalStyles.value}>{formatDate(selectedOrder.payment_details.payment_date)}</Text>
                      </View>
                    )}
                  </>
                ) : (
                  <Text style={ModalStyles.emptyText}>No payment info</Text>
                )}
              </View>

              {/* Shipping */}
              <View style={ModalStyles.card}>
                <Text style={ModalStyles.sectionTitle}>Shipping</Text>
                {selectedOrder.shipping_details ? (
                  <>
                    <View style={ModalStyles.row}>
                      <Text style={ModalStyles.label}>Method</Text>
                      <Text style={ModalStyles.value}>{selectedOrder.shipping_details.shipping_method}</Text>
                    </View>
                    {selectedOrder.shipping_details.carrier && (
                      <View style={ModalStyles.row}>
                        <Text style={ModalStyles.label}>Carrier</Text>
                        <Text style={ModalStyles.value}>{selectedOrder.shipping_details.carrier}</Text>
                      </View>
                    )}
                    {selectedOrder.shipping_details.tracking_number && (
                      <View style={ModalStyles.row}>
                        <Text style={ModalStyles.label}>Tracking</Text>
                        <Text style={[ModalStyles.value, { fontWeight: "700" }]}>
                          {selectedOrder.shipping_details.tracking_number}
                        </Text>
                      </View>
                    )}
                  </>
                ) : (
                  <Text style={ModalStyles.emptyText}>No shipping info</Text>
                )}
              </View>

              {/* Action Buttons in Modal */}
              <ActionButtons
                orderId={selectedOrder.id}
                orderStatus={selectedOrder.status.toLowerCase()}
                onStatusUpdate={(newStatus) => handleStatusUpdate(selectedOrder.id, newStatus)}
              />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  const renderLoadMoreFooter = () => {
    if (!isLoadingMore) return null;

    return (
      <View style={{ padding: 20, alignItems: 'center' }}>
        <ActivityIndicator size="small" color="#6366F1" />
        <Text style={{ marginTop: 8, color: '#6B7280' }}>Loading more orders...</Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', width: '100%' }}>
        <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <ActivityIndicator size="large" color="#6366F1" />
          <Text style={{ marginTop: 12, color: '#6B7280', fontSize: 16 }}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
        <StatusBar barStyle="light-content" backgroundColor="#6366F1" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 }}>
          <View style={{
            backgroundColor: '#FEE2E2',
            width: 80,
            height: 80,
            borderRadius: 40,
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: 20
          }}>
            <Ionicons name="alert-circle" size={40} color="#DC2626" />
          </View>
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#DC2626', marginBottom: 8, textAlign: 'center' }}>
            Error Loading Orders
          </Text>
          <Text style={{ fontSize: 14, color: '#6B7280', textAlign: 'center', lineHeight: 20, marginBottom: 20 }}>
            {error instanceof Error ? error.message : 'Something went wrong while loading orders.'}
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#6366F1',
              paddingHorizontal: 20,
              paddingVertical: 12,
              borderRadius: 8
            }}
            onPress={() => refetch()}
          >
            <Text style={{ color: '#FFFFFF', fontWeight: '600' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <SafeAreaView style={{ flex: 1 }}>
        <StatusBar barStyle="light-content" backgroundColor="#6366F1" />

        <FlatList
          data={localOrders}
          renderItem={renderOrderItem}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={() => RenderHeader(pagination, summary, activeTab, localOrders, handleTabChange)}
          ListEmptyComponent={() => renderEmptyState(activeTab)}
          ListFooterComponent={renderLoadMoreFooter}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.3}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: 20,
            flexGrow: 1
          }}
          style={{ backgroundColor: '#F9FAFB' }}
        />

        {OrderDetailsModal()}
      </SafeAreaView>
    </View>
  );
};

export default OrdersScreen;