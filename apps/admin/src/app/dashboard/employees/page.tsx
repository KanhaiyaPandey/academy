"use client";

import { useState } from "react";
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
  salary: number | null;
  joiningDate: string;
  isActive: boolean;
};

const mockEmployees: Employee[] = [
  { id: 1, employeeId: "EMP-001", firstName: "Vikash", lastName: "Kumar", email: "vikash@pahalacademy.com", phone: "9801234567", role: "admin", department: "Management", salary: 35000, joiningDate: "2022-01-01", isActive: true },
  { id: 2, employeeId: "EMP-002", firstName: "Sunita", lastName: "Devi", email: "sunita@pahalacademy.com", phone: "9812345678", role: "teacher", department: "Computer Science", salary: 22000, joiningDate: "2022-03-15", isActive: true },
  { id: 3, employeeId: "EMP-003", firstName: "Ravi", lastName: "Prasad", email: "ravi@pahalacademy.com", phone: "9823456789", role: "teacher", department: "Programming", salary: 25000, joiningDate: "2023-01-10", isActive: true },
  { id: 4, employeeId: "EMP-004", firstName: "Pooja", lastName: "Sharma", email: "pooja@pahalacademy.com", phone: "9834567890", role: "receptionist", department: "Admin", salary: 15000, joiningDate: "2023-06-01", isActive: true },
];

const roleColors: Record<string, string> = {
  admin: "red", teacher: "blue", accountant: "green",
  receptionist: "purple", support: "orange",
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<Employee | null>(null);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const handleSubmit = (values: Record<string, unknown>) => {
    const payload = {
      ...values,
      joiningDate: values.joiningDate ? (values.joiningDate as ReturnType<typeof dayjs>).format("YYYY-MM-DD") : dayjs().format("YYYY-MM-DD"),
    };

    if (editingEmp) {
      setEmployees((prev) => prev.map((e) => e.id === editingEmp.id ? { ...e, ...payload } as Employee : e));
      api.success({ message: "Employee updated!" });
    } else {
      const newEmp: Employee = {
        ...payload,
        id: Date.now(),
        employeeId: `EMP-${String(employees.length + 1).padStart(3, "0")}`,
        isActive: true,
      } as Employee;
      setEmployees((prev) => [...prev, newEmp]);
      api.success({ message: "Employee added!" });
    }
    setModalOpen(false);
    form.resetFields();
    setEditingEmp(null);
  };

  const handleEdit = (emp: Employee) => {
    setEditingEmp(emp);
    form.setFieldsValue({ ...emp, joiningDate: dayjs(emp.joiningDate) });
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
    api.success({ message: "Employee removed" });
  };

  const columns: ColumnsType<Employee> = [
    {
      title: "Employee",
      key: "employee",
      render: (_, r) => (
        <div className="flex items-center gap-3">
          <Avatar
            size={38}
            style={{ background: "#1677ff", fontWeight: 700 }}
          >
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
        <Table columns={columns} dataSource={employees} rowKey="id" pagination={{ pageSize: 10 }} scroll={{ x: 900 }} />
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
              <Input placeholder="work email" />
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
            <Button type="primary" htmlType="submit" icon={<TeamOutlined />}>
              {editingEmp ? "Save Changes" : "Add Employee"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
