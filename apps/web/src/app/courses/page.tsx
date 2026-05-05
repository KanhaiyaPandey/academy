import { Metadata } from "next";
import Link from "next/link";
import { Button, Tag } from "antd";
import { ClockCircleOutlined, BookOutlined, ArrowRightOutlined } from "@ant-design/icons";

export const metadata: Metadata = {
  title: "Courses",
  description: "Explore all computer and IT courses at Pahal Academy — CCC, DCA, Python, Web Development, Tally, and more.",
};

const courses = [
  {
    code: "CCC-01", name: "CCC Certificate", slug: "ccc-certificate-computer-concepts",
    description: "NIELIT-pattern certificate covering computer basics, MS Office, internet, and digital literacy. Perfect for beginners.",
    duration: "3 months", level: "Beginner", fees: 3500, emoji: "🏅",
    color: "#eb2f96", highlights: ["MS Office Suite", "Internet & Email", "Digital Payments", "Govt Recognized"],
  },
  {
    code: "DCA-02", name: "Diploma in Computer Applications", slug: "dca-diploma-computer-applications",
    description: "6-month government-recognized diploma covering C programming, database, Tally, and web development fundamentals.",
    duration: "6 months", level: "Beginner", fees: 8000, emoji: "🖥️",
    color: "#fa8c16", highlights: ["C Programming", "MS Office", "Tally Prime", "Basic Web Design"],
  },
  {
    code: "PY-03", name: "Python Programming", slug: "python-programming",
    description: "Learn Python from fundamentals to building real applications — scripts, automation, APIs, and Django web apps.",
    duration: "4 months", level: "Beginner", fees: 7000, emoji: "🐍",
    color: "#52c41a", highlights: ["Python Basics", "OOP", "File Handling", "Django Intro"],
  },
  {
    code: "WD-04", name: "Full Stack Web Development", slug: "fullstack-web-development",
    description: "Complete web development from HTML to React and Node.js. Build and deploy real-world applications.",
    duration: "6 months", level: "Intermediate", fees: 12000, emoji: "🌐",
    color: "#1677ff", highlights: ["HTML/CSS/JS", "React", "Node.js", "MongoDB", "Deployment"],
  },
  {
    code: "TALLY-05", name: "Tally Prime with GST", slug: "tally-prime-gst",
    description: "Master Tally Prime for accounting, inventory, GST filing, TDS, and payroll. Essential for commerce students.",
    duration: "2 months", level: "Beginner", fees: 4000, emoji: "📊",
    color: "#13c2c2", highlights: ["Tally Prime", "GST Filing", "Inventory", "Payroll"],
  },
  {
    code: "ADCA-06", name: "Advanced Diploma (ADCA)", slug: "adca-advanced-diploma",
    description: "1-year comprehensive IT program — programming, networking, database, web development, and capstone project.",
    duration: "1 year", level: "Advanced", fees: 15000, emoji: "🚀",
    color: "#722ed1", highlights: ["C/C++", "Networking", "Web Dev", "Database", "Project Work"],
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
            Practical, industry-aligned IT programs from beginner to advanced. Find your perfect course.
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
                      <Button type="primary" size="small">Enroll</Button>
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
