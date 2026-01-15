import { NextRequest, NextResponse } from "next/server";
import { API_CONFIG } from "@/lib/config/api";

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || "http://10.20.0.55:9009/api/v1";

/**
 * GET /api/dashboard/bank
 */
export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.toString();

    // API_CONFIG.ENDPOINTS.BANKS is "/swift/banks" usually? Or "/banks"?
    // api.ts said: BANKS: "/swift/banks"
    // So we fetch ${BACKEND_URL}/swift/banks

    // Note: The previous code used apiClient.get(API_CONFIG.ENDPOINTS.BANKS)
    // We must ensure we construct the URL correctly.

    const response = await fetch(`${BACKEND_URL}${API_CONFIG.ENDPOINTS.BANKS}?${query}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Banks API error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

/**
 * POST /api/dashboard/bank
 */
export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const response = await fetch(`${BACKEND_URL}${API_CONFIG.ENDPOINTS.BANKS}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 201 });
  } catch (error) {
    console.error("Create bank API error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/dashboard/bank
 */
export async function PUT(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { message: "Bank ID is required", success: false },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}${API_CONFIG.ENDPOINTS.BANKS}/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updateData),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Update bank API error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/dashboard/bank
 */
export async function DELETE(request: NextRequest) {
  try {
    const token = request.cookies.get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { message: "Bank ID is required", success: false },
        { status: 400 }
      );
    }

    const response = await fetch(`${BACKEND_URL}${API_CONFIG.ENDPOINTS.BANKS}/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data, { status: 200 });
  } catch (error) {
    console.error("Delete bank API error:", error);
    return NextResponse.json(
      { message: "Internal server error", success: false },
      { status: 500 }
    );
  }
}
