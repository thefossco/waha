import { Request, Response } from 'express';
import prisma from '../config/database';
import { contactSchema, groupSchema } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';
import { logAction } from '../services/auditService';
import { AuthRequest } from '../middleware/auth';

export async function createContact(req: AuthRequest, res: Response) {
  const { error, value } = contactSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { name, phone, tags, metadata } = value;

  const existingContact = await prisma.contact.findUnique({ where: { phone } });
  if (existingContact) {
    throw new AppError('Contact with this phone already exists', 400);
  }

  const contact = await prisma.contact.create({
    data: { name, phone, tags: tags || [], metadata },
  });

  await logAction('contact_created', req.user?.id, contact.id);

  res.status(201).json(contact);
}

export async function getContacts(req: Request, res: Response) {
  const { search, tag, page = 1, limit = 50 } = req.query;

  const where: any = {};

  if (search) {
    where.OR = [
      { name: { contains: search as string, mode: 'insensitive' } },
      { phone: { contains: search as string } },
    ];
  }

  if (tag) {
    where.tags = { has: tag as string };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const [contacts, total] = await Promise.all([
    prisma.contact.findMany({
      where,
      skip,
      take: Number(limit),
      orderBy: { createdAt: 'desc' },
    }),
    prisma.contact.count({ where }),
  ]);

  res.json({
    contacts,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)),
    },
  });
}

export async function updateContact(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { error, value } = contactSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const contact = await prisma.contact.update({
    where: { id },
    data: value,
  });

  await logAction('contact_updated', req.user?.id, contact.id);

  res.json(contact);
}

export async function deleteContact(req: AuthRequest, res: Response) {
  const { id } = req.params;

  await prisma.contact.delete({ where: { id } });

  await logAction('contact_deleted', req.user?.id, id);

  res.status(204).send();
}

export async function createGroup(req: AuthRequest, res: Response) {
  const { error, value } = groupSchema.validate(req.body);
  if (error) {
    throw new AppError(error.details[0].message, 400);
  }

  const { name } = value;

  const group = await prisma.group.create({
    data: { name },
  });

  await logAction('group_created', req.user?.id, group.id);

  res.status(201).json(group);
}

export async function getGroups(req: Request, res: Response) {
  const groups = await prisma.group.findMany({
    include: {
      contacts: {
        include: {
          contact: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const formatted = groups.map((group) => ({
    ...group,
    contactCount: group.contacts.length,
  }));

  res.json(formatted);
}

export async function addContactsToGroup(req: AuthRequest, res: Response) {
  const { id } = req.params;
  const { contactIds } = req.body;

  if (!Array.isArray(contactIds) || contactIds.length === 0) {
    throw new AppError('contactIds must be a non-empty array', 400);
  }

  const operations = contactIds.map((contactId) =>
    prisma.contactGroup.create({
      data: {
        groupId: id,
        contactId,
      },
    })
  );

  await Promise.all(operations);

  await logAction('contacts_added_to_group', req.user?.id, id, {
    count: contactIds.length,
  });

  res.json({ message: 'Contacts added to group' });
}

export async function removeContactFromGroup(req: AuthRequest, res: Response) {
  const { id, contactId } = req.params;

  await prisma.contactGroup.deleteMany({
    where: {
      groupId: id,
      contactId,
    },
  });

  await logAction('contact_removed_from_group', req.user?.id, id);

  res.status(204).send();
}
