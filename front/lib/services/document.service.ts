/**
 * Document Upload Service
 * Handles file uploads for engagements
 */
export class DocumentService {
    private static readonly BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

    /**
     * Upload documents for an engagement step
     */
    static async uploadDocuments(
        files: File[],
        engagementId: string,
        stepId?: string,
        type: string = 'AUTRE'
    ): Promise<any[]> {
        const formData = new FormData();

        // Append all files
        files.forEach(file => {
            formData.append('files', file);
        });

        // Append metadata
        formData.append('engagementId', engagementId);
        if (stepId) {
            formData.append('stepId', stepId);
        }
        formData.append('type', type);

        const response = await fetch(`/api/dashboard/documents/upload`, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to upload documents');
        }

        const result = await response.json();
        return result.data || [];
    }

    /**
     * Get documents for an engagement
     */
    static async getEngagementDocuments(engagementId: string): Promise<any[]> {
        const response = await fetch(`/api/dashboard/documents/engagement/${engagementId}`, {
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to fetch documents');
        }

        return response.json();
    }

    /**
     * Download a document
     */
    static async downloadDocument(documentId: string): Promise<void> {
        window.open(`/api/dashboard/documents/${documentId}/download`, '_blank');
    }

    /**
     * Delete a document
     */
    static async deleteDocument(documentId: string): Promise<void> {
        const response = await fetch(`/api/dashboard/documents/${documentId}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to delete document');
        }
    }
}
