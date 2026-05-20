import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";

const API_KEY = process.env.CLOUDINARY_API_KEY!;
const API_SECRET = process.env.CLOUDINARY_API_SECRET!;

export async function POST(req: NextRequest) {
  if (!API_KEY || !API_SECRET) {
    return NextResponse.json({ error: "Cloudinary not configured" }, { status: 500 });
  }

  const { folder } = await req.json();
  const timestamp = Math.floor(Date.now() / 1000);

  // Signature: SHA-1 of sorted params string + api_secret
  const params: Record<string, string | number> = { folder, timestamp };
  const paramString =
    Object.keys(params)
      .sort()
      .map((k) => `${k}=${params[k]}`)
      .join("&") + API_SECRET;

  const signature = createHash("sha1").update(paramString).digest("hex");

  return NextResponse.json({ signature, timestamp, apiKey: API_KEY });
}
