import React from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { Card } from '../types';

interface CardDisplayProps {
  card: Card;
  onPress?: () => void;
  onShare?: () => void;
  onRemix?: () => void;
}

const { width } = Dimensions.get('window');
const cardWidth = width - 40;

export const CardDisplay: React.FC<CardDisplayProps> = ({
  card,
  onPress,
  onShare,
  onRemix,
}) => {
  const getRarityColor = (rarity: number) => {
    const colors = ['#888', '#4CAF50', '#2196F3', '#FF9800', '#E91E63'];
    return colors[rarity - 1] || '#888';
  };

  const getRarityLabel = (rarity: number) => {
    const labels = ['普通', '稀有', '超稀有', '传奇', '神话'];
    return labels[rarity - 1] || '未知';
  };

  return (
    <TouchableOpacity
      style={[styles.card, { borderColor: getRarityColor(card.rarity) }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Image
        source={{ uri: card.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={1}>
            {card.title}
          </Text>
          <View
            style={[
              styles.rarityBadge,
              { backgroundColor: getRarityColor(card.rarity) },
            ]}
          >
            <Text style={styles.rarityText}>
              {getRarityLabel(card.rarity)}
            </Text>
          </View>
        </View>

        <Text style={styles.description} numberOfLines={2}>
          {card.description}
        </Text>

        <View style={styles.tags}>
          {card.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>#{tag}</Text>
            </View>
          ))}
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={onShare}
          >
            <Text style={styles.actionButtonText}>分享</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.remixButton]}
            onPress={onRemix}
          >
            <Text style={styles.actionButtonText}>Remix</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: cardWidth,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#1a1a1a',
    borderWidth: 2,
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: '#333',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
  },
  rarityBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 8,
  },
  rarityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  description: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 12,
    lineHeight: 20,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#333',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 4,
  },
  tagText: {
    color: '#888',
    fontSize: 12,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#333',
    alignItems: 'center',
  },
  remixButton: {
    backgroundColor: '#FF6B6B',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
