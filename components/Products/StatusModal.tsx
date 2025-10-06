import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { Modal, Text, View } from "react-native";

export const StatusModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  selectedStatus: 'active' | 'draft' | 'out_of_stock';
  onSelectStatus: (status: 'active' | 'draft' | 'out_of_stock') => void;
}> = React.memo(({ visible, onClose, selectedStatus, onSelectStatus }) => {
  const statusOptions = [
    { value: 'active' as const, label: 'Active', color: '#10B981', icon: 'checkmark-circle' as const },
    { value: 'draft' as const, label: 'Draft', color: '#6B7280', icon: 'document-text' as const },
    { value: 'out_of_stock' as const, label: 'Out of Stock', color: '#EF4444', icon: 'ban' as const },
  ];

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-white rounded-t-3xl">
          <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
            <Text className="text-xl font-bold text-gray-900">Listing Status</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>
          <View className="p-4">
            {statusOptions.map((status) => (
              <TouchableOpacity
                key={status.value}
                className="flex-row items-center p-4 rounded-xl mb-2"
                style={{ backgroundColor: selectedStatus === status.value ? `${status.color}15` : 'transparent' }}
                onPress={() => {
                  onSelectStatus(status.value);
                  onClose();
                }}
              >
                <View className="p-2 rounded-full mr-4" style={{ backgroundColor: `${status.color}20` }}>
                  <Ionicons name={status.icon as any} size={20} color={status.color} />
                </View>
                <Text className="flex-1 text-gray-900 font-medium">{status.label}</Text>
                {selectedStatus === status.value && (
                  <Ionicons name="checkmark-circle" size={24} color={status.color} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
});