import { Response } from 'express';
import prisma from '../config/database';
import { messageSchema } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';
import { logAction } from '../services/auditService';
import { AuthRequest } from '../middleware/auth';
import { addMessageToQueue } from '../queues/messageQueue';
import { MessageItemStatus, MessageStatus } from '@prisma/client';

const MAX_BATCH_SIZE = parseInt(process.env.MAX_BATCH_SIZE || '100');

export async function sendMessage(req: AuthRequest, res: Response) {
  const { error, value } = messageSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { text, templateId, recipients, groupIds, scheduledAt } = value;
  const userId = req.user!.id;

  let messageText = text;

  if (templateId) {
    const template = await prisma.template.findUnique({
      where: { id: templateId },
    });
    if (!template) {
      throw new AppError('Template not found', 404);
    }
    messageText = template.text;
  }

  const allPhones: Array<{ phone: string; contactId?: string }> = [];

  if (recipients && recipients.length > 0) {
    for (const recipient of recipients) {
      if (recipient.phone) {
        allPhones.push({ phone: recipient.phone });
      } else if (recipient.contactId) {
        const contact = await prisma.contact.findUnique({
          where: { id: recipient.contactId },
        });
        if (contact) {
          allPhones.push({ phone: contact.phone, contactId: contact.id });
        }
      }
    }
  }

  if (groupIds && groupIds.length > 0) {
    const groupContacts = await prisma.contactGroup.findMany({
      where: { groupId: { in: groupIds } },
      include: { contact: true },
    });

    for (const gc of groupContacts) {
      allPhones.push({ phone: gc.contact.phone, contactId: gc.contact.id });
    }
  }

  if (allPhones.length === 0) {
    throw new AppError('No recipients found', 400);
  }

  const uniquePhones = Array.from(
    new Map(allPhones.map((item) => [item.phone, item])).values()
  );

  const status = scheduledAt ? MessageStatus.SCHEDULED : MessageStatus.QUEUED;

  const message = await prisma.message.create({
    data: {
      userId,
      text: messageText,
      templateId,
      status,
      scheduledAt: scheduledAt ? new Date(scheduledAt) : null,
    },
  });

  const messageItems = await prisma.messageItem.createMany({
    data: uniquePhones.map((item) => ({
      messageId: message.id,
      phone: item.phone,
      contactId: item.contactId,
      status: MessageItemStatus.PENDING,
    })),
  });

  const items = await prisma.messageItem.findMany({
    where: { messageId: message.id },
  });

  if (!scheduledAt) {
    const batches = [];
    for (let i = 0; i < items.length; i += MAX_BATCH_SIZE) {
      batches.push(items.slice(i, i + MAX_BATCH_SIZE));
    }

    for (const batch of batches) {
      await addMessageToQueue({
        messageId: message.id,
        messageItemIds: batch.map((item) => item.id),
        text: messageText,
        from: 'WAHA',
      });
    }

    await prisma.message.update({
      where: { id: message.id },
      data: { status: MessageStatus.PROCESSING },
    });
  }

  await logAction('message_created', userId, message.id, {
    recipientCount: uniquePhones.length,
    scheduled: !!scheduledAt,
  });

  res.status(201).json({
    message,
    recipientCount: uniquePhones.length,
  });
}

export async function getMessages(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const userRole = req.user!.role;
  const { status, page = 1, limit = 20 } = req.query;

  const where: any = userRole === 'ADMIN' ? {} : { userId };

  if (status) {
    where.status = status;
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [messages, total] = await Promise.all([
    prisma.message.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true },
        },
        template: {
          select: { id: true, name: true },
        },
        _count: {
          select: { items: true },
        },
      },
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.message.count({ where }),
  ]);

  res.json({
    messages,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
}

export async function getMessage(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const message = await prisma.message.findUnique({
    where: { id },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
      template: {
        select: { id: true, name: true },
      },
      items: {
        include: {
          contact: {
            select: { id: true, name: true, phone: true },
          },
        },
      },
    },
  });

  if (!message) {
    throw new AppError('Message not found', 404);
  }

  if (userRole !== 'ADMIN' && message.userId !== userId) {
    throw new AppError('Not authorized to view this message', 403);
  }

  const stats = {
    total: message.items.length,
    pending: message.items.filter((i) => i.status === MessageItemStatus.PENDING).length,
    sent: message.items.filter((i) => i.status === MessageItemStatus.SENT).length,
    delivered: message.items.filter((i) => i.status === MessageItemStatus.DELIVERED).length,
    failed: message.items.filter((i) => i.status === MessageItemStatus.FAILED).length,
    retrying: message.items.filter((i) => i.status === MessageItemStatus.RETRYING).length,
  };

  res.json({ ...message, stats });
}

export async function getMessageStats(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const where = userRole === 'ADMIN' ? {} : { userId };

  const [totalMessages, messagesByStatus, itemsByStatus] = await Promise.all([
    prisma.message.count({ where }),
    prisma.message.groupBy({
      by: ['status'],
      where,
      _count: true,
    }),
    prisma.messageItem.groupBy({
      by: ['status'],
      _count: true,
    }),
  ]);

  res.json({
    totalMessages,
    messagesByStatus,
    itemsByStatus,
  });
}
