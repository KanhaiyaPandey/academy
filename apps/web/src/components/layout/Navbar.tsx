"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Button, Drawer } from "antd";
import { MenuOutlined } from "@ant-design/icons";

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 no-underline">
            <Image src="/pahal-logo.jpeg" alt="Pahal Beauty Academy" width={36} height={36} className="rounded-lg object-cover" />
            <div>
              <span className="font-display font-bold text-lg text-gray-900 leading-none block">
                Pahal
              </span>
              <span className="text-xs text-primary-500 font-medium leading-none">
                Beauty Academy
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all no-underline"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/admission">
              <Button type="primary" size="middle" className="font-semibold">
                Apply Now
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setDrawerOpen(true)}
          >
            <MenuOutlined style={{ fontSize: 20 }} />
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <Drawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        placement="right"
        width={280}
        title={
          <div className="flex items-center gap-2">
            <Image src="/pahal-logo.jpeg" alt="Pahal Beauty Academy" width={28} height={28} className="rounded object-cover" />
            <span className="font-bold">Pahal Beauty Academy</span>
          </div>
        }
      >
        <nav className="flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all no-underline block"
              onClick={() => setDrawerOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link href="/admission" onClick={() => setDrawerOpen(false)}>
              <Button type="primary" block size="large">
                Apply Now — Free
              </Button>
            </Link>
          </div>
        </nav>
      </Drawer>
    </header>
  );
}
