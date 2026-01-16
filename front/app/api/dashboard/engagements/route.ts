import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

/**
 * GET /api/dashboard/engagements
 * List all engagements with optional filters
 */
export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const templateId = searchParams.get('templateId');

        let url = `${BACKEND_URL}${API_CONFIG.ENDPOINTS.ENGAGEMENTS}`;
        const params = new URLSearchParams();
        if (status) params.append('status', status);
        if (templateId) params.append('templateId', templateId);
        if (params.toString()) url += `?${params.toString()}`;

        const response = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            cache: 'no-store',
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Engagements API error:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}

/**
 * POST /api/dashboard/engagements
 * Create a new engagement
 */
export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}${API_CONFIG.ENDPOINTS.ENGAGEMENTS}`, {
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
        console.error('Create engagement API error:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
