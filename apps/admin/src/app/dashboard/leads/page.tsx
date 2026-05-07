"use client";

import { useState, useEffect } from "react";
import {
  Table, Button, Tag, Space, Modal, Form, Input, Select,
  notification, Card, Statistic, Row, Col,
} from "antd";
import { PlusOutlined, EditOutlined, WhatsAppOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

type Lead = {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  courseInterest: string | null;
  source: string;
  status: string;
  notes: string | null;
  createdAt: string;
};

const statusColors: Record<string, string> = {
  new: "blue", contacted: "orange", interested: "gold",
  enrolled: "green", lost: "red",
};

const sourceLabels: Record<string, string> = {
  website: "🌐 Website", social: "📱 Social", walkin: "🚶 Walk-in",
  referral: "👥 Referral", banner: "📌 Banner", other: "Other",
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);
  const [filterStatus, setFilterStatus] = useState("all");
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/leads");
      const data = await res.json();
      setLeads(data.data || []);
    } catch {
      api.error({ message: "Failed to load leads" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchLeads(); }, []);

  const filtered = filterStatus === "all" ? leads : leads.filter((l) => l.status === filterStatus);

  const totalLeads = leads.length;
  const newLeads = leads.filter((l) => l.status === "new").length;
  const enrolledLeads = leads.filter((l) => l.status === "enrolled").length;
  const conversionRate = totalLeads > 0 ? Math.round((enrolledLeads / totalLeads) * 100) : 0;

  const handleSubmit = async (values: Record<string, string>) => {
    setSaving(true);
    try {
      const url = editingLead ? `/api/leads/${editingLead.id}` : "/api/leads";
      const method = editingLead ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (res.ok) {
        api.success({ message: editingLead ? "Lead updated!" : "Lead added!" });
        setModalOpen(false);
        form.resetFields();
        setEditingLead(null);
        fetchLeads();
      }
    } catch {
      api.error({ message: "Failed to save lead" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (lead: Lead) => {
    setEditingLead(lead);
    form.setFieldsValue(lead);
    setModalOpen(true);
  };

  const columns: ColumnsType<Lead> = [
    {
      title: "Name",
      key: "name",
      render: (_, r) => (
        <div>
          <div className="font-semibold text-gray-900">{r.name}</div>
          <div className="text-xs text-gray-400">{r.phone}</div>
        </div>
      ),
    },
    {
      title: "Course Interest",
      dataIndex: "courseInterest",
      render: (c) => c || <span className="text-gray-400">—</span>,
    },
    {
      title: "Source",
      dataIndex: "source",
      render: (s) => <span className="text-sm">{sourceLabels[s] || s}</span>,
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (s) => (
        <Tag color={statusColors[s] || "default"}>
          {s.charAt(0).toUpperCase() + s.slice(1)}
        </Tag>
      ),
    },
    {
      title: "Notes",
      dataIndex: "notes",
      render: (n) => n ? <span className="text-sm text-gray-500 truncate block max-w-[200px]">{n}</span> : <span className="text-gray-300">—</span>,
    },
    {
      title: "Date",
      dataIndex: "createdAt",
      render: (d) => <span className="text-gray-400 text-sm">{dayjs(d).format("DD MMM YYYY")}</span>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)} />
          <Button
            size="small"
            style={{ color: "#25D366", borderColor: "#25D366" }}
            icon={<WhatsAppOutlined />}
            onClick={() => window.open(`https://wa.me/91${r.phone}`, "_blank")}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {contextHolder}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Leads & Inquiries</h1>
          <p className="text-gray-500 text-sm mt-0.5">Track and convert incoming inquiries</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => { setEditingLead(null); form.resetFields(); setModalOpen(true); }}>
          Add Lead
        </Button>
      </div>

      <Row gutter={[16, 16]}>
        {[
          { title: "Total Leads", value: totalLeads, color: "#ec4899", icon: "📋" },
          { title: "New Inquiries", value: newLeads, color: "#fa8c16", icon: "🆕" },
          { title: "Enrolled", value: enrolledLeads, color: "#52c41a", icon: "🎓" },
          { title: "Conversion Rate", value: conversionRate, color: "#722ed1", suffix: "%", icon: "📈" },
        ].map((s) => (
          <Col xs={12} lg={6} key={s.title}>
            <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
              <div className="flex justify-between items-start">
                <Statistic
                  title={<span className="text-gray-500 text-sm">{s.title}</span>}
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
        <div className="mb-4 flex gap-3">
          <Select
            value={filterStatus}
            onChange={setFilterStatus}
            style={{ width: 180 }}
            options={[
              { value: "all", label: "All Leads" },
              { value: "new", label: "New" },
              { value: "contacted", label: "Contacted" },
              { value: "interested", label: "Interested" },
              { value: "enrolled", label: "Enrolled" },
              { value: "lost", label: "Lost" },
            ]}
          />
        </div>
        <Table
          columns={columns}
          dataSource={filtered}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10, showTotal: (t) => `${t} leads` }}
          scroll={{ x: 800 }}
        />
      </Card>

      <Modal
        title={<span className="font-display font-bold">{editingLead ? "Edit Lead" : "Add Lead"}</span>}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); form.resetFields(); setEditingLead(null); }}
        footer={null}
        width={520}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
            <Input placeholder="Prospect's name" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <Input placeholder="Mobile number" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input placeholder="Email (optional)" type="email" />
            </Form.Item>
          </div>
          <Form.Item name="courseInterest" label="Course Interest">
            <Input placeholder="Which course are they interested in?" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item name="source" label="Source" rules={[{ required: true }]}>
              <Select placeholder="How did they find us?">
                <Select.Option value="website">Website</Select.Option>
                <Select.Option value="social">Social Media</Select.Option>
                <Select.Option value="walkin">Walk-in</Select.Option>
                <Select.Option value="referral">Referral</Select.Option>
                <Select.Option value="banner">Banner / Poster</Select.Option>
                <Select.Option value="other">Other</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status" rules={[{ required: true }]}>
              <Select placeholder="Current status">
                <Select.Option value="new">New</Select.Option>
                <Select.Option value="contacted">Contacted</Select.Option>
                <Select.Option value="interested">Interested</Select.Option>
                <Select.Option value="enrolled">Enrolled</Select.Option>
                <Select.Option value="lost">Lost</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={3} placeholder="Any relevant notes..." />
          </Form.Item>
          <div className="flex justify-end gap-3 mt-2">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving}>{editingLead ? "Save Changes" : "Add Lead"}</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
