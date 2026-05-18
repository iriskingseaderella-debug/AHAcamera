// 图片处理工具
export const imageUtils = {
  // 压缩图片
  async compressImage(uri: string, quality: number = 0.8): Promise<string> {
    // 这里需要使用图片处理库
    // 在实际应用中可以使用 react-native-image-resizer 或类似库
    return uri;
  },

  // 生成缩略图
  async generateThumbnail(uri: string, size: number = 200): Promise<string> {
    return uri;
  },

  // 获取图片尺寸
  async getImageDimensions(uri: string): Promise<{ width: number; height: number }> {
    return { width: 1080, height: 1920 };
  },
};

// 数据格式化工具
export const formatUtils = {
  // 格式化日期
  formatDate(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  },

  // 格式化时间
  formatTime(date: string | Date): string {
    const d = new Date(date);
    return d.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  },

  // 格式化文件大小
  formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  },
};

// 验证工具
export const validationUtils = {
  // 验证邮箱
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // 验证URL
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // 验证图片URL
  isValidImageUrl(url: string): boolean {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
    return imageExtensions.some((ext) => url.toLowerCase().endsWith(ext));
  },
};

// 存储工具
export const storageUtils = {
  // 本地存储键
  keys: {
    USER: 'user',
    CARDS: 'cards',
    SETTINGS: 'settings',
    CACHE: 'cache',
  },

  // 保存数据
  async save(key: string, data: any): Promise<void> {
    try {
      const jsonData = JSON.stringify(data);
      // 使用 AsyncStorage 或类似库
      console.log(`Saved ${key}:`, jsonData);
    } catch (error) {
      console.error(`Failed to save ${key}:`, error);
    }
  },

  // 读取数据
  async get(key: string): Promise<any> {
    try {
      // 使用 AsyncStorage 或类似库
      return null;
    } catch (error) {
      console.error(`Failed to get ${key}:`, error);
      return null;
    }
  },

  // 删除数据
  async remove(key: string): Promise<void> {
    try {
      // 使用 AsyncStorage 或类似库
      console.log(`Removed ${key}`);
    } catch (error) {
      console.error(`Failed to remove ${key}:`, error);
    }
  },

  // 清空所有数据
  async clear(): Promise<void> {
    try {
      // 使用 AsyncStorage 或类似库
      console.log('Cleared all storage');
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  },
};

// 通知工具
export const notificationUtils = {
  // 显示成功通知
  showSuccess(message: string): void {
    console.log('✅ Success:', message);
  },

  // 显示错误通知
  showError(message: string): void {
    console.error('❌ Error:', message);
  },

  // 显示警告通知
  showWarning(message: string): void {
    console.warn('⚠️ Warning:', message);
  },

  // 显示信息通知
  showInfo(message: string): void {
    console.info('ℹ️ Info:', message);
  },
};
