"use client";

import { useState, useEffect } from "react";
import {
  Table, Button, Tag, Space, Modal, Form, Input, Select, Switch,
  notification, Card, InputNumber, Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, BookOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import Image from "next/image";
import ImageUpload from "@/components/ImageUpload";

type Course = {
  id: number;
  courseCode: string;
  name: string;
  level: string;
  duration: string;
  fees: number | string;
  isActive: boolean;
  isFeatured: boolean;
  thumbnail?: string;
};

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Course | null>(null);
  const [thumbnail, setThumbnail] = useState<string | undefined>();
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data.data || []);
    } catch {
      api.error({ message: "Failed to load courses" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCourses(); }, []);

  const openModal = (course?: Course) => {
    setEditing(course || null);
    setThumbnail(course?.thumbnail);
    form.setFieldsValue(course || {});
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditing(null);
    setThumbnail(undefined);
    form.resetFields();
  };

  const handleSubmit = async (values: Record<string, unknown>) => {
    setSaving(true);
    try {
      const url = editing ? `/api/courses/${editing.id}` : "/api/courses";
      const method = editing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, thumbnail }),
      });
      if (res.ok) {
        api.success({ message: editing ? "Course updated!" : "Course added!" });
        closeModal();
        fetchCourses();
      }
    } catch {
      api.error({ message: "Failed to save course" });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await fetch(`/api/courses/${id}`, { method: "DELETE" });
      api.success({ message: "Course removed" });
      fetchCourses();
    } catch {
      api.error({ message: "Failed to delete" });
    }
  };

  const columns: ColumnsType<Course> = [
    {
      title: "Image",
      dataIndex: "thumbnail",
      width: 64,
      render: (url, r) =>
        url ? (
          <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-100">
            <Image src={url} alt={r.name} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center text-primary-400">
            <BookOutlined />
          </div>
        ),
    },
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
          <Button size="small" icon={<EditOutlined />} onClick={() => openModal(r)} />
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
        <Button type="primary" icon={<PlusOutlined />} size="large" onClick={() => openModal()}>
          Add Course
        </Button>
      </div>

      <Card bordered={false} style={{ borderRadius: 12, border: "1px solid #f0f0f0" }}>
        <Table
          columns={columns}
          dataSource={courses}
          rowKey="id"
          loading={loading}
          pagination={false}
          scroll={{ x: 900 }}
        />
      </Card>

      <Modal
        title={<span className="font-display font-bold">{editing ? "Edit Course" : "Add Course"}</span>}
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        width={640}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit} className="mt-4">
          <Form.Item label="Course Thumbnail">
            <ImageUpload
              variant="banner"
              value={thumbnail}
              onChange={setThumbnail}
              label="Upload Thumbnail"
            />
          </Form.Item>

          <div className="grid grid-cols-2 gap-x-5">
            <Form.Item name="courseCode" label="Course Code" rules={[{ required: true }]}>
              <Input placeholder="e.g. MUA-01" />
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
            <Button onClick={closeModal}>Cancel</Button>
            <Button type="primary" htmlType="submit" loading={saving} icon={<BookOutlined />}>
              {editing ? "Save Changes" : "Add Course"}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
}
