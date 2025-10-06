import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ScrollView, TouchableOpacity } from "react-native";
import { Modal, Text, View } from "react-native";

export const CategoryModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  categories: { id: number; name: string }[];
  selectedCategory: string | null;
  onSelectCategory: (category: string) => void;
}> = React.memo(({ visible, onClose, categories, selectedCategory, onSelectCategory }) => (
  <Modal visible={visible} transparent animationType="slide">
    <View className="flex-1 bg-black/50 justify-end">
      <View className="bg-white rounded-t-3xl max-h-96">
        <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
          <Text className="text-xl font-bold text-gray-900">Select Category</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <ScrollView className="max-h-80">
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              className="flex-row items-center p-4 border-b border-gray-50"
              onPress={() => {
                onSelectCategory(category.name);
                onClose();
              }}
            >
              <View className="bg-blue-50 p-2 rounded-full mr-3">
                <Ionicons name="fish" size={20} color="#2563EB" />
              </View>
              <Text className="flex-1 text-gray-900 font-medium">{category.name}</Text>
              {selectedCategory === category.name && (
                <Ionicons name="checkmark-circle" size={24} color="#10B981" />
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
));