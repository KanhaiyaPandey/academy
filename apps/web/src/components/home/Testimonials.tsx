const testimonials = [
  {
    name: "Ananya Sharma",
    role: "Makeup Artist at Shagun Wedding Studio",
    content:
      "Pahal Academy completely changed my life. The Makeup Artistry course was so hands-on — we practiced on real models from week one. I got placed at a bridal studio within 2 months of completing!",
    rating: 5,
    initials: "AS",
    color: "#eb2f96",
  },
  {
    name: "Priya Kumari",
    role: "Senior Hair Stylist at Style Lounge",
    content:
      "The Hair Styling course was the best investment I've made. Teachers are actual salon professionals, not just instructors. Small batches mean you get personal feedback every single session.",
    rating: 5,
    initials: "PK",
    color: "#722ed1",
  },
  {
    name: "Seema Verma",
    role: "Freelance Bridal Makeup Artist",
    content:
      "The Bridal Makeup course was worth every rupee. Now I handle 3–4 weddings every month on my own. Pahal Academy gave me both the skills and the confidence to build my own clientele.",
    rating: 5,
    initials: "SV",
    color: "#fa8c16",
  },
  {
    name: "Kavya Singh",
    role: "Nail Technician at Glamour Nails",
    content:
      "I was a complete beginner but the faculty is so patient and supportive. The Nail Art course gave me a full-time job at a premium nail studio. I couldn't have asked for a better start!",
    rating: 5,
    initials: "KS",
    color: "#13c2c2",
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
            Real stories from real students who built successful beauty careers with Pahal Academy.
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
                {"★".repeat(t.rating).split("").map((star, i) => (
                  <span key={`${t.name}-star-${i}`} className="text-yellow-400 text-lg">{star}</span>
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
