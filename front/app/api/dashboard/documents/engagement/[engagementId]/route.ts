import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

/**
 * GET /api/dashboard/documents/engagement/[engagementId]
 * Get all documents for an engagement
 */
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ engagementId: string }> }
) {
    try {
        const { engagementId } = await params;

        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const response = await fetch(`${BACKEND_URL}/documents/engagement/${engagementId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error('Get engagement documents API error:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
