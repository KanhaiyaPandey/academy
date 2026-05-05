"use client";

import { useState } from "react";
import { Layout, Menu, Avatar, Badge, Dropdown, Button } from "antd";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  DashboardOutlined, UserOutlined, BookOutlined, DollarOutlined,
  CalendarOutlined, TeamOutlined, FileTextOutlined, FunnelPlotOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, BookFilled,
  SettingOutlined, LogoutOutlined,
} from "@ant-design/icons";

const { Sider, Header, Content } = Layout;

const navItems = [
  { key: "/dashboard", label: "Dashboard", icon: <DashboardOutlined /> },
  { key: "/dashboard/students", label: "Students", icon: <UserOutlined /> },
  { key: "/dashboard/courses", label: "Courses", icon: <BookOutlined /> },
  { key: "/dashboard/fees", label: "Fees & Payments", icon: <DollarOutlined /> },
  { key: "/dashboard/attendance", label: "Attendance", icon: <CalendarOutlined /> },
  { key: "/dashboard/employees", label: "Employees", icon: <TeamOutlined /> },
  { key: "/dashboard/leaves", label: "Leaves", icon: <FileTextOutlined /> },
  { key: "/dashboard/leads", label: "Leads", icon: <FunnelPlotOutlined /> },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  const selectedKey = navItems
    .filter((item) => pathname.startsWith(item.key))
    .sort((a, b) => b.key.length - a.key.length)[0]?.key || "/dashboard";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <Sider
        collapsible
        collapsed={collapsed}
        trigger={null}
        width={240}
        style={{
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 100,
          background: "white",
          borderRight: "1px solid #f0f0f0",
          overflow: "auto",
        }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-4 border-b border-gray-100"
          style={{ height: 64 }}
        >
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
            <BookFilled style={{ color: "white", fontSize: 16 }} />
          </div>
          {!collapsed && (
            <div>
              <div className="font-bold text-gray-900 text-sm leading-tight">Pahal Academy</div>
              <div className="text-xs text-primary-500">Admin Panel</div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          style={{ border: "none", marginTop: 8 }}
          items={navItems.map((item) => ({
            key: item.key,
            icon: item.icon,
            label: <Link href={item.key}>{item.label}</Link>,
          }))}
        />
      </Sider>

      {/* Main Area */}
      <Layout style={{ marginLeft: collapsed ? 80 : 240, transition: "margin 0.2s" }}>
        {/* Header */}
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 99,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            background: "white",
            borderBottom: "1px solid #f0f0f0",
            height: 64,
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
          />

          <div className="flex items-center gap-4">
            <Badge count={3} size="small">
              <Button type="text" icon={<BellOutlined style={{ fontSize: 18 }} />} shape="circle" />
            </Badge>

            <Dropdown
              menu={{
                items: [
                  { key: "profile", label: "My Profile", icon: <UserOutlined /> },
                  { key: "settings", label: "Settings", icon: <SettingOutlined /> },
                  { type: "divider" },
                  { key: "logout", label: "Logout", icon: <LogoutOutlined />, danger: true },
                ],
              }}
              placement="bottomRight"
            >
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
                <Avatar size={32} style={{ background: "#1677ff" }}>A</Avatar>
                <span className="text-sm font-medium text-gray-700 hidden sm:inline">Admin</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        {/* Content */}
        <Content style={{ padding: "24px", minHeight: "calc(100vh - 64px)" }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
