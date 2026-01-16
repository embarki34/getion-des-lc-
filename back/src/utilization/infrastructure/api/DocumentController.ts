import { Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { PrismaClient } from '../../../identity/infrastructure/persistence/prisma/client';

const prisma = new PrismaClient();

// Configure storage
const UPLOAD_DIR = path.join(process.cwd(), 'uploads', 'documents');

// Ensure upload directory exists
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}-${Date.now()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    },
});

// File filter for validation
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    // Allowed file types
    const allowedTypes = [
        'application/pdf',
        'image/jpeg',
        'image/png',
        'image/jpg',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only PDF, images, Word, and Excel files are allowed.'));
    }
};

// Configure multer
export const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024, // 10MB max file size
    },
});

/**
 * Document Upload Controller
 */
export class DocumentController {
    /**
     * Upload documents for an engagement step
     * POST /api/documents/upload
     */
    async uploadDocuments(req: Request, res: Response): Promise<void> {
        try {
            const files = req.files as Express.Multer.File[];
            const { engagementId, stepId, type = 'AUTRE' } = req.body;

            if (!files || files.length === 0) {
                res.status(400).json({ message: 'No files uploaded' });
                return;
            }

            if (!engagementId) {
                res.status(400).json({ message: 'engagementId is required' });
                return;
            }

            // Get engagement to get reference dossier
            const engagement = await prisma.engagement.findUnique({
                where: { id: engagementId },
                select: { referenceDossier: true },
            });

            if (!engagement) {
                // Clean up uploaded files
                files.forEach(file => {
                    fs.unlinkSync(file.path);
                });
                res.status(404).json({ message: 'Engagement not found' });
                return;
            }

            // Create document records
            const documents = await Promise.all(
                files.map(async (file) => {
                    return prisma.documentImport.create({
                        data: {
                            type,
                            nomFichier: file.originalname,
                            cheminFichier: file.path,
                            dateUpload: new Date(),
                            referenceDossier: engagement.referenceDossier,
                            metadata: JSON.stringify({
                                size: file.size,
                                mimetype: file.mimetype,
                                engagementId,
                                stepId,
                            }),
                        },
                    });
                })
            );

            res.status(201).json({
                message: 'Documents uploaded successfully',
                data: documents,
            });
        } catch (error: any) {
            console.error('Error uploading documents:', error);
            res.status(500).json({
                message: error.message || 'Failed to upload documents',
            });
        }
    }

    /**
     * Get document by ID
     * GET /api/documents/:id
     */
    async getDocument(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const document = await prisma.documentImport.findUnique({
                where: { id },
            });

            if (!document) {
                res.status(404).json({ message: 'Document not found' });
                return;
            }

            res.json(document);
        } catch (error: any) {
            console.error('Error fetching document:', error);
            res.status(500).json({
                message: error.message || 'Failed to fetch document',
            });
        }
    }

    /**
     * Download document
     * GET /api/documents/:id/download
     */
    async downloadDocument(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const document = await prisma.documentImport.findUnique({
                where: { id },
            });

            if (!document) {
                res.status(404).json({ message: 'Document not found' });
                return;
            }

            if (!fs.existsSync(document.cheminFichier)) {
                res.status(404).json({ message: 'File not found on server' });
                return;
            }

            res.download(document.cheminFichier, document.nomFichier);
        } catch (error: any) {
            console.error('Error downloading document:', error);
            res.status(500).json({
                message: error.message || 'Failed to download document',
            });
        }
    }

    /**
     * Get documents for an engagement
     * GET /api/documents/engagement/:engagementId
     */
    async getEngagementDocuments(req: Request, res: Response): Promise<void> {
        try {
            const { engagementId } = req.params;

            // Get engagement reference
            const engagement = await prisma.engagement.findUnique({
                where: { id: engagementId },
                select: { referenceDossier: true },
            });

            if (!engagement) {
                res.status(404).json({ message: 'Engagement not found' });
                return;
            }

            const documents = await prisma.documentImport.findMany({
                where: {
                    referenceDossier: engagement.referenceDossier,
                },
                orderBy: {
                    dateUpload: 'desc',
                },
            });

            res.json(documents);
        } catch (error: any) {
            console.error('Error fetching engagement documents:', error);
            res.status(500).json({
                message: error.message || 'Failed to fetch documents',
            });
        }
    }

    /**
     * Delete document
     * DELETE /api/documents/:id
     */
    async deleteDocument(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.params;

            const document = await prisma.documentImport.findUnique({
                where: { id },
            });

            if (!document) {
                res.status(404).json({ message: 'Document not found' });
                return;
            }

            // Delete file from filesystem
            if (fs.existsSync(document.cheminFichier)) {
                fs.unlinkSync(document.cheminFichier);
            }

            // Delete database record
            await prisma.documentImport.delete({
                where: { id },
            });

            res.status(204).send();
        } catch (error: any) {
            console.error('Error deleting document:', error);
            res.status(500).json({
                message: error.message || 'Failed to delete document',
            });
        }
    }
}
