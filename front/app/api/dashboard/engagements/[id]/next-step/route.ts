import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

/**
 * POST /api/dashboard/engagements/[id]/next-step
 * Move engagement to next workflow step
 */
export async function POST(
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

        const response = await fetch(
            `${BACKEND_URL}${API_CONFIG.ENDPOINTS.ENGAGEMENTS}/${id}/next-step`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Next step API error:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
