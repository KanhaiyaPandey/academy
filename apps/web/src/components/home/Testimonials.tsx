const testimonials = [
  {
    name: "Rahul Sharma",
    role: "Software Engineer at TCS",
    content:
      "Pahal Academy completely changed my career trajectory. The Python course was hands-on and teachers were always available for doubt sessions. I got placed within 3 months!",
    rating: 5,
    initials: "RS",
    color: "#1677ff",
  },
  {
    name: "Priya Kumari",
    role: "Frontend Developer",
    content:
      "The Full Stack course was incredibly practical. We built real projects from day one. Faculty is knowledgeable and batch sizes are small enough for personal attention.",
    rating: 5,
    initials: "PK",
    color: "#52c41a",
  },
  {
    name: "Manish Verma",
    role: "Accountant at CA Firm",
    content:
      "Tally with GST course was exactly what I needed. Very affordable, and the certificate helped me land a job immediately. Highly recommend for commerce students.",
    rating: 5,
    initials: "MV",
    color: "#fa8c16",
  },
  {
    name: "Kavya Singh",
    role: "Freelance Web Developer",
    content:
      "Best investment I made in my education. The ADCA course gave me solid IT foundations. Now I work as a freelancer and earn well from home.",
    rating: 5,
    initials: "KS",
    color: "#722ed1",
  },
];

export function Testimonials() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-primary-500 font-semibold text-sm uppercase tracking-wider mb-3">
            Student Stories
          </span>
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            What Our Graduates Say
          </h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Real stories from real students who transformed their careers with Pahal Academy.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.name}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <span key={i} className="text-yellow-400 text-lg">★</span>
                ))}
              </div>

              {/* Quote */}
              <p className="text-gray-700 leading-relaxed mb-6 italic">
                "{t.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                  style={{ background: t.color }}
                >
                  {t.initials}
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{t.name}</div>
                  <div className="text-sm text-gray-500">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
