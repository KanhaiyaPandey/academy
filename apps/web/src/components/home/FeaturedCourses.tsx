import Link from "next/link";
import { Button, Tag } from "antd";
import { ArrowRightOutlined, ClockCircleOutlined, BookOutlined } from "@ant-design/icons";
import { db } from "@pahal/db/client";
import { courses } from "@pahal/db/schema";
import { eq } from "drizzle-orm";

// Revalidate every 5 minutes
export const revalidate = 300;

const BG_PALETTE = [
  "bg-pink-50", "bg-purple-50", "bg-green-50", "bg-orange-50",
  "bg-red-50", "bg-cyan-50", "bg-blue-50", "bg-violet-50",
];
const EMOJIS = ["💄", "✂️", "🌿", "💅", "👰", "🎓", "🌸", "✨"];

type Course = Awaited<ReturnType<typeof fetchCourses>>[0];

async function fetchCourses() {
  return db
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
      isFeatured: courses.isFeatured,
    })
    .from(courses)
    .where(eq(courses.isActive, true));
}

function CourseCard({ course, index }: { course: Course; index: number }) {
  const bgClass = BG_PALETTE[index % BG_PALETTE.length];
  const emoji = EMOJIS[index % EMOJIS.length];
  const blurb = course.shortDescription || course.description?.slice(0, 130) || "";

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-primary-200 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Card Header */}
      <div className={`h-28 flex items-center justify-center relative overflow-hidden ${bgClass}`}>
        <span className="text-5xl">{emoji}</span>
        {course.isFeatured && (
          <div className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full bg-primary-100 text-primary-600">
            Featured
          </div>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        <Tag color="default" className="self-start mb-2 text-xs">
          {course.courseCode}
        </Tag>
        <h3 className="font-display font-semibold text-gray-900 text-lg mb-2 leading-tight">
          {course.name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">{blurb}</p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <ClockCircleOutlined />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <BookOutlined />
            {course.level.charAt(0).toUpperCase() + course.level.slice(1)}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="font-display font-bold text-xl text-gray-900">
              ₹{Number(course.fees).toLocaleString("en-IN")}
            </span>
            <span className="text-xs text-gray-400 ml-1">total</span>
          </div>
          <Link href={`/courses/${course.slug}`}>
            <Button
              type="primary"
              size="small"
              className="group-hover:shadow-lg transition-shadow"
            >
              View Details
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export async function FeaturedCourses() {
  const allCourses = await fetchCourses();
  // Prefer featured courses, fill rest from active list, cap at 6
  const featured = allCourses.filter((c) => c.isFeatured);
  const rest = allCourses.filter((c) => !c.isFeatured);
  const display = [...featured, ...rest].slice(0, 6);

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <span className="inline-block text-primary-500 font-semibold text-sm uppercase tracking-wider mb-3">
            Our Programs
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Courses Designed for the{" "}
            <span className="text-primary-500">Beauty Industry</span>
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto text-lg">
            From beginner basics to advanced cosmetology — pick a course that matches your passion and career goals.
          </p>
        </div>

        {/* Course Grid */}
        {display.length === 0 ? (
          <p className="text-center text-gray-400 py-12">Courses coming soon!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {display.map((course, i) => (
              <CourseCard key={course.id} course={course} index={i} />
            ))}
          </div>
        )}

        {/* View All */}
        <div className="text-center mt-10">
          <Link href="/courses">
            <Button size="large" icon={<ArrowRightOutlined />} iconPosition="end">
              View All Courses
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
