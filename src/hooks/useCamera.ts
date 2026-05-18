import { useRef, useState } from 'react';
import { CameraPictureOptions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';

export const useCamera = () => {
  const cameraRef = useRef(null);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const requestPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    setHasPermission(status === 'granted');
    return status === 'granted';
  };

  const takePicture = async (): Promise<string | null> => {
    if (!cameraRef.current || !isCameraReady) {
      return null;
    }

    try {
      const options: CameraPictureOptions = {
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      };

      const photo = await (cameraRef.current as any).takePictureAsync(options);
      return photo.uri;
    } catch (error) {
      console.error('Failed to take picture:', error);
      return null;
    }
  };

  const pickImage = async (): Promise<string | null> => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled) {
        return result.assets[0].uri;
      }
      return null;
    } catch (error) {
      console.error('Failed to pick image:', error);
      return null;
    }
  };

  return {
    cameraRef,
    hasPermission,
    isCameraReady,
    setIsCameraReady,
    requestPermission,
    takePicture,
    pickImage,
  };
};
