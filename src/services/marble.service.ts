import axios from 'axios';
import { Model3D, ApiResponse } from '../types';

const MARBLE_API_KEY = 'ql4cShuJUbbjVQlhCU6x1t97JMddtljI';
const MARBLE_API_BASE = 'https://api.marble.ai/v1';

const marbleClient = axios.create({
  baseURL: MARBLE_API_BASE,
  headers: {
    'Authorization': `Bearer ${MARBLE_API_KEY}`,
    'Content-Type': 'application/json',
  },
});

export const marbleService = {
  // 从图像生成3D模型
  async generateModel3DFromImage(imageUri: string): Promise<ApiResponse<Model3D>> {
    try {
      const formData = new FormData();
      formData.append('image', {
        uri: imageUri,
        type: 'image/jpeg',
        name: 'capture.jpg',
      } as any);

      const response = await marbleClient.post('/models/generate', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: {
          id: response.data.id,
          url: response.data.model_url,
          format: response.data.format || 'glb',
          thumbnail: response.data.thumbnail_url,
          createdAt: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '3D模型生成失败',
      };
    }
  },

  // 获取模型生成状态
  async getModelStatus(modelId: string): Promise<ApiResponse<any>> {
    try {
      const response = await marbleClient.get(`/models/${modelId}/status`);
      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '获取模型状态失败',
      };
    }
  },

  // 下载模型文件
  async downloadModel(modelId: string, format: 'glb' | 'gltf' = 'glb'): Promise<ApiResponse<string>> {
    try {
      const response = await marbleClient.get(`/models/${modelId}/download`, {
        params: { format },
        responseType: 'arraybuffer',
      });

      return {
        success: true,
        data: response.data,
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || '模型下载失败',
      };
    }
  },

  // 批量生成模型（用于Remix）
  async generateRemixModel(imageUris: string[]): Promise<ApiResponse<Model3D>> {
    try {
      const formData = new FormData();
      imageUris.forEach((uri, index) => {
        formData.append(`images`, {
          uri,
          type: 'image/jpeg',
          name: `image_${index}.jpg`,
        } as any);
      });

      const response = await marbleClient.post('/models/remix', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return {
        success: true,
        data: {
          id: response.data.id,
          url: response.data.model_url,
          format: response.data.format || 'glb',
          thumbnail: response.data.thumbnail_url,
          createdAt: new Date().toISOString(),
        },
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Remix模型生成失败',
      };
    }
  },
};
