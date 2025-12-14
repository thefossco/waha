import Joi from 'joi';

export const userSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('ADMIN', 'USER', 'VIEWER').optional(),
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const contactSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).required(),
  tags: Joi.array().items(Joi.string()).optional(),
  metadata: Joi.object().optional(),
});

export const groupSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
});

export const templateSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  text: Joi.string().min(1).max(1000).required(),
});

export const messageSchema = Joi.object({
  text: Joi.string().min(1).max(1000).required(),
  templateId: Joi.string().uuid().optional(),
  recipients: Joi.array().items(
    Joi.object({
      phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
      contactId: Joi.string().uuid().optional(),
    })
  ).min(1).required(),
  groupIds: Joi.array().items(Joi.string().uuid()).optional(),
  scheduledAt: Joi.date().iso().optional(),
});

export function validatePhone(phone: string): boolean {
  const phoneRegex = /^\+?[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}
