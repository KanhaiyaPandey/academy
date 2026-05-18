import Link from "next/link";
import { Button } from "antd";
import { ArrowRightOutlined, PhoneOutlined } from "@ant-design/icons";

export function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          className="rounded-3xl p-12 lg:p-16 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #a855f7 0%, #9333ea 100%)",
          }}
        >
          {/* Decorative */}
          <div
            className="absolute top-0 right-0 w-64 h-64 rounded-full opacity-10"
            style={{ background: "white", transform: "translate(30%, -30%)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-48 h-48 rounded-full opacity-10"
            style={{ background: "white", transform: "translate(-30%, 30%)" }}
          />

          <div className="relative">
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Begin Your Beauty Journey?
            </h2>
            <p className="text-purple-100 text-lg mb-10 max-w-xl mx-auto">
              Join hundreds of students who've already launched successful beauty careers with Pahal Academy. Admissions are open for 2025 batches.
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/admission">
                <Button
                  size="large"
                  style={{
                    height: 52,
                    paddingInline: 32,
                    fontSize: 16,
                    fontWeight: 700,
                    borderRadius: 10,
                    background: "white",
                    color: "#9333ea",
                    border: "none",
                  }}
                  icon={<ArrowRightOutlined />}
                  iconPosition="end"
                >
                  Apply for Admission
                </Button>
              </Link>
              <a href="tel:+91XXXXXXXXXX">
                <Button
                  size="large"
                  style={{
                    height: 52,
                    paddingInline: 32,
                    fontSize: 16,
                    fontWeight: 600,
                    borderRadius: 10,
                    background: "rgba(255,255,255,0.15)",
                    color: "white",
                    border: "2px solid rgba(255,255,255,0.4)",
                  }}
                  icon={<PhoneOutlined />}
                >
                  Call Us Now
                </Button>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
