import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  SafeAreaView,
  ScrollView,
  Image,
} from 'react-native';
import { useAppStore } from '../stores/app.store';
import { cardService } from '../services/card.service';
import { marbleService } from '../services/marble.service';
import { Card } from '../types';

interface RemixScreenProps {
  navigation: any;
}

export const RemixScreen: React.FC<RemixScreenProps> = ({ navigation }) => {
  const { remixCards, clearRemixCards, addCard, setIsLoading, isLoading } =
    useAppStore();
  const [remixResult, setRemixResult] = useState<Card | null>(null);

  const handleRemix = async () => {
    if (remixCards.length < 2) {
      Alert.alert('提示', '需要选择至少2张卡牌进行Remix');
      return;
    }

    setIsLoading(true);
    try {
      // 获取卡牌的图像URI
      const imageUris = remixCards.map((card) => card.imageUrl);

      // 生成Remix模型
      const modelResult = await marbleService.generateRemixModel(imageUris);

      if (!modelResult.success) {
        Alert.alert('错误', modelResult.error || 'Remix失败');
        return;
      }

      // 生成Remix卡牌
      const cardResult = await cardService.remixCards(
        remixCards[0].id,
        remixCards[1].id
      );

      if (cardResult.success && cardResult.data) {
        setRemixResult(cardResult.data);
        addCard(cardResult.data);
        Alert.alert('成功', '卡牌Remix成功！');
      } else {
        Alert.alert('错误', cardResult.error || 'Remix失败');
      }
    } catch (error: any) {
      Alert.alert('错误', error.message || 'Remix失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    clearRemixCards();
    setRemixResult(null);
  };

  const handleViewResult = () => {
    if (remixResult) {
      navigation.navigate('CardDetail', { card: remixResult });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.header}>
          <Text style={styles.title}>Remix卡牌</Text>
          <Text style={styles.subtitle}>
            选择两张卡牌融合生成新的稀有卡牌
          </Text>
        </View>

        <View style={styles.selectedCards}>
          <Text style={styles.sectionTitle}>
            已选择 ({remixCards.length}/2)
          </Text>

          {remixCards.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyText}>
                从卡牌库中选择卡牌开始Remix
              </Text>
              <TouchableOpacity
                style={styles.selectButton}
                onPress={() => navigation.navigate('Gallery')}
              >
                <Text style={styles.selectButtonText}>去选择卡牌</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.cardsList}>
              {remixCards.map((card, index) => (
                <View key={card.id} style={styles.selectedCard}>
                  <Image
                    source={{ uri: card.imageUrl }}
                    style={styles.cardImage}
                  />
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardTitle}>{card.title}</Text>
                    <Text style={styles.cardRarity}>
                      {card.rarity}星 - {card.description}
                    </Text>
                  </View>
                  <Text style={styles.cardIndex}>{index + 1}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {remixCards.length === 2 && !remixResult && (
          <View style={styles.remixInfo}>
            <Text style={styles.remixInfoTitle}>融合效果预览</Text>
            <View style={styles.fusionPreview}>
              <Image
                source={{ uri: remixCards[0].imageUrl }}
                style={styles.previewImage}
              />
              <Text style={styles.fusionSymbol}>+</Text>
              <Image
                source={{ uri: remixCards[1].imageUrl }}
                style={styles.previewImage}
              />
              <Text style={styles.fusionSymbol}>=</Text>
              <View style={styles.previewImagePlaceholder}>
                <Text style={styles.placeholderText}>新卡牌</Text>
              </View>
            </View>
          </View>
        )}

        {remixResult && (
          <View style={styles.resultSection}>
            <Text style={styles.sectionTitle}>Remix结果</Text>
            <View style={styles.resultCard}>
              <Image
                source={{ uri: remixResult.imageUrl }}
                style={styles.resultImage}
              />
              <View style={styles.resultInfo}>
                <Text style={styles.resultTitle}>{remixResult.title}</Text>
                <Text style={styles.resultRarity}>
                  稀有度: {remixResult.rarity}星
                </Text>
                <Text style={styles.resultDescription}>
                  {remixResult.description}
                </Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.actions}>
          {remixCards.length === 2 && !remixResult && (
            <TouchableOpacity
              style={[styles.button, styles.remixButton]}
              onPress={handleRemix}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>开始Remix</Text>
              )}
            </TouchableOpacity>
          )}

          {remixResult && (
            <>
              <TouchableOpacity
                style={[styles.button, styles.viewButton]}
                onPress={handleViewResult}
              >
                <Text style={styles.buttonText}>查看详情</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={handleClear}
              >
                <Text style={styles.buttonText}>重新Remix</Text>
              </TouchableOpacity>
            </>
          )}

          {remixCards.length > 0 && !remixResult && (
            <TouchableOpacity
              style={[styles.button, styles.clearButton]}
              onPress={handleClear}
            >
              <Text style={styles.buttonText}>清空选择</Text>
            </TouchableOpacity>
          )}
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
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  selectedCards: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
    marginBottom: 16,
  },
  selectButton: {
    paddingHorizontal: 24,
    paddingVertical: 10,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
  },
  selectButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  cardsList: {
    gap: 12,
  },
  selectedCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
  },
  cardImage: {
    width: 80,
    height: 80,
  },
  cardInfo: {
    flex: 1,
    paddingHorizontal: 12,
  },
  cardTitle: {
    color: '#fff',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  cardRarity: {
    color: '#888',
    fontSize: 12,
  },
  cardIndex: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FF6B6B',
    paddingRight: 16,
  },
  remixInfo: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  fusionPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    padding: 16,
  },
  previewImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  previewImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#888',
    fontSize: 12,
  },
  fusionSymbol: {
    color: '#FF6B6B',
    fontSize: 20,
    fontWeight: 'bold',
  },
  resultSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  resultCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
  },
  resultImage: {
    width: '100%',
    height: 200,
  },
  resultInfo: {
    padding: 16,
  },
  resultTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  resultRarity: {
    color: '#FF6B6B',
    fontWeight: 'bold',
    marginBottom: 8,
  },
  resultDescription: {
    color: '#ccc',
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    gap: 12,
  },
  button: {
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  remixButton: {
    backgroundColor: '#FF6B6B',
  },
  viewButton: {
    backgroundColor: '#4CAF50',
  },
  clearButton: {
    backgroundColor: '#333',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
