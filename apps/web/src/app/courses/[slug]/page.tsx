import { Metadata } from "next";
import Link from "next/link";
import { Button, Tag } from "antd";
import { ClockCircleOutlined, ArrowLeftOutlined } from "@ant-design/icons";
import { notFound } from "next/navigation";
import { db } from "@pahal/db/client";
import { courses } from "@pahal/db/schema";
import { eq, and } from "drizzle-orm";

export const revalidate = 300;

async function getCourse(slug: string) {
  const [course] = await db
    .select()
    .from(courses)
    .where(and(eq(courses.slug, slug), eq(courses.isActive, true)));
  return course ?? null;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const course = await getCourse(slug);
  return {
    title: course?.name || "Course",
    description: (course?.shortDescription || course?.description || "").slice(0, 160),
  };
}

const BG_LEVEL: Record<string, string> = {
  beginner: "bg-green-50",
  intermediate: "bg-blue-50",
  advanced: "bg-purple-50",
};

const EMOJI_LEVEL: Record<string, string> = {
  beginner: "🌸",
  intermediate: "📚",
  advanced: "🎓",
};

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const course = await getCourse(slug);
  if (!course) notFound();

  const bgClass = BG_LEVEL[course.level] || "bg-gray-50";
  const emoji = EMOJI_LEVEL[course.level] || "📚";

  // Syllabus stored as JSON array of strings by the admin
  let curriculum: string[] = [];
  if (course.syllabus) {
    try {
      const parsed = JSON.parse(course.syllabus);
      if (Array.isArray(parsed)) curriculum = parsed.map(String);
    } catch {
      // Stored as plain text — split by newline
      curriculum = course.syllabus.split("\n").map((s) => s.trim()).filter(Boolean);
    }
  }

  const highlights = course.tags
    ? course.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  const levelColor =
    course.level === "advanced" ? "purple" : course.level === "intermediate" ? "blue" : "green";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/courses"
            className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-500 transition-colors mb-6 no-underline"
          >
            <ArrowLeftOutlined /> Back to Courses
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className={`w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shrink-0 ${bgClass}`}>
              {emoji}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Tag color="default">{course.courseCode}</Tag>
                <Tag color={levelColor}>
                  {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
                </Tag>
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
                {course.name}
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                {course.description || course.shortDescription}
              </p>
              <div className="flex flex-wrap items-center gap-6 mt-5">
                <div className="flex items-center gap-2 text-gray-600">
                  <ClockCircleOutlined />{" "}
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="font-display text-3xl font-bold text-primary-500">
                  ₹{Number(course.fees).toLocaleString("en-IN")}
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <Link href="/admission">
                <Button
                  type="primary"
                  size="large"
                  className="!h-[52px] !px-7 !font-semibold"
                >
                  Enroll Now
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {curriculum.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
                  📚 Course Curriculum
                </h2>
                <div className="space-y-2">
                  {curriculum.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                    >
                      <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-600 text-sm font-bold flex items-center justify-center shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {highlights.length > 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
                <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">
                  ✨ Course Highlights
                </h2>
                <div className="flex flex-wrap gap-3">
                  {highlights.map((h) => (
                    <span
                      key={h}
                      className="bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium"
                    >
                      {h}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {curriculum.length === 0 && highlights.length === 0 && (
              <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center text-gray-400">
                <p>For full course details, contact us or visit the academy.</p>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="text-center mb-6">
                <div className="font-display text-4xl font-bold text-primary-500">
                  ₹{Number(course.fees).toLocaleString("en-IN")}
                </div>
                <div className="text-sm text-gray-400 mt-1">Total course fee</div>
                <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block mt-2">
                  ✓ Installments available
                </div>
              </div>
              <Link href="/admission" className="block">
                <Button
                  type="primary"
                  block
                  size="large"
                  style={{ height: 48, fontWeight: 600, borderRadius: 10 }}
                >
                  Apply for Admission
                </Button>
              </Link>
              <Link href="/contact" className="block mt-3">
                <Button block size="large" style={{ height: 48, borderRadius: 10 }}>
                  Enquire Now
                </Button>
              </Link>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span>⏱</span> Duration: {course.duration}
                </div>
                <div className="flex items-center gap-2">
                  <span>📍</span> Mode: In-person, Ranchi
                </div>
                <div className="flex items-center gap-2">
                  <span>🏅</span> Certificate: Yes, on completion
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
