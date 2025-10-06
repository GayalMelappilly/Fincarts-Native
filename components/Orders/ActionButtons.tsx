import { orderAction } from '@/services/orderServices'; 
import { useMutation } from '@tanstack/react-query';
import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { FileImage } from 'lucide-react-native';
import { uploadToCloudinary } from '@/utils/cloudinary/upload';

interface ActionButtonsProps {
  orderId: string;
  orderStatus: string;
  onStatusUpdate?: (newStatus: string) => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ 
  orderId, 
  orderStatus,
  onStatusUpdate 
}) => {
  const [isUploading, setIsUploading] = useState(false);

  const orderActionMutation = useMutation({
    mutationFn: orderAction,
    onSuccess: (data) => {
      console.log('Order action success:', data);
      if (onStatusUpdate && data?.data?.order?.status) {
        onStatusUpdate(data.data.order.status);
      }
      Alert.alert('Success', 'Order status updated successfully');
    },
    onError: (err) => {
      console.log('Order action error:', err);
      Alert.alert('Error', 'Failed to update order status');
    }
  });

  // Helper function to convert image to base64
  const convertImageToBase64 = useCallback(async (uri: string): Promise<string> => {
    try {
      const response = await fetch(uri);
      const blob = await response.blob();

      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (error) {
      console.error('Error converting image to base64:', error);
      throw error;
    }
  }, []);

  const handleAccept = () => {
    Alert.alert(
      'Accept Order',
      'Are you sure you want to accept this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Accept',
          onPress: () => {
            orderActionMutation.mutate({ 
              action: 'accept', 
              orderId, 
              receipt: null 
            });
          }
        }
      ]
    );
  };

  const handleDecline = () => {
    Alert.alert(
      'Decline Order',
      'Are you sure you want to decline this order?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Decline',
          style: 'destructive',
          onPress: () => {
            orderActionMutation.mutate({ 
              action: 'decline', 
              orderId, 
              receipt: null 
            });
          }
        }
      ]
    );
  };

  // Updated receipt upload with Cloudinary
  const handleReceiptUpload = useCallback(async (
    source: 'camera' | 'library' = 'library'
  ): Promise<void> => {
    try {
      // Request permissions
      const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
      const { status: libraryStatus } = await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (source === 'camera' && cameraStatus !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to camera.');
        return;
      }

      if (source === 'library' && libraryStatus !== 'granted') {
        Alert.alert('Permission Required', 'Please allow access to photo library.');
        return;
      }

      const result = source === 'camera'
        ? await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          })
        : await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0.8,
          });

      if (!result.canceled && result.assets && result.assets[0]) {
        setIsUploading(true);
        const asset = result.assets[0];

        try {
          // Convert image to base64
          const base64Image = await convertImageToBase64(asset.uri);
          
          // Upload to Cloudinary
          const cloudinaryUrl = await uploadToCloudinary(base64Image, 'image');

          if (cloudinaryUrl) {
            // Send the Cloudinary URL to the backend
            orderActionMutation.mutate({ 
              action: 'receipt', 
              orderId, 
              receipt: cloudinaryUrl 
            });
            
            Alert.alert('Success', 'Receipt uploaded successfully!');
          } else {
            throw new Error('Failed to get image URL from Cloudinary');
          }
        } catch (error) {
          console.error('Error uploading receipt:', error);
          Alert.alert('Upload Error', 'Failed to upload receipt. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error selecting image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }, [orderId, convertImageToBase64, orderActionMutation]);

  // Show image source options
  const showImageSourceOptions = useCallback((): void => {
    Alert.alert(
      'Upload Receipt',
      'Choose image source',
      [
        {
          text: 'Take Photo',
          onPress: () => handleReceiptUpload('camera'),
        },
        {
          text: 'Photo Library',
          onPress: () => handleReceiptUpload('library'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ],
      { cancelable: true }
    );
  }, [handleReceiptUpload]);

  const isLoading = orderActionMutation.isPending || isUploading;

  // Render based on order status
  if (orderStatus === 'pending') {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.acceptButton, isLoading && styles.disabledButton]}
          onPress={handleAccept}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.acceptText}>Accept</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.declineButton, isLoading && styles.disabledButton]}
          onPress={handleDecline}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.declineText}>Decline</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  if (orderStatus === 'processing') {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          style={[styles.uploadButton, isLoading && styles.disabledButton]}
          onPress={showImageSourceOptions}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <>
              <ActivityIndicator color="#FFFFFF" style={{ marginRight: 8 }} />
              <Text style={styles.uploadText}>Uploading...</Text>
            </>
          ) : (
            <>
              <FileImage color="#FFFFFF" size={20} style={styles.icon} />
              <Text style={styles.uploadText}>Upload Receipt</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.declineButton, isLoading && styles.disabledButton]}
          onPress={handleDecline}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.declineText}>Decline</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  if (orderStatus === 'shipped') {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Order Confirmed</Text>
        </View>
      </View>
    );
  }

  if (orderStatus === 'cancelled') {
    return (
      <View style={styles.container}>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Order Cancelled</Text>
        </View>
      </View>
    );
  }

  // For delivered or any other status
  return null;
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  acceptButton: {
    flex: 1,
    backgroundColor: '#10B981',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  acceptText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  declineButton: {
    flex: 1,
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#EF4444',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  declineText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  uploadButton: {
    flex: 1,
    backgroundColor: '#3B82F6',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  uploadText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  icon: {
    marginRight: 8,
  },
  disabledButton: {
    opacity: 0.5,
  },
  infoContainer: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  infoText: {
    color: '#64748B',
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '600',
  },
});

export default ActionButtons;