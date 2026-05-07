import { NextRequest, NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { courses } from "@pahal/db/schema";
import { eq } from "drizzle-orm";
import { slugify, successResponse, errorResponse } from "@pahal/lib/utils";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    const body = await req.json();
    const slug = slugify(body.name);
    const [updated] = await db
      .update(courses)
      .set({ ...body, slug, updatedAt: new Date() })
      .where(eq(courses.id, Number(id)))
      .returning();
    return NextResponse.json(successResponse(updated, "Course updated"));
  } catch {
    return NextResponse.json(errorResponse("Failed to update"), { status: 500 });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await db.delete(courses).where(eq(courses.id, Number(id)));
    return NextResponse.json(successResponse(null, "Course deleted"));
  } catch {
    return NextResponse.json(errorResponse("Failed to delete"), { status: 500 });
  }
}
