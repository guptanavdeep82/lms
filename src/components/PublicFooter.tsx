import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import type { HomePageSettings } from "@/lib/home-page";

type PublicFooterProps = {
  settings?: HomePageSettings | null;
};

const companyLinks = [
  { label: "All Packages", href: "/packages" },
  { label: "Mock Test Series", href: "/mock-tests" },
  { label: "Live Classes", href: "/live-classes" },
  { label: "Contact Us", href: "/contact" },
  { label: "Affiliate Program", href: "/affiliate/login" },
];

const usefulLinks = [
  { label: "Video Courses", href: "/courses" },
  { label: "Faculty", href: "/faculty" },
  { label: "Register", href: "/register" },
  { label: "Student Login", href: "/login" },
  { label: "Blog", href: "/blog" },
];

function SocialLink({
  href,
  label,
  children,
}: {
  href: string | null | undefined;
  label: string;
  children: ReactNode;
}) {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="public-site-footer-social"
    >
      {children}
    </a>
  );
}

export function PublicFooter({ settings }: PublicFooterProps) {
  const whatsappHref = settings?.whatsapp_number
    ? `https://wa.me/${settings.whatsapp_number.replace(/[^\d]/g, "")}`
    : null;

  return (
    <footer className="public-site-footer">
      <div className="public-site-footer-inner">
        <div className="public-site-footer-grid">
          <div>
            <div className="public-site-footer-brand">
              <Image src="/logics-logo.jpeg" alt="KR Logics" width={52} height={52} />
              <div>
                <div className="public-site-footer-brand-title">
                  KR <span>Logics</span>
                </div>
                <div className="public-site-footer-brand-tag">Banking Exam Preparation</div>
              </div>
            </div>
            <p className="public-site-footer-about">
              Empowering banking aspirants across India with quality education, expert mentorship and advanced test
              technology.
            </p>
            <div className="public-site-footer-socials">
              <SocialLink href={settings?.facebook_link} label="Facebook">
                <span className="text-xs font-bold">f</span>
              </SocialLink>
              <SocialLink href={settings?.instagram_link} label="Instagram">
                <span className="text-xs font-bold">ig</span>
              </SocialLink>
              <SocialLink href={settings?.youtube_link} label="YouTube">
                <span className="text-xs font-bold">yt</span>
              </SocialLink>
              <SocialLink href={settings?.linkedin_link} label="LinkedIn">
                <span className="text-xs font-bold">in</span>
              </SocialLink>
              <SocialLink href={whatsappHref} label="WhatsApp">
                <Phone size={15} />
              </SocialLink>
            </div>
          </div>

          <div className="public-site-footer-col">
            <h5>Company</h5>
            <div className="public-site-footer-links">
              {companyLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="public-site-footer-col">
            <h5>Useful Links</h5>
            <div className="public-site-footer-links">
              {usefulLinks.map((link) => (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="public-site-footer-col public-site-footer-contact">
            <h5>Get in touch</h5>
            <p className="flex items-start gap-2">
              <MapPin size={14} className="mt-0.5 shrink-0 text-[#d6a900]" />
              <span>KR Logics Institute, Near City Mall, Jodhpur, Rajasthan — 342001</span>
            </p>
            <p className="flex items-start gap-2">
              <Mail size={14} className="mt-0.5 shrink-0 text-[#d6a900]" />
              <span>admissions@krlogics.com</span>
            </p>
            <p className="flex items-start gap-2">
              <Phone size={14} className="mt-0.5 shrink-0 text-[#d6a900]" />
              <span>{settings?.whatsapp_number?.trim() || "+91 98765 43210"} (Mon–Sat, 9 AM – 8 PM)</span>
            </p>
          </div>
        </div>

        <div className="public-site-footer-bottom">
          <p>
            © {new Date().getFullYear()} <span>KR Logics</span> | All rights reserved.
          </p>
          <p>Made in India with care for banking aspirants.</p>
        </div>
      </div>
    </footer>
  );
}
