import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

/**
 * POST /api/dashboard/documents/upload
 * Upload documents
 */
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        // Get the form data (files + metadata)
        const formData = await request.formData();

        // Forward to backend
        const response = await fetch(`${BACKEND_URL}/documents/upload`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData, // FormData is sent directly
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Document upload API error:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
