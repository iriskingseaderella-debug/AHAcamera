import express, { Router, Request, Response } from 'express';
import axios from 'axios';

const router = Router();

const MARBLE_API_KEY = 'ql4cShuJUbbjVQlhCU6x1t97JMddtljI';
const MARBLE_API_BASE = 'https://api.marble.ai/v1';

// 获取模型生成状态
router.get('/:modelId/status', async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;

    const response = await axios.get(
      `${MARBLE_API_BASE}/models/${modelId}/status`,
      {
        headers: {
          Authorization: `Bearer ${MARBLE_API_KEY}`,
        },
      }
    );

    res.json({
      success: true,
      data: response.data,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || '获取模型状态失败',
    });
  }
});

// 下载模型
router.get('/:modelId/download', async (req: Request, res: Response) => {
  try {
    const { modelId } = req.params;
    const { format = 'glb' } = req.query;

    const response = await axios.get(
      `${MARBLE_API_BASE}/models/${modelId}/download`,
      {
        params: { format },
        headers: {
          Authorization: `Bearer ${MARBLE_API_KEY}`,
        },
        responseType: 'arraybuffer',
      }
    );

    res.setHeader('Content-Type', 'application/octet-stream');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="model.${format}"`
    );
    res.send(response.data);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || '模型下载失败',
    });
  }
});

// 获取模型列表
router.get('/', (req: Request, res: Response) => {
  try {
    res.json({
      success: true,
      models: [],
      message: '模型列表为空',
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || '获取模型列表失败',
    });
  }
});

export default router;
