import Link from "next/link";
import Image from "next/image";
import { siteConfig } from "@/config/site";
import {
  Phone,
  Mail01,
  MarkerPin01,
} from "@untitledui/icons";

const footerLinks = [
  { href: "/services", label: "Services" },
  { href: "/gallery", label: "Gallery" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/terms", label: "Terms" },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-white/[0.04] bg-[#07070a]">
      <div className="mx-auto max-w-7xl px-4 py-14 md:px-6">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link
              href="/"
              className="flex items-center gap-2 text-[15px] font-semibold tracking-tight text-white focus-visible:ring-1 focus-visible:ring-[#1d4ed8]/40 outline-none rounded-lg"
            >
              <span className="flex h-8 w-8 items-center justify-center">
                <Image
                  src="/logo.svg"
                  alt="Dominik Detailing"
                  width={28}
                  height={28}
                />
              </span>
              Dominik<span className="font-light text-[#5a5a65]">Detailing</span>
            </Link>
            <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-[#5a5a65]">
              Premium mobile car detailing across London and surrounding areas. We bring the studio to you.
            </p>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="mt-5 grid grid-cols-2 gap-2">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-[13px] text-[#5a5a65] transition hover:text-[#8a8a95] focus-visible:ring-1 focus-visible:ring-[#1d4ed8]/40 outline-none rounded"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[13px] font-semibold uppercase tracking-wider text-white">
              Contact
            </h3>
            <ul className="mt-5 space-y-3.5">
              <li>
                <a
                  href={siteConfig.phoneHref}
                  className="flex items-center gap-2 text-[13px] text-[#5a5a65] transition hover:text-[#8a8a95] focus-visible:ring-1 focus-visible:ring-[#1d4ed8]/40 outline-none rounded"
                >
                  <Phone size={15} />
                  {siteConfig.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="flex items-center gap-2 text-[13px] text-[#5a5a65] transition hover:text-[#8a8a95] focus-visible:ring-1 focus-visible:ring-[#1d4ed8]/40 outline-none rounded"
                >
                  <Mail01 size={15} />
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-center gap-2 text-[13px] text-[#5a5a65]">
                <MarkerPin01 size={15} />
                {siteConfig.address}
              </li>
            </ul>
            <div className="mt-5 flex items-center gap-5">
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#22c55e] transition hover:underline focus-visible:ring-1 focus-visible:ring-[#22c55e]/40 outline-none rounded"
              >
                WhatsApp
              </a>
              <a
                href={siteConfig.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[13px] text-[#5a5a65] transition hover:text-[#8a8a95] focus-visible:ring-1 focus-visible:ring-[#1d4ed8]/40 outline-none rounded"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="mt-14 border-t border-white/[0.04] pt-6 text-center text-[11px] uppercase tracking-wider text-[#3a3a45]">
          &copy; {new Date().getFullYear()} Dominik Detailing. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
