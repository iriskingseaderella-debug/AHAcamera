# AhaCamera3D - 沉浸式空间社交平台

一款利用开源世界模型技术，将2D照片实时重建为3D场景，并结合平行实境（MR）游戏机制的社交应用。

## 🎯 核心功能

### 1. 拍照 → 3D场景生成
- 使用设备相机拍摄照片
- 通过Marble API自动生成3D模型
- 支持360°全景空间探索
- Three.js实时渲染展示

### 2. 卡牌生成系统
- 自动生成稀有度卡牌（1-5星）
- 基于图像内容的智能分类
- 支持卡牌收藏和管理
- 热门卡牌排行榜

### 3. Remix卡牌融合
- 选择两张卡牌进行融合
- 生成新的稀有卡牌
- 支持无限创意组合
- 融合结果可分享

### 4. 一键社交分享
- 支持微信朋友圈分享
- Instagram、Snapchat、TikTok集成
- 自定义分享文案
- 生成分享链接

### 5. 平行实境(AR)游戏
- 在现实场景中发现虚拟元素
- 捕捉虚拟生物和道具
- 特殊地标触发AR效果
- 增强现实游戏化体验

## 🏗️ 项目架构

```
AHAcamera/
├── src/
│   ├── screens/          # 应用屏幕
│   ├── components/       # UI组件
│   ├── services/         # API服务
│   ├── stores/           # 状态管理
│   ├── hooks/            # 自定义钩子
│   └── types/            # 类型定义
├── backend/              # Node.js后端服务
├── App.tsx               # 主应用入口
└── package.json
```

## 🚀 快速开始

### 安装依赖
```bash
npm install
cd backend && npm install && cd ..
```

### 开发模式
```bash
npm start
npm run backend:dev
```

### 构建应用
```bash
npm run android    # Android
npm run ios        # iOS
npm run web        # Web
```

## 🎨 技术栈

- **前端**: React Native + Expo
- **3D渲染**: Three.js
- **状态管理**: Zustand
- **后端**: Node.js + Express
- **API**: Marble API (3D生成)

## 📱 应用导航

1. **拍照** - 使用相机拍摄照片并生成3D模型
2. **卡牌库** - 浏览和管理已生成的卡牌
3. **Remix** - 融合两张卡牌生成新卡牌
4. **平行实境** - 探索AR游戏元素

## 🔌 API端点

### 卡牌相关
- `POST /api/cards/generate` - 生成卡牌
- `GET /api/cards/:cardId` - 获取卡牌详情
- `POST /api/cards/remix` - Remix卡牌
- `GET /api/cards` - 获取热门卡牌

### 用户相关
- `POST /api/users/login` - 用户登录
- `GET /api/users/:userId` - 获取用户信息
- `GET /api/users/:userId/cards` - 获取用户卡牌

---

**AhaCamera3D** - 让每一次快门按下，都转化为可探索、可交易、可游戏的"第一人称空间数据"。
