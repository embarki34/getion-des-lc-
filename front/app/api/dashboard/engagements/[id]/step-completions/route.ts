import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

/**
 * GET /api/dashboard/engagements/[id]/step-completions
 * Get step completion history for an engagement
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}${API_CONFIG.ENDPOINTS.ENGAGEMENTS}/${id}/step-completions`, {
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
        console.error('Get step completions API error:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
