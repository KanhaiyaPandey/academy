import { format, formatDistanceToNow } from "date-fns";

export function generateStudentId(sequence: number): string {
  const year = new Date().getFullYear();
  return `PAH-${year}-${String(sequence).padStart(3, "0")}`;
}

export function generateEmployeeId(sequence: number): string {
  return `EMP-${String(sequence).padStart(3, "0")}`;
}

export function generateReceiptNumber(): string {
  const timestamp = Date.now().toString().slice(-8);
  return `RCP-${timestamp}`;
}

export function formatCurrency(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd MMM yyyy");
}

export function formatDateTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return format(d, "dd MMM yyyy, hh:mm a");
}

export function timeAgo(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return formatDistanceToNow(d, { addSuffix: true });
}

export function calculateAttendancePercent(
  present: number,
  total: number
): number {
  if (total === 0) return 0;
  return Math.round((present / total) * 100);
}

export function getGrade(percent: number): string {
  if (percent >= 90) return "A+";
  if (percent >= 80) return "A";
  if (percent >= 70) return "B";
  if (percent >= 60) return "C";
  if (percent >= 50) return "D";
  return "F";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]+/g, "")
    .replace(/--+/g, "-")
    .trim();
}

export type ApiResponse<T> = {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
};

export function successResponse<T>(data: T, message?: string): ApiResponse<T> {
  return { success: true, data, message };
}

export function errorResponse(error: string): ApiResponse<never> {
  return { success: false, error };
}
