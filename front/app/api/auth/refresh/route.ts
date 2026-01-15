import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG } from "@/lib/config/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

export async function POST(request: NextRequest) {
    try {
        const refreshToken = request.cookies.get("refresh_token")?.value;

        if (!refreshToken) {
            return NextResponse.json(
                { message: "No refresh token found" },
                { status: 401 }
            );
        }

        const response = await fetch(`${BACKEND_URL}/auth/refresh`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refreshToken }),
        });

        const data = await response.json();

        if (!response.ok) {
            // If refresh fails, clear cookies
            const res = NextResponse.json(
                { message: "Invalid refresh token" },
                { status: 401 }
            );
            res.cookies.delete("auth_token");
            res.cookies.delete("refresh_token");
            return res;
        }

        const { accessToken, refreshToken: newRefreshToken } = data.data || data;

        const res = NextResponse.json({ message: "Token refreshed" });

        // Set access token cookie
        res.cookies.set("auth_token", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            // Expire in 15 minutes (or match backend)
            maxAge: 15 * 60,
        });

        // Set refresh token cookie
        if (newRefreshToken) {
            res.cookies.set("refresh_token", newRefreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: "lax",
                path: "/",
                // Expire in 7 days
                maxAge: 7 * 24 * 60 * 60,
            });
        }

        return res;

    } catch (error) {
        console.error("RefreshToken Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
