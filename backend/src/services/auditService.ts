import prisma from '../config/database';
import logger from '../config/logger';

export async function logAction(
  action: string,
  userId?: string,
  target?: string,
  metadata?: any
) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        userId,
        target,
        metadata,
      },
    });

    logger.info('Audit log created', { action, userId, target });
  } catch (error) {
    logger.error('Failed to create audit log', { error, action, userId });
  }
}
