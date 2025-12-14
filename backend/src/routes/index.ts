import express from 'express';
import multer from 'multer';
import path from 'path';
import { authenticate, authorize } from '../middleware/auth';
import * as authController from '../controllers/authController';
import * as contactController from '../controllers/contactController';
import * as templateController from '../controllers/templateController';
import * as messageController from '../controllers/messageController';
import * as uploadController from '../controllers/uploadController';
import * as callbackController from '../controllers/callbackController';

const router = express.Router();

const MAX_FILE_SIZE_MB = parseInt(process.env.MAX_FILE_SIZE_MB || '10');
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

const upload = multer({
  dest: UPLOAD_DIR,
  limits: {
    fileSize: MAX_FILE_SIZE_MB * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== '.csv') {
      return cb(new Error('Only CSV files are allowed'));
    }
    cb(null, true);
  },
});

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/profile', authenticate, authController.getProfile);

router.post('/contacts', authenticate, contactController.createContact);
router.get('/contacts', authenticate, contactController.getContacts);
router.put('/contacts/:id', authenticate, contactController.updateContact);
router.delete('/contacts/:id', authenticate, authorize('ADMIN'), contactController.deleteContact);

router.post('/groups', authenticate, contactController.createGroup);
router.get('/groups', authenticate, contactController.getGroups);
router.post('/groups/:id/contacts', authenticate, contactController.addContactsToGroup);
router.delete('/groups/:id/contacts/:contactId', authenticate, contactController.removeContactFromGroup);

router.post('/templates', authenticate, templateController.createTemplate);
router.get('/templates', authenticate, templateController.getTemplates);
router.put('/templates/:id', authenticate, templateController.updateTemplate);
router.delete('/templates/:id', authenticate, templateController.deleteTemplate);

router.post('/messages', authenticate, messageController.sendMessage);
router.get('/messages', authenticate, messageController.getMessages);
router.get('/messages/stats', authenticate, messageController.getMessageStats);
router.get('/messages/:id', authenticate, messageController.getMessage);

router.post('/upload/csv', authenticate, upload.single('file'), uploadController.uploadCSV);
router.post('/upload/validate-csv', authenticate, upload.single('file'), uploadController.validateCSV);

router.post('/callbacks/waha', callbackController.handleCallback);

router.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
