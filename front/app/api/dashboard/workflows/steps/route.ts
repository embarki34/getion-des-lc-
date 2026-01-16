import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/config/api';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9000/api/v1';

/**
 * PUT /api/dashboard/workflows/steps?id=xxx
 * Updates an existing workflow step
 */
export async function PUT(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'Step ID is required', success: false },
                { status: 400 }
            );
        }

        const body = await request.json();

        // Backend Route: PUT /workflows/steps/:stepId
        const response = await fetch(`${BACKEND_URL}${API_CONFIG.ENDPOINTS.WORKFLOWS}/steps/${id}`, {
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
        console.error('Update step API error:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/dashboard/workflows/steps?id=xxx
 * Deletes a workflow step
 */
export async function DELETE(request: NextRequest) {
    try {
        const token = request.cookies.get('auth_token')?.value;
        if (!token) {
            return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json(
                { message: 'Step ID is required', success: false },
                { status: 400 }
            );
        }

        // Backend Route: DELETE /workflows/steps/:stepId
        const response = await fetch(`${BACKEND_URL}${API_CONFIG.ENDPOINTS.WORKFLOWS}/steps/${id}`, {
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
        console.error('Delete step API error:', error);
        return NextResponse.json(
            { message: 'Internal server error', success: false },
            { status: 500 }
        );
    }
}
