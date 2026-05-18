import { Card, RemixCard, ApiResponse } from '../types';

// 模拟后端API基础URL
const API_BASE = 'http://localhost:3000/api';

export const cardService = {
  // 生成卡牌
  async generateCard(imageUri: string, title: string, description: string): Promise<ApiResponse<Card>> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'card.jpg',
      } as any);
      formData.append('title', title);
      formData.append('description', description);

      const response = await fetch(`${API_BASE}/cards/generate`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || '卡牌生成失败',
        };
      }

      return {
        success: true,
        data: data.card,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '卡牌生成失败',
      };
    }
  },

  // 获取用户卡牌列表
  async getUserCards(userId: string): Promise<ApiResponse<Card[]>> {
    try {
      const response = await fetch(`${API_BASE}/users/${userId}/cards`);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || '获取卡牌列表失败',
        };
      }

      return {
        success: true,
        data: data.cards,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '获取卡牌列表失败',
      };
    }
  },

  // 获取卡牌详情
  async getCard(cardId: string): Promise<ApiResponse<Card>> {
    try {
      const response = await fetch(`${API_BASE}/cards/${cardId}`);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || '获取卡牌详情失败',
        };
      }

      return {
        success: true,
        data: data.card,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '获取卡牌详情失败',
      };
    }
  },

  // Remix两张卡牌
  async remixCards(cardId1: string, cardId2: string): Promise<ApiResponse<RemixCard>> {
    try {
      const response = await fetch(`${API_BASE}/cards/remix`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          parentCards: [cardId1, cardId2],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Remix失败',
        };
      }

      return {
        success: true,
        data: data.card,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Remix失败',
      };
    }
  },

  // 删除卡牌
  async deleteCard(cardId: string): Promise<ApiResponse<void>> {
    try {
      const response = await fetch(`${API_BASE}/cards/${cardId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const data = await response.json();
        return {
          success: false,
          error: data.error || '删除卡牌失败',
        };
      }

      return {
        success: true,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '删除卡牌失败',
      };
    }
  },

  // 获取热门卡牌
  async getTrendingCards(limit: number = 20): Promise<ApiResponse<Card[]>> {
    try {
      const response = await fetch(`${API_BASE}/cards/trending?limit=${limit}`);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || '获取热门卡牌失败',
        };
      }

      return {
        success: true,
        data: data.cards,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '获取热门卡牌失败',
      };
    }
  },
};
