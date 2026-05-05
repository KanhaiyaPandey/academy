import Link from "next/link";
import { Button, Tag } from "antd";
import { ArrowRightOutlined, ClockCircleOutlined, BookOutlined } from "@ant-design/icons";

const featuredCourses = [
  {
    id: 1,
    code: "MUA-01",
    name: "Makeup Artistry",
    description: "Learn professional makeup from basics to editorial looks — foundation, contouring, eye art, and bridal finishes.",
    duration: "3 months",
    level: "Beginner",
    fees: 8000,
    color: "#eb2f96",
    emoji: "💄",
    tag: "Most Popular",
    slug: "makeup-artistry",
  },
  {
    id: 2,
    code: "HS-02",
    name: "Hair Styling & Cutting",
    description: "Master cutting techniques, blow-dry styling, coloring basics, and trending hairstyles for salon-ready skills.",
    duration: "4 months",
    level: "Intermediate",
    fees: 10000,
    color: "#722ed1",
    emoji: "✂️",
    tag: "Best Value",
    slug: "hair-styling-cutting",
  },
  {
    id: 3,
    code: "SK-03",
    name: "Skincare & Facial Therapy",
    description: "Learn skin analysis, cleansing routines, facials, and treatment therapies used in professional spas and clinics.",
    duration: "3 months",
    level: "Beginner",
    fees: 7000,
    color: "#52c41a",
    emoji: "🌿",
    tag: "In Demand",
    slug: "skincare-facial-therapy",
  },
  {
    id: 4,
    code: "NA-04",
    name: "Nail Art & Extensions",
    description: "From classic manicures to gel extensions, nail art designs, and 3D nail techniques for premium nail studios.",
    duration: "2 months",
    level: "Beginner",
    fees: 5000,
    color: "#fa8c16",
    emoji: "💅",
    tag: "Quick Course",
    slug: "nail-art-extensions",
  },
  {
    id: 5,
    code: "BM-05",
    name: "Bridal Makeup & Styling",
    description: "Specialised bridal makeup, draping, and hairstyling for weddings. Build a full bridal portfolio and clientele.",
    duration: "2 months",
    level: "Advanced",
    fees: 12000,
    color: "#f5222d",
    emoji: "👰",
    tag: "High Earning",
    slug: "bridal-makeup-styling",
  },
  {
    id: 6,
    code: "ACD-06",
    name: "Advanced Cosmetology Diploma",
    description: "1-year complete program covering makeup, hair, skincare, nail art, salon management, and capstone project.",
    duration: "1 year",
    level: "Advanced",
    fees: 20000,
    color: "#13c2c2",
    emoji: "🎓",
    tag: "Complete Package",
    slug: "advanced-cosmetology-diploma",
  },
];

function CourseCard({ course }: { course: (typeof featuredCourses)[0] }) {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 hover:border-primary-200 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Card Header */}
      <div
        className="h-28 flex items-center justify-center relative overflow-hidden"
        style={{ background: `${course.color}12` }}
      >
        <span className="text-5xl">{course.emoji}</span>
        <div
          className="absolute top-3 right-3 text-xs font-semibold px-2.5 py-1 rounded-full"
          style={{ background: `${course.color}20`, color: course.color }}
        >
          {course.tag}
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col flex-1">
        <Tag color="default" className="self-start mb-2 text-xs">
          {course.code}
        </Tag>
        <h3 className="font-display font-semibold text-gray-900 text-lg mb-2 leading-tight">
          {course.name}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
          {course.description}
        </p>

        {/* Meta */}
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <ClockCircleOutlined />
            {course.duration}
          </span>
          <span className="flex items-center gap-1">
            <BookOutlined />
            {course.level}
          </span>
        </div>

        {/* Price + CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div>
            <span className="font-display font-bold text-xl text-gray-900">
              ₹{course.fees.toLocaleString("en-IN")}
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

export function FeaturedCourses() {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>

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
