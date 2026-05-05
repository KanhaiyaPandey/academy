"use client";

import { useState } from "react";
import {
  Table, Button, Tag, Card, DatePicker, Select, notification,
  Radio, Badge, Tooltip, Row, Col, Statistic,
} from "antd";
import {
  CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

type AttendanceStatus = "present" | "absent" | "late" | "holiday";

type AttendanceRow = {
  id: number;
  name: string;
  studentId: string;
  course: string;
  status: AttendanceStatus;
};

const mockStudents: AttendanceRow[] = [
  { id: 1, name: "Ananya Sharma", studentId: "PAH-2024-001", course: "Makeup Artistry", status: "present" },
  { id: 2, name: "Priya Kumari", studentId: "PAH-2024-002", course: "Makeup Artistry", status: "present" },
  { id: 3, name: "Sneha Gupta", studentId: "PAH-2024-003", course: "Makeup Artistry", status: "absent" },
  { id: 4, name: "Ritu Devi", studentId: "PAH-2024-004", course: "Makeup Artistry", status: "late" },
  { id: 5, name: "Kavya Yadav", studentId: "PAH-2024-005", course: "Makeup Artistry", status: "present" },
  { id: 6, name: "Seema Verma", studentId: "PAH-2024-006", course: "Makeup Artistry", status: "present" },
];

const statusConfig: Record<AttendanceStatus, { color: string; label: string; icon: React.ReactNode }> = {
  present: { color: "green", label: "Present", icon: <CheckCircleOutlined /> },
  absent: { color: "red", label: "Absent", icon: <CloseCircleOutlined /> },
  late: { color: "orange", label: "Late", icon: <ClockCircleOutlined /> },
  holiday: { color: "blue", label: "Holiday", icon: <ClockCircleOutlined /> },
};

export default function AttendancePage() {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [course, setCourse] = useState("Makeup Artistry");
  const [attendance, setAttendance] = useState<AttendanceRow[]>(mockStudents);
  const [saving, setSaving] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const updateStatus = (id: number, status: AttendanceStatus) => {
    setAttendance((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const markAll = (status: AttendanceStatus) => {
    setAttendance((prev) => prev.map((r) => ({ ...r, status })));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: date.format("YYYY-MM-DD"), course, attendance }),
      });
      api.success({ message: `Attendance saved for ${date.format("DD MMM YYYY")}` });
    } catch {
      api.error({ message: "Failed to save attendance" });
    } finally {
      setSaving(false);
    }
  };

  const presentCount = attendance.filter((r) => r.status === "present").length;
  const absentCount = attendance.filter((r) => r.status === "absent").length;
  const lateCount = attendance.filter((r) => r.status === "late").length;
  const attendancePercent = Math.round((presentCount / attendance.length) * 100);

  const columns: ColumnsType<AttendanceRow> = [
    {
      title: "#",
      key: "index",
      width: 50,
      render: (_, __, i) => <span className="text-gray-400 text-sm">{i + 1}</span>,
    },
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
      render: (id) => <span className="font-mono text-xs text-primary-600 font-semibold">{id}</span>,
    },
    {
      title: "Student Name",
      dataIndex: "name",
      key: "name",
      render: (name, r) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600 text-sm">
            {name[0]}
          </div>
          <span className="font-medium text-gray-900">{name}</span>
        </div>
      ),
    },
    {
      title: "Mark Attendance",
      key: "mark",
      render: (_, record) => (
        <Radio.Group
          value={record.status}
          onChange={(e) => updateStatus(record.id, e.target.value)}
          optionType="button"
          size="small"
        >
          <Radio.Button value="present" style={{ color: record.status === "present" ? "#52c41a" : undefined }}>
            ✓ Present
          </Radio.Button>
          <Radio.Button value="absent" style={{ color: record.status === "absent" ? "#ff4d4f" : undefined }}>
            ✗ Absent
          </Radio.Button>
          <Radio.Button value="late" style={{ color: record.status === "late" ? "#fa8c16" : undefined }}>
            ⏱ Late
          </Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: AttendanceStatus) => (
        <Tag color={statusConfig[s].color} icon={statusConfig[s].icon}>
          {statusConfig[s].label}
        </Tag>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {contextHolder}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 text-sm mt-0.5">Mark and track daily student attendance</p>
        </div>
        <Button
          type="primary"
          icon={<SaveOutlined />}
          size="large"
          loading={saving}
          onClick={handleSave}
        >
          Save Attendance
        </Button>
      </div>

      {/* Summary */}
      <Row gutter={[16, 16]}>
        {[
          { label: "Present", value: presentCount, color: "#52c41a", icon: "✅" },
          { label: "Absent", value: absentCount, color: "#ff4d4f", icon: "❌" },
          { label: "Late", value: lateCount, color: "#fa8c16", icon: "⏱" },
          { label: "Attendance %", value: attendancePercent, color: "#ec4899", icon: "📊", suffix: "%" },
        ].map((s) => (
          <Col xs={12} lg={6} key={s.label}>
            <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
              <div className="flex items-center justify-between">
                <Statistic
                  title={<span className="text-gray-500 text-sm">{s.label}</span>}
                  value={s.value}
                  suffix={s.suffix}
                  valueStyle={{ color: s.color, fontSize: 28, fontWeight: 700, fontFamily: "Sora" }}
                />
                <span className="text-3xl">{s.icon}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Controls */}
      <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Date:</span>
            <DatePicker
              value={date}
              onChange={(d) => d && setDate(d)}
              format="DD MMM YYYY"
              allowClear={false}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Course:</span>
            <Select
              value={course}
              onChange={setCourse}
              style={{ minWidth: 220 }}
              options={[
                { value: "Makeup Artistry", label: "Makeup Artistry" },
                { value: "Hair Styling & Cutting", label: "Hair Styling & Cutting" },
                { value: "Skincare & Facial Therapy", label: "Skincare & Facial Therapy" },
                { value: "Nail Art & Extensions", label: "Nail Art & Extensions" },
                { value: "Bridal Makeup & Styling", label: "Bridal Makeup & Styling" },
                { value: "Advanced Cosmetology Diploma", label: "Advanced Cosmetology Diploma" },
              ]}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-gray-500">Mark all:</span>
            <Button size="small" onClick={() => markAll("present")} style={{ color: "#52c41a", borderColor: "#52c41a" }}>
              All Present
            </Button>
            <Button size="small" danger onClick={() => markAll("absent")}>
              All Absent
            </Button>
          </div>
        </div>

        <Table
          columns={columns}
          dataSource={attendance}
          rowKey="id"
          pagination={false}
          rowClassName={(r) =>
            r.status === "absent" ? "bg-red-50" :
            r.status === "late" ? "bg-orange-50" : ""
          }
        />
      </Card>
    </div>
  );
}
