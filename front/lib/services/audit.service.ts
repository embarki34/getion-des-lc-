export interface AuditLog {
    id: string;
    action: string;
    entity: string;
    entityId: string;
    userId: string | null;
    details: any;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: string;
    user?: {
        name: string;
        email: string;
    };
}

export interface AuditLogFilter {
    userId?: string;
    action?: string;
    entity?: string;
    startDate?: Date;
    endDate?: Date;
    limit?: number;
    offset?: number;
}

export interface AuditLogsResponse {
    logs: AuditLog[];
    total: number;
}

export const AuditService = {
    async getLogs(filter: AuditLogFilter): Promise<AuditLogsResponse> {
        const params = new URLSearchParams();
        if (filter.userId) params.append("userId", filter.userId);
        if (filter.action) params.append("action", filter.action);
        if (filter.entity) params.append("entity", filter.entity);
        if (filter.startDate) params.append("startDate", filter.startDate.toISOString());
        if (filter.endDate) params.append("endDate", filter.endDate.toISOString());
        if (filter.limit) params.append("limit", filter.limit.toString());
        if (filter.offset) params.append("offset", filter.offset.toString());

        // Using Next.js Proxy Route (BFF)
        const url = "/api/dashboard/system/audit-logs?" + params.toString();

        try {
            const response = await fetch(url);

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || "Failed to fetch audit logs");
            }

            return await response.json();
        } catch (error) {
            console.error("Failed to fetch audit logs", error);
            throw error;
        }
    },
};
