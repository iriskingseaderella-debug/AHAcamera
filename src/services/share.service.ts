import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import { ShareConfig, ApiResponse } from '../types';

export const shareService = {
  // 分享到微信
  async shareToWeChat(cardId: string, imageUri: string, message?: string): Promise<ApiResponse<void>> {
    try {
      // 微信分享需要通过原生模块实现
      // 这里是模拟实现，实际需要集成微信SDK
      const fileName = `card_${cardId}.jpg`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      // 复制文件到可分享的位置
      await FileSystem.copyAsync({
        from: imageUri,
        to: filePath,
      });

      // 调用分享API
      await Sharing.shareAsync(filePath, {
        mimeType: 'image/jpeg',
        dialogTitle: '分享到微信',
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '分享到微信失败',
      };
    }
  },

  // 分享到Instagram
  async shareToInstagram(cardId: string, imageUri: string, caption?: string): Promise<ApiResponse<void>> {
    try {
      const fileName = `card_${cardId}.jpg`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: imageUri,
        to: filePath,
      });

      await Sharing.shareAsync(filePath, {
        mimeType: 'image/jpeg',
        dialogTitle: '分享到Instagram',
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '分享到Instagram失败',
      };
    }
  },

  // 分享到Snapchat
  async shareToSnapchat(cardId: string, imageUri: string): Promise<ApiResponse<void>> {
    try {
      const fileName = `card_${cardId}.jpg`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: imageUri,
        to: filePath,
      });

      await Sharing.shareAsync(filePath, {
        mimeType: 'image/jpeg',
        dialogTitle: '分享到Snapchat',
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '分享到Snapchat失败',
      };
    }
  },

  // 通用分享方法
  async shareCard(config: ShareConfig, imageUri: string): Promise<ApiResponse<void>> {
    try {
      const fileName = `card_${config.cardId}.jpg`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;

      await FileSystem.copyAsync({
        from: imageUri,
        to: filePath,
      });

      const message = config.message || `Check out my AhaCamera3D card! #AhaCamera3D`;

      await Sharing.shareAsync(filePath, {
        mimeType: 'image/jpeg',
        dialogTitle: `分享到${config.platform}`,
        message,
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '分享失败',
      };
    }
  },

  // 生成分享链接
  async generateShareLink(cardId: string): Promise<ApiResponse<string>> {
    try {
      const shareLink = `https://ahacamera3d.app/card/${cardId}`;
      return {
        success: true,
        data: shareLink,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '生成分享链接失败',
      };
    }
  },

  // 检查是否可以分享
  async canShare(): Promise<boolean> {
    return await Sharing.isAvailableAsync();
  },
};
