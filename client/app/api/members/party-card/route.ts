import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(request: Request) {
  try {
    const auth = request.headers.get("authorization") || "";
    const res = await fetch(
      "https://forthefreedom-kr-production.up.railway.app/api/members/party-card",
      {
        headers: { Authorization: auth },
        cache: "no-store",
      }
    );

    const contentType = res.headers.get("content-type") || "application/json";
    const text = await res.text();

    return new NextResponse(text, {
      status: res.status,
      headers: { "content-type": contentType },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, message: "Proxy error", error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
