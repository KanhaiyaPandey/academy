const stats = [
  { value: "500+", label: "Students Trained", icon: "🎓" },
  { value: "6+", label: "Beauty Courses", icon: "💄" },
  { value: "95%", label: "Employment Rate", icon: "🏆" },
  { value: "7+", label: "Years of Excellence", icon: "⭐" },
];

export function StatsSection() {
  return (
    <section className="bg-primary-500 py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="font-display text-3xl lg:text-4xl font-bold text-white mb-1">
                {stat.value}
              </div>
              <div className="text-primary-100 text-sm font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
