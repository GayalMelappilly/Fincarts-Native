import { Text, View } from "react-native";

export const CustomLineChart = ({ data }:any) => {
  const maxValue = Math.max(...data.values);
  const normalizedData = data.values.map((value: any) => value / maxValue);
  
  return (
    <View className="h-48 mt-4">
      <View className="flex-row items-end justify-between h-40">
        {normalizedData.map((value: any, index: number) => (
          <View key={index} className="flex-1 items-center">
            <View 
              className="bg-blue-700 rounded-t-md w-6" 
              style={{ height: `${value * 100}%` }} 
            />
          </View>
        ))}
      </View>
      <View className="flex-row justify-between mt-2">
        {data.labels.map((label: string, index: number) => (
          <Text key={index} className="text-xs text-gray-500 flex-1 text-center">
            {label}
          </Text>
        ))}
      </View>
    </View>
  );
};