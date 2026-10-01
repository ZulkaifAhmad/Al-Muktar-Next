"use client";

import React from "react";
import { Link } from "@/lib/navigation-adapter";
import {
  BookOpen,
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
} from "lucide-react";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

const quickLinks = [
  { label: "About Institute", to: "/about" },
  { label: "Faculty & Scholars", to: "/teachers" },
  { label: "Alumni & Graduates", to: "/students" },
  { label: "Courses & Curricula", to: "/courses" },
  { label: "Blog & Publications", to: "/blog" },
  { label: "Admissions & Apply", to: "/apply" },
  { label: "Contact Us", to: "/contact" },
  { label: "Examination Results", to: "/result" },
];

const courseLinks = [
  { label: "Quran Recitation & Tajweed", to: "/courses/quran-tajweed-course" },
  {
    label: "Islamic Studies Fundamentals",
    to: "/courses/islamic-studies-fundamentals",
  },
  { label: "Arabic Language", to: "/courses" },
  { label: "Hifz Program", to: "/courses" },
];

const socialLinks = [
  { icon: FaFacebook, href: "#", label: "Facebook" },
  { icon: FaInstagram, href: "#", label: "Instagram" },
  { icon: FaYoutube, href: "#", label: "YouTube" },
];

function Footer() {
  return (
    <footer className="bg-[#0A2540] text-white relative overflow-hidden border-t border-slate-800">


      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-14 sm:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#0F6E8C] to-[#0B5C74] flex items-center justify-center shrink-0 shadow-md shadow-[#0F6E8C]/20 border border-[#8FB3AA]/30">
                <BookOpen size={18} className="text-white" />
              </div>
              <span className="font-serif text-lg font-bold text-white tracking-tight">
                Al-Mukhtar Institute
              </span>
            </div>
            <p className="text-slate-300 text-sm leading-relaxed mb-6 max-w-xs break-normal hyphens-none">
              Authentic Islamic education integrated with modern academic
              learning — guided by qualified scholars, built on discipline,
              sincerity, and care.
            </p>
            <div className="flex items-center gap-2.5">
              {socialLinks.map((social, i) => {
                const Icon = social.icon;
                return (
                  <a
                    key={i}
                    href={social.href}
                    aria-label={social.label}
                    className="w-9 h-9 rounded-xl bg-white/[0.06] border border-white/10 flex items-center justify-center hover:bg-[#0F6E8C] hover:border-[#0F6E8C] group transition-all"
                  >
                    <Icon
                      size={15}
                      className="text-slate-300 group-hover:text-white transition-colors"
                    />
                  </a>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[#8FB3AA] text-[11px] font-bold tracking-widest uppercase font-mono mb-5">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="group inline-flex items-center gap-1.5 text-slate-300 text-sm hover:text-white transition-colors"
                  >
                    <ArrowRight
                      size={12}
                      className="text-[#8FB3AA] opacity-0 -translate-x-1.5 group-hover:opacity-100 group-hover:translate-x-0 transition-all"
                    />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-2">
            <h4 className="text-[#8FB3AA] text-[11px] font-bold tracking-widest uppercase font-mono mb-5">
              Courses
            </h4>
            <ul className="space-y-3">
              {courseLinks.map((link, i) => (
                <li key={i}>
                  <Link
                    to={link.to}
                    className="text-slate-300 text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-3">
            <h4 className="text-[#8FB3AA] text-[11px] font-bold tracking-widest uppercase font-mono mb-5">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#0F6E8C] mt-0.5 shrink-0" />
                <span className="text-slate-300 text-sm leading-relaxed break-normal hyphens-none">
                  Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar, KPK, Pakistan
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={15} className="text-[#0F6E8C] shrink-0" />
                <a
                  href="tel:+923339176894"
                  className="text-slate-300 text-sm hover:text-white transition-colors"
                >
                  +92 333 9176894
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={15} className="text-[#0F6E8C] shrink-0" />
                <a
                  href="mailto:izhar5ullah@gmail.com"
                  className="text-slate-300 text-sm hover:text-white transition-colors"
                >
                  izhar5ullah@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={15} className="text-[#0F6E8C] mt-0.5 shrink-0" />
                <span className="text-slate-300 text-sm leading-relaxed">
                  Sat – Thu: 8:00 AM – 6:00 PM
                  <br />
                  Friday: Closed
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/10 bg-[#081E2E]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            © {new Date().getFullYear()} Al-Mukhtar Institute. All rights reserved.
          </p>
          <p className="text-center sm:text-right text-[11px] text-slate-500 font-mono">
            Academic Excellence &amp; Classical Scholarship
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;