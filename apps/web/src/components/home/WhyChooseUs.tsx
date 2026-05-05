const reasons = [
  {
    icon: "🎯",
    title: "Hands-on Practical Training",
    description:
      "Every course is built around real client practice. You leave with a full portfolio of looks and skills, not just a certificate.",
  },
  {
    icon: "👩‍🏫",
    title: "Expert Faculty",
    description:
      "Learn from working beauty professionals with 5+ years of salon and studio experience — not just classroom trainers.",
  },
  {
    icon: "🏆",
    title: "Recognized Certifications",
    description:
      "Our diplomas and certificates are recognized by leading salons, spas, and bridal studios across India.",
  },
  {
    icon: "💼",
    title: "Salon Placement Support",
    description:
      "We connect our graduates with top salons, wedding studios, and spas through our industry placement network.",
  },
  {
    icon: "📱",
    title: "Small Batch Sizes",
    description:
      "Maximum 15 students per batch ensures personalized attention, hands-on guidance, and better learning outcomes.",
  },
  {
    icon: "💰",
    title: "Affordable Fees",
    description:
      "Quality beauty education shouldn't be expensive. Our courses offer the best value with easy installment options.",
  },
];

export function WhyChooseUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left */}
          <div>
            <span className="inline-block text-primary-500 font-semibold text-sm uppercase tracking-wider mb-3">
              Why Pahal Academy
            </span>
            <h2 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              The Smart Choice for Your{" "}
              <span className="text-primary-500">Beauty Career</span>
            </h2>
            <p className="text-gray-500 text-lg leading-relaxed mb-8">
              Since 2018, we've been transforming passionate students into confident beauty professionals. Our approach focuses on real skills, not just theory.
            </p>

            {/* Highlight box */}
            <div className="bg-primary-50 border border-primary-100 rounded-2xl p-6">
              <div className="text-2xl font-display font-bold text-primary-500 mb-1">
                95% Employment Rate
              </div>
              <div className="text-gray-600 text-sm">
                Of our graduates secured positions at salons, studios, or launched their own freelance practice within 3 months of completing their course.
              </div>
            </div>
          </div>

          {/* Right — reason grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {reasons.map((reason) => (
              <div
                key={reason.title}
                className="group p-5 rounded-2xl bg-gray-50 hover:bg-primary-50 hover:border-primary-100 border border-transparent transition-all duration-200"
              >
                <span className="text-3xl mb-3 block">{reason.icon}</span>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {reason.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {reason.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
