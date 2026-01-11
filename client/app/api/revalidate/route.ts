import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const tags = Array.isArray(body?.tags) ? body.tags : [];

    // tags가 없으면 그냥 OK
    if (tags.length === 0) {
      return NextResponse.json({ ok: true, revalidated: false, tags: [] });
    }

    for (const tag of tags) {
      // ✅ revalidateTag는 인자 1개만 받음
      revalidateTag(tag);
      console.log(`Revalidated tag: ${tag}`);
    }

    return NextResponse.json({ ok: true, revalidated: true, tags });
  } catch (err: any) {
    return NextResponse.json(
      { ok: false, error: err?.message || String(err) },
      { status: 500 }
    );
  }
}
