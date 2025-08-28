// utils/cloudinary/upload.ts
export const uploadToCloudinary = async (base64Image: string): Promise<string | null> => {
  try {
    const cloudName = process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    
    // Debug logging
    console.log('Environment variables check:', {
      cloudName: cloudName ? cloudName : 'MISSING',
      uploadPreset: uploadPreset ? uploadPreset : 'MISSING',
      allEnvVars: Object.keys(process.env).filter(key => key.includes('CLOUDINARY'))
    });
    
    if (!cloudName) {
      throw new Error('EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME is not set in environment variables');
    }
    
    if (!uploadPreset) {
      throw new Error('EXPO_PUBLIC_CLOUDINARY_UPLOAD_PRESET is not set in environment variables');
    }

    const formData = new FormData();
    formData.append('file', base64Image);
    formData.append('upload_preset', uploadPreset);
    formData.append('folder', 'fincarts-user-profile');
    
    console.log('Uploading to Cloudinary with:', {
      url: `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      cloudName,
      uploadPreset,
      hasImage: !!base64Image
    });

    const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
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
    
    console.log('Upload successful:', data.secure_url);
    return data.secure_url;
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return null;
  }
};