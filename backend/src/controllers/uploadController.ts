import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import fs from 'fs';
import csvParser from 'csv-parser';
import { validatePhone } from '../utils/validation';
import { AppError } from '../middleware/errorHandler';
import prisma from '../config/database';
import { logAction } from '../services/auditService';

interface CSVRow {
  name: string;
  phone: string;
  tags?: string;
}

export async function uploadCSV(req: AuthRequest, res: Response) {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const userId = req.user!.id;
  const filePath = req.file.path;

  const contacts: CSVRow[] = [];
  const errors: string[] = [];

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row: any) => {
        const name = row.name || row.Name || '';
        const phone = row.phone || row.Phone || '';

        if (!name || !phone) {
          errors.push(`Row missing name or phone: ${JSON.stringify(row)}`);
          return;
        }

        if (!validatePhone(phone)) {
          errors.push(`Invalid phone format: ${phone}`);
          return;
        }

        contacts.push({
          name: name.trim(),
          phone: phone.trim(),
          tags: row.tags || row.Tags || '',
        });
      })
      .on('end', async () => {
        fs.unlinkSync(filePath);

        if (contacts.length === 0) {
          res.status(400).json({
            error: 'No valid contacts found in CSV',
            errors,
          });
          resolve();
          return;
        }

        try {
          const created = [];
          const skipped = [];

          for (const contact of contacts) {
            try {
              const tags = contact.tags
                ? contact.tags.split(',').map((t) => t.trim())
                : [];

              const existing = await prisma.contact.findUnique({
                where: { phone: contact.phone },
              });

              if (existing) {
                skipped.push(contact.phone);
              } else {
                const newContact = await prisma.contact.create({
                  data: {
                    name: contact.name,
                    phone: contact.phone,
                    tags,
                  },
                });
                created.push(newContact);
              }
            } catch (error: any) {
              errors.push(`Failed to create contact ${contact.phone}: ${error.message}`);
            }
          }

          await logAction('csv_uploaded', userId, undefined, {
            totalRows: contacts.length,
            created: created.length,
            skipped: skipped.length,
            errors: errors.length,
          });

          res.json({
            message: 'CSV processed',
            summary: {
              total: contacts.length,
              created: created.length,
              skipped: skipped.length,
              errors: errors.length,
            },
            contacts: created,
            errors: errors.length > 0 ? errors : undefined,
          });

          resolve();
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        fs.unlinkSync(filePath);
        reject(new AppError(`CSV parsing error: ${error.message}`, 400));
      });
  });
}

export async function validateCSV(req: AuthRequest, res: Response) {
  if (!req.file) {
    throw new AppError('No file uploaded', 400);
  }

  const filePath = req.file.path;
  const preview: CSVRow[] = [];
  const errors: string[] = [];
  let totalRows = 0;

  return new Promise<void>((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(csvParser())
      .on('data', (row: any) => {
        totalRows++;

        const name = row.name || row.Name || '';
        const phone = row.phone || row.Phone || '';

        if (!name || !phone) {
          errors.push(`Row ${totalRows} missing name or phone`);
          return;
        }

        if (!validatePhone(phone)) {
          errors.push(`Row ${totalRows} invalid phone: ${phone}`);
          return;
        }

        if (preview.length < 10) {
          preview.push({
            name: name.trim(),
            phone: phone.trim(),
            tags: row.tags || row.Tags || '',
          });
        }
      })
      .on('end', () => {
        fs.unlinkSync(filePath);

        res.json({
          totalRows,
          validRows: totalRows - errors.length,
          preview,
          errors: errors.slice(0, 20),
          hasMoreErrors: errors.length > 20,
        });

        resolve();
      })
      .on('error', (error) => {
        fs.unlinkSync(filePath);
        reject(new AppError(`CSV parsing error: ${error.message}`, 400));
      });
  });
}
