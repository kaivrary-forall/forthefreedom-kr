import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const auth = req.headers.authorization || "";

    const upstream = await fetch(
      "https://forthefreedom-kr-production.up.railway.app/api/members/party-card",
      {
        headers: {
          Authorization: auth,
        },
      }
    );

    const text = await upstream.text();

    res.status(upstream.status);
    res.setHeader(
      "Content-Type",
      upstream.headers.get("content-type") || "application/json"
    );
    res.send(text);
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: "Proxy error",
      error: err?.message || String(err),
    });
  }
}
