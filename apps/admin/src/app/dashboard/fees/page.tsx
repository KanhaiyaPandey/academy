"use client";

import { useState, useEffect } from "react";
import {
  Table, Button, Tag, Space, Modal, Form, Input, Select,
  notification, Card, Statistic, Row, Col, InputNumber,
} from "antd";
import {
  DollarOutlined, CheckCircleOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

type FeeRecord = {
  id: number;
  studentName: string;
  studentPhone: string;
  courseName: string;
  totalAmount: number;
  paidAmount: number;
  status: string;
  dueDate: string | null;
};

export default function FeesPage() {
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [installmentModal, setInstallmentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState<FeeRecord | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/fees");
      const data = await res.json();
      const mapped = (data.data || []).map((f: Record<string, any>) => ({
        id: f.id,
        studentName: `${f.student?.firstName || ""} ${f.student?.lastName || ""}`.trim() || "Unknown",
        studentPhone: f.student?.phone || "",
        courseName: f.enrollment?.course?.name || "—",
        totalAmount: Number(f.totalAmount),
        paidAmount: Number(f.paidAmount),
        status: f.status,
        dueDate: f.dueDate,
      }));
      setFees(mapped);
    } catch {
      api.error({ message: "Failed to load fees" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchFees(); }, []);

  const totalRevenue = fees.reduce((sum, f) => sum + Number(f.paidAmount), 0);
  const totalPending = fees.reduce((sum, f) => sum + (Number(f.totalAmount) - Number(f.paidAmount)), 0);
  const overdueCount = fees.filter((f) => f.status === "overdue").length;
  const collectionRate = totalRevenue + totalPending > 0
    ? Math.round((totalRevenue / (totalRevenue + totalPending)) * 100)
    : 0;

  const filtered = filterStatus === "all" ? fees : fees.filter((f) => f.status === filterStatus);

  const handleRecordPayment = async (values: { amount: number; paymentMode: string; transactionId?: string; notes?: string }) => {
    if (!selectedFee) return;
    try {
      const res = await fetch("/api/fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          feeId: selectedFee.id,
          amount: values.amount,
          paymentMode: values.paymentMode,
          transactionId: values.transactionId,
          notes: values.notes,
          studentPhone: selectedFee.studentPhone,
          studentName: selectedFee.studentName,
        }),
      });
      if (res.ok) {
        api.success({ message: `Payment of ₹${values.amount} recorded successfully!` });
        setInstallmentModal(false);
        form.resetFields();
        fetchFees();
      }
    } catch {
      api.error({ message: "Failed to record payment" });
    }
  };

  const columns: ColumnsType<FeeRecord> = [
    {
      title: "Student",
      dataIndex: "studentName",
      key: "studentName",
      render: (name) => <span className="font-medium text-gray-900">{name}</span>,
    },
    { title: "Course", dataIndex: "courseName", key: "courseName" },
    {
      title: "Total Fees",
      dataIndex: "totalAmount",
      key: "totalAmount",
      render: (amt) => <span className="font-semibold">₹{Number(amt).toLocaleString("en-IN")}</span>,
    },
    {
      title: "Paid",
      dataIndex: "paidAmount",
      key: "paidAmount",
      render: (amt) => <span className="text-green-600 font-semibold">₹{Number(amt).toLocaleString("en-IN")}</span>,
    },
    {
      title: "Pending",
      key: "pending",
      render: (_, r) => {
        const pending = Number(r.totalAmount) - Number(r.paidAmount);
        return pending > 0 ? (
          <span className="text-orange-600 font-semibold">₹{pending.toLocaleString("en-IN")}</span>
        ) : (
          <span className="text-green-500 font-semibold">—</span>
        );
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => {
        const colors: Record<string, string> = {
          paid: "green", partial: "blue", pending: "orange", overdue: "red",
        };
        return <Tag color={colors[s] || "default"}>{s.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Due Date",
      dataIndex: "dueDate",
      key: "dueDate",
      render: (d) => d ? (
        <span className={dayjs(d).isBefore(dayjs()) ? "text-red-500 font-medium" : "text-gray-500"}>
          {dayjs(d).format("DD MMM YYYY")}
        </span>
      ) : "—",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          {record.status !== "paid" && (
            <Button
              type="primary"
              size="small"
              icon={<DollarOutlined />}
              onClick={() => { setSelectedFee(record); setInstallmentModal(true); }}
            >
              Record Payment
            </Button>
          )}
          {record.status === "paid" && (
            <Tag color="green" icon={<CheckCircleOutlined />}>Paid</Tag>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {contextHolder}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Fees & Payments</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track student fee collection and installments</p>
        </div>
      </div>

      <Row gutter={[16, 16]}>
        {[
          { title: "Total Collected", value: totalRevenue, prefix: "₹", color: "#52c41a", icon: "💰" },
          { title: "Total Pending", value: totalPending, prefix: "₹", color: "#fa8c16", icon: "⏳" },
          { title: "Overdue Students", value: overdueCount, prefix: "", color: "#ff4d4f", icon: "⚠️" },
          { title: "Collection Rate", value: collectionRate, prefix: "", suffix: "%", color: "#1677ff", icon: "📊" },
        ].map((s) => (
          <Col xs={24} sm={12} lg={6} key={s.title}>
            <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
              <div className="flex justify-between items-start">
                <Statistic
                  title={<span className="text-gray-500 text-sm">{s.title}</span>}
                  value={s.value}
                  prefix={s.prefix}
                  suffix={s.suffix}
                  valueStyle={{ color: s.color, fontSize: 26, fontWeight: 700, fontFamily: "Sora" }}
                />
                <span className="text-3xl">{s.icon}</span>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
        <div className="mb-4 flex gap-3">
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 160 }}
            options={[
              { value: "all", label: "All Status" },
              { value: "paid", label: "Paid" },
              { value: "partial", label: "Partial" },
              { value: "pending", label: "Pending" },
              { value: "overdue", label: "Overdue" },
            ]}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `${t} records` }}
          scroll={{ x: 900 }}
          rowClassName={(r) => r.status === "overdue" ? "bg-red-50" : ""}
        />
      </Card>

      <Modal
        title={<span className="font-display font-bold">Record Payment</span>}
        open={installmentModal}
        onCancel={() => { setInstallmentModal(false); form.resetFields(); }}
        footer={null}
        width={480}
      >
        {selectedFee && (
          <div className="my-4 p-4 bg-blue-50 rounded-xl">
            <p className="font-semibold text-gray-800">{selectedFee.studentName}</p>
            <p className="text-sm text-gray-600">{selectedFee.courseName}</p>
            <div className="mt-2 flex justify-between text-sm">
              <span>Remaining: <strong className="text-orange-600">
                ₹{(Number(selectedFee.totalAmount) - Number(selectedFee.paidAmount)).toLocaleString("en-IN")}
              </strong></span>
              <span>Paid: <strong className="text-green-600">₹{Number(selectedFee.paidAmount).toLocaleString("en-IN")}</strong></span>
            </div>
          </div>
        )}
        <Form form={form} layout="vertical" onFinish={handleRecordPayment}>
          <Form.Item name="amount" label="Payment Amount (₹)" rules={[{ required: true }]}>
            <InputNumber
              className="w-full"
              min={1}
              max={selectedFee ? Number(selectedFee.totalAmount) - Number(selectedFee.paidAmount) : undefined}
              placeholder="Enter amount received"
              formatter={(v) => `₹ ${v}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            />
          </Form.Item>
          <Form.Item name="paymentMode" label="Payment Mode" rules={[{ required: true }]}>
            <Select placeholder="How was payment made?">
              <Select.Option value="cash">Cash</Select.Option>
              <Select.Option value="upi">UPI (GPay/PhonePe/Paytm)</Select.Option>
              <Select.Option value="bank">Bank Transfer / NEFT</Select.Option>
              <Select.Option value="cheque">Cheque</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item name="transactionId" label="Transaction ID / Reference (optional)">
            <Input placeholder="UPI ref no. or bank transaction ID" />
          </Form.Item>
          <Form.Item name="notes" label="Notes (optional)">
            <Input.TextArea rows={2} placeholder="Any additional notes" />
          </Form.Item>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setInstallmentModal(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" icon={<DollarOutlined />}>
              Record Payment
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
