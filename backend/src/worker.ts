import 'dotenv/config';
import { messageQueue } from './queues/messageQueue';
import logger from './config/logger';
import prisma from './config/database';

logger.info('Message worker starting...');

process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down worker gracefully');
  await messageQueue.close();
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down worker gracefully');
  await messageQueue.close();
  await prisma.$disconnect();
  process.exit(0);
});

logger.info('Message worker is running and waiting for jobs');
console.log('🔄 Message worker is running and processing jobs...');
