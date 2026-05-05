"use client";

import { useState } from "react";
import {
  Table, Button, Tag, Space, Modal, Form, Input, Select, Switch,
  notification, Card, InputNumber, Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

type Course = {
  id: number;
  courseCode: string;
  name: string;
  level: string;
  duration: string;
  fees: number;
  isActive: boolean;
  isFeatured: boolean;
  enrolledCount: number;
};

const mockCourses: Course[] = [
  { id: 1, courseCode: "MUA-01", name: "Makeup Artistry", level: "beginner", duration: "3 months", fees: 8000, isActive: true, isFeatured: true, enrolledCount: 18 },
  { id: 2, courseCode: "HS-02", name: "Hair Styling & Cutting", level: "intermediate", duration: "4 months", fees: 10000, isActive: true, isFeatured: true, enrolledCount: 14 },
  { id: 3, courseCode: "SK-03", name: "Skincare & Facial Therapy", level: "beginner", duration: "3 months", fees: 7000, isActive: true, isFeatured: true, enrolledCount: 12 },
  { id: 4, courseCode: "NA-04", name: "Nail Art & Extensions", level: "beginner", duration: "2 months", fees: 5000, isActive: true, isFeatured: false, enrolledCount: 13 },
  { id: 5, courseCode: "BM-05", name: "Bridal Makeup & Styling", level: "advanced", duration: "2 months", fees: 12000, isActive: true, isFeatured: true, enrolledCount: 9 },
  { id: 6, courseCode: "ACD-06", name: "Advanced Cosmetology Diploma", level: "advanced", duration: "1 year", fees: 20000, isActive: true, isFeatured: true, enrolledCount: 11 },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const handleSubmit = (values: Record<string, unknown>) => {
    if (editing) {
      setCourses((prev) => prev.map((c) => c.id === editing.id ? { ...c, ...values } as Course : c));
      api.success({ message: "Course updated!" });
    } else {
      const newCourse: Course = {
        ...values,
        id: Date.now(),
        enrolledCount: 0,
      } as Course;
      setCourses((prev) => [...prev, newCourse]);
      api.success({ message: "Course added!" });
    }
    setModalOpen(false);
    form.resetFields();
    setEditing(null);
  };

  const handleEdit = (course: Course) => {
    setEditing(course);
    form.setFieldsValue(course);
    setModalOpen(true);
  };

  const handleDelete = (id: number) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    api.success({ message: "Course removed" });
  };

  const columns: ColumnsType<Course> = [
    {
      title: "Code",
      dataIndex: "courseCode",
      render: (c) => <span className="font-mono text-xs font-bold text-primary-600">{c}</span>,
    },
    {
      title: "Course Name",
      dataIndex: "name",
      render: (n) => <span className="font-semibold text-gray-900">{n}</span>,
    },
    {
      title: "Level",
      dataIndex: "level",
      render: (l) => (
        <Tag color={l === "advanced" ? "purple" : l === "intermediate" ? "blue" : "green"}>
          {l.charAt(0).toUpperCase() + l.slice(1)}
        </Tag>
      ),
    },
    { title: "Duration", dataIndex: "duration" },
    {
      title: "Fees",
      dataIndex: "fees",
      render: (f) => <span className="font-semibold">₹{Number(f).toLocaleString("en-IN")}</span>,
    },
    {
      title: "Enrolled",
      dataIndex: "enrolledCount",
      render: (c) => (
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 text-primary-700 font-bold text-sm">
          {c}
        </span>
      ),
    },
    {
      title: "Featured",
      dataIndex: "isFeatured",
      render: (f) => <Tag color={f ? "gold" : "default"}>{f ? "⭐ Featured" : "No"}</Tag>,
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
          <Popconfirm title="Delete this course?" onConfirm={() => handleDelete(r.id)}>
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
          <h1 className="font-display text-2xl font-bold text-gray-900">Courses</h1>
          <p className="text-gray-500 text-sm mt-0.5">{courses.length} courses configured</p>
        </div>
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => { setEditing(null); form.resetFields(); setModalOpen(true); }}>
          Add Course
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          pagination={false}
          scroll={{ x: 900 }}
        />
      </Card>

      <Modal
        title={<span className="font-display font-bold">{editing ? "Edit Course" : "Add Course"}</span>}
        open={modalOpen}
        onCancel={() => { setModalOpen(false); setEditing(null); form.resetFields(); }}
        footer={null}
        width={620}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item name="courseCode" label="Course Code" rules={[{ required: true }]}>
              <Input placeholder="e.g. PY-03" />
            </Form.Item>
            <Form.Item name="level" label="Level" rules={[{ required: true }]}>
              <Select>
                <Select.Option value="beginner">Beginner</Select.Option>
                <Select.Option value="intermediate">Intermediate</Select.Option>
                <Select.Option value="advanced">Advanced</Select.Option>
              </Select>
            </Form.Item>
          </div>
          <Form.Item name="name" label="Course Name" rules={[{ required: true }]}>
            <Input placeholder="Full course name" />
          </Form.Item>
          <Form.Item name="shortDescription" label="Short Description">
            <Input placeholder="One-liner description" />
          </Form.Item>
          <Form.Item name="description" label="Full Description">
            <Input.TextArea rows={3} placeholder="Detailed course description" />
          </Form.Item>
          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item name="duration" label="Duration" rules={[{ required: true }]}>
              <Input placeholder="e.g. 6 months" />
            </Form.Item>
            <Form.Item name="fees" label="Fees (₹)" rules={[{ required: true }]}>
              <InputNumber className="w-full" min={0} placeholder="e.g. 8000" />
            </Form.Item>
          </div>
          <div className="flex gap-8">
            <Form.Item name="isActive" label="Active" valuePropName="checked" initialValue={true}>
              <Switch defaultChecked />
            </Form.Item>
            <Form.Item name="isFeatured" label="Featured on Website" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
          <div className="flex justify-end gap-3 mt-2">
            <Button onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit" icon={<BookOutlined />}>
              {editing ? "Save Changes" : "Add Course"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
