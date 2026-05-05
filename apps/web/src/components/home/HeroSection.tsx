import Link from "next/link";
import { Button, Tag } from "antd";
import {
  ArrowRightOutlined,
  PlayCircleOutlined,
  CheckCircleFilled,
} from "@ant-design/icons";

const highlights = [
  "Industry-recognized certificates",
  "Hands-on practical training",
  "Job placement assistance",
];

export function HeroSection() {
  return (
    <section className="relative bg-white overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.07]"
          style={{
            background:
              "radial-gradient(circle, #1677ff 0%, transparent 70%)",
            transform: "translate(30%, -30%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{
            background:
              "radial-gradient(circle, #0958d9 0%, transparent 70%)",
            transform: "translate(-30%, 30%)",
          }}
        />
        {/* Grid dots */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle, #1677ff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 lg:pt-28 lg:pb-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-up">
            <Tag
              color="blue"
              className="mb-6 px-3 py-1 text-sm font-medium rounded-full"
            >
              🚀 Admissions Open — 2025 Batch
            </Tag>

            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] mb-6">
              Start Your{" "}
              <span
                className="relative"
                style={{
                  background: "linear-gradient(135deg, #1677ff, #0958d9)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Tech Career
              </span>{" "}
              with Pahal Academy
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed mb-8 max-w-lg">
              Master in-demand computer skills with our practical, job-ready
              courses. From basic computing to full stack development — we've
              got the course for you.
            </p>

            {/* Highlights */}
            <ul className="space-y-3 mb-10">
              {highlights.map((point) => (
                <li key={point} className="flex items-center gap-3">
                  <CheckCircleFilled
                    style={{ color: "#1677ff", fontSize: 18 }}
                  />
                  <span className="text-gray-700 font-medium">{point}</span>
                </li>
              ))}
            </ul>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4">
              <Link href="/admission">
                <Button
                  type="primary"
                  size="large"
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                  style={{
                    height: 52,
                    paddingInline: 28,
                    fontSize: 16,
                    fontWeight: 600,
                    borderRadius: 10,
                    background: "linear-gradient(135deg, #1677ff, #0958d9)",
                    border: "none",
                    boxShadow: "0 8px 24px rgba(22,119,255,0.35)",
                  }}
                >
                  Enroll Now — Free
                </Button>
              </Link>
              <Link href="/courses">
                <Button
                  size="large"
                  icon={<PlayCircleOutlined />}
                  style={{
                    height: 52,
                    paddingInline: 28,
                    fontSize: 16,
                    fontWeight: 600,
                    borderRadius: 10,
                    border: "2px solid #e5e7eb",
                  }}
                >
                  Browse Courses
                </Button>
              </Link>
            </div>
          </div>

          {/* Right — Visual Card Stack */}
          <div className="relative hidden lg:block">
            <div className="relative animate-float">
              {/* Main card */}
              <div
                className="relative rounded-3xl overflow-hidden shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #1677ff 0%, #0958d9 100%)",
                  padding: "2px",
                }}
              >
                <div className="rounded-[calc(1.5rem-2px)] bg-white p-8">
                  {/* Course stats visual */}
                  <div className="text-center mb-6">
                    <div className="text-5xl font-display font-black text-primary-500 mb-2">
                      6+
                    </div>
                    <div className="text-gray-600 font-medium">
                      IT & Computer Courses
                    </div>
                  </div>

                  {/* Mini course list */}
                  <div className="space-y-3">
                    {[
                      { name: "Python Programming", level: "Beginner", color: "#52c41a" },
                      { name: "Full Stack Web Dev", level: "Intermediate", color: "#1677ff" },
                      { name: "DCA Diploma", level: "Beginner", color: "#fa8c16" },
                      { name: "Tally with GST", level: "Beginner", color: "#722ed1" },
                    ].map((course) => (
                      <div
                        key={course.name}
                        className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-primary-50 transition-colors"
                      >
                        <span className="font-medium text-gray-800 text-sm">
                          {course.name}
                        </span>
                        <span
                          className="text-xs font-semibold px-2 py-1 rounded-full"
                          style={{
                            background: `${course.color}15`,
                            color: course.color,
                          }}
                        >
                          {course.level}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating stat chips */}
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
                <span className="text-2xl font-bold text-primary-500">500+</span>
                <span className="text-sm text-gray-600 font-medium">Students Trained</span>
              </div>

              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-lg px-4 py-3 flex items-center gap-2">
                <span className="text-2xl">⭐</span>
                <div>
                  <div className="text-sm font-bold text-gray-900">4.9/5</div>
                  <div className="text-xs text-gray-500">Student Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
