import { Request, Response } from 'express';
import prisma from '../config/database';
import logger from '../config/logger';
import { MessageItemStatus } from '@prisma/client';
import { logAction } from '../services/auditService';

export async function handleCallback(req: Request, res: Response) {
  try {
    const { id, status, deliveredAt, error } = req.body;

    logger.info('Received callback', { id, status });

    if (!id) {
      return res.status(400).json({ error: 'Missing id in callback' });
    }

    const messageItem = await prisma.messageItem.findFirst({
      where: { providerId: id },
    });

    if (!messageItem) {
      logger.warn('Message item not found for callback', { id });
      return res.status(404).json({ error: 'Message item not found' });
    }

    let itemStatus = messageItem.status;

    if (status === 'delivered') {
      itemStatus = MessageItemStatus.DELIVERED;
    } else if (status === 'failed') {
      itemStatus = MessageItemStatus.FAILED;
    } else if (status === 'sent') {
      itemStatus = MessageItemStatus.SENT;
    }

    await prisma.messageItem.update({
      where: { id: messageItem.id },
      data: {
        status: itemStatus,
        providerStatus: status,
        errorMessage: error || null,
        deliveredAt: deliveredAt ? new Date(deliveredAt) : null,
      },
    });

    await logAction('callback_received', undefined, messageItem.id, {
      providerId: id,
      status,
    });

    logger.info('Callback processed successfully', {
      messageItemId: messageItem.id,
      status: itemStatus,
    });

    res.json({ success: true });
  } catch (error: any) {
    logger.error('Callback processing error', { error: error.message });
    res.status(500).json({ error: 'Internal server error' });
  }
}
