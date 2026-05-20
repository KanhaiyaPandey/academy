import Link from "next/link";
import { ScissorOutlined, PhoneOutlined, MailOutlined, EnvironmentOutlined } from "@ant-design/icons";

export function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-lg bg-primary-500 flex items-center justify-center">
                <ScissorOutlined style={{ color: "white", fontSize: 18 }} />
              </div>
              <div>
                <span className="font-display font-bold text-lg text-white block leading-none">
                  Pahal Academy
                </span>
                <span className="text-xs text-primary-400 leading-none">
                  Beauty & Cosmetology Courses
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Empowering students with professional beauty skills and industry-recognized certifications since 2018.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: "Home", href: "/" },
                { label: "Courses", href: "/courses" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "Apply Now", href: "/admission" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Courses */}
          <div>
            <h3 className="font-semibold text-white mb-4">Popular Courses</h3>
            <ul className="space-y-2">
              {[
                "Makeup Artistry",
                "Hair Styling & Cutting",
                "Skincare & Facial Therapy",
                "Nail Art & Extensions",
                "Bridal Makeup & Styling",
                "Advanced Cosmetology Diploma",
              ].map((course) => (
                <li key={course}>
                  <Link
                    href="/courses"
                    className="text-sm text-gray-400 hover:text-primary-400 transition-colors no-underline"
                  >
                    {course}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-white mb-4">Contact Us</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-gray-400">
                <EnvironmentOutlined className="mt-0.5 text-primary-400 shrink-0" />
                <span>3rd Floor Tulsi complex, Nr Kankaria Gate no 1, Above William Jones pizza, Maninagar, Ahmedabad Gujarat --- 380008</span>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <PhoneOutlined className="text-primary-400" />
                <a href="tel:+919XXXXXXXXX" className="hover:text-primary-400 transition-colors no-underline text-gray-400">
                  +91-9XXXXXXXXX
                </a>
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MailOutlined className="text-primary-400" />
                <a href="mailto:info@pahalacademy.com" className="hover:text-primary-400 transition-colors no-underline text-gray-400">
                  info@pahalacademy.com
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Pahal Beauty Academy. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Shaping Beauty Careers in Jharkhand
          </p>
        </div>
      </div>
    </footer>
  );
}
