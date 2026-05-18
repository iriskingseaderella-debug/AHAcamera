// 3D模型类型
export interface Model3D {
  id: string;
  url: string;
  format: 'glb' | 'gltf' | 'obj';
  thumbnail: string;
  createdAt: string;
}

// 卡牌类型
export interface Card {
  id: string;
  imageUrl: string;
  title: string;
  description: string;
  rarity: 1 | 2 | 3 | 4 | 5;
  model3D?: Model3D;
  createdAt: string;
  userId: string;
  tags: string[];
}

// Remix卡牌类型
export interface RemixCard extends Card {
  parentCards: string[];
  remixedAt: string;
}

// 用户类型
export interface User {
  id: string;
  username: string;
  avatar: string;
  cards: Card[];
  createdAt: string;
}

// 相机捕获类型
export interface CaptureData {
  imageUri: string;
  timestamp: string;
  location?: {
    latitude: number;
    longitude: number;
  };
}

// AR元素类型
export interface ARElement {
  id: string;
  type: 'creature' | 'item' | 'effect';
  modelUrl: string;
  position: { x: number; y: number; z: number };
  scale: number;
}

// 分享配置类型
export interface ShareConfig {
  platform: 'wechat' | 'instagram' | 'snapchat' | 'tiktok';
  cardId: string;
  message?: string;
}

// API响应类型
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}
