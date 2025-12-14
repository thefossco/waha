import { Response } from 'express';
import prisma from '../config/database';
import { templateSchema } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';
import { logAction } from '../services/auditService';
import { AuthRequest } from '../middleware/auth';

export async function createTemplate(req: AuthRequest, res: Response) {
  const { error, value } = templateSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { name, text } = value;
  const userId = req.user!.id;

  const template = await prisma.template.create({
    data: {
      name,
      text,
      userId,
    },
  });

  await logAction('template_created', userId, template.id);

  res.status(201).json(template);
}

export async function getTemplates(req: AuthRequest, res: Response) {
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const where = userRole === 'ADMIN' ? {} : { userId };

  const templates = await prisma.template.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  res.json(templates);
}

export async function updateTemplate(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { error, value } = templateSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const userId = req.user!.id;
  const userRole = req.user!.role;

  const existing = await prisma.template.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Template not found', 404);
  }

  if (userRole !== 'ADMIN' && existing.userId !== userId) {
    throw new AppError('Not authorized to update this template', 403);
  }

  const template = await prisma.template.update({
    where: { id },
    data: value,
  });

  await logAction('template_updated', userId, template.id);

  res.json(template);
}

export async function deleteTemplate(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const userId = req.user!.id;
  const userRole = req.user!.role;

  const existing = await prisma.template.findUnique({ where: { id } });
  if (!existing) {
    throw new AppError('Template not found', 404);
  }

  if (userRole !== 'ADMIN' && existing.userId !== userId) {
    throw new AppError('Not authorized to delete this template', 403);
  }

  await prisma.template.delete({ where: { id } });

  await logAction('template_deleted', userId, id);

  res.status(204).send();
}
