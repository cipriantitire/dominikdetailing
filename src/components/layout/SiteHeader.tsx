"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import {
  Phone,
  MarkerPin01,
  Menu01,
  XClose,
} from "@untitledui/icons";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="border-b border-white/[0.04] bg-[#07070a] text-[11px] tracking-wide text-[#5a5a65] uppercase">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-2.5 md:px-6">
          <div className="flex items-center gap-5">
            <a
              href={siteConfig.phoneHref}
              className="hidden items-center gap-1.5 transition hover:text-[#8a8a95] focus-visible:ring-1 focus-visible:ring-[#1d4ed8]/40 outline-none rounded md:flex"
            >
              <Phone size={12} />
              <span>{siteConfig.phone}</span>
            </a>
            <span className="flex items-center gap-1.5">
              <MarkerPin01 size={12} />
              <span>{siteConfig.address}</span>
            </span>
          </div>
          <span>
            Mon &ndash; Sat: 8:00 &ndash; 18:00
          </span>
        </div>
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 border-b border-white/[0.04] bg-[#09090d]/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 md:px-6">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-[15px] font-semibold tracking-tight text-white focus-visible:ring-1 focus-visible:ring-[#1d4ed8]/40 outline-none rounded-lg"
          >
            <span className="flex h-8 w-8 items-center justify-center">
              <Image
                src="/logo.svg"
                alt="Dominik Detailing"
                width={28}
                height={28}
              />
            </span>
            <span>
              Dominik<span className="font-light text-[#5a5a65]">Detailing</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[13px] font-medium text-[#8a8a95] transition hover:text-white focus-visible:ring-1 focus-visible:ring-[#1d4ed8]/40 outline-none rounded"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href={siteConfig.phoneHref}
              className="flex items-center gap-2 rounded-lg border border-[#22c55e]/25 px-4 py-2 text-[13px] font-semibold text-[#22c55e] transition hover:border-[#22c55e]/50 hover:bg-[#22c55e]/5 focus-visible:ring-1 focus-visible:ring-[#22c55e]/40 outline-none"
            >
              <Phone size={16} />
              Call
            </a>
            <Link
              href="/book"
              className="rounded-lg bg-[#1d4ed8] px-5 py-2 text-[13px] font-semibold text-white transition hover:bg-[#1e40af] active:scale-[0.98] focus-visible:ring-1 focus-visible:ring-[#1d4ed8]/40 outline-none"
            >
              Request Booking
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex items-center gap-3 md:hidden">
            <a
              href={siteConfig.phoneHref}
              className={`flex items-center gap-1.5 rounded-lg border border-[#22c55e]/25 px-3 py-2 text-[13px] font-semibold text-[#22c55e] transition-opacity duration-300 hover:border-[#22c55e]/50 hover:bg-[#22c55e]/5 ${
                menuOpen ? "pointer-events-none opacity-0" : "opacity-100"
              }`}
            >
              <Phone size={16} className="transition-opacity duration-300" />
              <span className="transition-opacity duration-300">Call</span>
            </a>
            <button
              className="flex h-10 w-10 items-center justify-center rounded-lg text-white transition hover:bg-white/5"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              {menuOpen ? <XClose size={22} /> : <Menu01 size={22} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`border-t border-white/[0.04] bg-[#09090d] px-4 md:hidden overflow-hidden transition-all duration-300 ease-out ${
            menuOpen ? "max-h-[500px] opacity-100 pb-6" : "max-h-0 opacity-0 pb-0"
          }`}
        >
          <nav className="flex flex-col gap-0.5 pt-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-lg px-3 py-3 text-[14px] font-medium text-[#8a8a95] transition hover:bg-white/[0.03] hover:text-white focus-visible:ring-1 focus-visible:ring-[#1d4ed8]/40 outline-none"
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-3">
            <a
              href={siteConfig.phoneHref}
              className="flex items-center justify-center gap-2 rounded-lg border border-[#22c55e]/25 px-4 py-3 text-[13px] font-semibold text-[#22c55e] transition hover:border-[#22c55e]/50 hover:bg-[#22c55e]/5"
            >
              <Phone size={16} />
              Call {siteConfig.phone}
            </a>
            <Link
              href="/book"
              className="rounded-lg bg-[#1d4ed8] px-4 py-3 text-center text-[13px] font-semibold text-white transition hover:bg-[#1e40af]"
              onClick={() => setMenuOpen(false)}
            >
              Request Booking
            </Link>
          </div>
        </div>
      </header>
    </>
  );
}
