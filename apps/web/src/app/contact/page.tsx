"use client";

import { Form, Input, Select, Button, notification } from "antd";
import { EnvironmentOutlined, PhoneOutlined, MailOutlined, ClockCircleOutlined } from "@ant-design/icons";

const { TextArea } = Input;

export default function ContactPage() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();

  const handleSubmit = async (values: Record<string, string>) => {
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...values, source: "website" }),
      });
      if (response.ok) {
        api.success({
          message: "Message Sent!",
          description: "We'll get back to you within 24 hours.",
        });
        form.resetFields();
      }
    } catch {
      api.error({ message: "Error", description: "Please try again or call us directly." });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {contextHolder}
      {/* Header */}
      <div className="bg-white border-b border-gray-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-display text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Have questions about our beauty courses or admissions? We're here to help.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Info */}
          <div>
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-8">Get in Touch</h2>
            <div className="space-y-6">
              {[
                { icon: <EnvironmentOutlined className="text-primary-500 text-xl" />, label: "Address", value: "Near Main Market, Ranchi, Jharkhand — 834001" },
                { icon: <PhoneOutlined className="text-primary-500 text-xl" />, label: "Phone", value: "+91-9XXXXXXXXX" },
                { icon: <MailOutlined className="text-primary-500 text-xl" />, label: "Email", value: "info@pahalacademy.com" },
                { icon: <ClockCircleOutlined className="text-primary-500 text-xl" />, label: "Hours", value: "Mon–Sat: 9:00 AM – 7:00 PM" },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-4 p-4 bg-white rounded-xl shadow-sm border border-gray-100">
                  <div className="w-10 h-10 rounded-lg bg-primary-50 flex items-center justify-center shrink-0">
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 font-medium mb-0.5">{item.label}</div>
                    <div className="text-gray-800 font-medium">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Map placeholder */}
            <div className="mt-8 rounded-2xl overflow-hidden border border-gray-200 bg-primary-50 h-48 flex items-center justify-center">
              <div className="text-center text-gray-500">
                <EnvironmentOutlined style={{ fontSize: 32 }} className="text-primary-400 mb-2 block" />
                <p className="text-sm">Ranchi, Jharkhand</p>
                <p className="text-xs text-gray-400">Add Google Maps embed here</p>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="font-display text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
              <Form.Item name="name" label="Full Name" rules={[{ required: true }]}>
                <Input placeholder="Your full name" size="large" />
              </Form.Item>
              <Form.Item name="phone" label="Phone Number" rules={[{ required: true }]}>
                <Input placeholder="10-digit mobile number" size="large" maxLength={10} />
              </Form.Item>
              <Form.Item name="email" label="Email (optional)">
                <Input placeholder="your@email.com" size="large" type="email" />
              </Form.Item>
              <Form.Item name="courseInterest" label="Course Interest">
                <Select placeholder="Select a course" size="large">
                  <Select.Option value="Makeup Artistry">Makeup Artistry</Select.Option>
                  <Select.Option value="Hair Styling & Cutting">Hair Styling & Cutting</Select.Option>
                  <Select.Option value="Skincare & Facial Therapy">Skincare & Facial Therapy</Select.Option>
                  <Select.Option value="Nail Art & Extensions">Nail Art & Extensions</Select.Option>
                  <Select.Option value="Bridal Makeup & Styling">Bridal Makeup & Styling</Select.Option>
                  <Select.Option value="Advanced Cosmetology Diploma">Advanced Cosmetology Diploma</Select.Option>
                  <Select.Option value="Other">Other / Not Sure</Select.Option>
                </Select>
              </Form.Item>
              <Form.Item name="notes" label="Message">
                <TextArea rows={4} placeholder="Any specific questions or requirements..." />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large" style={{ fontWeight: 600 }}>
                  Send Message
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
