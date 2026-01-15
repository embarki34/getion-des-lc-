import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.20.0.55:9009/api/v1";

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const companyId = searchParams.get("companyId");
        const queryParams = new URLSearchParams();
        if (companyId) queryParams.append("companyId", companyId);

        const response = await fetch(`${BACKEND_URL}/business-units?${queryParams}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const data = await response.json();

        if (!response.ok) {
            if (response.status === 404) return NextResponse.json([], { status: 200 });
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json(data);
    } catch (error) {
        console.error("Error fetching business units:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get("auth_token")?.value;
        if (!token) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

        const body = await request.json();

        // Ensure companyId is present
        if (!body.companyId) {
            return NextResponse.json({ message: "companyId is required" }, { status: 400 });
        }

        const response = await fetch(`${BACKEND_URL}/business-units`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();

        if (!response.ok) {
            return NextResponse.json(data, { status: response.status });
        }

        return NextResponse.json({ data: data.id, message: "Created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating business unit:", error);
        return NextResponse.json(
            { message: "Internal Server Error" },
            { status: 500 }
        );
    }
}
