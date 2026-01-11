import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const auth = request.headers.get("authorization") || "";
  const res = await fetch(
    "https://forthefreedom-kr-production.up.railway.app/api/members/party-card",
    {
      headers: { Authorization: auth },
      cache: "no-store",
    }
  );

  const text = await res.text();

  return new NextResponse(text, {
    status: res.status,
    headers: {
      "content-type": res.headers.get("content-type") || "application/json",
    },
  });
}
