// utils/cloudinary/upload.ts
export const uploadToCloudinary = async (
  base64File: string, 
  fileType: 'image' | 'video' = 'image'
): Promise<string | null> => {
  try {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    // Debug logging
    console.log('Environment variables check:', {
      cloudName: cloudName ? cloudName : 'MISSING',
      uploadPreset: uploadPreset ? uploadPreset : 'MISSING',
      fileType,
      allEnvVars: Object.keys(process.env).filter(key => key.includes('CLOUDINARY'))
    });
    
    if (!cloudName) {
      throw new Error('EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME is not set in environment variables');
    }
    
    if (!uploadPreset) {
      throw new Error('EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set in environment variables');
    }

    const formData = new FormData();
    formData.append('file', base64File);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', `fincarts-user-profile/${fileType}s`);
    
    // Set resource_type for videos - this is crucial for video uploads
    if (fileType === 'video') {
      formData.append('resource_type', 'video');
    }
    
    // Determine the correct API endpoint based on file type
    const endpoint = fileType === 'video' 
      ? `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`
      : `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;
    
    console.log('Uploading to Cloudinary with:', {
      url: endpoint,
      cloudName,
      uploadPreset,
      fileType,
      hasFile: !!base64File
    });

    const response = await fetch(endpoint, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    console.log('Cloudinary response:', data);
    
    if (!response.ok) {
      console.error('Cloudinary API error:', data);
      throw new Error(data.error?.message || `HTTP error! status: ${response.status}`);
    }
    
    if (data.error) {
      console.error('Cloudinary upload error:', data.error);
      throw new Error(data.error.message);
    }
    
    console.log(`${fileType} upload successful:`, data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error(`Error uploading ${fileType} to Cloudinary:`, error);
    return null;
  }
};

// Convenience functions for specific file types
export const uploadImageToCloudinary = (base64Image: string): Promise<string | null> => {
  return uploadToCloudinary(base64Image, 'image');
};

export const uploadVideoToCloudinary = (base64Video: string): Promise<string | null> => {
  return uploadToCloudinary(base64Video, 'video');
};

// Alternative version using auto-detection (Cloudinary automatically detects file type)
export const uploadToCloudinaryAuto = async (base64File: string): Promise<string | null> => {
  try {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    if (!cloudName || !uploadPreset) {
      throw new Error('Missing Cloudinary environment variables');
    }

    const formData = new FormData();
    formData.append('file', base64File);
    formData.append('upload_preset', uploadPreset);
    formData.append('resource_type', 'auto'); // Let Cloudinary auto-detect file type
    formData.append('folder', 'fincarts-user-profile');
    
    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/upload`, {
      method: 'POST',
      body: formData,
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok || data.error) {
      throw new Error(data.error?.message || `Upload failed: ${response.status}`);
    }
    
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading file to Cloudinary:', error);
    return null;
  }
};
