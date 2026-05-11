"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Table, Button, Tag, Card, DatePicker, Select, notification,
  Radio, Row, Col, Statistic, Tabs, Progress,
} from "antd";
import {
  CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined,
  SaveOutlined, BarChartOutlined, CalendarOutlined,
} from "@ant-design/icons";
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import type { ColumnsType } from "antd/es/table";
import dayjs, { Dayjs } from "dayjs";

type AttendanceStatus = "present" | "absent" | "late" | "holiday";
type AttendanceRow = { id: number; name: string; studentId: string; status: AttendanceStatus };
type Course = { id: number; name: string };
type RawRecord = {
  studentId: number;
  date: string;
  status: string;
  student: { firstName: string; lastName: string; studentId: string };
};

const STATUS_CFG: Record<AttendanceStatus, { color: string; label: string; icon: React.ReactNode }> = {
  present: { color: "green",  label: "Present", icon: <CheckCircleOutlined /> },
  absent:  { color: "red",    label: "Absent",  icon: <CloseCircleOutlined /> },
  late:    { color: "orange", label: "Late",    icon: <ClockCircleOutlined /> },
  holiday: { color: "blue",   label: "Holiday", icon: <ClockCircleOutlined /> },
};

const PALETTE = [
  "#ec4899", "#6366f1", "#14b8a6", "#f59e0b",
  "#10b981", "#8b5cf6", "#ef4444", "#3b82f6", "#06b6d4", "#84cc16",
];

const AVATAR_BG = [
  "bg-pink-500",    "bg-indigo-500", "bg-teal-500",  "bg-amber-500",
  "bg-emerald-500", "bg-purple-500", "bg-red-500",   "bg-blue-500",
  "bg-cyan-500",    "bg-lime-500",
];

function pctColor(pct: number) {
  if (pct >= 75) return "#52c41a";
  if (pct >= 50) return "#fa8c16";
  return "#ff4d4f";
}

function pctColorClass(pct: number) {
  if (pct >= 75) return "text-green-500";
  if (pct >= 50) return "text-orange-400";
  return "text-red-500";
}

function tagColor(pct: number) {
  if (pct >= 75) return "green";
  if (pct >= 50) return "orange";
  return "red";
}

function tagLabel(pct: number) {
  if (pct >= 75) return "Good";
  if (pct >= 50) return "Average";
  return "Low";
}

function getRowClass(r: AttendanceRow) {
  if (r.status === "absent") return "bg-red-50";
  if (r.status === "late") return "bg-orange-50";
  return "";
}

export default function AttendancePage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState("mark");
  const [api, contextHolder] = notification.useNotification();

  // ── Mark attendance state ────────────────────────────────────────────────────
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRow[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  // ── Analytics state ──────────────────────────────────────────────────────────
  const [analyticsCourseId, setAnalyticsCourseId] = useState<number | null>(null);
  const [rawData, setRawData] = useState<RawRecord[]>([]);
  const [loadingAnalytics, setLoadingAnalytics] = useState(false);

  useEffect(() => {
    fetch("/api/courses")
      .then((r) => r.json())
      .then((data) => {
        const active = (data.data || []).filter((c: Course & { isActive: boolean }) => c.isActive);
        setCourses(active);
        if (active.length > 0) {
          setSelectedCourseId(active[0].id);
          setAnalyticsCourseId(active[0].id);
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedCourseId) return;
    setLoadingStudents(true);
    fetch("/api/students")
      .then((r) => r.json())
      .then((data) =>
        setAttendance(
          (data.data || []).map((s: Record<string, string>) => ({
            id: s.id,
            name: `${s.firstName} ${s.lastName}`,
            studentId: s.studentId,
            status: "present" as AttendanceStatus,
          }))
        )
      )
      .catch(() => {})
      .finally(() => setLoadingStudents(false));
  }, [selectedCourseId]);

  useEffect(() => {
    if (!analyticsCourseId) return;
    setLoadingAnalytics(true);
    fetch(`/api/attendance?courseId=${analyticsCourseId}`)
      .then((r) => r.json())
      .then((data) => setRawData(data.data || []))
      .catch(() => {})
      .finally(() => setLoadingAnalytics(false));
  }, [analyticsCourseId]);

  const updateStatus = (id: number, status: AttendanceStatus) =>
    setAttendance((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  const markAll = (status: AttendanceStatus) =>
    setAttendance((prev) => prev.map((r) => ({ ...r, status })));

  const handleSave = async () => {
    if (!selectedCourseId) return;
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
  const absentCount  = attendance.filter((r) => r.status === "absent").length;
  const lateCount    = attendance.filter((r) => r.status === "late").length;
  const markPct = attendance.length > 0 ? Math.round((presentCount / attendance.length) * 100) : 0;

  // ── Analytics derived data ───────────────────────────────────────────────────
  const analytics = useMemo(() => {
    if (!rawData.length)
      return { monthlyChart: [], students: [], avgPct: 0, bestMonth: "—", worstMonth: "—" };

    const monthMap: Record<string, { total: number; attended: number }> = {};
    const studentMap: Record<string, {
      name: string; studentId: string;
      total: number; present: number; absent: number; late: number;
      months: Record<string, { total: number; attended: number }>;
    }> = {};

    rawData.forEach((r) => {
      const month = dayjs(r.date).format("YYYY-MM");

      if (!monthMap[month]) monthMap[month] = { total: 0, attended: 0 };
      monthMap[month].total++;
      if (r.status === "present" || r.status === "late") monthMap[month].attended++;

      const key = r.student.studentId;
      if (!studentMap[key])
        studentMap[key] = {
          name: `${r.student.firstName} ${r.student.lastName}`,
          studentId: r.student.studentId,
          total: 0, present: 0, absent: 0, late: 0, months: {},
        };
      const s = studentMap[key];
      s.total++;
      if (r.status === "present") s.present++;
      else if (r.status === "absent") s.absent++;
      else if (r.status === "late") s.late++;
      if (!s.months[month]) s.months[month] = { total: 0, attended: 0 };
      s.months[month].total++;
      if (r.status === "present" || r.status === "late") s.months[month].attended++;
    });

    const sortedMonths = Object.keys(monthMap).sort((a, b) => a.localeCompare(b));

    const monthlyChart = sortedMonths.map((m) => ({
      month: dayjs(`${m}-01`).format("MMM YY"),
      "Avg %": monthMap[m].total > 0
        ? Math.round((monthMap[m].attended / monthMap[m].total) * 100)
        : 0,
    }));

    const students = Object.values(studentMap)
      .map((s, i) => ({
        ...s,
        pct: s.total > 0 ? Math.round(((s.present + s.late) / s.total) * 100) : 0,
        color: PALETTE[i % PALETTE.length],
        avatarBg: AVATAR_BG[i % AVATAR_BG.length],
        sparkline: sortedMonths.map((m) => ({
          month: dayjs(`${m}-01`).format("MMM"),
          pct: s.months[m]?.total > 0
            ? Math.round((s.months[m].attended / s.months[m].total) * 100)
            : 0,
        })),
      }))
      .sort((a, b) => b.pct - a.pct);

    const avgPct =
      monthlyChart.length > 0
        ? Math.round(monthlyChart.reduce((sum, m) => sum + m["Avg %"], 0) / monthlyChart.length)
        : 0;

    const bestMonth = monthlyChart.length > 0
      ? monthlyChart.reduce((b, m) => (m["Avg %"] > b["Avg %"] ? m : b), { month: "—", "Avg %": -1 }).month
      : "—";

    const worstMonth = monthlyChart.length > 0
      ? monthlyChart.reduce((b, m) => (m["Avg %"] < b["Avg %"] ? m : b), { month: "—", "Avg %": 101 }).month
      : "—";

    return { monthlyChart, students, avgPct, bestMonth, worstMonth };
  }, [rawData]);

  // ── Table columns ────────────────────────────────────────────────────────────
  const columns: ColumnsType<AttendanceRow> = [
    {
      title: "#", key: "i", width: 50,
      render: (_, __, i) => <span className="text-gray-400 text-sm">{i + 1}</span>,
    },
    {
      title: "Student ID", dataIndex: "studentId", key: "sid",
      render: (id) => <span className="font-mono text-xs text-primary-600 font-semibold">{id}</span>,
    },
    {
      title: "Student", dataIndex: "name", key: "name",
      render: (name: string) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center font-bold text-primary-600 text-sm">
            {name[0]}
          </div>
          <span className="font-medium text-gray-900">{name}</span>
        </div>
      ),
    },
    {
      title: "Mark Attendance", key: "mark",
      render: (_, r) => (
        <Radio.Group
          value={r.status}
          onChange={(e) => updateStatus(r.id, e.target.value)}
          optionType="button"
          size="small"
        >
          <Radio.Button value="present" style={{ color: r.status === "present" ? "#52c41a" : undefined }}>✓ Present</Radio.Button>
          <Radio.Button value="absent"  style={{ color: r.status === "absent"  ? "#ff4d4f" : undefined }}>✗ Absent</Radio.Button>
          <Radio.Button value="late"    style={{ color: r.status === "late"    ? "#fa8c16" : undefined }}>⏱ Late</Radio.Button>
        </Radio.Group>
      ),
    },
    {
      title: "Status", dataIndex: "status", key: "status",
      render: (s: AttendanceStatus) => (
        <Tag color={STATUS_CFG[s].color} icon={STATUS_CFG[s].icon}>{STATUS_CFG[s].label}</Tag>
      ),
    },
  ];

  // ── Analytics summary stats ──────────────────────────────────────────────────
  type NumStat  = { label: string; value: number; color: string; icon: string; suffix?: string; isText: false };
  type TextStat = { label: string; value: string; cls: string; icon: string; isText: true };
  const summaryStats: (NumStat | TextStat)[] = [
    { label: "Total Students",  value: analytics.students.length, color: "#6366f1", icon: "👥", isText: false },
    { label: "Avg Attendance",  value: analytics.avgPct,          color: "#ec4899", icon: "📊", suffix: "%", isText: false },
    { label: "Best Month",      value: analytics.bestMonth,  cls: "text-[22px] font-bold font-display text-green-600", icon: "🏆", isText: true },
    { label: "Needs Attention", value: analytics.worstMonth, cls: "text-[22px] font-bold font-display text-red-500",   icon: "⚠️", isText: true },
  ];

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">
      {contextHolder}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Attendance</h1>
          <p className="text-gray-500 text-sm mt-0.5">Mark daily attendance and view monthly analytics</p>
        </div>
        {activeTab === "mark" && (
          <Button type="primary" icon={<SaveOutlined />} size="large" loading={saving} onClick={handleSave} disabled={attendance.length === 0}>
            Save Attendance
          </Button>
        )}
      </div>

      <Tabs
        activeKey={activeTab}
        onChange={setActiveTab}
        size="large"
        items={[
          // ─── Tab 1: Mark Attendance ───────────────────────────────────────────
          {
            key: "mark",
            label: (
              <span className="flex items-center gap-2">
                <CalendarOutlined /> Mark Attendance
              </span>
            ),
            children: (
              <div className="space-y-4 pt-4">
                <Row gutter={[16, 16]}>
                  {[
                    { label: "Present",      value: presentCount, color: "#52c41a", icon: "✅" },
                    { label: "Absent",       value: absentCount,  color: "#ff4d4f", icon: "❌" },
                    { label: "Late",         value: lateCount,    color: "#fa8c16", icon: "⏱"  },
                    { label: "Attendance %", value: markPct,      color: "#ec4899", icon: "📊", suffix: "%" },
                  ].map((s) => (
                    <Col xs={12} lg={6} key={s.label}>
                      <Card variant="borderless" style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
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

                <Card variant="borderless" style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-medium">Date:</span>
                      <DatePicker value={date} onChange={(d) => d && setDate(d)} format="DD MMM YYYY" allowClear={false} />
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-500 font-medium">Course:</span>
                      <Select
                        value={selectedCourseId}
                        onChange={setSelectedCourseId}
                        style={{ minWidth: 220 }}
                        options={courses.map((c) => ({ value: c.id, label: c.name }))}
                        placeholder="Select course"
                      />
                    </div>
                    <div className="flex items-center gap-2 ml-auto">
                      <span className="text-sm text-gray-500">Mark all:</span>
                      <Button size="small" onClick={() => markAll("present")} style={{ color: "#52c41a", borderColor: "#52c41a" }}>All Present</Button>
                      <Button size="small" danger onClick={() => markAll("absent")}>All Absent</Button>
                    </div>
                  </div>
                  <Table
                    columns={columns}
                    dataSource={attendance}
                    rowKey="id"
                    loading={loadingStudents}
                    pagination={false}
                    rowClassName={getRowClass}
                    locale={{ emptyText: selectedCourseId ? "No students found" : "Select a course to load students" }}
                  />
                </Card>
              </div>
            ),
          },

          // ─── Tab 2: Monthly Analytics ─────────────────────────────────────────
          {
            key: "analytics",
            label: (
              <span className="flex items-center gap-2">
                <BarChartOutlined /> Monthly Analytics
              </span>
            ),
            children: (
              <div className="space-y-4 pt-4">
                {/* Course selector */}
                <Card variant="borderless" style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className="text-sm font-medium text-gray-500">Course:</span>
                    <Select
                      value={analyticsCourseId}
                      onChange={setAnalyticsCourseId}
                      style={{ minWidth: 260 }}
                      options={courses.map((c) => ({ value: c.id, label: c.name }))}
                      placeholder="Select course"
                      loading={loadingAnalytics}
                    />
                    {rawData.length > 0 && (
                      <span className="text-xs text-gray-400">{rawData.length} records · {analytics.monthlyChart.length} months</span>
                    )}
                  </div>
                </Card>

                {/* Summary stats */}
                <Row gutter={[16, 16]}>
                  {summaryStats.map((s) => (
                    <Col xs={12} lg={6} key={s.label}>
                      <Card variant="borderless" style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
                        <div className="flex items-center justify-between">
                          {s.isText ? (
                            <div>
                              <div className="text-gray-500 text-sm mb-1">{s.label}</div>
                              <div className={s.cls}>{s.value}</div>
                            </div>
                          ) : (
                            <Statistic
                              title={<span className="text-gray-500 text-sm">{s.label}</span>}
                              value={s.value}
                              suffix={s.suffix}
                              valueStyle={{ color: s.color, fontSize: 28, fontWeight: 700, fontFamily: "Sora" }}
                            />
                          )}
                          <span className="text-3xl">{s.icon}</span>
                        </div>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* Main area chart */}
                {analytics.monthlyChart.length > 0 && (
                  <Card
                    variant="borderless"
                    style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}
                    title={<span className="font-display font-bold text-gray-900">Month-wise Attendance Trend</span>}
                    extra={<Tag color="pink">Class Average %</Tag>}
                  >
                    <ResponsiveContainer width="100%" height={300}>
                      <AreaChart data={analytics.monthlyChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="pinkGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%"  stopColor="#ec4899" stopOpacity={0.28} />
                            <stop offset="95%" stopColor="#ec4899" stopOpacity={0.02} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                        <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                        <YAxis
                          domain={[0, 100]}
                          tickFormatter={(v) => `${v}%`}
                          tick={{ fontSize: 12, fill: "#9ca3af" }}
                          axisLine={false}
                          tickLine={false}
                        />
                        <Tooltip
                          formatter={(v: number) => [`${v}%`, "Attendance"]}
                          contentStyle={{ borderRadius: 10, border: "1px solid #f0f0f0", fontSize: 13 }}
                        />
                        <Area
                          type="monotone"
                          dataKey="Avg %"
                          stroke="#ec4899"
                          strokeWidth={2.5}
                          fill="url(#pinkGrad)"
                          dot={{ r: 5, fill: "#ec4899", strokeWidth: 2, stroke: "#fff" }}
                          activeDot={{ r: 7 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card>
                )}

                {/* Per-student cards */}
                {analytics.students.length > 0 && (
                  <div>
                    <h2 className="font-display font-bold text-gray-800 text-lg mb-3">
                      Per-Student Attendance{" "}
                      <span className="text-sm font-normal text-gray-400">(sorted by attendance %)</span>
                    </h2>
                    <Row gutter={[16, 16]}>
                      {analytics.students.map((s) => (
                        <Col xs={24} md={12} xl={8} key={s.studentId}>
                          <Card
                            variant="borderless"
                            style={{ borderRadius: 16, border: "1px solid #f0f0f0" }}
                            styles={{ body: { padding: "18px" } }}
                          >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-base shrink-0 ${s.avatarBg}`}>
                                  {s.name[0]}
                                </div>
                                <div>
                                  <div className="font-semibold text-gray-900 text-sm leading-tight">{s.name}</div>
                                  <div className="font-mono text-xs text-gray-400 mt-0.5">{s.studentId}</div>
                                </div>
                              </div>
                              <div className="text-right shrink-0">
                                <div className={`text-2xl font-bold leading-none font-display ${pctColorClass(s.pct)}`}>
                                  {s.pct}%
                                </div>
                                <Tag color={tagColor(s.pct)} style={{ fontSize: 10, marginTop: 4, marginRight: 0 }}>
                                  {tagLabel(s.pct)}
                                </Tag>
                              </div>
                            </div>

                            {/* Progress bar */}
                            <Progress
                              percent={s.pct}
                              strokeColor={pctColor(s.pct)}
                              trailColor="#f3f4f6"
                              showInfo={false}
                              strokeWidth={6}
                              className="mb-2.5"
                            />

                            {/* Stats row */}
                            <div className="flex justify-between text-xs mb-3">
                              <span className="text-green-600 font-medium">✓ {s.present} present</span>
                              <span className="text-orange-500 font-medium">⏱ {s.late} late</span>
                              <span className="text-red-500 font-medium">✗ {s.absent} absent</span>
                              <span className="text-gray-400">{s.total} total</span>
                            </div>

                            {/* Monthly sparkline */}
                            {s.sparkline.length > 1 && (
                              <ResponsiveContainer width="100%" height={64}>
                                <LineChart data={s.sparkline} margin={{ top: 4, right: 4, left: 4, bottom: 0 }}>
                                  <XAxis
                                    dataKey="month"
                                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                                    axisLine={false}
                                    tickLine={false}
                                  />
                                  <Tooltip
                                    formatter={(v: number) => [`${v}%`, "Attendance"]}
                                    contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #f0f0f0" }}
                                  />
                                  <Line
                                    type="monotone"
                                    dataKey="pct"
                                    stroke={s.color}
                                    strokeWidth={2}
                                    dot={{ r: 3, fill: s.color, strokeWidth: 0 }}
                                  />
                                </LineChart>
                              </ResponsiveContainer>
                            )}
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Empty state */}
                {rawData.length === 0 && !loadingAnalytics && (
                  <Card variant="borderless" style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
                    <div className="text-center py-14 text-gray-400">
                      <BarChartOutlined style={{ fontSize: 52, marginBottom: 12, color: "#e5e7eb" }} />
                      <p className="font-medium">No attendance data yet</p>
                      <p className="text-sm mt-1">Mark daily attendance to see monthly analytics here.</p>
                    </div>
                  </Card>
                )}
              </div>
            ),
          },
        ]}
      />
    </div>
  );
}
