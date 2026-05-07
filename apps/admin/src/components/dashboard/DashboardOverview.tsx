"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Table, Tag, Statistic, Badge, Spin } from "antd";
import {
  UserOutlined, DollarOutlined, FunnelPlotOutlined, WarningOutlined,
} from "@ant-design/icons";

type Stats = {
  totalStudents: number;
  activeStudents: number;
  totalRevenue: number;
  pendingFees: number;
  totalCourses: number;
  newLeads: number;
};

type RecentStudent = {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  status: string;
  admissionDate: string;
};

type PendingFee = {
  id: number;
  studentName: string;
  courseName: string;
  pending: number;
  dueDate: string | null;
};

type Course = {
  id: number;
  name: string;
  level: string;
  fees: string | number;
  duration: string;
  isActive: boolean;
};

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0, activeStudents: 0, totalRevenue: 0,
    pendingFees: 0, totalCourses: 0, newLeads: 0,
  });
  const [recentStudents, setRecentStudents] = useState<RecentStudent[]>([]);
  const [pendingFees, setPendingFees] = useState<PendingFee[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [statsRes, studentsRes, feesRes, coursesRes] = await Promise.all([
          fetch("/api/dashboard/stats"),
          fetch("/api/students"),
          fetch("/api/fees"),
          fetch("/api/courses"),
        ]);
        const [statsData, studentsData, feesData, coursesData] = await Promise.all([
          statsRes.json(), studentsRes.json(), feesRes.json(), coursesRes.json(),
        ]);

        setStats(statsData.data || stats);

        setRecentStudents((studentsData.data || []).slice(0, 5));

        const pending = (feesData.data || [])
          .filter((f: Record<string, any>) => f.status !== "paid")
          .slice(0, 5)
          .map((f: Record<string, any>) => ({
            id: f.id,
            studentName: `${f.student?.firstName || ""} ${f.student?.lastName || ""}`.trim() || "Unknown",
            courseName: f.enrollment?.course?.name || "—",
            pending: Number(f.totalAmount) - Number(f.paidAmount),
            dueDate: f.dueDate,
          }));
        setPendingFees(pending);

        setCourses((coursesData.data || []).filter((c: Course) => c.isActive));
      } catch {
        // non-critical, page still renders with zeros
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <UserOutlined style={{ fontSize: 24, color: "#ec4899" }} />,
      bgClass: "bg-pink-50",
    },
    {
      title: "Total Revenue",
      value: stats.totalRevenue,
      icon: <DollarOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
      bgClass: "bg-green-50",
      prefix: "₹",
    },
    {
      title: "Pending Fees",
      value: stats.pendingFees,
      icon: <WarningOutlined style={{ fontSize: 24, color: "#fa8c16" }} />,
      bgClass: "bg-orange-50",
      prefix: "₹",
    },
    {
      title: "New Leads",
      value: stats.newLeads,
      icon: <FunnelPlotOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
      bgClass: "bg-purple-50",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here&apos;s what&apos;s happening at Pahal Beauty Academy.</p>
      </div>

      {/* Stat Cards */}
      <Row gutter={[16, 16]}>
        {statCards.map((card) => (
          <Col xs={24} sm={12} lg={6} key={card.title}>
            <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-gray-500 text-sm font-medium mb-1">{card.title}</div>
                  <Statistic
                    value={card.value}
                    prefix={card.prefix}
                    valueStyle={{ fontSize: 28, fontWeight: 700, fontFamily: "Sora" }}
                  />
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.bgClass}`}>
                  {card.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Recent Admissions + Pending Fees */}
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={14}>
          <Card
            title="Recent Admissions"
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}
            extra={<a href="/dashboard/students" className="text-primary-500 text-sm">View All</a>}
          >
            <Table
              dataSource={recentStudents}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: "No students yet" }}
              columns={[
                {
                  title: "Student",
                  key: "name",
                  render: (_, r) => (
                    <span className="font-medium">{r.firstName} {r.lastName}</span>
                  ),
                },
                {
                  title: "Status",
                  dataIndex: "status",
                  render: (s) => <Tag color={s === "active" ? "green" : "red"}>{s}</Tag>,
                },
                {
                  title: "Admission Date",
                  dataIndex: "admissionDate",
                  render: (d) => <span className="text-gray-500">{d}</span>,
                },
              ]}
            />
          </Card>
        </Col>

        <Col xs={24} lg={10}>
          <Card
            title={
              <span className="flex items-center gap-2">
                Pending Fee Alerts
                <Badge count={pendingFees.length} style={{ background: "#fa8c16" }} />
              </span>
            }
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}
            extra={<a href="/dashboard/fees" className="text-primary-500 text-sm">Manage</a>}
          >
            {pendingFees.length === 0 ? (
              <div className="text-gray-400 text-center py-4 text-sm">No pending fees</div>
            ) : (
              <div className="space-y-3">
                {pendingFees.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-100"
                  >
                    <div>
                      <div className="font-medium text-gray-800 text-sm">{item.studentName}</div>
                      <div className="text-xs text-gray-500">
                        {item.courseName}
                        {item.dueDate ? ` · Due ${item.dueDate}` : ""}
                      </div>
                    </div>
                    <div className="text-orange-600 font-bold text-sm">
                      ₹{item.pending.toLocaleString("en-IN")}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* Active Courses */}
      <Card
        title="Active Courses"
        bordered={false}
        style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}
        extra={<a href="/dashboard/courses" className="text-primary-500 text-sm">Manage</a>}
      >
        {courses.length === 0 ? (
          <div className="text-gray-400 text-center py-6 text-sm">No active courses</div>
        ) : (
          <Row gutter={[16, 16]}>
            {courses.map((c) => (
              <Col xs={24} sm={12} lg={8} key={c.id}>
                <div className="p-4 rounded-xl border border-gray-100 bg-gray-50 hover:border-primary-200 transition-colors">
                  <div className="font-semibold text-gray-800 text-sm">{c.name}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {c.level.charAt(0).toUpperCase() + c.level.slice(1)} · {c.duration}
                  </div>
                  <div className="text-primary-600 font-bold mt-2 text-sm">
                    ₹{Number(c.fees).toLocaleString("en-IN")}
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        )}
      </Card>
    </div>
  );
}
