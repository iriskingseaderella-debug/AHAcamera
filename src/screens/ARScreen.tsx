import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { useAppStore } from '../stores/app.store';

interface ARScreenProps {
  navigation: any;
}

export const ARScreen: React.FC<ARScreenProps> = ({ navigation }) => {
  const { arEnabled, setAREnabled } = useAppStore();
  const [isLoading, setIsLoading] = useState(false);
  const [arElements, setARElements] = useState<any[]>([]);

  useEffect(() => {
    initializeAR();
  }, []);

  const initializeAR = async () => {
    setIsLoading(true);
    try {
      // 初始化AR功能
      // 这里需要集成ARKit (iOS) 或 ARCore (Android)
      setAREnabled(true);

      // 模拟AR元素
      setARElements([
        {
          id: '1',
          type: 'creature',
          name: '幻想生物',
          description: '在现实中捕捉虚拟生物',
        },
        {
          id: '2',
          type: 'item',
          name: '魔法道具',
          description: '收集隐藏的虚拟道具',
        },
        {
          id: '3',
          type: 'effect',
          name: '时空裂缝',
          description: '发现特殊的AR效果',
        },
      ]);
    } catch (error: any) {
      Alert.alert('错误', error.message || 'AR初始化失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCaptureARElement = (element: any) => {
    Alert.alert(
      '成功',
      `已捕捉: ${element.name}\n${element.description}`
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
          <Text style={styles.loadingText}>初始化AR...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>平行实境</Text>
        <Text style={styles.subtitle}>
          {arEnabled ? '已启用' : '未启用'}
        </Text>
      </View>

      <View style={styles.arViewPlaceholder}>
        <Text style={styles.arViewText}>AR相机视图</Text>
        <Text style={styles.arViewSubtext}>
          使用设备相机探索虚拟元素
        </Text>
      </View>

      <View style={styles.elementsContainer}>
        <Text style={styles.elementsTitle}>可捕捉的元素</Text>

        {arElements.map((element) => (
          <TouchableOpacity
            key={element.id}
            style={styles.elementCard}
            onPress={() => handleCaptureARElement(element)}
          >
            <View style={styles.elementIcon}>
              <Text style={styles.elementIconText}>
                {element.type === 'creature'
                  ? '🦄'
                  : element.type === 'item'
                  ? '✨'
                  : '⚡'}
              </Text>
            </View>

            <View style={styles.elementInfo}>
              <Text style={styles.elementName}>{element.name}</Text>
              <Text style={styles.elementDescription}>
                {element.description}
              </Text>
            </View>

            <Text style={styles.captureButton}>捕捉</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>返回</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#fff',
    marginTop: 16,
    fontSize: 16,
  },
  arViewPlaceholder: {
    height: 300,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: '#333',
  },
  arViewText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  arViewSubtext: {
    color: '#888',
    fontSize: 14,
  },
  elementsContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  elementsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  elementCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  elementIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  elementIconText: {
    fontSize: 24,
  },
  elementInfo: {
    flex: 1,
  },
  elementName: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  elementDescription: {
    color: '#888',
    fontSize: 12,
  },
  captureButton: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    fontSize: 14,
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  backButton: {
    paddingVertical: 12,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
