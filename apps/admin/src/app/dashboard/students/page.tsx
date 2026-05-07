"use client";

import { useState, useEffect } from "react";
import {
  Table, Button, Tag, Space, Modal, Form, Input, Select,
  DatePicker, notification, Popconfirm, Card, Input as AntInput,
} from "antd";
import {
  PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined,
  UserOutlined, EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

const { Option } = Select;

type Student = {
  id: number;
  studentId: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  gender: string;
  city: string | null;
  qualification: string | null;
  status: string;
  admissionDate: string;
};

type Course = {
  id: number;
  name: string;
  courseCode: string;
};

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [search, setSearch] = useState("");
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/students");
      const data = await res.json();
      setStudents(data.data || []);
    } catch {
      api.error({ message: "Failed to load students" });
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data.data || []);
    } catch {
      // non-critical, form will just show empty list
    }
  };

  useEffect(() => { fetchStudents(); fetchCourses(); }, []);

  const handleSubmit = async (values: Record<string, unknown>) => {
    try {
      const payload = {
        ...values,
        dateOfBirth: values.dateOfBirth ? (values.dateOfBirth as ReturnType<typeof dayjs>).format("YYYY-MM-DD") : undefined,
        admissionDate: values.admissionDate
          ? (values.admissionDate as ReturnType<typeof dayjs>).format("YYYY-MM-DD")
          : dayjs().format("YYYY-MM-DD"),
      };

      const url = editingStudent ? `/api/students/${editingStudent.id}` : "/api/students";
      const method = editingStudent ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        api.success({ message: editingStudent ? "Student updated!" : "Student added!" });
        setModalOpen(false);
        form.resetFields();
        setEditingStudent(null);
        fetchStudents();
      }
    } catch {
      api.error({ message: "Failed to save student" });
    }
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    form.setFieldsValue({
      ...student,
      admissionDate: dayjs(student.admissionDate),
    });
    setModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/students/${id}`, { method: "DELETE" });
      api.success({ message: "Student removed" });
      fetchStudents();
    } catch {
      api.error({ message: "Failed to delete" });
    }
  };

  const filtered = students.filter(
    (s) =>
      `${s.firstName} ${s.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
      s.studentId.toLowerCase().includes(search.toLowerCase()) ||
      s.phone.includes(search)
  );

  const columns: ColumnsType<Student> = [
    {
      title: "Student ID",
      dataIndex: "studentId",
      key: "studentId",
      render: (id) => <span className="font-mono text-xs font-semibold text-primary-600">{id}</span>,
    },
    {
      title: "Name",
      key: "name",
      render: (_, r) => (
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold text-sm">
            {r.firstName[0]}
          </div>
          <div>
            <div className="font-medium text-gray-900">{r.firstName} {r.lastName}</div>
            <div className="text-xs text-gray-400">{r.email || r.phone}</div>
          </div>
        </div>
      ),
    },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
      render: (g) => (
        <Tag color={g === "male" ? "blue" : g === "female" ? "pink" : "default"}>
          {g}
        </Tag>
      ),
    },
    { title: "City", dataIndex: "city", key: "city", render: (c) => c || "—" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Tag color={s === "active" ? "green" : s === "graduated" ? "blue" : "red"}>
          {s}
        </Tag>
      ),
    },
    {
      title: "Admission Date",
      dataIndex: "admissionDate",
      key: "admissionDate",
      render: (d) => dayjs(d).format("DD MMM YYYY"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button size="small" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Delete this student?" onConfirm={() => handleDelete(record.id)}>
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-5">
      {contextHolder}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-2xl font-bold text-gray-900">Students</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {students.length} total students enrolled
          </p>
        </div>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={() => {
            setEditingStudent(null);
            form.resetFields();
            setModalOpen(true);
          }}
        >
          Add Student
        </Button>
      </div>

      {/* Table Card */}
      <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
        <div className="mb-4">
          <AntInput
            prefix={<SearchOutlined />}
            placeholder="Search by name, ID, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ maxWidth: 360 }}
            allowClear
          />
        </div>
        <Table
          columns={columns}
          dataSource={filtered}
          loading={loading}
          rowKey="id"
          pagination={{ pageSize: 10, showSizeChanger: true, showTotal: (t) => `${t} students` }}
          scroll={{ x: 900 }}
        />
      </Card>

      {/* Add/Edit Modal */}
      <Modal
        title={
          <span className="font-display font-bold">
            {editingStudent ? "Edit Student" : "Add New Student"}
          </span>
        }
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditingStudent(null); form.resetFields(); }}
        footer={null}
        width={700}
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
            <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
              <Input placeholder="Mobile number" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input placeholder="Email address" type="email" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
              <Select>
                <Option value="male">Male</Option>
                <Option value="female">Female</Option>
                <Option value="other">Other</Option>
              </Select>
            </Form.Item>
            <Form.Item name="dateOfBirth" label="Date of Birth">
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item name="fatherName" label="Father's Name">
              <Input placeholder="Father's name" />
            </Form.Item>
            <Form.Item name="parentPhone" label="Parent Phone">
              <Input placeholder="Parent number" />
            </Form.Item>
          </div>
          <div className="grid grid-cols-3 gap-x-5">
            <Form.Item name="city" label="City">
              <Input placeholder="City" />
            </Form.Item>
            <Form.Item name="state" label="State">
              <Input placeholder="State" defaultValue="Jharkhand" />
            </Form.Item>
            <Form.Item name="pincode" label="PIN Code">
              <Input placeholder="Pincode" maxLength={6} />
            </Form.Item>
          </div>
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item name="qualification" label="Qualification">
              <Select placeholder="Highest qualification">
                <Option value="10th Pass">10th Pass</Option>
                <Option value="12th Pass">12th Pass</Option>
                <Option value="Graduate">Graduate</Option>
                <Option value="Post Graduate">Post Graduate</Option>
              </Select>
            </Form.Item>
            <Form.Item name="status" label="Status">
              <Select defaultValue="active">
                <Option value="active">Active</Option>
                <Option value="inactive">Inactive</Option>
                <Option value="graduated">Graduated</Option>
                <Option value="dropped">Dropped</Option>
              </Select>
            </Form.Item>
          </div>
          {!editingStudent && (
            <Form.Item name="courseId" label="Course" rules={[{ required: true, message: "Please select a course" }]}>
              <Select placeholder="Select course to enroll">
                {courses.map((c) => (
                  <Option key={c.id} value={c.id}>
                    {c.courseCode} — {c.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}
          <Form.Item name="admissionDate" label="Admission Date" rules={[{ required: true }]}>
            <DatePicker className="w-full" format="DD/MM/YYYY" defaultValue={dayjs()} />
          </Form.Item>
          <div className="flex justify-end gap-3 mt-2">
            <Button onClick={() => { setModalOpen(false); form.resetFields(); }}>Cancel</Button>
            <Button type="primary" htmlType="submit" icon={<UserOutlined />}>
              {editingStudent ? "Save Changes" : "Add Student"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
