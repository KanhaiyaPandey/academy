"use client";

import { useEffect, useState, useCallback } from "react";
import {
  Card, Table, Tag, Button, DatePicker, Tabs, Select,
  Statistic, Row, Col, message, Spin, Radio, Tooltip,
} from "antd";
import {
  CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined,
  MinusCircleOutlined, SaveOutlined, UserOutlined,
} from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";

// ── Types ──────────────────────────────────────────────────────────────────────

type EmpStatus = "present" | "absent" | "late" | "halfday";

type Employee = {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  role: string;
  department: string | null;
  isActive: boolean;
};

type AttendanceRow = Employee & { status: EmpStatus; notes: string };

type SavedRecord = {
  id: number;
  employeeId: number;
  date: string;
  status: EmpStatus;
  employee: Employee;
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const STATUS_CONFIG: Record<EmpStatus, { label: string; color: string; icon: React.ReactNode }> = {
  present:  { label: "Present",  color: "green",  icon: <CheckCircleOutlined /> },
  absent:   { label: "Absent",   color: "red",    icon: <CloseCircleOutlined /> },
  late:     { label: "Late",     color: "orange", icon: <ClockCircleOutlined /> },
  halfday:  { label: "Half Day", color: "blue",   icon: <MinusCircleOutlined /> },
};

const AVATAR_COLORS = [
  "bg-purple-500", "bg-indigo-500", "bg-teal-500", "bg-amber-500",
  "bg-emerald-500", "bg-red-500", "bg-blue-500", "bg-cyan-500",
];

function Avatar({ name, index }: { name: string; index: number }) {
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0 ${AVATAR_COLORS[index % AVATAR_COLORS.length]}`}>
      {name.charAt(0).toUpperCase()}
    </div>
  );
}

// ── Mark Attendance Tab ───────────────────────────────────────────────────────

function MarkAttendanceTab() {
  const [date, setDate] = useState<Dayjs>(dayjs());
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [rows, setRows] = useState<AttendanceRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [msgApi, ctx] = message.useMessage();

  const loadData = useCallback(async (selectedDate: Dayjs) => {
    setLoading(true);
    try {
      const dateStr = selectedDate.format("YYYY-MM-DD");
      const [empRes, attRes] = await Promise.all([
        fetch("/api/employees"),
        fetch(`/api/employee-attendance?date=${dateStr}`),
      ]);
      const [empData, attData] = await Promise.all([empRes.json(), attRes.json()]);

      const active: Employee[] = (empData.data ?? []).filter((e: Employee) => e.isActive);
      const saved: SavedRecord[] = attData.data ?? [];

      const savedMap = new Map(saved.map((r) => [r.employeeId, r.status]));

      setEmployees(active);
      setRows(
        active.map((e) => ({
          ...e,
          status: (savedMap.get(e.id) ?? "present") as EmpStatus,
          notes: "",
        }))
      );
    } catch {
      msgApi.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  }, [msgApi]);

  useEffect(() => { loadData(date); }, [date, loadData]);

  const setStatus = (employeeId: number, status: EmpStatus) => {
    setRows((prev) => prev.map((r) => r.id === employeeId ? { ...r, status } : r));
  };

  const markAll = (status: EmpStatus) => {
    setRows((prev) => prev.map((r) => ({ ...r, status })));
  };

  const save = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/employee-attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: date.format("YYYY-MM-DD"),
          records: rows.map((r) => ({ employeeId: r.id, status: r.status, notes: r.notes })),
        }),
      });
      if (!res.ok) throw new Error();
      msgApi.success("Attendance saved successfully");
    } catch {
      msgApi.error("Failed to save attendance");
    } finally {
      setSaving(false);
    }
  };

  const present  = rows.filter((r) => r.status === "present").length;
  const absent   = rows.filter((r) => r.status === "absent").length;
  const late     = rows.filter((r) => r.status === "late").length;
  const halfday  = rows.filter((r) => r.status === "halfday").length;

  const columns = [
    {
      title: "Employee",
      key: "name",
      render: (_: unknown, r: AttendanceRow, i: number) => (
        <div className="flex items-center gap-3">
          <Avatar name={r.firstName} index={i} />
          <div>
            <div className="font-semibold text-gray-800 text-sm">{r.firstName} {r.lastName}</div>
            <div className="text-xs text-gray-400">{r.employeeId}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (v: string) => (
        <Tag color="purple" className="capitalize">{v}</Tag>
      ),
    },
    {
      title: "Department",
      dataIndex: "department",
      render: (v: string | null) => <span className="text-gray-500 text-sm">{v || "—"}</span>,
    },
    {
      title: "Attendance",
      key: "status",
      render: (_: unknown, r: AttendanceRow) => (
        <Radio.Group
          value={r.status}
          onChange={(e) => setStatus(r.id, e.target.value)}
          optionType="button"
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="present"  style={r.status === "present"  ? { background: "#16a34a", borderColor: "#16a34a" } : {}}>Present</Radio.Button>
          <Radio.Button value="absent"   style={r.status === "absent"   ? { background: "#dc2626", borderColor: "#dc2626" } : {}}>Absent</Radio.Button>
          <Radio.Button value="late"     style={r.status === "late"     ? { background: "#ea580c", borderColor: "#ea580c" } : {}}>Late</Radio.Button>
          <Radio.Button value="halfday"  style={r.status === "halfday"  ? { background: "#2563eb", borderColor: "#2563eb" } : {}}>Half Day</Radio.Button>
        </Radio.Group>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {ctx}

      {/* Controls */}
      <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-600">Date:</span>
            <DatePicker
              value={date}
              onChange={(d) => d && setDate(d)}
              format="DD MMM YYYY"
              allowClear={false}
              disabledDate={(d) => d.isAfter(dayjs(), "day")}
            />
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-400 mr-1">Quick mark:</span>
            <Button size="small" onClick={() => markAll("present")} style={{ color: "#16a34a", borderColor: "#16a34a" }}>All Present</Button>
            <Button size="small" onClick={() => markAll("absent")}  style={{ color: "#dc2626", borderColor: "#dc2626" }}>All Absent</Button>
            <Button size="small" onClick={() => markAll("late")}    style={{ color: "#ea580c", borderColor: "#ea580c" }}>All Late</Button>
          </div>
        </div>
      </Card>

      {/* Summary chips */}
      {rows.length > 0 && (
        <Row gutter={12}>
          {(["present", "absent", "late", "halfday"] as EmpStatus[]).map((s) => {
            const count = rows.filter((r) => r.status === s).length;
            const cfg = STATUS_CONFIG[s];
            return (
              <Col key={s} xs={12} sm={6}>
                <Card bordered={false} style={{ borderRadius: 10, border: "1px solid #f0f0f0", textAlign: "center" }} bodyStyle={{ padding: "12px 8px" }}>
                  <Tag color={cfg.color} className="mb-1">{cfg.label}</Tag>
                  <div className="font-display text-2xl font-bold text-gray-800">{count}</div>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}

      {/* Table */}
      <Card
        bordered={false}
        style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}
        title={
          <span className="font-display font-bold text-gray-900 flex items-center gap-2">
            <UserOutlined />
            Employee Attendance — {date.format("DD MMM YYYY")}
          </span>
        }
        extra={
          <Button
            type="primary"
            icon={<SaveOutlined />}
            onClick={save}
            loading={saving}
            disabled={rows.length === 0}
          >
            Save Attendance
          </Button>
        }
      >
        <Table
          dataSource={rows}
          rowKey="id"
          columns={columns}
          loading={loading}
          pagination={false}
          size="middle"
          locale={{ emptyText: "No active employees found" }}
        />
      </Card>
    </div>
  );
}

// ── Monthly Overview Tab ──────────────────────────────────────────────────────

type MonthlyRecord = {
  employeeId: number;
  date: string;
  status: EmpStatus;
  employee: Employee;
};

function MonthlyOverviewTab() {
  const [month, setMonth] = useState<Dayjs>(dayjs());
  const [records, setRecords] = useState<MonthlyRecord[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  const loadData = useCallback(async (m: Dayjs) => {
    setLoading(true);
    try {
      const monthStr = m.format("YYYY-MM");
      const [empRes, attRes] = await Promise.all([
        fetch("/api/employees"),
        fetch(`/api/employee-attendance?month=${monthStr}`),
      ]);
      const [empData, attData] = await Promise.all([empRes.json(), attRes.json()]);
      setEmployees((empData.data ?? []).filter((e: Employee) => e.isActive));
      setRecords(attData.data ?? []);
    } catch {
      // non-fatal
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadData(month); }, [month, loadData]);

  // Calculate working days in month (Mon–Sat, excluding Sun)
  const daysInMonth = month.daysInMonth();
  const workingDays = Array.from({ length: daysInMonth }, (_, i) => {
    const d = month.date(i + 1);
    return d.day() !== 0; // exclude Sunday
  }).filter(Boolean).length;

  // Per-employee stats
  const empStats = employees.map((e) => {
    const recs = records.filter((r) => r.employeeId === e.id);
    const present = recs.filter((r) => r.status === "present").length;
    const late    = recs.filter((r) => r.status === "late").length;
    const halfday = recs.filter((r) => r.status === "halfday").length;
    const absent  = recs.filter((r) => r.status === "absent").length;
    const marked  = recs.length;
    const effectiveDays = present + late + halfday * 0.5;
    const pct = workingDays > 0 ? Math.round((effectiveDays / workingDays) * 100) : 0;
    return { ...e, present, late, halfday, absent, marked, pct };
  }).sort((a, b) => b.pct - a.pct);

  const totalPresent = records.filter((r) => r.status === "present").length;
  const totalAbsent  = records.filter((r) => r.status === "absent").length;
  const totalLate    = records.filter((r) => r.status === "late").length;
  const totalHalf    = records.filter((r) => r.status === "halfday").length;
  const avgPct = empStats.length > 0
    ? Math.round(empStats.reduce((s, e) => s + e.pct, 0) / empStats.length)
    : 0;

  if (loading) return <div className="flex justify-center py-20"><Spin size="large" /></div>;

  return (
    <div className="space-y-5">
      {/* Month picker */}
      <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-600">Month:</span>
          <DatePicker.MonthPicker
            value={month}
            onChange={(m) => m && setMonth(m)}
            format="MMM YYYY"
            allowClear={false}
            disabledDate={(d) => d.isAfter(dayjs(), "month")}
          />
          <span className="text-xs text-gray-400">{workingDays} working days</span>
        </div>
      </Card>

      {/* Summary stats */}
      <Row gutter={[16, 16]}>
        {[
          { label: "Avg Attendance", value: `${avgPct}%`, color: "#a855f7" },
          { label: "Total Present",  value: totalPresent, color: "#16a34a" },
          { label: "Total Absent",   value: totalAbsent,  color: "#dc2626" },
          { label: "Late / Half Day",value: `${totalLate} / ${totalHalf}`, color: "#ea580c" },
        ].map((s) => (
          <Col xs={12} sm={6} key={s.label}>
            <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
              <Statistic
                title={<span className="text-xs text-gray-500">{s.label}</span>}
                value={s.value}
                valueStyle={{ color: s.color, fontSize: 24, fontWeight: 700 }}
              />
            </Card>
          </Col>
        ))}
      </Row>

      {/* Per-employee cards */}
      {empStats.length === 0 ? (
        <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
          <div className="text-center py-10 text-gray-400">No attendance data for this month.</div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {empStats.map((e, i) => (
            <Card
              key={e.id}
              bordered={false}
              style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Avatar name={e.firstName} index={i} />
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-gray-800 text-sm truncate">{e.firstName} {e.lastName}</div>
                  <div className="text-xs text-gray-400 capitalize">{e.role}{e.department ? ` · ${e.department}` : ""}</div>
                </div>
                <Tooltip title="Effective attendance %">
                  <div
                    className="text-lg font-bold"
                    style={{ color: e.pct >= 75 ? "#16a34a" : e.pct >= 50 ? "#ea580c" : "#dc2626" }}
                  >
                    {e.pct}%
                  </div>
                </Tooltip>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 bg-gray-100 rounded-full mb-3 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{
                    width: `${e.pct}%`,
                    background: e.pct >= 75 ? "#16a34a" : e.pct >= 50 ? "#ea580c" : "#dc2626",
                  }}
                />
              </div>

              <div className="grid grid-cols-4 gap-1 text-center text-xs">
                {(["present", "late", "halfday", "absent"] as EmpStatus[]).map((s) => (
                  <div key={s} className="flex flex-col items-center gap-0.5">
                    <Tag color={STATUS_CONFIG[s].color} className="mx-0 text-xs px-1">
                      {e[s === "halfday" ? "halfday" : s]}
                    </Tag>
                    <span className="text-gray-400">{STATUS_CONFIG[s].label.split(" ")[0]}</span>
                  </div>
                ))}
              </div>

              {e.marked < workingDays && (
                <div className="mt-2 text-xs text-gray-400 text-center">
                  {workingDays - e.marked} day{workingDays - e.marked !== 1 ? "s" : ""} not marked
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function EmployeeAttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Employee Attendance</h1>
        <p className="text-gray-500 text-sm mt-1">Mark and track daily attendance for all staff members.</p>
      </div>

      <Tabs
        defaultActiveKey="mark"
        items={[
          {
            key: "mark",
            label: "Mark Attendance",
            children: <MarkAttendanceTab />,
          },
          {
            key: "overview",
            label: "Monthly Overview",
            children: <MonthlyOverviewTab />,
          },
        ]}
      />
    </div>
  );
}
