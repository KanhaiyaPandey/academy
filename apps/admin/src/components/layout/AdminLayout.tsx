"use client";

import { useState, useEffect } from "react";
import { Layout, Menu, Avatar, Badge, Dropdown, Button } from "antd";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DashboardOutlined, UserOutlined, DollarOutlined,
  CalendarOutlined, TeamOutlined, FileTextOutlined, FunnelPlotOutlined,
  MenuFoldOutlined, MenuUnfoldOutlined, BellOutlined, ScissorOutlined,
  SettingOutlined, LogoutOutlined, BookOutlined,
} from "@ant-design/icons";

const { Sider, Header, Content } = Layout;

type Role = "admin" | "employee";

const ALL_NAV = [
  { key: "/dashboard", label: "Dashboard", icon: <DashboardOutlined />, roles: ["admin", "employee"] as Role[] },
  { key: "/dashboard/students", label: "Students", icon: <UserOutlined />, roles: ["admin", "employee"] as Role[] },
  { key: "/dashboard/courses", label: "Courses", icon: <BookOutlined />, roles: ["admin"] as Role[] },
  { key: "/dashboard/fees", label: "Fees & Payments", icon: <DollarOutlined />, roles: ["admin", "employee"] as Role[] },
  { key: "/dashboard/attendance", label: "Attendance", icon: <CalendarOutlined />, roles: ["admin"] as Role[] },
  { key: "/dashboard/employees", label: "Employees", icon: <TeamOutlined />, roles: ["admin"] as Role[] },
  { key: "/dashboard/leaves", label: "Leaves", icon: <FileTextOutlined />, roles: ["admin", "employee"] as Role[] },
  { key: "/dashboard/leads", label: "Leads", icon: <FunnelPlotOutlined />, roles: ["admin"] as Role[] },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [role, setRole] = useState<Role>("admin");
  const [userName, setUserName] = useState("Admin");
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data?.data?.role) {
          setRole(data.data.role);
          setUserName(data.data.name || "Admin");
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  const navItems = ALL_NAV.filter((item) => item.roles.includes(role));

  const selectedKey =
    navItems
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
        <div className="flex items-center gap-3 px-5 py-4 h-16 border-b border-gray-100">
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center shrink-0">
            <ScissorOutlined style={{ color: "white", fontSize: 16 }} />
          </div>
          {!collapsed && (
            <div>
              <div className="font-bold text-gray-900 text-sm leading-tight">Pahal Beauty Academy</div>
              <div className="text-xs text-primary-500">{role === "admin" ? "Admin Panel" : "Staff Portal"}</div>
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
                  ...(role === "admin"
                    ? [{ key: "settings", label: "Settings", icon: <SettingOutlined /> }]
                    : []),
                  { type: "divider" as const },
                  { key: "logout", label: "Logout", icon: <LogoutOutlined />, danger: true },
                ],
                onClick: ({ key }) => { if (key === "logout") handleLogout(); },
              }}
              placement="bottomRight"
            >
              <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors">
                <Avatar size={32} style={{ background: role === "admin" ? "#ec4899" : "#6366f1" }}>
                  {userName.charAt(0).toUpperCase()}
                </Avatar>
                <div className="hidden sm:flex flex-col leading-tight">
                  <span className="text-sm font-medium text-gray-700">{userName}</span>
                  <span className="text-xs text-gray-400 capitalize">{role}</span>
                </div>
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
