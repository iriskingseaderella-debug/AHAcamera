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
  Share,
} from 'react-native';
import { Model3DViewer } from '../components/Model3DViewer';
import { CardDisplay } from '../components/CardDisplay';
import { useAppStore } from '../stores/app.store';
import { shareService } from '../services/share.service';
import { Card } from '../types';

interface CardDetailScreenProps {
  route: any;
  navigation: any;
}

export const CardDetailScreen: React.FC<CardDetailScreenProps> = ({
  route,
  navigation,
}) => {
  const { card: initialCard } = route.params;
  const [card, setCard] = useState<Card>(initialCard);
  const [isLoading, setIsLoading] = useState(false);
  const { currentModel, addCard, addRemixCard } = useAppStore();

  const handleShare = async () => {
    try {
      setIsLoading(true);
      const canShare = await shareService.canShare();

      if (!canShare) {
        Alert.alert('提示', '您的设备不支持分享功能');
        return;
      }

      // 显示分享选项
      const result = await Share.share({
        message: `查看我的AhaCamera3D卡牌: ${card.title}`,
        title: card.title,
        url: card.imageUrl,
      });

      if (result.action === Share.dismissedAction) {
        return;
      }

      Alert.alert('成功', '卡牌已分享');
    } catch (error: any) {
      Alert.alert('错误', error.message || '分享失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemix = () => {
    addRemixCard(card);
    Alert.alert('成功', '已添加到Remix列表');
    navigation.navigate('Remix');
  };

  const handleSaveCard = () => {
    addCard(card);
    Alert.alert('成功', '卡牌已保存到我的收藏');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {currentModel && (
          <View style={styles.modelContainer}>
            <Model3DViewer
              model={currentModel}
              onLoaded={() => console.log('Model loaded')}
              onError={(error) => Alert.alert('错误', error)}
            />
          </View>
        )}

        <View style={styles.content}>
          <CardDisplay
            card={card}
            onShare={handleShare}
            onRemix={handleRemix}
          />

          <View style={styles.detailsSection}>
            <Text style={styles.sectionTitle}>卡牌详情</Text>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>稀有度:</Text>
              <Text style={styles.detailValue}>{card.rarity}星</Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>创建时间:</Text>
              <Text style={styles.detailValue}>
                {new Date(card.createdAt).toLocaleDateString('zh-CN')}
              </Text>
            </View>

            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>标签:</Text>
              <Text style={styles.detailValue}>{card.tags.join(', ')}</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSaveCard}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>保存卡牌</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  scrollView: {
    flex: 1,
  },
  modelContainer: {
    width: '100%',
    height: 400,
    backgroundColor: '#1a1a1a',
  },
  content: {
    padding: 16,
  },
  detailsSection: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  detailLabel: {
    color: '#888',
    fontSize: 14,
  },
  detailValue: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  saveButton: {
    backgroundColor: '#FF6B6B',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
