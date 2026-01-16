import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

/**
 * POST /api/dashboard/workflows/templates/steps?templateId=xxx
 * Creates a new step for the specified template
 */
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const templateId = searchParams.get('templateId');

        if (!templateId) {
            return NextResponse.json(
                { message: 'Template ID is required', success: false },
                { status: 400 }
            );
        }

        const body = await request.json();

        // Backend Route: POST /workflows/templates/:id/steps
        const response = await fetch(`${BACKEND_URL}${API_CONFIG.ENDPOINTS.WORKFLOWS}/templates/${templateId}/steps`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data, { status: 201 });
    } catch (error) {
        console.error('Create step API error:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
