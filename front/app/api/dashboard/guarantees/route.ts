import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.20.0.55:9009/api/v1";
// Guarantees endpoint in backend. App.ts says '/api/v1/guarantees'.
const GUARANTEES_ENDPOINT = "/guarantees";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value;
        // Guarantees backend route is currently PUBLIC, but we want to secure it.
        // Even if public, passing the token allows Audit Log to work.
        // If token is missing, we can still proceed if the backend allows it, OR enforce it here.
        // Given we are auditing, we should enforce it?
        // User said "im login with super admin", implying they expect auth.

        const headers: HeadersInit = {
            "Content-Type": "application/json",
        };
        if (token) {
            headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`${BACKEND_URL}${GUARANTEES_ENDPOINT}`, {
            headers: headers,
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Guarantees API error:", error);
        return NextResponse.json(
            { message: "Internal server error", success: false },
            { status: 500 }
        );
    }
}
