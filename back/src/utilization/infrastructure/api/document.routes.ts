import { Router } from 'express';
import { DocumentController, upload } from './DocumentController';

const router = Router();
const controller = new DocumentController();

// Upload multiple documents
router.post('/upload', upload.array('files', 10), controller.uploadDocuments.bind(controller));

// Get document by ID
router.get('/:id', controller.getDocument.bind(controller));

// Download document
router.get('/:id/download', controller.downloadDocument.bind(controller));

// Get all documents for an engagement
router.get('/engagement/:engagementId', controller.getEngagementDocuments.bind(controller));

// Delete document
router.delete('/:id', controller.deleteDocument.bind(controller));

export default router;
