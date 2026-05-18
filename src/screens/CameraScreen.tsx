import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { CameraView } from 'expo-camera';
import { useAppStore } from '../stores/app.store';
import { useCamera } from '../hooks/useCamera';
import { marbleService } from '../services/marble.service';
import { cardService } from '../services/card.service';

export const CameraScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const {
    cameraRef,
    hasPermission,
    isCameraReady,
    setIsCameraReady,
    requestPermission,
    takePicture,
    pickImage,
  } = useCamera();

  const { setIsLoading, isLoading, setCaptureData, setCurrentModel } =
    useAppStore();

  const [cameraType, setCameraType] = useState<'front' | 'back'>('back');

  useEffect(() => {
    requestPermission();
  }, []);

  const handleCapture = async () => {
    setIsLoading(true);
    try {
      const imageUri = await takePicture();
      if (!imageUri) {
        Alert.alert('错误', '拍照失败');
        return;
      }

      setCaptureData({
        imageUri,
        timestamp: new Date().toISOString(),
      });

      // 生成3D模型
      const modelResult = await marbleService.generateModel3DFromImage(imageUri);
      if (modelResult.success && modelResult.data) {
        setCurrentModel(modelResult.data);

        // 生成卡牌
        const cardResult = await cardService.generateCard(
          imageUri,
          '我的空间',
          '通过AhaCamera3D生成的3D空间卡牌'
        );

        if (cardResult.success && cardResult.data) {
          navigation.navigate('CardDetail', { card: cardResult.data });
        } else {
          Alert.alert('错误', cardResult.error || '卡牌生成失败');
        }
      } else {
        Alert.alert('错误', modelResult.error || '3D模型生成失败');
      }
    } catch (error: any) {
      Alert.alert('错误', error.message || '处理失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePickImage = async () => {
    setIsLoading(true);
    try {
      const imageUri = await pickImage();
      if (!imageUri) {
        return;
      }

      setCaptureData({
        imageUri,
        timestamp: new Date().toISOString(),
      });

      // 生成3D模型
      const modelResult = await marbleService.generateModel3DFromImage(imageUri);
      if (modelResult.success && modelResult.data) {
        setCurrentModel(modelResult.data);

        // 生成卡牌
        const cardResult = await cardService.generateCard(
          imageUri,
          '我的空间',
          '通过AhaCamera3D生成的3D空间卡牌'
        );

        if (cardResult.success && cardResult.data) {
          navigation.navigate('CardDetail', { card: cardResult.data });
        } else {
          Alert.alert('错误', cardResult.error || '卡牌生成失败');
        }
      } else {
        Alert.alert('错误', modelResult.error || '3D模型生成失败');
      }
    } catch (error: any) {
      Alert.alert('错误', error.message || '处理失败');
    } finally {
      setIsLoading(false);
    }
  };

  if (hasPermission === null) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>请求相机权限...</Text>
      </SafeAreaView>
    );
  }

  if (hasPermission === false) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>需要相机权限才能使用此功能</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={requestPermission}
        >
          <Text style={styles.buttonText}>授予权限</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CameraView
        ref={cameraRef}
        style={styles.camera}
        facing={cameraType}
        onCameraReady={() => setIsCameraReady(true)}
      >
        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.flipButton}
              onPress={() =>
                setCameraType(cameraType === 'back' ? 'front' : 'back')
              }
            >
              <Text style={styles.flipButtonText}>翻转</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={styles.galleryButton}
              onPress={handlePickImage}
              disabled={isLoading}
            >
              <Text style={styles.galleryButtonText}>相册</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.captureButton, isLoading && styles.captureButtonDisabled]}
              onPress={handleCapture}
              disabled={!isCameraReady || isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <View style={styles.captureButtonInner} />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.galleryButton}
              onPress={() => navigation.navigate('Gallery')}
              disabled={isLoading}
            >
              <Text style={styles.galleryButtonText}>我的卡牌</Text>
            </TouchableOpacity>
          </View>
        </View>
      </CameraView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  flipButton: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  flipButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 32,
    paddingHorizontal: 16,
  },
  galleryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 8,
  },
  galleryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  captureButtonDisabled: {
    opacity: 0.5,
  },
  captureButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
  button: {
    marginTop: 16,
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
