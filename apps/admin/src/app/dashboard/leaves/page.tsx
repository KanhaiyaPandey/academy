"use client";

import { useState } from "react";
import {
  Table, Button, Tag, Space, Modal, Form, Input, Select,
  DatePicker, notification, Card, Tabs, Badge,
} from "antd";
import {
  CheckOutlined, CloseOutlined, FileTextOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

type Leave = {
  id: number;
  employeeName: string;
  role: string;
  leaveType: string;
  fromDate: string;
  toDate: string;
  totalDays: number;
  reason: string;
  status: "pending" | "approved" | "rejected";
  appliedOn: string;
};

const mockLeaves: Leave[] = [
  { id: 1, employeeName: "Sunita Devi", role: "Teacher", leaveType: "sick", fromDate: "2024-01-20", toDate: "2024-01-22", totalDays: 3, reason: "Fever and cold", status: "pending", appliedOn: "2024-01-19" },
  { id: 2, employeeName: "Ravi Prasad", role: "Teacher", leaveType: "casual", fromDate: "2024-01-25", toDate: "2024-01-25", totalDays: 1, reason: "Personal work", status: "pending", appliedOn: "2024-01-23" },
  { id: 3, employeeName: "Pooja Sharma", role: "Receptionist", leaveType: "earned", fromDate: "2024-02-01", toDate: "2024-02-03", totalDays: 3, reason: "Family function", status: "approved", appliedOn: "2024-01-28" },
  { id: 4, employeeName: "Sunita Devi", role: "Teacher", leaveType: "casual", fromDate: "2024-01-10", toDate: "2024-01-10", totalDays: 1, reason: "Bank work", status: "rejected", appliedOn: "2024-01-09" },
];

const leaveTypeColors: Record<string, string> = {
  sick: "red", casual: "blue", earned: "green",
};

export default function LeavesPage() {
  const [leaves, setLeaves] = useState<Leave[]>(mockLeaves);
  const [rejectModal, setRejectModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [remarks, setRemarks] = useState("");
  const [api, contextHolder] = notification.useNotification();

  const pendingLeaves = leaves.filter((l) => l.status === "pending");
  const approvedLeaves = leaves.filter((l) => l.status === "approved");
  const rejectedLeaves = leaves.filter((l) => l.status === "rejected");

  const handleApprove = async (leave: Leave) => {
    setLeaves((prev) => prev.map((l) => l.id === leave.id ? { ...l, status: "approved" } : l));
    api.success({ message: `Leave approved for ${leave.employeeName}` });
    // In real app: POST /api/leaves/${leave.id}/approve + send WhatsApp
  };

  const handleReject = () => {
    if (!selectedLeave) return;
    setLeaves((prev) => prev.map((l) => l.id === selectedLeave.id ? { ...l, status: "rejected" } : l));
    api.info({ message: `Leave rejected for ${selectedLeave.employeeName}` });
    setRejectModal(false);
    setRemarks("");
  };

  const columns = (showActions: boolean): ColumnsType<Leave> => [
    {
      title: "Employee",
      key: "employee",
      render: (_, r) => (
        <div>
          <div className="font-semibold text-gray-900">{r.employeeName}</div>
          <div className="text-xs text-gray-400">{r.role}</div>
        </div>
      ),
    },
    {
      title: "Leave Type",
      dataIndex: "leaveType",
      render: (t) => <Tag color={leaveTypeColors[t] || "default"}>{t.charAt(0).toUpperCase() + t.slice(1)}</Tag>,
    },
    {
      title: "Duration",
      key: "duration",
      render: (_, r) => (
        <div>
          <div className="text-sm font-medium">{dayjs(r.fromDate).format("DD MMM")} – {dayjs(r.toDate).format("DD MMM YYYY")}</div>
          <div className="text-xs text-gray-400">{r.totalDays} day{r.totalDays > 1 ? "s" : ""}</div>
        </div>
      ),
    },
    {
      title: "Reason",
      dataIndex: "reason",
      render: (r) => <span className="text-gray-600 text-sm">{r}</span>,
    },
    {
      title: "Applied On",
      dataIndex: "appliedOn",
      render: (d) => <span className="text-gray-500 text-sm">{dayjs(d).format("DD MMM YYYY")}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => (
        <Tag color={s === "approved" ? "green" : s === "rejected" ? "red" : "orange"}>
          {s.toUpperCase()}
        </Tag>
      ),
    },
    ...(showActions ? [{
      title: "Actions",
      key: "actions",
      render: (_: unknown, r: Leave) => (
        <Space>
          <Button
            size="small"
            type="primary"
            icon={<CheckOutlined />}
            onClick={() => handleApprove(r)}
            style={{ background: "#52c41a", borderColor: "#52c41a" }}
          >
            Approve
          </Button>
          <Button
            size="small"
            danger
            icon={<CloseOutlined />}
            onClick={() => { setSelectedLeave(r); setRejectModal(true); }}
          >
            Reject
          </Button>
        </Space>
      ),
    }] : []),
  ];

  const tabItems = [
    {
      key: "pending",
      label: <span>Pending <Badge count={pendingLeaves.length} style={{ background: "#fa8c16" }} /></span>,
      children: (
        <Table
          columns={columns(true)}
          dataSource={pendingLeaves}
          rowKey="id"
          pagination={false}
          scroll={{ x: 800 }}
          rowClassName="bg-orange-50/40"
        />
      ),
    },
    {
      key: "approved",
      label: <span>Approved <Badge count={approvedLeaves.length} style={{ background: "#52c41a" }} /></span>,
      children: (
        <Table
          columns={columns(false)}
          dataSource={approvedLeaves}
          rowKey="id"
          pagination={false}
          scroll={{ x: 800 }}
        />
      ),
    },
    {
      key: "rejected",
      label: `Rejected (${rejectedLeaves.length})`,
      children: (
        <Table
          columns={columns(false)}
          dataSource={rejectedLeaves}
          rowKey="id"
          pagination={false}
          scroll={{ x: 800 }}
        />
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {contextHolder}

      <div>
        <h1 className="font-display text-2xl font-bold text-gray-900">Leave Management</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review and approve employee leave applications</p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Pending Approval", count: pendingLeaves.length, color: "#fa8c16", bg: "#fff7e6" },
          { label: "Approved This Month", count: approvedLeaves.length, color: "#52c41a", bg: "#f6ffed" },
          { label: "Rejected", count: rejectedLeaves.length, color: "#ff4d4f", bg: "#fff1f0" },
        ].map((s) => (
          <Card key={s.label} bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0", background: s.bg }}>
            <div className="text-3xl font-display font-bold" style={{ color: s.color }}>{s.count}</div>
            <div className="text-sm text-gray-600 mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
        <Tabs items={tabItems} />
      </Card>

      {/* Reject modal */}
      <Modal
        title={<span className="font-display font-bold">Reject Leave</span>}
        open={rejectModal}
        onCancel={() => setRejectModal(false)}
        onOk={handleReject}
        okText="Confirm Reject"
        okButtonProps={{ danger: true }}
        width={440}
      >
        {selectedLeave && (
          <div className="my-4">
            <p className="text-gray-700">
              Rejecting leave for <strong>{selectedLeave.employeeName}</strong>{" "}
              ({dayjs(selectedLeave.fromDate).format("DD MMM")} – {dayjs(selectedLeave.toDate).format("DD MMM YYYY")})
            </p>
            <div className="mt-4">
              <label className="text-sm font-medium text-gray-700 block mb-2">
                Reason for rejection (optional):
              </label>
              <Input.TextArea
                rows={3}
                placeholder="Enter reason for rejection..."
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
              />
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
