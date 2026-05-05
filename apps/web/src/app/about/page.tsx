import { Metadata } from "next";
import Link from "next/link";
import { Button } from "antd";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Pahal Academy — our mission, vision, and team dedicated to IT education in Jharkhand.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-primary-500 to-primary-700 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl lg:text-5xl font-bold text-white mb-6">
            About Pahal Academy
          </h1>
          <p className="text-blue-100 text-xl max-w-2xl mx-auto leading-relaxed">
            Empowering students with practical IT skills and digital literacy since 2018 — right here in Jharkhand.
          </p>
        </div>
      </div>

      {/* Our Story */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary-500 font-semibold text-sm uppercase tracking-wider">Our Story</span>
              <h2 className="font-display text-3xl font-bold text-gray-900 mt-2 mb-6">
                Born from a Passion for Tech Education
              </h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Pahal Academy was founded in 2018 with a simple but powerful belief — quality IT education should be accessible to every student in Jharkhand, regardless of their background or economic status.
              </p>
              <p className="text-gray-600 leading-relaxed mb-4">
                Starting with just 20 students and 2 faculty members in a small classroom, we've grown to become one of the most trusted computer training institutes in Ranchi, having trained over 500 students.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Our alumni work at top companies like TCS, Infosys, and various local businesses, or run their own freelance practices — and that is our greatest achievement.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {[
                { label: "Founded", value: "2018", icon: "📅" },
                { label: "Students Trained", value: "500+", icon: "🎓" },
                { label: "Courses Offered", value: "6+", icon: "📚" },
                { label: "Placement Rate", value: "95%", icon: "💼" },
              ].map((s) => (
                <div key={s.label} className="bg-primary-50 rounded-2xl p-6 text-center">
                  <div className="text-4xl mb-2">{s.icon}</div>
                  <div className="font-display text-3xl font-bold text-primary-500 mb-1">{s.value}</div>
                  <div className="text-gray-600 text-sm font-medium">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900">Vision & Mission</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🔭</div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-3">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed">
                To be the leading IT education institution in Jharkhand, producing confident digital professionals who contribute meaningfully to the tech economy of the region.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="font-display text-xl font-bold text-gray-900 mb-3">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed">
                To provide affordable, practical, and industry-aligned computer education that empowers every student with the skills to secure employment or run a successful freelance practice.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900">Our Core Values</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: "🤝", value: "Integrity", desc: "Honest, transparent education with no false promises." },
              { icon: "💡", value: "Innovation", desc: "Always updating our curriculum to match industry needs." },
              { icon: "🌱", value: "Growth", desc: "Every student's success is our success." },
              { icon: "🏡", value: "Community", desc: "Building a network of tech professionals in Jharkhand." },
            ].map((v) => (
              <div key={v.value} className="text-center p-6 rounded-2xl bg-gray-50">
                <div className="text-4xl mb-3">{v.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-2">{v.value}</h3>
                <p className="text-sm text-gray-500">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary-500">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="font-display text-3xl font-bold text-white mb-4">
            Ready to Join Our Community?
          </h2>
          <p className="text-blue-100 text-lg mb-8">
            Take the first step toward your IT career. Applications are open for 2025 batches.
          </p>
          <Link href="/admission">
            <Button size="large" style={{ height: 52, paddingInline: 32, fontWeight: 700, background: "white", color: "#1677ff" }}>
              Apply for Admission
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
