import { Text, View } from "react-native";

export const CustomPieChart = ({ data }: any) => {
  return (
    <View className="items-center justify-center py-4">
      <View className="h-24 w-24 rounded-full bg-gray-200 items-center justify-center">
        <View className="h-20 w-20 rounded-full bg-white items-center justify-center">
          <Text className="text-blue-800 font-bold">172</Text>
          <Text className="text-xs text-gray-500">Orders</Text>
        </View>
      </View>
      <View className="mt-4">
        {data.map((item: any, index: number) => (
          <View key={index} className="flex-row items-center mb-2">
            <View className="h-3 w-3 rounded-full mr-2" style={{ backgroundColor: item.color }} />
            <Text className="text-xs text-gray-700">{item.name}: {item.count}</Text>
          </View>
        ))}
      </View>
    </View>
  );
};