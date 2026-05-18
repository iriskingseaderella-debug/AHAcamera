import express, { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { upload } from '../index';

const router = Router();

// 模拟数据库
const cardsDB: any[] = [];

// 生成卡牌
router.post('/generate', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: '未上传图片',
      });
    }

    // 生成卡牌
    const card = {
      id: uuidv4(),
      imageUrl: `/uploads/${req.file.filename}`,
      title: title || '我的空间',
      description: description || '通过AhaCamera3D生成的3D空间卡牌',
      rarity: Math.floor(Math.random() * 5) + 1,
      createdAt: new Date().toISOString(),
      userId: 'user_' + uuidv4(),
      tags: ['3D', '空间', '卡牌'],
    };

    cardsDB.push(card);

    res.json({
      success: true,
      card,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || '卡牌生成失败',
    });
  }
});

// 获取卡牌详情
router.get('/:cardId', (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const card = cardsDB.find((c) => c.id === cardId);

    if (!card) {
      return res.status(404).json({
        success: false,
        error: '卡牌不存在',
      });
    }

    res.json({
      success: true,
      card,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || '获取卡牌失败',
    });
  }
});

// Remix卡牌
router.post('/remix', async (req: Request, res: Response) => {
  try {
    const { parentCards } = req.body;

    if (!parentCards || parentCards.length < 2) {
      return res.status(400).json({
        success: false,
        error: '需要至少2张卡牌进行Remix',
      });
    }

    // 获取父卡牌
    const parents = cardsDB.filter((c) => parentCards.includes(c.id));

    if (parents.length < 2) {
      return res.status(404).json({
        success: false,
        error: '找不到指定的卡牌',
      });
    }

    // 生成Remix卡牌
    const remixCard = {
      id: uuidv4(),
      imageUrl: parents[0].imageUrl, // 使用第一张卡牌的图片作为示例
      title: `${parents[0].title} × ${parents[1].title}`,
      description: `融合了${parents[0].title}和${parents[1].title}的特性`,
      rarity: Math.min(parents[0].rarity + parents[1].rarity - 1, 5),
      createdAt: new Date().toISOString(),
      userId: parents[0].userId,
      tags: [...new Set([...parents[0].tags, ...parents[1].tags])],
      parentCards,
      remixedAt: new Date().toISOString(),
    };

    cardsDB.push(remixCard);

    res.json({
      success: true,
      card: remixCard,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Remix失败',
    });
  }
});

// 获取热门卡牌
router.get('/', (req: Request, res: Response) => {
  try {
    const { limit = 20 } = req.query;
    const trendingCards = cardsDB
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, parseInt(limit as string));

    res.json({
      success: true,
      cards: trendingCards,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || '获取卡牌列表失败',
    });
  }
});

// 删除卡牌
router.delete('/:cardId', (req: Request, res: Response) => {
  try {
    const { cardId } = req.params;
    const index = cardsDB.findIndex((c) => c.id === cardId);

    if (index === -1) {
      return res.status(404).json({
        success: false,
        error: '卡牌不存在',
      });
    }

    cardsDB.splice(index, 1);

    res.json({
      success: true,
      message: '卡牌已删除',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || '删除卡牌失败',
    });
  }
});

export default router;
