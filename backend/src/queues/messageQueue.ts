import Bull from 'bull';
import redisConfig from '../config/redis';
import logger from '../config/logger';
import prisma from '../config/database';
import { sendMessage } from '../services/wahaService';
import { MessageItemStatus } from '@prisma/client';
import { logAction } from '../services/auditService';

const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3');
const RETRY_BACKOFF_MS = parseInt(process.env.RETRY_BACKOFF_MS || '1000');

export interface MessageJob {
  messageId: string;
  messageItemIds: string[];
  text: string;
  from: string;
  apiKeyId?: string;
}

export const messageQueue = new Bull<MessageJob>('message-queue', {
  redis: redisConfig,
  defaultJobOptions: {
    attempts: MAX_RETRIES,
    backoff: {
      type: 'exponential',
      delay: RETRY_BACKOFF_MS,
    },
    removeOnComplete: true,
    removeOnFail: false,
  },
});

messageQueue.process(async (job) => {
  const { messageId, messageItemIds, text, from, apiKeyId } = job.data;

  logger.info('Processing message job', {
    messageId,
    itemCount: messageItemIds.length,
  });

  try {
    // Get message items
    const items = await prisma.messageItem.findMany({
      where: {
        id: { in: messageItemIds },
      },
    });

    if (items.length === 0) {
      throw new Error('No message items found');
    }

    const phones = items.map((item) => item.phone);

    // Update items to SENT status before sending
    await prisma.messageItem.updateMany({
      where: { id: { in: messageItemIds } },
      data: { status: MessageItemStatus.SENT },
    });

    // Send to Waha API
    const response = await sendMessage(
      {
        to: phones,
        from,
        body: text,
      },
      apiKeyId
    );

    // Update items with provider ID
    await prisma.messageItem.updateMany({
      where: { id: { in: messageItemIds } },
      data: {
        providerId: response.id,
        providerStatus: response.status,
      },
    });

    // Check if all items for this message are done
    const remainingItems = await prisma.messageItem.count({
      where: {
        messageId,
        status: { in: [MessageItemStatus.PENDING, MessageItemStatus.RETRYING] },
      },
    });

    if (remainingItems === 0) {
      await prisma.message.update({
        where: { id: messageId },
        data: {
          status: 'COMPLETED',
          sentAt: new Date(),
        },
      });

      await logAction('message_completed', undefined, messageId, {
        itemCount: items.length,
      });
    }

    logger.info('Message job completed', {
      messageId,
      providerId: response.id,
    });

    return { success: true, providerId: response.id };
  } catch (error: any) {
    logger.error('Message job failed', {
      messageId,
      error: error.message,
      attempt: job.attemptsMade,
    });

    // Update items to RETRYING or FAILED status
    const status =
      job.attemptsMade < MAX_RETRIES
        ? MessageItemStatus.RETRYING
        : MessageItemStatus.FAILED;

    await prisma.messageItem.updateMany({
      where: { id: { in: messageItemIds } },
      data: {
        status,
        errorMessage: error.message,
      },
    });

    // If max retries reached, mark message as failed
    if (job.attemptsMade >= MAX_RETRIES) {
      const allItemsFailed = await prisma.messageItem.count({
        where: {
          messageId,
          status: { notIn: [MessageItemStatus.FAILED] },
        },
      });

      if (allItemsFailed === 0) {
        await prisma.message.update({
          where: { id: messageId },
          data: { status: 'FAILED' },
        });
      }
    }

    throw error;
  }
});

messageQueue.on('completed', (job) => {
  logger.info('Job completed', { jobId: job.id });
});

messageQueue.on('failed', (job, err) => {
  logger.error('Job failed', {
    jobId: job?.id,
    error: err.message,
  });
});

export async function addMessageToQueue(jobData: MessageJob): Promise<void> {
  await messageQueue.add(jobData);
  logger.info('Message added to queue', {
    messageId: jobData.messageId,
    itemCount: jobData.messageItemIds.length,
  });
}
