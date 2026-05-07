"use client";

import { useState, useEffect } from "react";
import {
  Table, Button, Tag, Card, DatePicker, Select, notification,
  Radio, Row, Col, Statistic,
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
  status: AttendanceStatus;
};

type Course = {
  id: number;
  name: string;
};

const statusConfig: Record<AttendanceStatus, { color: string; label: string; icon: React.ReactNode }> = {
  present: { color: "green", label: "Present", icon: <CheckCircleOutlined /> },
  absent: { color: "red", label: "Absent", icon: <CloseCircleOutlined /> },
  late: { color: "orange", label: "Late", icon: <ClockCircleOutlined /> },
  holiday: { color: "blue", label: "Holiday", icon: <ClockCircleOutlined /> },
};

export default function AttendancePage() {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        const active = (data.data || []).filter((c: Course & { isActive: boolean }) => c.isActive);
        setCourses(active);
        if (active.length > 0) setSelectedCourseId(active[0].id);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    setLoadingStudents(true);
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) => {
        const rows = (data.data || []).map((s: Record<string, any>) => ({
          id: s.id,
          name: `${s.firstName} ${s.lastName}`,
          studentId: s.studentId,
          status: "present" as AttendanceStatus,
        }));
        setAttendance(rows);
      })
      .catch(() => {})
      .finally(() => setLoadingStudents(false));
  }, [selectedCourseId]);

  const updateStatus = (id: number, status: AttendanceStatus) => {
    setAttendance((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
  };

  const markAll = (status: AttendanceStatus) => {
    setAttendance((prev) => prev.map((r) => ({ ...r, status })));
  };

  const handleSave = async () => {
    if (!selectedCourseId) {
      api.error({ message: "Please select a course" });
      return;
    }
    setSaving(true);
    try {
      await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date.format("YYYY-MM-DD"),
          courseId: selectedCourseId,
          records: attendance.map((r) => ({ studentId: r.id, status: r.status })),
        }),
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
  const attendancePercent = attendance.length > 0
    ? Math.round((presentCount / attendance.length) * 100)
    : 0;

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
      render: (name) => (
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
          disabled={attendance.length === 0}
        >
          Save Attendance
        </Button>
      </div>

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
              value={selectedCourseId}
              onChange={setSelectedCourseId}
              style={{ minWidth: 220 }}
              loading={courses.length === 0}
              options={courses.map((c) => ({ value: c.id, label: c.name }))}
              placeholder="Select course"
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
          loading={loadingStudents}
          pagination={false}
          rowClassName={(r) =>
            r.status === "absent" ? "bg-red-50" :
            r.status === "late" ? "bg-orange-50" : ""
          }
          locale={{ emptyText: selectedCourseId ? "No students found" : "Select a course to load students" }}
        />
      </Card>
    </div>
  );
}
