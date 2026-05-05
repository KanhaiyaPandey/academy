import {
  pgTable,
  pgEnum,
  serial,
  varchar,
  text,
  integer,
  decimal,
  boolean,
  date,
  timestamp,
  primaryKey,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// ─── ENUMS ───────────────────────────────────────────────────────────────────

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const studentStatusEnum = pgEnum("student_status", [
  "active",
  "inactive",
  "graduated",
  "dropped",
]);

export const feeStatusEnum = pgEnum("fee_status", [
  "paid",
  "pending",
  "partial",
  "overdue",
]);

export const attendanceStatusEnum = pgEnum("attendance_status", [
  "present",
  "absent",
  "late",
  "holiday",
]);

export const leaveStatusEnum = pgEnum("leave_status", [
  "pending",
  "approved",
  "rejected",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "interested",
  "enrolled",
  "lost",
]);

export const employeeRoleEnum = pgEnum("employee_role", [
  "admin",
  "teacher",
  "accountant",
  "receptionist",
  "support",
]);

export const courseLevelEnum = pgEnum("course_level", [
  "beginner",
  "intermediate",
  "advanced",
]);

// ─── STUDENTS ────────────────────────────────────────────────────────────────

export const students = pgTable("students", {
  id: serial("id").primaryKey(),
  studentId: varchar("student_id", { length: 20 }).notNull().unique(), // e.g. PAH-2024-001
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).unique(),
  phone: varchar("phone", { length: 15 }).notNull(),
  whatsapp: varchar("whatsapp", { length: 15 }),
  gender: genderEnum("gender").notNull(),
  dateOfBirth: date("date_of_birth"),
  fatherName: varchar("father_name", { length: 100 }),
  motherName: varchar("mother_name", { length: 100 }),
  parentPhone: varchar("parent_phone", { length: 15 }),
  address: text("address"),
  city: varchar("city", { length: 100 }),
  state: varchar("state", { length: 100 }),
  pincode: varchar("pincode", { length: 10 }),
  qualification: varchar("qualification", { length: 100 }),
  profileImage: varchar("profile_image", { length: 500 }),
  status: studentStatusEnum("status").default("active").notNull(),
  admissionDate: date("admission_date").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── COURSES ─────────────────────────────────────────────────────────────────

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  courseCode: varchar("course_code", { length: 20 }).notNull().unique(),
  name: varchar("name", { length: 200 }).notNull(),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  description: text("description"),
  shortDescription: varchar("short_description", { length: 300 }),
  level: courseLevelEnum("level").default("beginner").notNull(),
  duration: varchar("duration", { length: 50 }).notNull(), // e.g. "6 months"
  durationWeeks: integer("duration_weeks"),
  fees: decimal("fees", { precision: 10, scale: 2 }).notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  syllabus: text("syllabus"), // JSON stringified
  tags: text("tags"), // comma-separated
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── ENROLLMENTS ─────────────────────────────────────────────────────────────

export const enrollments = pgTable("enrollments", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  enrollmentDate: date("enrollment_date").notNull(),
  completionDate: date("completion_date"),
  isCompleted: boolean("is_completed").default(false).notNull(),
  certificateIssued: boolean("certificate_issued").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── FEES ────────────────────────────────────────────────────────────────────

export const fees = pgTable("fees", {
  id: serial("id").primaryKey(),
  enrollmentId: integer("enrollment_id")
    .notNull()
    .references(() => enrollments.id, { onDelete: "cascade" }),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  totalAmount: decimal("total_amount", { precision: 10, scale: 2 }).notNull(),
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }).default("0").notNull(),
  discountAmount: decimal("discount_amount", { precision: 10, scale: 2 }).default("0"),
  dueDate: date("due_date"),
  status: feeStatusEnum("status").default("pending").notNull(),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── INSTALLMENTS ────────────────────────────────────────────────────────────

export const installments = pgTable("installments", {
  id: serial("id").primaryKey(),
  feeId: integer("fee_id")
    .notNull()
    .references(() => fees.id, { onDelete: "cascade" }),
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  paidAt: timestamp("paid_at"),
  receiptNumber: varchar("receipt_number", { length: 50 }),
  paymentMode: varchar("payment_mode", { length: 50 }).default("cash"), // cash, upi, bank
  transactionId: varchar("transaction_id", { length: 100 }),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── ATTENDANCE ───────────────────────────────────────────────────────────────

export const attendance = pgTable("attendance", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  date: date("date").notNull(),
  status: attendanceStatusEnum("status").notNull(),
  markedById: integer("marked_by_id").references(() => employees.id),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── EMPLOYEES ────────────────────────────────────────────────────────────────

export const employees = pgTable("employees", {
  id: serial("id").primaryKey(),
  employeeId: varchar("employee_id", { length: 20 }).notNull().unique(),
  firstName: varchar("first_name", { length: 100 }).notNull(),
  lastName: varchar("last_name", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  phone: varchar("phone", { length: 15 }).notNull(),
  role: employeeRoleEnum("role").notNull(),
  department: varchar("department", { length: 100 }),
  salary: decimal("salary", { precision: 10, scale: 2 }),
  joiningDate: date("joining_date").notNull(),
  profileImage: varchar("profile_image", { length: 500 }),
  address: text("address"),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── LEAVES ──────────────────────────────────────────────────────────────────

export const leaves = pgTable("leaves", {
  id: serial("id").primaryKey(),
  employeeId: integer("employee_id")
    .notNull()
    .references(() => employees.id, { onDelete: "cascade" }),
  leaveType: varchar("leave_type", { length: 50 }).notNull(), // sick, casual, earned
  fromDate: date("from_date").notNull(),
  toDate: date("to_date").notNull(),
  totalDays: integer("total_days").notNull(),
  reason: text("reason").notNull(),
  status: leaveStatusEnum("status").default("pending").notNull(),
  approvedById: integer("approved_by_id").references(() => employees.id),
  approvedAt: timestamp("approved_at"),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── LEADS ───────────────────────────────────────────────────────────────────

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 200 }).notNull(),
  email: varchar("email", { length: 255 }),
  phone: varchar("phone", { length: 15 }).notNull(),
  courseInterest: varchar("course_interest", { length: 200 }),
  source: varchar("source", { length: 100 }), // website, walkin, referral, social
  status: leadStatusEnum("status").default("new").notNull(),
  assignedToId: integer("assigned_to_id").references(() => employees.id),
  notes: text("notes"),
  followUpDate: date("follow_up_date"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ─── EXAM RESULTS ─────────────────────────────────────────────────────────────

export const examResults = pgTable("exam_results", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id")
    .notNull()
    .references(() => students.id, { onDelete: "cascade" }),
  courseId: integer("course_id")
    .notNull()
    .references(() => courses.id, { onDelete: "cascade" }),
  examName: varchar("exam_name", { length: 200 }).notNull(),
  examDate: date("exam_date").notNull(),
  totalMarks: integer("total_marks").notNull(),
  obtainedMarks: integer("obtained_marks").notNull(),
  grade: varchar("grade", { length: 5 }),
  isPassed: boolean("is_passed").default(false).notNull(),
  remarks: text("remarks"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── TESTIMONIALS ─────────────────────────────────────────────────────────────

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => students.id),
  name: varchar("name", { length: 100 }).notNull(),
  role: varchar("role", { length: 100 }),
  content: text("content").notNull(),
  rating: integer("rating").default(5),
  avatar: varchar("avatar", { length: 500 }),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// ─── RELATIONS ────────────────────────────────────────────────────────────────

export const studentsRelations = relations(students, ({ many }) => ({
  enrollments: many(enrollments),
  fees: many(fees),
  attendance: many(attendance),
  examResults: many(examResults),
}));

export const coursesRelations = relations(courses, ({ many }) => ({
  enrollments: many(enrollments),
  attendance: many(attendance),
  examResults: many(examResults),
}));

export const enrollmentsRelations = relations(enrollments, ({ one, many }) => ({
  student: one(students, {
    fields: [enrollments.studentId],
    references: [students.id],
  }),
  course: one(courses, {
    fields: [enrollments.courseId],
    references: [courses.id],
  }),
  fees: many(fees),
}));

export const feesRelations = relations(fees, ({ one, many }) => ({
  enrollment: one(enrollments, {
    fields: [fees.enrollmentId],
    references: [enrollments.id],
  }),
  student: one(students, {
    fields: [fees.studentId],
    references: [students.id],
  }),
  installments: many(installments),
}));

export const installmentsRelations = relations(installments, ({ one }) => ({
  fee: one(fees, { fields: [installments.feeId], references: [fees.id] }),
}));

export const attendanceRelations = relations(attendance, ({ one }) => ({
  student: one(students, {
    fields: [attendance.studentId],
    references: [students.id],
  }),
  course: one(courses, {
    fields: [attendance.courseId],
    references: [courses.id],
  }),
}));

export const employeesRelations = relations(employees, ({ many }) => ({
  leaves: many(leaves),
  approvedLeaves: many(leaves),
}));

export const leavesRelations = relations(leaves, ({ one }) => ({
  employee: one(employees, {
    fields: [leaves.employeeId],
    references: [employees.id],
  }),
  approvedBy: one(employees, {
    fields: [leaves.approvedById],
    references: [employees.id],
  }),
}));

export const leadsRelations = relations(leads, ({ one }) => ({
  assignedTo: one(employees, {
    fields: [leads.assignedToId],
    references: [employees.id],
  }),
}));
