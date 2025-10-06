import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator
} from 'react-native';
import {
  Feather,
  MaterialCommunityIcons,
  FontAwesome5,
  Ionicons
} from '@expo/vector-icons';
import Footer from '@/components/Footer/Footer';
import { CustomLineChart } from '@/components/Charts/LineChart';
import { CustomPieChart } from '@/components/Charts/PieChart';
import { CustomProgressBar } from '@/components/Charts/ProgressBar';
import { useQuery } from '@tanstack/react-query';
import { getSellerDetails } from '@/services/authServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '@/context/AuthContext';

// Type definitions
interface BusinessInfo {
  businessName: string;
  businessType: string;
  legalBusinessName: string;
  displayName: string;
  storeDescription: string;
  logoUrl: string;
  websiteUrl: string;
  gstin: string;
  status: string;
}

interface ContactInfo {
  email: string;
  phone: string;
  alternatePhone: string;
}

interface Location {
  city: string | undefined;
  state: string | undefined;
  country: string | undefined;
  pinCode: string | undefined;
}

interface Address {
  addressLine1: string;
  addressLine2: string;
  landmark: string;
  addressType: string;
  location: Location;
}

interface Metrics {
  totalSales: number | string;
  totalOrders: number;
  avgRating: number | string;
  totalListings: number;
  activeListings: number;
  lastCalculatedAt: Date;
}

interface Settings {
  autoAcceptOrders: boolean;
  defaultWarrantyPeriod: number;
  returnWindow: number;
  shippingProvider: string | null;
  minOrderValue: number;
}

interface PaymentSettings {
  paymentCycle: string;
  minPayoutAmount: number;
}

interface SalesHistory {
  dailySales: number | string;
  orderCount: number;
  newCustomers: number;
  cancellations: number;
  date: string;
}

interface RecentOrder {
  id: string;
  orderId: string;
  customer: string;
  amount: number;
  status: string;
  date: string;
}

interface TopSellingProduct {
  id: string;
  name: string;
  image: string;
  sold: number;
  stock: number;
}

export interface TopFishListing {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  images: string[];
  isFeatured: boolean;
  viewCount: number;
  reviewCount: number;
  createdAt: string;
}

interface SalesChartData {
  month: string;
  sales: number;
}

interface Business {
  id: string;
  businessInfo: BusinessInfo;
  contactInfo: ContactInfo;
  address: Address;
  metrics: Metrics;
  settings: Settings;
  paymentSettings: PaymentSettings;
  recentSales: SalesHistory[];
  recentOrders: RecentOrder[];
  topSellingProducts: TopSellingProduct[];
  topFishListings: TopFishListing[];
  salesChartData: SalesChartData[];
  commissionRate: string;
  createdAt: string;
  updatedAt: string;
}

const DashboardScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');

  const { sellerData, setSellerData } = useAuth();

  console.log('seller data : ',sellerData)

  // Type guard to ensure sellerData is properly typed
  const typedSellerData = sellerData as Business | null;

  // Helper functions to format data
  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return `₹${numAmount?.toLocaleString() || '0'}`;
  };

  const formatOrderId = (id: string) => {
    return id?.substring(0, 8) || '';
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return { bg: 'bg-yellow-100', text: 'text-yellow-800' };
      case 'processing':
        return { bg: 'bg-blue-100', text: 'text-blue-800' };
      case 'shipped':
        return { bg: 'bg-purple-100', text: 'text-purple-800' };
      case 'delivered':
        return { bg: 'bg-green-100', text: 'text-green-800' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-800' };
    }
  };

  // FIXED: Safe array access helper with better validation
  const ensureArray = <T,>(data: any): T[] => {
    // Handle null or undefined
    if (!data) return [];

    // Already an array
    if (Array.isArray(data)) return data;

    // Handle single object - wrap in array
    if (typeof data === 'object' && data !== null) return [data];

    return [];
  };

  // FIXED: Prepare chart data with better safety checks
  const salesChartData = React.useMemo(() => {
    if (!typedSellerData?.salesChartData) return [];

    const rawData = ensureArray<SalesChartData>(typedSellerData.salesChartData);
    return rawData.map((item, index) => ({
      name: item?.month || `Month ${index + 1}`,
      value: typeof item?.sales === 'string' ? parseFloat(item.sales) || 0 : item?.sales || 0
    }));
  }, [typedSellerData?.salesChartData]);

  // FIXED: Calculate category distribution with better validation
  const categoryData = React.useMemo(() => {
    if (!typedSellerData?.topFishListings) return [];

    const rawData = ensureArray<TopFishListing>(typedSellerData.topFishListings);
    const categoryMap = new Map<string, number>();

    rawData.forEach(fish => {
      if (fish?.category) {
        categoryMap.set(fish.category, (categoryMap.get(fish.category) || 0) + 1);
      }
    });

    const colors = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4'];
    return Array.from(categoryMap.entries()).map(([name, value], index) => ({
      name,
      value,
      color: colors[index % colors.length]
    }));
  }, [typedSellerData?.topFishListings]);

  // FIXED: Convert to percentages with validation
  const categoryPercentages = React.useMemo(() => {
    if (categoryData.length === 0) return [];

    const totalCategories = categoryData.reduce((sum, cat) => sum + cat.value, 0);
    if (totalCategories === 0) return categoryData;

    return categoryData.map(cat => ({
      ...cat,
      value: Math.round((cat.value / totalCategories) * 100)
    }));
  }, [categoryData]);

  // Prepare pie chart data for order status (mock data since not in API)
  const pieData = {
    total: sellerData?.metrics.totalOrders,
    data: [
    { name: 'Pending', count: sellerData?.metrics.orderStatusCounts.pending, color: '#F59E0B' },
    { name: 'Processing', count: sellerData?.metrics.orderStatusCounts.processing, color: '#3B82F6' },
    { name: 'Shipped', count: sellerData?.metrics.orderStatusCounts.shipped, color: '#8B5CF6' },
    { name: 'Delivered', count: sellerData?.metrics.orderStatusCounts.delivered, color: '#10B981' }
  ]
};

  // Progress data (mock goals)
  const progressData = [
    { label: 'Monthly Sales', value: 75, color: '#3B82F6' },
    { label: 'New Customers', value: 45, color: '#10B981' },
    { label: 'Product Listings', value: 60, color: '#F59E0B' }
  ];

  // FIXED: Safe array access for components with validation
  const topSellingProducts = React.useMemo(() => {
    if (!typedSellerData?.topSellingProducts) return [];
    return ensureArray<TopSellingProduct>(typedSellerData.topSellingProducts);
  }, [typedSellerData?.topSellingProducts]);

  const recentOrders = React.useMemo(() => {
    if (!typedSellerData?.recentOrders) return [];
    return ensureArray<RecentOrder>(typedSellerData.recentOrders);
  }, [typedSellerData?.recentOrders]);

  // FIXED: Filter functions for inventory alerts with validation
  const lowStockProducts = React.useMemo(() => {
    return topSellingProducts.filter(product =>
      product &&
      product.stock !== undefined &&
      product.stock !== null &&
      typeof product.stock === 'number' &&
      product.stock > 0 &&
      product.stock < 10
    );
  }, [topSellingProducts]);

  const outOfStockProducts = React.useMemo(() => {
    return topSellingProducts.filter(product =>
      product &&
      product.stock !== undefined &&
      product.stock !== null &&
      typeof product.stock === 'number' &&
      product.stock === 0
    );
  }, [topSellingProducts]);

  const wellStockedProducts = React.useMemo(() => {
    return topSellingProducts.filter(product =>
      product &&
      product.stock !== undefined &&
      product.stock !== null &&
      typeof product.stock === 'number' &&
      product.stock >= 10
    );
  }, [topSellingProducts]);

  if (!typedSellerData) return (
    <SafeAreaView className="flex-1 w-full bg-gray-50 justify-center items-center">
      <Text className="text-gray-600">No data available</Text>
    </SafeAreaView>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 m-2 py-4">
        <View className="px-4 py-4 flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-800">Dashboard</Text>
            <Text className="text-sm text-gray-600 mt-1">{typedSellerData.businessInfo?.displayName || 'Business Name'}</Text>
          </View>
        </View>

        {/* Stats Overview Cards */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="px-2 py-2"
        >
          <View className="bg-white rounded-lg shadow-sm p-4 mx-2 w-40">
            <View className="bg-blue-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
              <FontAwesome5 name="rupee-sign" size={18} color="#1E40AF" />
            </View>
            <Text className="text-gray-500 text-sm">Total Sales</Text>
            <Text className="text-xl font-bold text-gray-800">
              {formatCurrency(typedSellerData.metrics?.totalSales || 0)}
            </Text>
            <View className="flex-row items-center mt-1">
              <Feather name="arrow-up" size={14} color="#10B981" />
              <Text className="text-green-500 text-xs ml-1">Revenue</Text>
            </View>
          </View>

          <View className="bg-white rounded-lg shadow-sm p-4 mx-2 w-40">
            <View className="bg-green-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
              <Feather name="shopping-cart" size={18} color="#059669" />
            </View>
            <Text className="text-gray-500 text-sm">Orders</Text>
            <Text className="text-xl font-bold text-gray-800">
              {typedSellerData.metrics?.totalOrders || 0}
            </Text>
            <View className="flex-row items-center mt-1">
              <Feather name="arrow-up" size={14} color="#10B981" />
              <Text className="text-green-500 text-xs ml-1">Total</Text>
            </View>
          </View>

          <View className="bg-white rounded-lg shadow-sm p-4 mx-2 w-40">
            <View className="bg-yellow-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
              <MaterialCommunityIcons name="fish" size={18} color="#D97706" />
            </View>
            <Text className="text-gray-500 text-sm">Products</Text>
            <Text className="text-xl font-bold text-gray-800">
              {typedSellerData.metrics?.activeListings || 0}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-gray-500 text-xs">
                of {typedSellerData.metrics?.totalListings || 0} total
              </Text>
            </View>
          </View>

          <View className="bg-white rounded-lg shadow-sm p-4 mx-2 w-40">
            <View className="bg-purple-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
              <Feather name="star" size={18} color="#7C3AED" />
            </View>
            <Text className="text-gray-500 text-sm">Rating</Text>
            <Text className="text-xl font-bold text-gray-800">
              {typedSellerData.metrics?.avgRating || 0}
            </Text>
            <View className="flex-row items-center mt-1">
              <Text className="text-gray-500 text-xs">Average</Text>
            </View>
          </View>
        </ScrollView>

        {/* Sales Chart - TEMPORARILY HIDDEN TO FIX ITERATOR ERROR */}
        {/* {salesChartData.length > 0 && (
          <View className="bg-white rounded-lg shadow-sm mx-4 my-4 p-4">
            <Text className="text-lg font-bold text-gray-800 mb-2">Sales Overview</Text>
            <Text className="text-gray-500 text-xs mb-2">{selectedPeriod} sales performance</Text>
            <CustomLineChart data={salesChartData} />
          </View>
        )} */}

        {/* Order Status and Category Distribution - TEMPORARILY HIDDEN TO FIX ITERATOR ERROR */}
        <View className="flex-row mx-2">
          <View className="bg-white rounded-lg shadow-sm mx-2 my-2 p-4 flex-1">
            <Text className="text-base font-bold text-gray-800 mb-2">Order Status</Text>
            <CustomPieChart data={pieData} />
          </View>

          <View className="bg-white rounded-lg shadow-sm mx-2 my-2 p-4 flex-1">
            <Text className="text-base font-bold text-gray-800 mb-2">Top Listings</Text>
            <View className="mt-4">
              {categoryPercentages.length > 0 ? (
                categoryPercentages
                  .sort((a, b) => b.value - a.value) // Sort by value descending
                  .slice(0, 5) // Take only top 5
                  .map((category, index) => (
                    <View key={`${category.name}-${index}`} className="mb-3">
                      <View className="flex-row justify-between mb-1">
                        <Text className="text-xs text-gray-600">{category.name}</Text>
                        <Text className="text-xs text-gray-600">{category.value}%</Text>
                      </View>
                      <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <View
                          className="h-full rounded-full"
                          style={{ width: `${category.value}%`, backgroundColor: category.color }}
                        />
                      </View>
                    </View>
                  ))
              ) : (
                <Text className="text-xs text-gray-500 text-center mt-4">No category data available</Text>
              )}
            </View>
          </View>
        </View>

        {/* Goals Progress - TEMPORARILY HIDDEN TO FIX ITERATOR ERROR */}
        {/* <View className="bg-white rounded-lg shadow-sm mx-4 my-4 p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Monthly Goals</Text>
          {progressData.map((item, index) => (
            <CustomProgressBar
              key={`${item.label}-${index}`}
              value={item.value}
              color={item.color}
              label={item.label}
            />
          ))}
        </View> */}

        {/* Top Selling Products */}
        <View className="bg-white rounded-lg shadow-sm mx-4 my-4 p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Top Selling Products</Text>
            <TouchableOpacity>
              <Text className="text-blue-800 text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          {/* TEMPORARILY HIDDEN TO FIX ITERATOR ERROR */}
          {topSellingProducts.length > 0 ? (
            topSellingProducts.slice(0, 5).map((product, index) => (
              <View
                key={product?.id || `product-${index}`}
                className={`flex-row justify-between items-center py-3 ${index < Math.min(topSellingProducts.length - 1, 4) ? 'border-b border-gray-200' : ''
                  }`}
              >
                <View className="flex-1">
                  <Text className="text-gray-800 font-medium">{product?.name || 'Product Name'}</Text>
                  <Text className="text-gray-500 text-xs mt-1">
                    {product?.sold || 0} units sold • {product?.stock || 0} in stock
                  </Text>
                </View>
                <View className="flex-row items-center">
                  <View className="bg-green-100 rounded-full px-2 py-1">
                    <Text className="text-green-600 text-xs">
                      #{index + 1}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <Text className="text-gray-500 text-center py-4">No products available</Text>
          )}
        </View>

        {/* Recent Orders */}
        <View className="bg-white rounded-lg shadow-sm mx-4 my-4 p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Recent Orders</Text>
            <TouchableOpacity>
              <Text className="text-blue-800 text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          {/* TEMPORARILY HIDDEN TO FIX ITERATOR ERROR */}
          {recentOrders.length > 0 ? (
            recentOrders.slice(0, 5).map((order, index) => {
              const statusColors = getStatusColor(order?.status || '');
              return (
                <View
                  key={order?.id || `order-${index}`}
                  className={`flex-row justify-between items-center py-3 ${index < Math.min(recentOrders.length - 1, 4) ? 'border-b border-gray-200' : ''
                    }`}
                >
                  <View className="flex-1">
                    <Text className="text-gray-800 font-medium">
                      {order?.orderId || `#${formatOrderId(order?.id || '')}`}
                    </Text>
                    <Text className="text-gray-500 text-xs mt-1">
                      {order?.customer || 'Customer'} • {order?.date || 'Date'}
                    </Text>
                  </View>
                  <View>
                    <Text className="text-gray-800 font-medium text-right">
                      {formatCurrency(order?.amount || 0)}
                    </Text>
                    <View className="flex-row justify-end mt-1">
                      <View className={`rounded-full px-2 py-1 ${statusColors.bg}`}>
                        <Text className={`text-xs ${statusColors.text}`}>
                          {order?.status || 'pending'}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })
          ) : (
            <Text className="text-gray-500 text-center py-4">No recent orders</Text>
          )}
        </View>

        {/* Inventory Alert */}
        <View className="bg-white rounded-lg shadow-sm mx-4 my-4 p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Inventory Alerts</Text>
            <TouchableOpacity>
              <Text className="text-blue-800 text-sm">Manage</Text>
            </TouchableOpacity>
          </View>

          {/* Low Stock Alert */}
          {lowStockProducts.length > 0 && (
            <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
              <View className="flex-row items-center">
                <View className="bg-yellow-200 p-2 rounded-full">
                  <Feather name="alert-triangle" size={16} color="#D97706" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-800 font-medium">Low Stock Alert</Text>
                  <Text className="text-gray-600 text-xs mt-1">
                    {lowStockProducts.length} products are running low on inventory
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text className="text-blue-800 text-xs">View</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Out of Stock Alert */}
          {outOfStockProducts.length > 0 && (
            <View className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
              <View className="flex-row items-center">
                <View className="bg-red-200 p-2 rounded-full">
                  <Feather name="x-circle" size={16} color="#DC2626" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-800 font-medium">Out of Stock</Text>
                  <Text className="text-gray-600 text-xs mt-1">
                    {outOfStockProducts.length} products are currently out of stock
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text className="text-blue-800 text-xs">View</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* No alerts */}
          {topSellingProducts.length > 0 && wellStockedProducts.length === topSellingProducts.length && (
            <View className="bg-green-50 border border-green-200 rounded-lg p-3">
              <View className="flex-row items-center">
                <View className="bg-green-200 p-2 rounded-full">
                  <Feather name="check-circle" size={16} color="#059669" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-800 font-medium">All Good!</Text>
                  <Text className="text-gray-600 text-xs mt-1">
                    No inventory issues at the moment
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Show message when no products */}
          {topSellingProducts.length === 0 && (
            <View className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <View className="flex-row items-center">
                <View className="bg-gray-200 p-2 rounded-full">
                  <Feather name="info" size={16} color="#6B7280" />
                </View>
                <View className="ml-3 flex-1">
                  <Text className="text-gray-800 font-medium">No Products</Text>
                  <Text className="text-gray-600 text-xs mt-1">
                    No products available for inventory tracking
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default DashboardScreen;