import { Metadata } from "next";
import Link from "next/link";
import { Button, Tag } from "antd";
import { ClockCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { db } from "@pahal/db/client";
import { courses } from "@pahal/db/schema";
import { eq } from "drizzle-orm";

export const metadata: Metadata = {
  title: "Courses",
  description: "Explore all beauty and cosmetology courses at Pahal Academy — Makeup Artistry, Hair Styling, Skincare, Nail Art, Bridal Makeup, and more.",
};

// Revalidate every 5 minutes so new courses appear without a full redeploy
export const revalidate = 300;

const BG_PALETTE = [
  "bg-purple-50", "bg-violet-50", "bg-green-50", "bg-orange-50",
  "bg-red-50", "bg-cyan-50", "bg-blue-50", "bg-violet-50",
];
const EMOJIS = ["💄", "✂️", "🌿", "💅", "👰", "🎓", "🌸", "✨"];

export default async function CoursesPage() {
  const data = await db
    .select()
    .from(courses)
    .where(eq(courses.isActive, true));

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">All Courses</h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Practical, industry-aligned beauty programs from beginner to advanced. Find your perfect course.
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {data.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="text-5xl mb-4">📚</div>
            <p className="text-lg">Courses coming soon. Check back shortly!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {data.map((course, i) => {
              const bgClass = BG_PALETTE[i % BG_PALETTE.length];
              const emoji = EMOJIS[i % EMOJIS.length];
              const highlights = course.tags
                ? course.tags.split(",").map((t) => t.trim()).filter(Boolean)
                : [];
              const blurb = course.shortDescription || course.description?.slice(0, 140) || "";

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-2xl border border-gray-100 hover:border-primary-200 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 overflow-hidden flex flex-col"
                >
                  <div className={`h-32 flex items-center justify-center ${bgClass}`}>
                    <span className="text-6xl">{emoji}</span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag color="default" className="text-xs">{course.courseCode}</Tag>
                      <Tag
                        color={course.level === "advanced" ? "purple" : course.level === "intermediate" ? "blue" : "green"}
                        className="text-xs"
                      >
                        {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                      </Tag>
                    </div>
                    <h2 className="font-display font-bold text-xl text-gray-900 mb-2">{course.name}</h2>
                    <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{blurb}</p>

                    {highlights.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {highlights.slice(0, 4).map((h) => (
                          <span key={h} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{h}</span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><ClockCircleOutlined />{course.duration}</span>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="font-display font-bold text-2xl text-gray-900">
                        ₹{Number(course.fees).toLocaleString("en-IN")}
                      </span>
                      <div className="flex gap-2">
                        <Link href={`/courses/${course.slug}`}>
                          <Button size="small">Details</Button>
                        </Link>
                        <Link href="/admission">
                          <Button type="primary" size="small" icon={<ArrowRightOutlined />}>Enroll</Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
