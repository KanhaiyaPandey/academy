import { Metadata } from "next";
import Link from "next/link";
import { Button, Tag } from "antd";
import { ClockCircleOutlined, CheckCircleFilled, ArrowLeftOutlined } from "@ant-design/icons";
import { notFound } from "next/navigation";

const coursesData: Record<string, {
  code: string; name: string; description: string; duration: string;
  level: string; fees: number; emoji: string; color: string;
  curriculum: string[]; outcomes: string[]; prerequisites: string;
}> = {
  "python-programming": {
    code: "PY-03", name: "Python Programming", emoji: "🐍", color: "#52c41a",
    level: "Beginner", duration: "4 months (16 weeks)", fees: 7000,
    description: "A comprehensive hands-on Python course taking you from absolute beginner to building real-world applications. Covers everything from basic syntax to Django web development.",
    curriculum: ["Python Basics & Setup", "Data Types, Variables & Operators", "Control Flow & Loops", "Functions & Modules", "File Handling & Exceptions", "Object-Oriented Programming", "Working with APIs & JSON", "Database with SQLite", "Introduction to Django", "Final Project: Build a Web App"],
    outcomes: ["Write clean Python scripts for automation", "Build command-line tools", "Work with files, APIs, and databases", "Create basic Django web applications", "Earn a Python programming certificate"],
    prerequisites: "Basic computer knowledge. No programming experience needed.",
  },
  "fullstack-web-development": {
    code: "WD-04", name: "Full Stack Web Development", emoji: "🌐", color: "#1677ff",
    level: "Intermediate", duration: "6 months (24 weeks)", fees: 12000,
    description: "The most comprehensive web development course at Pahal Academy. Learn everything from building beautiful websites to deploying full-stack applications with React and Node.js.",
    curriculum: ["HTML5 & Semantic Markup", "CSS3 & Responsive Design", "JavaScript Fundamentals", "DOM Manipulation & Events", "ES6+ Modern JavaScript", "React & Component Architecture", "React Hooks & State Management", "Node.js & Express", "REST APIs & MongoDB", "Git & Deployment (Vercel/Netlify)"],
    outcomes: ["Build complete web applications from scratch", "Work with React and Node.js professionally", "Deploy apps to production", "Understand front-end and back-end architecture", "Build a professional portfolio"],
    prerequisites: "Basic computer knowledge. Familiarity with computers required.",
  },
  "dca-diploma-computer-applications": {
    code: "DCA-02", name: "Diploma in Computer Applications", emoji: "🖥️", color: "#fa8c16",
    level: "Beginner", duration: "6 months (24 weeks)", fees: 8000,
    description: "A government-recognized diploma covering all essential computer applications needed for office work, accounting, and entry-level IT roles.",
    curriculum: ["Computer Fundamentals", "Windows OS & File Management", "MS Word Advanced", "MS Excel & Formulas", "MS PowerPoint", "Internet & Email", "C Programming Basics", "Introduction to Database", "Tally Prime Basics", "Basic HTML & Web Design"],
    outcomes: ["Proficient in MS Office suite", "Basic programming knowledge in C", "Tally accounting fundamentals", "Government-recognized diploma certificate", "Ready for data entry and office roles"],
    prerequisites: "10th pass or above. No prior computer knowledge needed.",
  },
  "adca-advanced-diploma": {
    code: "ADCA-06", name: "Advanced Diploma in Computer Applications", emoji: "🚀", color: "#722ed1",
    level: "Advanced", duration: "1 year (52 weeks)", fees: 15000,
    description: "The most comprehensive 1-year IT program at Pahal Academy. Covers programming, networking, web development, database management, and a major project.",
    curriculum: ["Computer Fundamentals & OS", "C & C++ Programming", "Data Structures", "Database Management (SQL)", "Computer Networking Basics", "HTML, CSS & JavaScript", "Tally Prime with GST", "MS Office Advanced", "Photoshop / Canva Design", "Major Project Work"],
    outcomes: ["Strong programming foundation in C/C++", "Database and networking knowledge", "Full MS Office proficiency", "Complete web design skills", "Industry-ready IT professional"],
    prerequisites: "12th pass or equivalent. Basic computer knowledge preferred.",
  },
  "tally-prime-gst": {
    code: "TALLY-05", name: "Tally Prime with GST", emoji: "📊", color: "#13c2c2",
    level: "Beginner", duration: "2 months (8 weeks)", fees: 4000,
    description: "Master Tally Prime for accounting, inventory management, GST filing, TDS, and payroll. Essential for commerce students and anyone in finance.",
    curriculum: ["Introduction to Tally Prime", "Company Creation & Setup", "Ledger & Group Management", "Voucher Entry (All Types)", "Inventory Management", "GST Configuration & Filing", "TDS & TCS Entries", "Bank Reconciliation", "Payroll Management", "MIS Reports & Balance Sheet"],
    outcomes: ["Complete Tally Prime proficiency", "File GST returns independently", "Manage accounts for small businesses", "Generate financial reports", "Tally completion certificate"],
    prerequisites: "Basic computer skills. Commerce background helpful but not mandatory.",
  },
  "ccc-certificate-computer-concepts": {
    code: "CCC-01", name: "CCC Certificate in Computer Concepts", emoji: "🏅", color: "#eb2f96",
    level: "Beginner", duration: "3 months (12 weeks)", fees: 3500,
    description: "NIELIT-pattern CCC certificate course covering computer fundamentals, MS Office, internet usage, and digital payments. Government-recognized certification.",
    curriculum: ["Introduction to Computers", "Windows Operating System", "MS Word Basics", "MS Excel Basics", "MS PowerPoint", "Internet & Email", "Digital Payments & UPI", "Cyber Security Basics", "Online Services (e-Gov)", "Practice Tests & Mock Exams"],
    outcomes: ["Government-recognized CCC certificate", "MS Office proficiency", "Safe internet usage skills", "Digital payment literacy", "Eligible for many govt job requirements"],
    prerequisites: "No prior experience needed. Anyone can join.",
  },
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const course = coursesData[slug];
  return {
    title: course?.name || "Course",
    description: course?.description?.slice(0, 160),
  };
}

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const course = coursesData[slug];
  if (!course) notFound();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/courses" className="inline-flex items-center gap-2 text-gray-500 hover:text-primary-500 transition-colors mb-6 no-underline">
            <ArrowLeftOutlined /> Back to Courses
          </Link>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div
              className="w-24 h-24 rounded-3xl flex items-center justify-center text-5xl shrink-0"
              style={{ background: `${course.color}15` }}
            >
              {course.emoji}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap gap-2 mb-3">
                <Tag color="default">{course.code}</Tag>
                <Tag color={course.level === "Advanced" ? "purple" : course.level === "Intermediate" ? "blue" : "green"}>
                  {course.level}
                </Tag>
              </div>
              <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-3">{course.name}</h1>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">{course.description}</p>
              <div className="flex flex-wrap items-center gap-6 mt-5">
                <div className="flex items-center gap-2 text-gray-600">
                  <ClockCircleOutlined /> <span className="font-medium">{course.duration}</span>
                </div>
                <div className="font-display text-3xl font-bold text-primary-500">
                  ₹{course.fees.toLocaleString("en-IN")}
                </div>
              </div>
            </div>
            <div className="shrink-0">
              <Link href="/admission">
                <Button type="primary" size="large" style={{ height: 52, paddingInline: 28, fontWeight: 600 }}>
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
            {/* Curriculum */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">📚 Course Curriculum</h2>
              <div className="space-y-2">
                {course.curriculum.map((item, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors">
                    <span className="w-7 h-7 rounded-full bg-primary-100 text-primary-600 text-sm font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Learning Outcomes */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">🎯 What You'll Achieve</h2>
              <div className="space-y-3">
                {course.outcomes.map((outcome, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircleFilled style={{ color: "#52c41a", fontSize: 18 }} className="shrink-0 mt-0.5" />
                    <span className="text-gray-700">{outcome}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5">
            {/* Enroll Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 sticky top-24">
              <div className="text-center mb-6">
                <div className="font-display text-4xl font-bold text-primary-500">
                  ₹{course.fees.toLocaleString("en-IN")}
                </div>
                <div className="text-sm text-gray-400 mt-1">Total course fee</div>
                <div className="text-xs text-green-600 bg-green-50 px-3 py-1 rounded-full inline-block mt-2">
                  ✓ Installments available
                </div>
              </div>
              <Link href="/admission" className="block">
                <Button type="primary" block size="large" style={{ height: 48, fontWeight: 600, borderRadius: 10 }}>
                  Apply for Admission
                </Button>
              </Link>
              <Link href="/contact" className="block mt-3">
                <Button block size="large" style={{ height: 48, borderRadius: 10 }}>
                  Enquire Now
                </Button>
              </Link>

              <div className="mt-6 space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-2"><span>⏱</span> Duration: {course.duration}</div>
                <div className="flex items-center gap-2"><span>📍</span> Mode: In-person, Ranchi</div>
                <div className="flex items-center gap-2"><span>📋</span> Prerequisites: {course.prerequisites}</div>
                <div className="flex items-center gap-2"><span>🏅</span> Certificate: Yes, on completion</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
