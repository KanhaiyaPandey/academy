"use client";

import { Form, Input, Button, notification } from "antd";
import { LockOutlined, UserOutlined, ScissorOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [form] = Form.useForm();
  const [api, contextHolder] = notification.useNotification();
  const router = useRouter();

  const handleLogin = async (values: { username: string; password: string }) => {
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (res.ok) {
        api.success({ message: "Welcome back!" });
        setTimeout(() => router.push("/dashboard"), 800);
      } else {
        api.error({ message: "Invalid credentials", description: "Check username and password" });
      }
    } catch {
      api.error({ message: "Login failed", description: "Please try again" });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      {contextHolder}
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-700 px-8 pt-10 pb-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto mb-4">
              <ScissorOutlined style={{ fontSize: 32, color: "white" }} />
            </div>
            <h1 className="font-display text-2xl font-bold text-white">Pahal Beauty Academy</h1>
            <p className="text-pink-100 text-sm mt-1">Admin Portal</p>
          </div>

          {/* Form */}
          <div className="px-8 py-8">
            <h2 className="font-display text-xl font-bold text-gray-900 mb-6">Sign In</h2>
            <Form form={form} layout="vertical" onFinish={handleLogin}>
              <Form.Item
                name="username"
                label="Username"
                rules={[{ required: true, message: "Enter your username" }]}
              >
                <Input
                  prefix={<UserOutlined className="text-gray-400" />}
                  placeholder="admin"
                  size="large"
                />
              </Form.Item>
              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: "Enter your password" }]}
              >
                <Input.Password
                  prefix={<LockOutlined className="text-gray-400" />}
                  placeholder="••••••••"
                  size="large"
                />
              </Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                block
                size="large"
                style={{ height: 48, fontWeight: 600, borderRadius: 10, marginTop: 8 }}
              >
                Sign In to Dashboard
              </Button>
            </Form>

            <div className="mt-4 p-3 bg-primary-50 rounded-xl text-xs text-primary-600 text-center space-y-0.5">
              <div>Admin: <strong>admin</strong> / <strong>pahal@2025</strong></div>
              <div className="text-primary-400">Staff: email / EmployeeID + last 4 of phone</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
