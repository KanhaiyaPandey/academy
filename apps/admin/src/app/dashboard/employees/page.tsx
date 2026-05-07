"use client";

import { useState, useEffect } from "react";
import {
  Table, Button, Tag, Space, Modal, Form, Input, Select,
  DatePicker, notification, Popconfirm, Card, Avatar,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Option } = Select;

type Employee = {
  id: number;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string | null;
  salary: number | string | null;
  joiningDate: string;
  isActive: boolean;
};

const roleColors: Record<string, string> = {
  admin: "red", teacher: "blue", accountant: "green",
  receptionist: "purple", support: "orange",
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/employees");
      const data = await res.json();
      setEmployees(data.data || []);
    } catch {
      api.error({ message: "Failed to load employees" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEmployees(); }, []);

  const handleSubmit = async (values: Record<string, unknown>) => {
    setSaving(true);
    try {
      const payload = {
        ...values,
        joiningDate: values.joiningDate
          ? (values.joiningDate as ReturnType<typeof dayjs>).format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
      };
      const url = editingEmp ? `/api/employees/${editingEmp.id}` : "/api/employees";
      const method = editingEmp ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        api.success({ message: editingEmp ? "Employee updated!" : "Employee added!" });
        setModalOpen(false);
        form.resetFields();
        setEditingEmp(null);
        fetchEmployees();
      }
    } catch {
      api.error({ message: "Failed to save employee" });
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmp(emp);
    form.setFieldsValue({ ...emp, joiningDate: dayjs(emp.joiningDate) });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/employees/${id}`, { method: "DELETE" });
      api.success({ message: "Employee removed" });
      fetchEmployees();
    } catch {
      api.error({ message: "Failed to delete" });
    }
  };

  const columns: ColumnsType<Employee> = [
    {
      title: "Employee",
      key: "employee",
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <Avatar size={38} style={{ background: "#1677ff", fontWeight: 700 }}>
            {r.firstName[0]}
          </Avatar>
          <div>
            <div className="font-semibold text-gray-900">{r.firstName} {r.lastName}</div>
            <div className="text-xs text-gray-400">{r.email}</div>
          </div>
        </div>
      ),
    },
    { title: "ID", dataIndex: "employeeId", render: (id) => <span className="font-mono text-xs text-primary-600 font-bold">{id}</span> },
    {
      title: "Role",
      dataIndex: "role",
      render: (r) => <Tag color={roleColors[r] || "default"}>{r.charAt(0).toUpperCase() + r.slice(1)}</Tag>,
    },
    { title: "Department", dataIndex: "department", render: (d) => d || "—" },
    { title: "Phone", dataIndex: "phone" },
    {
      title: "Salary",
      dataIndex: "salary",
      render: (s) => s ? <span className="font-semibold">₹{Number(s).toLocaleString("en-IN")}</span> : "—",
    },
    {
      title: "Joining Date",
      dataIndex: "joiningDate",
      render: (d) => dayjs(d).format("DD MMM YYYY"),
    },
    {
      title: "Status",
      dataIndex: "isActive",
      render: (a) => <Tag color={a ? "green" : "red"}>{a ? "Active" : "Inactive"}</Tag>,
    },
    {
      title: "Actions",
      render: (_, r) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(r)} />
          <Popconfirm title="Remove this employee?" onConfirm={() => handleDelete(r.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {contextHolder}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Employees</h1>
          <p className="text-gray-500 text-sm mt-0.5">{employees.length} staff members</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => { setEditingEmp(null); form.resetFields(); setModalOpen(true); }}>
          Add Employee
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
        <Table columns={columns} dataSource={employees} rowKey="id" loading={loading} pagination={{ pageSize: 10 }} scroll={{ x: 900 }} />
      </Card>

      <Modal
        title={<span className="font-display font-bold">{editingEmp ? "Edit Employee" : "Add Employee"}</span>}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingEmp(null); form.resetFields(); }}
        footer={null}
        width={620}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item name="firstName" label="First Name" rules={[{ required: true }]}>
              <Input placeholder="First name" />
            </Form.Item>
            <Form.Item name="lastName" label="Last Name" rules={[{ required: true }]}>
              <Input placeholder="Last name" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item name="email" label="Email" rules={[{ required: true, type: "email" }]}>
              <Input placeholder="Work email" />
            </Form.Item>
            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <Input placeholder="Mobile number" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select placeholder="Select role">
                <Option value="admin">Admin</Option>
                <Option value="teacher">Teacher</Option>
                <Option value="accountant">Accountant</Option>
                <Option value="receptionist">Receptionist</Option>
                <Option value="support">Support</Option>
              </Select>
            </Form.Item>
            <Form.Item name="department" label="Department">
              <Input placeholder="e.g. Computer Science" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item name="salary" label="Monthly Salary (₹)">
              <Input type="number" placeholder="e.g. 22000" />
            </Form.Item>
            <Form.Item name="joiningDate" label="Joining Date" rules={[{ required: true }]}>
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving} icon={<TeamOutlined />}>
              {editingEmp ? "Save Changes" : "Add Employee"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
