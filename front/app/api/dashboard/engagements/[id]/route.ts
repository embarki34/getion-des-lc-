import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

/**
 * GET /api/dashboard/engagements/[id]
 * Get a single engagement by ID
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // Await params in Next.js 15+

        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}${API_CONFIG.ENDPOINTS.ENGAGEMENTS}/${id}`, {
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
        console.error('Get engagement API error:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}

/**
 * PUT /api/dashboard/engagements/[id]
 * Update an engagement
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // Await params in Next.js 15+

        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        const response = await fetch(`${BACKEND_URL}${API_CONFIG.ENDPOINTS.ENGAGEMENTS}/${id}`, {
            method: 'PUT',
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

        return NextResponse.json(data);
    } catch (error) {
        console.error('Update engagement API error:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/dashboard/engagements/[id]
 * Delete an engagement
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params; // Await params in Next.js 15+

        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}${API_CONFIG.ENDPOINTS.ENGAGEMENTS}/${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Delete engagement API error:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
