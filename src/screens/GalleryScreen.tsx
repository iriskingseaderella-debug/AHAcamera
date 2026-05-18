import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
  Alert,
} from 'react-native';
import { CardDisplay } from '../components/CardDisplay';
import { useAppStore } from '../stores/app.store';
import { cardService } from '../services/card.service';
import { Card } from '../types';

interface GalleryScreenProps {
  navigation: any;
}

export const GalleryScreen: React.FC<GalleryScreenProps> = ({ navigation }) => {
  const { cards, setCards, isLoading, setIsLoading } = useAppStore();
  const [filter, setFilter] = useState<'all' | 'trending'>('all');

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setIsLoading(true);
    try {
      if (filter === 'trending') {
        const result = await cardService.getTrendingCards(20);
        if (result.success && result.data) {
          setCards(result.data);
        }
      } else {
        // 从本地存储加载用户卡牌
        // 这里假设已经有卡牌在状态中
      }
    } catch (error: any) {
      Alert.alert('错误', error.message || '加载卡牌失败');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPress = (card: Card) => {
    navigation.navigate('CardDetail', { card });
  };

  const handleRemix = (card: Card) => {
    const { addRemixCard, remixCards } = useAppStore.getState();
    addRemixCard(card);

    if (remixCards.length >= 2) {
      navigation.navigate('Remix');
    } else {
      Alert.alert('提示', `已选择${remixCards.length + 1}张卡牌，再选择一张进行Remix`);
    }
  };

  const renderCard = ({ item }: { item: Card }) => (
    <CardDisplay
      card={item}
      onPress={() => handleCardPress(item)}
      onShare={() => handleCardPress(item)}
      onRemix={() => handleRemix(item)}
    />
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>卡牌库</Text>
        <View style={styles.filterButtons}>
          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'all' && styles.filterButtonActive,
            ]}
            onPress={() => {
              setFilter('all');
              loadCards();
            }}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'all' && styles.filterButtonTextActive,
              ]}
            >
              我的卡牌
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.filterButton,
              filter === 'trending' && styles.filterButtonActive,
            ]}
            onPress={() => {
              setFilter('trending');
              loadCards();
            }}
          >
            <Text
              style={[
                styles.filterButtonText,
                filter === 'trending' && styles.filterButtonTextActive,
              ]}
            >
              热门卡牌
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B6B" />
        </View>
      ) : cards.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>暂无卡牌</Text>
          <TouchableOpacity
            style={styles.createButton}
            onPress={() => navigation.navigate('Camera')}
          >
            <Text style={styles.createButtonText}>去拍照</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={cards}
          renderItem={renderCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          scrollEnabled={true}
        />
      )}
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
    marginBottom: 12,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#333',
  },
  filterButtonActive: {
    backgroundColor: '#FF6B6B',
  },
  filterButtonText: {
    color: '#888',
    fontWeight: '500',
  },
  filterButtonTextActive: {
    color: '#fff',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
    marginBottom: 16,
  },
  createButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
  },
  createButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
