import axios, { AxiosError } from 'axios';
import logger from '../config/logger';
import { decrypt } from '../utils/encryption';
import prisma from '../config/database';

const WAHA_API_URL = process.env.WAHA_API_URL || 'https://api.waha.example';

export interface SendMessageRequest {
  to: string[];
  from: string;
  body: string;
}

export interface SendMessageResponse {
  id: string;
  status: string;
  timestamp: string;
}

export async function sendMessage(
  request: SendMessageRequest,
  apiKeyId?: string
): Promise<SendMessageResponse> {
  try {
    // Get API key from database if provided
    let apiKey = process.env.WAHA_API_KEY;

    if (apiKeyId) {
      const keyRecord = await prisma.apiKey.findUnique({
        where: { id: apiKeyId, isActive: true },
      });

      if (keyRecord) {
        apiKey = decrypt(keyRecord.encryptedKey);
      }
    }

    const response = await axios.post(
      `${WAHA_API_URL}/messages`,
      request,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    logger.info('Message sent to Waha API', {
      recipients: request.to.length,
      responseId: response.data.id,
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      logger.error('Waha API error', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message,
      });

      throw new Error(
        `Waha API error: ${axiosError.response?.status || 'Unknown'}`
      );
    }

    logger.error('Unexpected error in sendMessage', { error });
    throw error;
  }
}

export async function getMessageStatus(
  providerId: string,
  apiKeyId?: string
): Promise<any> {
  try {
    let apiKey = process.env.WAHA_API_KEY;

    if (apiKeyId) {
      const keyRecord = await prisma.apiKey.findUnique({
        where: { id: apiKeyId, isActive: true },
      });

      if (keyRecord) {
        apiKey = decrypt(keyRecord.encryptedKey);
      }
    }

    const response = await axios.get(
      `${WAHA_API_URL}/messages/${providerId}`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    logger.error('Failed to get message status', { error, providerId });
    throw error;
  }
}
