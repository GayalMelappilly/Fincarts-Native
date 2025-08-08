import React, { useEffect, useState } from 'react';
import { orders } from '@/datasets/ordersData';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView,
  SafeAreaView,
  StatusBar,
  FlatList
} from 'react-native';

const OrdersScreen = () => {
  const [activeTab, setActiveTab] = useState('All');
  
  const tabs = ['All', 'Pending', 'Shipped', 'Delivered'];
  
  const filteredOrders = activeTab === 'All' 
    ? orders 
    : orders.filter(order => order.status === activeTab);
  
  const renderOrderItem = ( {item}  : {item: any}) => (
    <TouchableOpacity className="bg-gray-100 rounded-lg p-4 mb-3">
      <Text className="text-lg font-bold text-gray-800">Order # {item.id}</Text>
      <Text className="text-gray-700 mt-1">Buyer: {item.buyer}</Text>
      <Text className="text-gray-700 mt-1">Status: {item.status}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView className="flex-1 bg-white w-full pt-5 px-5">      
      {/* Title */}
      <View className="px-4 py-3">
        <Text className="text-2xl font-bold text-gray-800">Orders</Text>
      </View>
      
      {/* Tabs */}
      <View className="px-4 flex-row mb-3">
        {tabs.map((tab) => (
          <TouchableOpacity 
            key={tab}
            className={`py-2 px-4 mr-2 rounded-full ${activeTab === tab ? 'bg-emerald-600' : 'bg-gray-200'}`}
            onPress={() => setActiveTab(tab)}
          >
            <Text className={`${activeTab === tab ? 'text-white' : 'text-gray-800'} font-medium`}>
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Order List */}
      <FlatList
        className="px-4"
        data={filteredOrders}
        renderItem={renderOrderItem}
        keyExtractor={item => item.id}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}

export default OrdersScreen