import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { courses } from "@pahal/db/schema";
import { desc, eq } from "drizzle-orm";
import { slugify, successResponse, errorResponse } from "@pahal/lib/utils";

export async function GET() {
  try {
    const all = await db.select().from(courses).orderBy(desc(courses.createdAt));
    return NextResponse.json(successResponse(all));
  } catch {
    return NextResponse.json(errorResponse("Failed to fetch courses"), { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const slug = slugify(body.name);
    const [course] = await db.insert(courses)
      .values({ ...body, slug })
      .returning();
    return NextResponse.json(successResponse(course, "Course created"), { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json(errorResponse("Failed to create course"), { status: 500 });
  }
}
