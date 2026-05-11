import { NextResponse } from "next/server";
import { db } from "@pahal/db/client";
import { courses } from "@pahal/db/schema";
import { eq } from "drizzle-orm";

export async function GET() {
  try {
    const data = await db
      .select({
        id: courses.id,
        courseCode: courses.courseCode,
        name: courses.name,
        slug: courses.slug,
        shortDescription: courses.shortDescription,
        description: courses.description,
        level: courses.level,
        duration: courses.duration,
        fees: courses.fees,
        tags: courses.tags,
        isFeatured: courses.isFeatured,
      })
      .from(courses)
      .where(eq(courses.isActive, true));
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({ data: [] }, { status: 500 });
  }
}
