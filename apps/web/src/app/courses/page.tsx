import { Metadata } from "next";
import Link from "next/link";
import { Button, Tag } from "antd";
import { ClockCircleOutlined, ArrowRightOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Courses",
  description: "Explore all beauty and cosmetology courses at Pahal Academy — Makeup Artistry, Hair Styling, Skincare, Nail Art, Bridal Makeup, and more.",
};

const courses = [
  {
    code: "MUA-01", name: "Makeup Artistry", slug: "makeup-artistry",
    description: "Learn professional makeup from basics to editorial and bridal looks — foundation, contouring, eye art, and finishing techniques on real models.",
    duration: "3 months", level: "Beginner", fees: 8000, emoji: "💄",
    color: "#eb2f96", highlights: ["Basic to Pro Looks", "Skin Prep & Foundation", "Eye & Lip Art", "Portfolio Shoot"],
  },
  {
    code: "HS-02", name: "Hair Styling & Cutting", slug: "hair-styling-cutting",
    description: "Master cutting techniques, blow-dry styling, coloring basics, and trending hairstyles for a confident start in any professional salon.",
    duration: "4 months", level: "Intermediate", fees: 10000, emoji: "✂️",
    color: "#722ed1", highlights: ["Cutting Techniques", "Blow-dry & Setting", "Coloring Basics", "Trending Styles"],
  },
  {
    code: "SK-03", name: "Skincare & Facial Therapy", slug: "skincare-facial-therapy",
    description: "Learn skin analysis, cleansing routines, professional facials, and treatment therapies used in top spas and aesthetic clinics.",
    duration: "3 months", level: "Beginner", fees: 7000, emoji: "🌿",
    color: "#52c41a", highlights: ["Skin Analysis", "Classic Facials", "Cleansing Routines", "Treatment Therapy"],
  },
  {
    code: "NA-04", name: "Nail Art & Extensions", slug: "nail-art-extensions",
    description: "From classic manicures and pedicures to gel extensions, nail art designs, and 3D nail art for premium nail studios.",
    duration: "2 months", level: "Beginner", fees: 5000, emoji: "💅",
    color: "#fa8c16", highlights: ["Manicure & Pedicure", "Gel Extensions", "Nail Art Designs", "3D Nail Art"],
  },
  {
    code: "BM-05", name: "Bridal Makeup & Styling", slug: "bridal-makeup-styling",
    description: "Specialised bridal makeup, saree draping, and hairstyling for weddings. Build a full bridal portfolio and start your freelance practice.",
    duration: "2 months", level: "Advanced", fees: 12000, emoji: "👰",
    color: "#f5222d", highlights: ["Bridal Makeup", "Saree Draping", "Bridal Hairstyling", "Portfolio Building"],
  },
  {
    code: "ACD-06", name: "Advanced Cosmetology Diploma", slug: "advanced-cosmetology-diploma",
    description: "1-year comprehensive beauty program covering makeup, hair, skincare, nail art, salon management, and a full capstone project.",
    duration: "1 year", level: "Advanced", fees: 20000, emoji: "🎓",
    color: "#13c2c2", highlights: ["Makeup & Hair", "Skincare & Nails", "Salon Management", "Capstone Project"],
  },
];

export default function CoursesPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">
            All Courses
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto">
            Practical, industry-aligned beauty programs from beginner to advanced. Find your perfect course.
          </p>
        </div>
      </div>

      {/* Courses Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course.code} className="bg-white rounded-2xl border border-gray-100 hover:border-primary-200 shadow-sm hover:shadow-xl hover:shadow-primary-500/10 transition-all duration-300 overflow-hidden flex flex-col">
              <div className="h-32 flex items-center justify-center" style={{ background: `${course.color}10` }}>
                <span className="text-6xl">{course.emoji}</span>
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center gap-2 mb-3">
                  <Tag color="default" className="text-xs">{course.code}</Tag>
                  <Tag color={course.level === "Advanced" ? "purple" : course.level === "Intermediate" ? "blue" : "green"} className="text-xs">
                    {course.level}
                  </Tag>
                </div>
                <h2 className="font-display font-bold text-xl text-gray-900 mb-2">{course.name}</h2>
                <p className="text-gray-500 text-sm leading-relaxed mb-4 flex-1">{course.description}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {course.highlights.map((h) => (
                    <span key={h} className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">{h}</span>
                  ))}
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                  <span className="flex items-center gap-1"><ClockCircleOutlined />{course.duration}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <span className="font-display font-bold text-2xl text-gray-900">
                    ₹{course.fees.toLocaleString("en-IN")}
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
          ))}
        </div>
      </div>
    </div>
  );
}
