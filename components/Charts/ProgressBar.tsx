import { Text, View } from "react-native";

export const CustomProgressBar = ({ value, color, label }: any) => {
  return (
    <View className="mb-3">
      <View className="flex-row justify-between mb-1">
        <Text className="text-xs text-gray-600">{label}</Text>
        <Text className="text-xs text-gray-600">{Math.round(value * 100)}%</Text>
      </View>
      <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
        <View 
          className="h-full rounded-full" 
          style={{ width: `${value * 100}%`, backgroundColor: color }} 
        />
      </View>
    </View>
  );
};