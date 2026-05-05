"use client";

import { useState } from "react";
import {
  Form, Input, Select, DatePicker, Button, Steps, notification, Divider, Radio,
} from "antd";
import {
  UserOutlined, BookOutlined, HomeOutlined, CheckCircleFilled,
} from "@ant-design/icons";

const { Option } = Select;

const courses = [
  { value: "CCC-01", label: "CCC Certificate (3 months) — ₹3,500" },
  { value: "DCA-02", label: "DCA Diploma (6 months) — ₹8,000" },
  { value: "PY-03", label: "Python Programming (4 months) — ₹7,000" },
  { value: "WD-04", label: "Full Stack Web Dev (6 months) — ₹12,000" },
  { value: "TALLY-05", label: "Tally Prime with GST (2 months) — ₹4,000" },
  { value: "ADCA-06", label: "Advanced Diploma ADCA (1 year) — ₹15,000" },
];

export default function AdmissionPage() {
  const [form] = Form.useForm();
  const [current, setCurrent] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [api, contextHolder] = notification.useNotification();

  const steps = [
    { title: "Personal Info", icon: <UserOutlined /> },
    { title: "Course Selection", icon: <BookOutlined /> },
    { title: "Address & Docs", icon: <HomeOutlined /> },
  ];

  const handleNext = async () => {
    try {
      const fields =
        current === 0
          ? ["firstName", "lastName", "phone", "gender", "dateOfBirth", "email"]
          : current === 1
          ? ["courseId", "qualification"]
          : ["address", "city", "state", "pincode"];

      await form.validateFields(fields);
      setCurrent(current + 1);
    } catch {
      // validation will show field errors
    }
  };

  const handleSubmit = async () => {
    try {
      await form.validateFields();
      setLoading(true);
      const values = form.getFieldsValue(true);
      const response = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        setSubmitted(true);
      } else {
        api.error({ message: "Submission failed. Please try again." });
      }
    } catch {
      api.error({ message: "Please check all fields and try again." });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-lg p-12 max-w-md w-full text-center">
          <CheckCircleFilled style={{ fontSize: 64, color: "#52c41a" }} className="mb-6 block" />
          <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
            Application Received! 🎉
          </h2>
          <p className="text-gray-500 leading-relaxed mb-6">
            Thank you for applying to Pahal Academy. Our admissions team will contact you within 24 hours to confirm your seat and share batch details.
          </p>
          <p className="text-sm text-gray-400 bg-gray-50 rounded-xl p-4">
            📱 You'll also receive a WhatsApp confirmation on your registered number.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {contextHolder}
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-500 to-primary-700 py-12">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl font-bold text-white mb-3">
            Admission Form
          </h1>
          <p className="text-blue-100 text-lg">
            Take the first step — fill out the form below and we'll confirm your seat.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
        {/* Stepper */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <Steps current={current} items={steps} />
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <Form form={form} layout="vertical" size="large">

            {/* Step 0 — Personal Info */}
            {current === 0 && (
              <>
                <Divider orientation="left" className="font-semibold">Personal Information</Divider>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  <Form.Item name="firstName" label="First Name" rules={[{ required: true, message: "Required" }]}>
                    <Input placeholder="Enter first name" />
                  </Form.Item>
                  <Form.Item name="lastName" label="Last Name" rules={[{ required: true, message: "Required" }]}>
                    <Input placeholder="Enter last name" />
                  </Form.Item>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  <Form.Item name="phone" label="Mobile Number" rules={[{ required: true }, { len: 10, message: "Enter valid 10-digit number" }]}>
                    <Input placeholder="10-digit mobile" addonBefore="+91" maxLength={10} />
                  </Form.Item>
                  <Form.Item name="whatsapp" label="WhatsApp Number (if different)">
                    <Input placeholder="Leave blank if same" addonBefore="+91" maxLength={10} />
                  </Form.Item>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
                    <Select placeholder="Select gender">
                      <Option value="male">Male</Option>
                      <Option value="female">Female</Option>
                      <Option value="other">Other</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="dateOfBirth" label="Date of Birth">
                    <DatePicker className="w-full" format="DD/MM/YYYY" />
                  </Form.Item>
                </div>
                <Form.Item name="email" label="Email Address">
                  <Input placeholder="your@email.com" type="email" />
                </Form.Item>
                <Divider orientation="left" className="font-semibold">Parent / Guardian</Divider>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5">
                  <Form.Item name="fatherName" label="Father's Name">
                    <Input placeholder="Father's full name" />
                  </Form.Item>
                  <Form.Item name="motherName" label="Mother's Name">
                    <Input placeholder="Mother's full name" />
                  </Form.Item>
                </div>
                <Form.Item name="parentPhone" label="Parent's Mobile">
                  <Input placeholder="Parent contact number" addonBefore="+91" maxLength={10} />
                </Form.Item>
              </>
            )}

            {/* Step 1 — Course Selection */}
            {current === 1 && (
              <>
                <Divider orientation="left" className="font-semibold">Course & Qualification</Divider>
                <Form.Item name="courseId" label="Course Interested In" rules={[{ required: true, message: "Please select a course" }]}>
                  <Select placeholder="Select a course" optionLabelProp="label">
                    {courses.map((c) => (
                      <Option key={c.value} value={c.value} label={c.label}>
                        <div>
                          <div className="font-medium">{c.label}</div>
                        </div>
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item name="qualification" label="Highest Qualification" rules={[{ required: true }]}>
                  <Select placeholder="Your highest qualification">
                    <Option value="8th Pass">8th Pass</Option>
                    <Option value="10th Pass">10th Pass (Matriculation)</Option>
                    <Option value="12th Pass">12th Pass (Intermediate)</Option>
                    <Option value="Graduate">Graduate (B.A/B.Sc/B.Com/BCA)</Option>
                    <Option value="Post Graduate">Post Graduate</Option>
                    <Option value="Other">Other</Option>
                  </Select>
                </Form.Item>
                <Form.Item name="computerKnowledge" label="Prior Computer Knowledge">
                  <Radio.Group>
                    <Radio value="none">None / Beginner</Radio>
                    <Radio value="basic">Basic (can use computer)</Radio>
                    <Radio value="intermediate">Intermediate</Radio>
                  </Radio.Group>
                </Form.Item>
                <Form.Item name="howDidYouHear" label="How did you hear about us?">
                  <Select placeholder="Select source">
                    <Option value="walkin">Walk-in / Directly visited</Option>
                    <Option value="friend">Friend / Referral</Option>
                    <Option value="social">Social Media (Facebook/Instagram)</Option>
                    <Option value="website">Website</Option>
                    <Option value="banner">Banner / Poster</Option>
                    <Option value="other">Other</Option>
                  </Select>
                </Form.Item>
              </>
            )}

            {/* Step 2 — Address */}
            {current === 2 && (
              <>
                <Divider orientation="left" className="font-semibold">Address Details</Divider>
                <Form.Item name="address" label="Full Address" rules={[{ required: true }]}>
                  <Input.TextArea rows={3} placeholder="House no., Street, Locality..." />
                </Form.Item>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-5">
                  <Form.Item name="city" label="City" rules={[{ required: true }]}>
                    <Input placeholder="City" />
                  </Form.Item>
                  <Form.Item name="state" label="State" rules={[{ required: true }]}>
                    <Select placeholder="State" defaultValue="Jharkhand">
                      <Option value="Jharkhand">Jharkhand</Option>
                      <Option value="Bihar">Bihar</Option>
                      <Option value="West Bengal">West Bengal</Option>
                      <Option value="Odisha">Odisha</Option>
                      <Option value="Other">Other</Option>
                    </Select>
                  </Form.Item>
                  <Form.Item name="pincode" label="PIN Code" rules={[{ required: true }]}>
                    <Input placeholder="6-digit PIN" maxLength={6} />
                  </Form.Item>
                </div>

                <Divider orientation="left" className="font-semibold">Declaration</Divider>
                <div className="bg-blue-50 rounded-xl p-4 text-sm text-gray-600 mb-4">
                  I hereby declare that the information provided above is true and correct to the best of my knowledge. I agree to follow the rules and regulations of Pahal Academy.
                </div>
              </>
            )}
          </Form>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-gray-100">
            <Button
              size="large"
              onClick={() => setCurrent(current - 1)}
              disabled={current === 0}
              style={{ minWidth: 120 }}
            >
              Previous
            </Button>

            {current < steps.length - 1 ? (
              <Button type="primary" size="large" onClick={handleNext} style={{ minWidth: 120, fontWeight: 600 }}>
                Continue
              </Button>
            ) : (
              <Button
                type="primary"
                size="large"
                loading={loading}
                onClick={handleSubmit}
                style={{ minWidth: 160, fontWeight: 600 }}
              >
                Submit Application
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
