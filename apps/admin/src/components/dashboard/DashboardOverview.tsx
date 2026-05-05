"use client";

import { useEffect, useState } from "react";
import { Card, Row, Col, Table, Tag, Statistic, Progress, Badge } from "antd";
import {
  UserOutlined, DollarOutlined, BookOutlined, FunnelPlotOutlined,
  ArrowUpOutlined, WarningOutlined,
} from "@ant-design/icons";

type Stats = {
  totalStudents: number;
  activeStudents: number;
  totalRevenue: number;
  pendingFees: number;
  totalCourses: number;
  newLeads: number;
};

const recentStudents = [
  { key: 1, name: "Rahul Sharma", course: "Python Programming", status: "active", date: "15 Jan 2024" },
  { key: 2, name: "Priya Kumari", course: "Full Stack Web Dev", status: "active", date: "01 Feb 2024" },
  { key: 3, name: "Amit Singh", course: "DCA Diploma", status: "active", date: "10 Mar 2024" },
];

const pendingFeeData = [
  { key: 1, student: "Suresh Kumar", course: "ADCA", pending: 8000, due: "20 Jan" },
  { key: 2, student: "Meena Devi", course: "Python", pending: 3500, due: "15 Jan" },
  { key: 3, student: "Raj Kumar", course: "Tally GST", pending: 2000, due: "25 Jan" },
];

export function DashboardOverview() {
  const [stats, setStats] = useState<Stats>({
    totalStudents: 0, activeStudents: 0, totalRevenue: 0,
    pendingFees: 0, totalCourses: 0, newLeads: 0,
  });

  useEffect(() => {
    // In production, fetch from API
    setStats({
      totalStudents: 127,
      activeStudents: 98,
      totalRevenue: 485000,
      pendingFees: 42000,
      totalCourses: 6,
      newLeads: 14,
    });
  }, []);

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      icon: <UserOutlined style={{ fontSize: 24, color: "#1677ff" }} />,
      bg: "#e6f4ff",
      suffix: "",
      trend: "+12 this month",
    },
    {
      title: "Total Revenue",
      value: stats.totalRevenue,
      icon: <DollarOutlined style={{ fontSize: 24, color: "#52c41a" }} />,
      bg: "#f6ffed",
      prefix: "₹",
      trend: "+₹18,000 this month",
    },
    {
      title: "Pending Fees",
      value: stats.pendingFees,
      icon: <WarningOutlined style={{ fontSize: 24, color: "#fa8c16" }} />,
      bg: "#fff7e6",
      prefix: "₹",
      trend: "3 overdue",
    },
    {
      title: "New Leads",
      value: stats.newLeads,
      icon: <FunnelPlotOutlined style={{ fontSize: 24, color: "#722ed1" }} />,
      bg: "#f9f0ff",
      suffix: " this week",
      trend: "5 need follow-up",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Welcome back! Here's what's happening at Pahal Academy.</p>
      </div>

      {/* Stat Cards */}
      <Row gutter={[16, 16]}>
        {statCards.map((card) => (
          <Col xs={24} sm={12} lg={6} key={card.title}>
            <Card
              className="stat-card"
              bordered={false}
              style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-gray-500 text-sm font-medium mb-1">{card.title}</div>
                  <Statistic
                    value={card.value}
                    prefix={card.prefix}
                    suffix={card.suffix}
                    valueStyle={{ fontSize: 28, fontWeight: 700, fontFamily: "Sora" }}
                  />
                  <div className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                    <ArrowUpOutlined style={{ color: "#52c41a", fontSize: 10 }} />
                    {card.trend}
                  </div>
                </div>
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: card.bg }}
                >
                  {card.icon}
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Second Row */}
      <Row gutter={[16, 16]}>
        {/* Recent Admissions */}
        <Col xs={24} lg={14}>
          <Card
            title="Recent Admissions"
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}
            extra={<a href="/dashboard/students" className="text-primary-500 text-sm">View All</a>}
          >
            <Table
              dataSource={recentStudents}
              pagination={false}
              size="small"
              columns={[
                { title: "Student", dataIndex: "name", key: "name", render: (name) => <span className="font-medium">{name}</span> },
                { title: "Course", dataIndex: "course", key: "course" },
                {
                  title: "Status",
                  dataIndex: "status",
                  key: "status",
                  render: (s) => <Tag color={s === "active" ? "green" : "red"}>{s}</Tag>,
                },
                { title: "Date", dataIndex: "date", key: "date", className: "text-gray-500" },
              ]}
            />
          </Card>
        </Col>

        {/* Pending Fees */}
        <Col xs={24} lg={10}>
          <Card
            title={
              <span className="flex items-center gap-2">
                Pending Fee Alerts
                <Badge count={pendingFeeData.length} style={{ background: "#fa8c16" }} />
              </span>
            }
            bordered={false}
            style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}
            extra={<a href="/dashboard/fees" className="text-primary-500 text-sm">Manage</a>}
          >
            <div className="space-y-3">
              {pendingFeeData.map((item) => (
                <div
                  key={item.key}
                  className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-100"
                >
                  <div>
                    <div className="font-medium text-gray-800 text-sm">{item.student}</div>
                    <div className="text-xs text-gray-500">{item.course} · Due {item.due}</div>
                  </div>
                  <div className="text-orange-600 font-bold text-sm">
                    ₹{item.pending.toLocaleString("en-IN")}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Course Progress */}
      <Card
        title="Active Course Enrollment"
        bordered={false}
        style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}
      >
        <Row gutter={[24, 16]}>
          {[
            { name: "Python Programming", enrolled: 18, capacity: 20, color: "#52c41a" },
            { name: "Full Stack Web Dev", enrolled: 14, capacity: 20, color: "#1677ff" },
            { name: "DCA Diploma", enrolled: 22, capacity: 25, color: "#fa8c16" },
            { name: "Tally + GST", enrolled: 19, capacity: 20, color: "#13c2c2" },
            { name: "ADCA Program", enrolled: 12, capacity: 20, color: "#722ed1" },
            { name: "CCC Certificate", enrolled: 24, capacity: 30, color: "#eb2f96" },
          ].map((course) => (
            <Col xs={24} sm={12} lg={8} key={course.name}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="font-medium text-gray-700">{course.name}</span>
                <span className="text-gray-500">
                  {course.enrolled}/{course.capacity}
                </span>
              </div>
              <Progress
                percent={Math.round((course.enrolled / course.capacity) * 100)}
                strokeColor={course.color}
                size="small"
                showInfo={false}
              />
            </Col>
          ))}
        </Row>
      </Card>
    </div>
  );
}
