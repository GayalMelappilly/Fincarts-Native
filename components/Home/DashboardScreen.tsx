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
import { categoryData, pieData, progressData, recentOrders, salesData, topProducts } from '@/datasets/dashboardData';
import { CustomLineChart } from '@/components/Charts/LineChart';
import { CustomPieChart } from '@/components/Charts/PieChart';
import { CustomProgressBar } from '@/components/Charts/ProgressBar';


const DashboardScreen = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Weekly');

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 m-2 py-4">
        <View className="px-4 py-4 flex-row justify-between items-center">
          <Text className="text-2xl font-bold text-gray-800">Dashboard</Text>
          <View className="flex-row bg-gray-100 rounded-lg overflow-hidden">
            {['Weekly', 'Monthly', 'Yearly'].map((period) => (
              <TouchableOpacity
                key={period}
                className={`py-2 px-3 ${selectedPeriod === period ? 'bg-blue-800' : 'bg-gray-100'}`}
                onPress={() => setSelectedPeriod(period)}
              >
                <Text
                  className={`font-medium ${selectedPeriod === period ? 'text-white' : 'text-gray-700'}`}
                >
                  {period}
                </Text>
              </TouchableOpacity>
            ))}
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
              <FontAwesome5 name="dollar-sign" size={18} color="#1E40AF" />
            </View>
            <Text className="text-gray-500 text-sm">Revenue</Text>
            <Text className="text-xl font-bold text-gray-800">$24,629</Text>
            <View className="flex-row items-center mt-1">
              <Feather name="arrow-up" size={14} color="#10B981" />
              <Text className="text-green-500 text-xs ml-1">+8.4%</Text>
            </View>
          </View>

          <View className="bg-white rounded-lg shadow-sm p-4 mx-2 w-40">
            <View className="bg-green-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
              <Feather name="shopping-cart" size={18} color="#059669" />
            </View>
            <Text className="text-gray-500 text-sm">Orders</Text>
            <Text className="text-xl font-bold text-gray-800">172</Text>
            <View className="flex-row items-center mt-1">
              <Feather name="arrow-up" size={14} color="#10B981" />
              <Text className="text-green-500 text-xs ml-1">+12.3%</Text>
            </View>
          </View>

          <View className="bg-white rounded-lg shadow-sm p-4 mx-2 w-40">
            <View className="bg-yellow-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
              <Feather name="users" size={18} color="#D97706" />
            </View>
            <Text className="text-gray-500 text-sm">Customers</Text>
            <Text className="text-xl font-bold text-gray-800">87</Text>
            <View className="flex-row items-center mt-1">
              <Feather name="arrow-up" size={14} color="#10B981" />
              <Text className="text-green-500 text-xs ml-1">+5.7%</Text>
            </View>
          </View>

          <View className="bg-white rounded-lg shadow-sm p-4 mx-2 w-40">
            <View className="bg-red-100 p-2 rounded-full w-10 h-10 items-center justify-center mb-2">
              <MaterialCommunityIcons name="fish" size={18} color="#DC2626" />
            </View>
            <Text className="text-gray-500 text-sm">Products</Text>
            <Text className="text-xl font-bold text-gray-800">253</Text>
            <View className="flex-row items-center mt-1">
              <Feather name="arrow-up" size={14} color="#10B981" />
              <Text className="text-green-500 text-xs ml-1">+3.2%</Text>
            </View>
          </View>
        </ScrollView>

        {/* Sales Chart */}
        <View className="bg-white rounded-lg shadow-sm mx-4 my-4 p-4">
          <Text className="text-lg font-bold text-gray-800 mb-2">Sales Overview</Text>
          <Text className="text-gray-500 text-xs mb-2">{selectedPeriod} sales performance</Text>
          <CustomLineChart data={salesData} />
        </View>

        {/* Order Status and Category Distribution */}
        <View className="flex-row mx-2">
          <View className="bg-white rounded-lg shadow-sm mx-2 my-2 p-4 flex-1">
            <Text className="text-base font-bold text-gray-800 mb-2">Order Status</Text>
            <CustomPieChart data={pieData} />
          </View>

          <View className="bg-white rounded-lg shadow-sm mx-2 my-2 p-4 flex-1">
            <Text className="text-base font-bold text-gray-800 mb-2">Category Sales</Text>
            <View className="mt-4">
              {categoryData.map((category, index) => (
                <View key={index} className="mb-3">
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
              ))}
            </View>
          </View>
        </View>

        {/* Goals Progress */}
        <View className="bg-white rounded-lg shadow-sm mx-4 my-4 p-4">
          <Text className="text-lg font-bold text-gray-800 mb-4">Monthly Goals</Text>
          {progressData.map((item, index) => (
            <CustomProgressBar
              key={index}
              value={item.value}
              color={item.color}
              label={item.label}
            />
          ))}
        </View>

        {/* Top Products */}
        <View className="bg-white rounded-lg shadow-sm mx-4 my-4 p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Top Products</Text>
            <TouchableOpacity>
              <Text className="text-blue-800 text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          {topProducts.map((product, index) => (
            <View
              key={index}
              className={`flex-row justify-between items-center py-3 ${index < topProducts.length - 1 ? 'border-b border-gray-200' : ''
                }`}
            >
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">{product.name}</Text>
                <Text className="text-gray-500 text-xs mt-1">{product.sales} units sold</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-800 font-medium mr-3">{product.amount}</Text>
                <View
                  className={`flex-row items-center ${product.growth >= 0 ? 'bg-green-100' : 'bg-red-100'
                    } rounded-full px-2 py-1`}
                >
                  {product.growth >= 0 ? (
                    <Feather name="arrow-up" size={10} color="#059669" />
                  ) : (
                    <Feather name="arrow-down" size={10} color="#DC2626" />
                  )}
                  <Text
                    className={`text-xs ml-1 ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                  >
                    {Math.abs(product.growth)}%
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Orders */}
        <View className="bg-white rounded-lg shadow-sm mx-4 my-4 p-4">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Recent Orders</Text>
            <TouchableOpacity>
              <Text className="text-blue-800 text-sm">View All</Text>
            </TouchableOpacity>
          </View>

          {recentOrders.map((order, index) => (
            <View
              key={index}
              className={`flex-row justify-between items-center py-3 ${index < recentOrders.length - 1 ? 'border-b border-gray-200' : ''
                }`}
            >
              <View className="flex-1">
                <Text className="text-gray-800 font-medium">#{order.id}</Text>
                <Text className="text-gray-500 text-xs mt-1">{order.customer}</Text>
              </View>
              <View>
                <Text className="text-gray-800 font-medium text-right">{order.value}</Text>
                <View className="flex-row justify-end mt-1">
                  <View
                    className={`rounded-full px-2 py-1 ${order.status === 'Pending' ? 'bg-yellow-100' :
                      order.status === 'Processing' ? 'bg-blue-100' :
                        order.status === 'Shipped' ? 'bg-purple-100' : 'bg-green-100'
                      }`}
                  >
                    <Text
                      className={`text-xs ${order.status === 'Pending' ? 'text-yellow-800' :
                        order.status === 'Processing' ? 'text-blue-800' :
                          order.status === 'Shipped' ? 'text-purple-800' : 'text-green-800'
                        }`}
                    >
                      {order.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Inventory Alert */}
        <View className="bg-white rounded-lg shadow-sm mx-4 my-4 p-4 mb-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-lg font-bold text-gray-800">Inventory Alerts</Text>
            <TouchableOpacity>
              <Text className="text-blue-800 text-sm">Manage</Text>
            </TouchableOpacity>
          </View>

          <View className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-3">
            <View className="flex-row items-center">
              <View className="bg-yellow-200 p-2 rounded-full">
                <Feather name="alert-triangle" size={16} color="#D97706" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-medium">Low Stock Alert</Text>
                <Text className="text-gray-600 text-xs mt-1">
                  3 products are running low on inventory
                </Text>
              </View>
              <TouchableOpacity>
                <Text className="text-blue-800 text-xs">View</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-red-50 border border-red-200 rounded-lg p-3">
            <View className="flex-row items-center">
              <View className="bg-red-200 p-2 rounded-full">
                <Feather name="x-circle" size={16} color="#DC2626" />
              </View>
              <View className="ml-3 flex-1">
                <Text className="text-gray-800 font-medium">Out of Stock</Text>
                <Text className="text-gray-600 text-xs mt-1">
                  2 products are currently out of stock
                </Text>
              </View>
              <TouchableOpacity>
                <Text className="text-blue-800 text-xs">View</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

export default DashboardScreen