import { NextRequest, NextResponse } from "next/server";
import { apiClient } from "@/lib/api/client";
import { API_CONFIG } from "@/lib/config/api";
import { ApiResponse } from "@/lib/types/api";
import { AxiosError } from "axios";

/**
 * PUT /api/dashboard/bank/[id]/accounts/[accountId]
 * Update a bank account
 */
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; accountId: string }> }
) {
    try {
        const { id, accountId } = await params;
        const body = await request.json();

        const response = await apiClient.put<ApiResponse<any>>(
            `${API_CONFIG.ENDPOINTS.BANKS}/${id}/accounts/${accountId}`,
            body
        );

        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        console.error("Update bank account API error:", error);
        if (error.isAxiosError) {
            const axiosError = error as AxiosError<{ message: string; errors?: any }>;
            return NextResponse.json(
                {
                    message:
                        axiosError.response?.data?.message || "Failed to update bank account",
                    errors: axiosError.response?.data?.errors,
                    success: false,
                },
                { status: axiosError.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}

/**
 * DELETE /api/dashboard/bank/[id]/accounts/[accountId]
 * Delete a bank account
 */
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string; accountId: string }> }
) {
    try {
        const { id, accountId } = await params;

        const response = await apiClient.delete<ApiResponse<any>>(
            `${API_CONFIG.ENDPOINTS.BANKS}/${id}/accounts/${accountId}`
        );

        return NextResponse.json(response, { status: 200 });
    } catch (error: any) {
        console.error("Delete bank account API error:", error);
        if (error.isAxiosError) {
            const axiosError = error as AxiosError<{ message: string }>;
            return NextResponse.json(
                {
                    message:
                        axiosError.response?.data?.message || "Failed to delete bank account",
                    success: false,
                },
                { status: axiosError.response?.status || 500 }
            );
        }
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
