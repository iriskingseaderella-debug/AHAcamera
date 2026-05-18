import express, { Router, Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = Router();

// 模拟用户数据库
const usersDB: any[] = [];

// 创建或获取用户
router.post('/login', (req: Request, res: Response) => {
  try {
    const { username, email } = req.body;

    if (!username || !email) {
      return res.status(400).json({
        success: false,
        error: '用户名和邮箱不能为空',
      });
    }

    // 查找或创建用户
    let user = usersDB.find((u) => u.email === email);

    if (!user) {
      user = {
        id: uuidv4(),
        username,
        email,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
        cards: [],
        createdAt: new Date().toISOString(),
      };
      usersDB.push(user);
    }

    res.json({
      success: true,
      user,
      token: `token_${user.id}`,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || '登录失败',
    });
  }
});

// 获取用户信息
router.get('/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = usersDB.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || '获取用户信息失败',
    });
  }
});

// 获取用户卡牌
router.get('/:userId/cards', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = usersDB.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在',
      });
    }

    res.json({
      success: true,
      cards: user.cards || [],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || '获取用户卡牌失败',
    });
  }
});

// 更新用户信息
router.put('/:userId', (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { username, avatar } = req.body;

    const user = usersDB.find((u) => u.id === userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        error: '用户不存在',
      });
    }

    if (username) user.username = username;
    if (avatar) user.avatar = avatar;

    res.json({
      success: true,
      user,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || '更新用户信息失败',
    });
  }
});

export default router;
