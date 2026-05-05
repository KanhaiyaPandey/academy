import { db } from "./src/client";
import { courses, students, employees, leads, testimonials } from "./src/schema";

async function seed() {
  console.log("🌱 Seeding Pahal Academy database...");

  // ─── Courses ──────────────────────────────────────────────────────────────
  await db.insert(courses).values([
    {
      courseCode: "CCC-01",
      name: "Certificate in Computer Concepts (CCC)",
      slug: "ccc-certificate-computer-concepts",
      shortDescription: "Master computer fundamentals and get government-recognized certification.",
      description: "A comprehensive course covering basic computer operations, MS Office, internet usage, and digital literacy. Ideal for beginners entering the digital world.",
      level: "beginner",
      duration: "3 months",
      durationWeeks: 12,
      fees: "3500.00",
      tags: "computer basics,ms office,internet,digital literacy",
      isActive: true,
      isFeatured: true,
    },
    {
      courseCode: "DCA-02",
      name: "Diploma in Computer Applications (DCA)",
      slug: "dca-diploma-computer-applications",
      shortDescription: "Complete diploma covering programming, databases, and office tools.",
      description: "A 6-month diploma covering C programming, database management, Tally, and web basics. Perfect for students seeking job-ready IT skills.",
      level: "intermediate",
      duration: "6 months",
      durationWeeks: 24,
      fees: "8000.00",
      tags: "programming,c language,tally,database,web",
      isActive: true,
      isFeatured: true,
    },
    {
      courseCode: "PY-03",
      name: "Python Programming",
      slug: "python-programming",
      shortDescription: "Learn Python from scratch to build real-world applications.",
      description: "Hands-on Python programming course covering syntax, OOP, file handling, APIs, and mini projects. Includes Django introduction for web development.",
      level: "beginner",
      duration: "4 months",
      durationWeeks: 16,
      fees: "7000.00",
      tags: "python,programming,django,web development,automation",
      isActive: true,
      isFeatured: true,
    },
    {
      courseCode: "WD-04",
      name: "Full Stack Web Development",
      slug: "fullstack-web-development",
      shortDescription: "HTML to React — build complete web applications.",
      description: "Learn HTML, CSS, JavaScript, React, Node.js, and databases. Build and deploy real web applications with industry-standard tools.",
      level: "intermediate",
      duration: "6 months",
      durationWeeks: 24,
      fees: "12000.00",
      tags: "html,css,javascript,react,nodejs,web development",
      isActive: true,
      isFeatured: true,
    },
    {
      courseCode: "TALLY-05",
      name: "Tally Prime with GST",
      slug: "tally-prime-gst",
      shortDescription: "Master Tally for accounting and GST filing.",
      description: "Complete Tally Prime training covering accounting, inventory, GST, TDS, and payroll. Essential for finance and commerce students.",
      level: "beginner",
      duration: "2 months",
      durationWeeks: 8,
      fees: "4000.00",
      tags: "tally,gst,accounting,finance,inventory",
      isActive: true,
      isFeatured: false,
    },
    {
      courseCode: "ADCA-06",
      name: "Advanced Diploma in Computer Applications (ADCA)",
      slug: "adca-advanced-diploma",
      shortDescription: "1-year advanced program for comprehensive IT skills.",
      description: "Advanced 1-year program covering programming languages, database, networking, web development, and project work. Best for serious IT aspirants.",
      level: "advanced",
      duration: "1 year",
      durationWeeks: 52,
      fees: "15000.00",
      tags: "advanced,programming,networking,database,project",
      isActive: true,
      isFeatured: true,
    },
  ]).onConflictDoNothing();

  // ─── Students ─────────────────────────────────────────────────────────────
  await db.insert(students).values([
    {
      studentId: "PAH-2024-001",
      firstName: "Rahul",
      lastName: "Sharma",
      email: "rahul.sharma@email.com",
      phone: "9876543210",
      whatsapp: "9876543210",
      gender: "male",
      fatherName: "Ramesh Sharma",
      address: "12 MG Road",
      city: "Ranchi",
      state: "Jharkhand",
      pincode: "834001",
      qualification: "12th Pass",
      status: "active",
      admissionDate: "2024-01-15",
    },
    {
      studentId: "PAH-2024-002",
      firstName: "Priya",
      lastName: "Kumari",
      email: "priya.kumari@email.com",
      phone: "9765432109",
      gender: "female",
      fatherName: "Suresh Kumar",
      city: "Ranchi",
      state: "Jharkhand",
      pincode: "834002",
      qualification: "Graduate",
      status: "active",
      admissionDate: "2024-02-01",
    },
    {
      studentId: "PAH-2024-003",
      firstName: "Amit",
      lastName: "Singh",
      phone: "9654321098",
      gender: "male",
      city: "Hazaribagh",
      state: "Jharkhand",
      qualification: "10th Pass",
      status: "active",
      admissionDate: "2024-03-10",
    },
  ]).onConflictDoNothing();

  // ─── Employees ────────────────────────────────────────────────────────────
  await db.insert(employees).values([
    {
      employeeId: "EMP-001",
      firstName: "Vikash",
      lastName: "Kumar",
      email: "vikash@pahalacademy.com",
      phone: "9801234567",
      role: "admin",
      department: "Management",
      salary: "35000.00",
      joiningDate: "2022-01-01",
      isActive: true,
    },
    {
      employeeId: "EMP-002",
      firstName: "Sunita",
      lastName: "Devi",
      email: "sunita@pahalacademy.com",
      phone: "9812345678",
      role: "teacher",
      department: "Computer Science",
      salary: "22000.00",
      joiningDate: "2022-03-15",
      isActive: true,
    },
    {
      employeeId: "EMP-003",
      firstName: "Ravi",
      lastName: "Prasad",
      email: "ravi@pahalacademy.com",
      phone: "9823456789",
      role: "teacher",
      department: "Programming",
      salary: "25000.00",
      joiningDate: "2023-01-10",
      isActive: true,
    },
  ]).onConflictDoNothing();

  // ─── Leads ────────────────────────────────────────────────────────────────
  await db.insert(leads).values([
    {
      name: "Sanjay Yadav",
      phone: "9900123456",
      email: "sanjay@email.com",
      courseInterest: "Python Programming",
      source: "website",
      status: "new",
    },
    {
      name: "Pooja Gupta",
      phone: "9900234567",
      courseInterest: "Full Stack Web Development",
      source: "social",
      status: "contacted",
    },
    {
      name: "Manish Tiwari",
      phone: "9900345678",
      courseInterest: "DCA",
      source: "walkin",
      status: "interested",
    },
  ]).onConflictDoNothing();

  // ─── Testimonials ─────────────────────────────────────────────────────────
  await db.insert(testimonials).values([
    {
      name: "Rahul Sharma",
      role: "Got placed at TCS",
      content: "Pahal Academy completely changed my career trajectory. The Python course was hands-on and the teachers were always available for doubt sessions. I got placed within 3 months of completing the course!",
      rating: 5,
      isActive: true,
    },
    {
      name: "Priya Kumari",
      role: "Now working as Web Developer",
      content: "The Full Stack course was incredibly practical. We built real projects from day one. The faculty is knowledgeable and the batch sizes are small enough for personal attention.",
      rating: 5,
      isActive: true,
    },
    {
      name: "Manish Verma",
      role: "Accountant at local firm",
      content: "Tally with GST course was exactly what I needed. Very affordable and the certificate helped me land a job immediately. Highly recommend to anyone in commerce background.",
      rating: 4,
      isActive: true,
    },
    {
      name: "Kavya Singh",
      role: "Freelance Developer",
      content: "Best investment I made in my education. The ADCA course gave me a solid foundation in multiple technologies. Now I work as a freelancer making great money.",
      rating: 5,
      isActive: true,
    },
  ]).onConflictDoNothing();

  console.log("✅ Database seeded successfully!");
  process.exit(0);
}

seed().catch((err) => {
  console.error("❌ Seed failed:", err);
  process.exit(1);
});
