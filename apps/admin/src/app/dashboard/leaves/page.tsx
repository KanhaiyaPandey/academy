"use client";

import { useState, useEffect } from "react";
import {
  Table, Button, Tag, Space, Modal, Input, Card, Tabs, Badge,
  Form, Select, DatePicker, InputNumber, notification,
} from "antd";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "@ant-design/icons";
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

const leaveTypeColors: Record<string, string> = {
  sick: "red", casual: "blue", earned: "green",
};

function mapLeave(l: Record<string, any>): Leave {
  return {
    id: l.id,
    employeeName: `${l.employee?.firstName || ""} ${l.employee?.lastName || ""}`.trim() || "Unknown",
    role: l.employee?.role
      ? l.employee.role.charAt(0).toUpperCase() + l.employee.role.slice(1)
      : "—",
    leaveType: l.leaveType,
    fromDate: l.fromDate,
    toDate: l.toDate,
    totalDays: l.totalDays,
    reason: l.reason,
    status: l.status,
    appliedOn: l.createdAt ? l.createdAt.split("T")[0] : l.createdAt,
  };
}

export default function LeavesPage() {
  const [userRole, setUserRole] = useState<"admin" | "employee">("admin");
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [loading, setLoading] = useState(true);
  const [rejectModal, setRejectModal] = useState(false);
  const [applyModal, setApplyModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [remarks, setRemarks] = useState("");
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((d) => { if (d?.data?.role) setUserRole(d.data.role); })
      .catch(() => {});
  }, []);

  const fetchLeaves = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leaves");
      const data = await res.json();
      setLeaves((data.data || []).map(mapLeave));
    } catch {
      api.error({ message: "Failed to load leaves" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeaves(); }, []);

  const handleApprove = async (leave: Leave) => {
    try {
      await fetch("/api/leaves", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: leave.id, action: "approve" }),
      });
      api.success({ message: `Leave approved for ${leave.employeeName}` });
      fetchLeaves();
    } catch {
      api.error({ message: "Failed to approve leave" });
    }
  };

  const handleReject = async () => {
    if (!selectedLeave) return;
    try {
      await fetch("/api/leaves", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: selectedLeave.id, action: "reject", remarks }),
      });
      api.info({ message: `Leave rejected for ${selectedLeave.employeeName}` });
      setRejectModal(false);
      setRemarks("");
      fetchLeaves();
    } catch {
      api.error({ message: "Failed to reject leave" });
    }
  };

  const handleApply = async (values: Record<string, any>) => {
    try {
      await fetch("/api/leaves", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          leaveType: values.leaveType,
          fromDate: values.fromDate.format("YYYY-MM-DD"),
          toDate: values.toDate.format("YYYY-MM-DD"),
          totalDays: values.totalDays,
          reason: values.reason,
        }),
      });
      api.success({ message: "Leave application submitted!" });
      setApplyModal(false);
      form.resetFields();
      fetchLeaves();
    } catch {
      api.error({ message: "Failed to submit leave" });
    }
  };

  const pendingLeaves = leaves.filter((l) => l.status === "pending");
  const approvedLeaves = leaves.filter((l) => l.status === "approved");
  const rejectedLeaves = leaves.filter((l) => l.status === "rejected");

  const baseColumns: ColumnsType<Leave> = [
    ...(userRole === "admin"
      ? [{
          title: "Employee",
          key: "employee",
          render: (_: unknown, r: Leave) => (
            <div>
              <div className="font-semibold text-gray-900">{r.employeeName}</div>
              <div className="text-xs text-gray-400">{r.role}</div>
            </div>
          ),
        }]
      : []),
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
  ];

  const adminActionColumn: ColumnsType<Leave>[number] = {
    title: "Actions",
    key: "actions",
    render: (_, r) => (
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
  };

  const tabItems =
    userRole === "admin"
      ? [
          {
            key: "pending",
            label: <span>Pending <Badge count={pendingLeaves.length} style={{ background: "#fa8c16" }} /></span>,
            children: (
              <Table
                columns={[...baseColumns, adminActionColumn]}
                dataSource={pendingLeaves}
                rowKey="id"
                loading={loading}
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
                columns={baseColumns}
                dataSource={approvedLeaves}
                rowKey="id"
                loading={loading}
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
                columns={baseColumns}
                dataSource={rejectedLeaves}
                rowKey="id"
                loading={loading}
                pagination={false}
                scroll={{ x: 800 }}
              />
            ),
          },
        ]
      : [
          {
            key: "all",
            label: "My Leaves",
            children: (
              <Table
                columns={baseColumns}
                dataSource={leaves}
                rowKey="id"
                loading={loading}
                pagination={false}
                scroll={{ x: 700 }}
              />
            ),
          },
        ];

  const summaryStats =
    userRole === "admin"
      ? [
          { label: "Pending Approval", count: pendingLeaves.length, cls: "text-orange-500", bg: "#fff7e6" },
          { label: "Approved This Month", count: approvedLeaves.length, cls: "text-green-600", bg: "#f6ffed" },
          { label: "Rejected", count: rejectedLeaves.length, cls: "text-red-500", bg: "#fff1f0" },
        ]
      : [
          { label: "Total Applied", count: leaves.length, cls: "text-indigo-600", bg: "#eef2ff" },
          { label: "Approved", count: approvedLeaves.length, cls: "text-green-600", bg: "#f6ffed" },
          { label: "Pending", count: pendingLeaves.length, cls: "text-orange-500", bg: "#fff7e6" },
        ];

  return (
    <div className="space-y-5">
      {contextHolder}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">
            {userRole === "admin" ? "Leave Management" : "My Leaves"}
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {userRole === "admin"
              ? "Review and approve employee leave applications"
              : "Apply for leave and track your applications"}
          </p>
        </div>
        {userRole === "employee" && (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            size="large"
            onClick={() => setApplyModal(true)}
          >
            Apply for Leave
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {summaryStats.map((s) => (
          <Card key={s.label} bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0", background: s.bg }}>
            <div className={`text-3xl font-display font-bold ${s.cls}`}>{s.count}</div>
            <div className="text-sm text-gray-600 mt-1">{s.label}</div>
          </Card>
        ))}
      </div>

      <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
        <Tabs items={tabItems} />
      </Card>

      {/* Admin: Reject modal */}
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

      {/* Employee: Apply leave modal */}
      <Modal
        title={<span className="font-display font-bold">Apply for Leave</span>}
        open={applyModal}
        onCancel={() => { setApplyModal(false); form.resetFields(); }}
        footer={null}
        width={480}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleApply} className="mt-4">
          <Form.Item name="leaveType" label="Leave Type" rules={[{ required: true }]}>
            <Select placeholder="Select type">
              <Select.Option value="sick">Sick Leave</Select.Option>
              <Select.Option value="casual">Casual Leave</Select.Option>
              <Select.Option value="earned">Earned Leave</Select.Option>
            </Select>
          </Form.Item>
          <div className="grid grid-cols-2 gap-x-4">
            <Form.Item name="fromDate" label="From Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>
            <Form.Item name="toDate" label="To Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" />
            </Form.Item>
          </div>
          <Form.Item name="totalDays" label="Total Days" rules={[{ required: true }]}>
            <InputNumber min={1} className="w-full" placeholder="Number of days" />
          </Form.Item>
          <Form.Item name="reason" label="Reason" rules={[{ required: true }]}>
            <Input.TextArea rows={3} placeholder="Reason for leave..." />
          </Form.Item>
          <div className="flex justify-end gap-3 mt-2">
            <Button onClick={() => { setApplyModal(false); form.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit">Submit Application</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
