"use client";

import React, { useState } from "react";
import { Link } from "@/lib/navigation-adapter";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { toast } from "react-toastify";
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  ArrowUpRight,
  GraduationCap,
  ChevronDown,
  Loader2,
  MessageCircle,
  User,
  HelpCircle,
  BookOpen,
  DollarSign,
  Sparkles,
} from "lucide-react";

const TOPIC_OPTIONS = [
  { id: "admission", label: "New Admission", urdu: "نیا داخلہ", icon: GraduationCap },
  { id: "courses", label: "Course Details", urdu: "کورس کی معلومات", icon: BookOpen },
  { id: "fees", label: "Fee & Concession", urdu: "فیس اور رعایت", icon: DollarSign },
  { id: "general", label: "General Question", urdu: "عام سوال", icon: HelpCircle },
];

const SIMPLE_FAQS = [
  {
    question: "Can university students and working professionals join classes?",
    answer:
      "Yes, absolutely! Al-Mukhtar programs are specifically structured for university students, working professionals, and elders seeking authentic Islamic knowledge with convenient schedules and no age barrier.",
  },
  {
    question: "Where is the campus located for in-person classes & admissions?",
    answer:
      "Our on-campus facility is situated at Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar, KPK, Pakistan. You can visit the admissions office directly or contact us via WhatsApp.",
  },
  {
    question: "How long does it take to receive a response to inquiries?",
    answer:
      "Our team reviews all messages and responds via WhatsApp, phone call (+92 333 9176894), or email (izhar5ullah@gmail.com) within 24 hours.",
  },
  {
    question: "Are fee concessions or financial assistance available?",
    answer:
      "Yes. Deserving and motivated students can apply for fee concessions and scholarships upon submitting their inquiry or admission form.",
  },
  {
    question: "Are official certificates awarded upon course completion?",
    answer:
      "Yes. Every student who successfully completes their course and passes the examination receives an official, certified completion certificate from Al-Mukhtar.",
  },
];

function Contact() {
  const [selectedTopic, setSelectedTopic] = useState(TOPIC_OPTIONS[0].label);
  const [openFaq, setOpenFaq] = useState(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      subject: TOPIC_OPTIONS[0].label,
    },
  });

  const contactMutation = useMutation({
    mutationFn: (data) => api.post("/api/contact", data),
    onSuccess: (res) => {
      toast.success(res?.data?.message || "Your message has been sent successfully!");
      reset({
        name: "",
        email: "",
        phone: "",
        subject: TOPIC_OPTIONS[0].label,
        message: "",
      });
      setSelectedTopic(TOPIC_OPTIONS[0].label);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to send message. Please contact us on WhatsApp directly."
      );
    },
  });

  const onSubmit = (data) => {
    contactMutation.mutate(data);
  };

  const handleTopicSelect = (topicLabel) => {
    setSelectedTopic(topicLabel);
    setValue("subject", topicLabel, { shouldValidate: true });
  };

  return (
    <div className="bg-white dark:bg-[#070d18] text-slate-900 dark:text-slate-100 font-sans min-h-screen transition-colors duration-200">
      
      {/* 1. Welcoming Hero Header (Clean English Only) */}
      <section className="bg-slate-50/70 dark:bg-[#081220] border-b border-slate-200/80 dark:border-slate-800 pt-6 pb-8 sm:pt-12 sm:pb-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-2.5 sm:space-y-3">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1 rounded-full bg-teal-100/80 dark:bg-teal-950/60 text-[#0F6E8C] dark:text-teal-300 text-[10px] sm:text-xs font-bold font-mono uppercase tracking-wider border border-teal-200/70 dark:border-teal-800/60 max-w-full">
            <Sparkles size={13} className="shrink-0" />
            <span className="truncate">Al-Mukhtar Student Guidance &amp; Admissions</span>
          </div>

          <h1 className="text-xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white font-heading tracking-tight">
            How can we help you today?
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl mx-auto leading-relaxed font-normal">
            Have questions about academic programs, admissions criteria, or fee concessions? Reach out to our admissions desk below or connect with us directly.
          </p>

          {/* Quick Direct Actions (WhatsApp + Call) */}
          <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 max-w-2xl mx-auto">
            <a
              href="https://wa.me/923431775096?text=Assalam-o-Alaikum,%20I%20want%20information%20about%20Al-Mukhtar%20courses%20and%20admissions."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 text-center"
            >
              <MessageCircle size={15} className="shrink-0" />
              <span>WhatsApp 1</span>
            </a>

            <a
              href="https://wa.me/923009338981?text=Assalam-o-Alaikum,%20I%20want%20information%20about%20Al-Mukhtar%20courses%20and%20admissions."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 text-center"
            >
              <MessageCircle size={15} className="shrink-0" />
              <span>WhatsApp 2</span>
            </a>

            <a
              href="tel:+923339176894"
              className="inline-flex items-center justify-center gap-1.5 bg-[#0F6E8C] hover:bg-[#0B5C74] text-white px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 text-center"
            >
              <Phone size={14} className="shrink-0" />
              <span>Call Helpline 1</span>
            </a>

            <a
              href="tel:+923329566294"
              className="inline-flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm shadow-xs transition-all active:scale-95 text-center"
            >
              <Phone size={14} className="shrink-0" />
              <span>Call Helpline 2</span>
            </a>
          </div>
        </div>
      </section>

      {/* 2. Main Content Layout */}
      <section className="py-6 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-6 sm:space-y-10">

            {/* Form Header */}
            <div className="border-b border-slate-200 dark:border-slate-800 pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
                  Send Your Question or Message
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Our admissions team will get in touch with you shortly.
                </p>
              </div>
              <div className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 sm:px-3 rounded-lg self-start sm:self-auto font-medium font-mono">
                <Clock size={13} className="text-slate-400 shrink-0" />
                <span>Reply within 24 hours</span>
              </div>
            </div>

            {/* Step 1: Easy Topic Selection */}
            <div className="space-y-2 sm:space-y-2.5">
              <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                1. What is your question about? <span className="hidden sm:inline text-xs text-slate-500 font-normal font-urdu">(سوال کی قسم منتخب کریں)</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5">
                {TOPIC_OPTIONS.map((topic) => {
                  const Icon = topic.icon;
                  const isSelected = selectedTopic === topic.label;
                  return (
                    <button
                      key={topic.id}
                      type="button"
                      onClick={() => handleTopicSelect(topic.label)}
                      className={`p-2.5 sm:p-3 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-center ${
                        isSelected
                          ? "border-[#0F6E8C] dark:border-teal-400 bg-teal-50/70 dark:bg-teal-950/40 text-[#0F6E8C] dark:text-teal-300 ring-2 ring-[#0F6E8C]/20 font-bold shadow-xs"
                          : "border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0c1827] hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-200 font-medium"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 sm:gap-2 sm:mb-1">
                        <Icon size={15} className={`shrink-0 ${isSelected ? "text-[#0F6E8C] dark:text-teal-400" : "text-slate-400"}`} />
                        <span className="text-xs sm:text-sm leading-snug">{topic.label}</span>
                      </div>
                      <span className="hidden sm:block text-[11px] font-urdu text-slate-500 dark:text-slate-400" dir="rtl">
                        {topic.urdu}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Form Inputs */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
                
                {/* Full Name */}
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    Your Name <span className="hidden sm:inline text-xs text-slate-500 font-normal font-urdu">(آپ کا نام)</span> <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. Muhammad Ahmad"
                      className={`w-full pl-9 sm:pl-10 pr-3.5 sm:pr-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-[#0c1827] placeholder:text-slate-400 outline-none transition-all focus:bg-white dark:focus:bg-[#0f1f33] focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 ${
                        errors.name ? "border-rose-400 bg-rose-50/20" : "border-slate-200 dark:border-slate-800"
                      }`}
                      {...register("name", {
                        required: "Please enter your name",
                        minLength: { value: 3, message: "Name should be at least 3 letters" },
                      })}
                    />
                  </div>
                  {errors.name && (
                    <p className="text-[11px] sm:text-xs text-rose-500 font-medium">{errors.name.message}</p>
                  )}
                </div>

                {/* WhatsApp / Phone */}
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    WhatsApp or Mobile Number <span className="hidden sm:inline text-xs text-slate-500 font-normal font-urdu">(موبائل / واٹس ایپ نمبر)</span>
                  </label>
                  <div className="relative">
                    <Phone size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none shrink-0" />
                    <input
                      type="text"
                      placeholder="e.g. 0333 9176894"
                      className={`w-full pl-9 sm:pl-10 pr-3.5 sm:pr-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-[#0c1827] placeholder:text-slate-400 outline-none transition-all focus:bg-white dark:focus:bg-[#0f1f33] focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 ${
                        errors.phone ? "border-rose-400 bg-rose-50/20" : "border-slate-200 dark:border-slate-800"
                      }`}
                      {...register("phone", {
                        pattern: {
                          value: /^[\d\s+()-]{7,15}$/,
                          message: "Please enter a valid mobile number",
                        },
                      })}
                    />
                  </div>
                  {errors.phone && (
                    <p className="text-[11px] sm:text-xs text-rose-500 font-medium">{errors.phone.message}</p>
                  )}
                  <p className="text-[10px] sm:text-[11px] text-slate-400">
                    We will send our answer to this phone or WhatsApp.
                  </p>
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

                {/* Email Address */}
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    Email Address <span className="hidden sm:inline text-xs text-slate-500 font-normal font-urdu">(ای میل ایڈریس)</span> <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none shrink-0" />
                    <input
                      type="email"
                      placeholder="student@gmail.com"
                      className={`w-full pl-9 sm:pl-10 pr-3.5 sm:pr-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-[#0c1827] placeholder:text-slate-400 outline-none transition-all focus:bg-white dark:focus:bg-[#0f1f33] focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 ${
                        errors.email ? "border-rose-400 bg-rose-50/20" : "border-slate-200 dark:border-slate-800"
                      }`}
                      {...register("email", {
                        required: "Email is required",
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: "Please enter a valid email address",
                        },
                      })}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-[11px] sm:text-xs text-rose-500 font-medium">{errors.email.message}</p>
                  )}
                </div>

                {/* Subject Field */}
                <div className="space-y-1 sm:space-y-1.5">
                  <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                    Subject / Topic <span className="hidden sm:inline text-xs text-slate-500 font-normal font-urdu">(موضوع)</span> <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Admission inquiry"
                    className={`w-full px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl border text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-[#0c1827] placeholder:text-slate-400 outline-none transition-all focus:bg-white dark:focus:bg-[#0f1f33] focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 ${
                      errors.subject ? "border-rose-400 bg-rose-50/20" : "border-slate-200 dark:border-slate-800"
                    }`}
                    {...register("subject", {
                      required: "Subject is required",
                      minLength: { value: 3, message: "Please enter a subject" },
                    })}
                  />
                  {errors.subject && (
                    <p className="text-[11px] sm:text-xs text-rose-500 font-medium">{errors.subject.message}</p>
                  )}
                </div>

              </div>

              {/* Message Details */}
              <div className="space-y-1 sm:space-y-1.5">
                <label className="block text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200">
                  Your Message or Question <span className="hidden sm:inline text-xs text-slate-500 font-normal font-urdu">(آپ کا سوال یا تفصیلات)</span> <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Please write your question here..."
                  className={`w-full p-3 sm:p-4 rounded-xl border text-xs sm:text-sm text-slate-900 dark:text-slate-100 bg-slate-50/50 dark:bg-[#0c1827] placeholder:text-slate-400 outline-none transition-all resize-none focus:bg-white dark:focus:bg-[#0f1f33] focus:border-[#0F6E8C] dark:focus:border-teal-400 focus:ring-2 focus:ring-[#0F6E8C]/15 ${
                    errors.message ? "border-rose-400 bg-rose-50/20" : "border-slate-200 dark:border-slate-800"
                  }`}
                  {...register("message", {
                    required: "Please write your question or message",
                    minLength: { value: 10, message: "Message should be at least 10 characters long" },
                  })}
                />
                {errors.message && (
                  <p className="text-[11px] sm:text-xs text-rose-500 font-medium">{errors.message.message}</p>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-2 flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 border-t border-slate-100 dark:border-slate-800">
                <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
                  Inquiries are directly forwarded to <strong className="text-slate-700 dark:text-slate-200">izhar5ullah@gmail.com</strong>.
                </p>

                <button
                  type="submit"
                  disabled={contactMutation.isPending}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#0F6E8C] hover:bg-[#0B5C74] text-white px-6 sm:px-8 py-3 sm:py-3.5 rounded-xl font-bold text-xs sm:text-sm shadow-xs active:scale-98 transition-all disabled:opacity-60 cursor-pointer"
                >
                  {contactMutation.isPending ? (
                    <>
                      <Loader2 size={15} className="animate-spin shrink-0" />
                      <span>Sending Message...</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} className="shrink-0" />
                      <span>Send Message<span className="hidden sm:inline"> (پیغام بھیجیں)</span></span>
                    </>
                  )}
                </button>
              </div>

            </form>

            {/* Direct Contact Numbers & Campus Address (4 Detailed Cards) */}
            <div className="pt-6 sm:pt-8 border-t border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* WhatsApp Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs font-mono uppercase tracking-wider">
                  <MessageCircle size={15} />
                  <span>WhatsApp Support</span>
                </div>
                <div className="space-y-1 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  <a
                    href="https://wa.me/923431775096"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block"
                  >
                    +92 343 1775096
                  </a>
                  <a
                    href="https://wa.me/923009338981"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors block"
                  >
                    +92 300 9338981
                  </a>
                </div>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400">Direct WhatsApp messaging</p>
              </div>

              {/* Phone Helpline Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs font-mono uppercase tracking-wider">
                  <Phone size={15} />
                  <span>Call Helpline</span>
                </div>
                <div className="space-y-1 text-xs sm:text-sm font-semibold text-slate-900 dark:text-white">
                  <a
                    href="tel:+923339176894"
                    className="hover:text-[#0F6E8C] dark:hover:text-teal-400 transition-colors block"
                  >
                    +92 333 9176894
                  </a>
                  <a
                    href="tel:+923329566294"
                    className="hover:text-[#0F6E8C] dark:hover:text-teal-400 transition-colors block"
                  >
                    +92 332 9566294
                  </a>
                </div>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400">Voice call support</p>
              </div>

              {/* Email Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs font-mono uppercase tracking-wider">
                  <Mail size={15} />
                  <span>Email Inquiries</span>
                </div>
                <a
                  href="mailto:izhar5ullah@gmail.com"
                  className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-white hover:text-[#0F6E8C] dark:hover:text-teal-400 transition-colors block truncate"
                  title="izhar5ullah@gmail.com"
                >
                  izhar5ullah@gmail.com
                </a>
                <p className="text-[10.5px] text-slate-500 dark:text-slate-400">Formal applications &amp; documents</p>
              </div>

              {/* Campus Address Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0c1827] border border-slate-200/80 dark:border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-[#0F6E8C] dark:text-teal-400 font-bold text-xs font-mono uppercase tracking-wider">
                  <MapPin size={15} />
                  <span>Campus Location</span>
                </div>
                <p className="text-xs text-slate-800 dark:text-slate-200 font-medium leading-snug">
                  Ghaz Masjid, Tanga Adda, Landi Arbab, Peshawar, KPK, Pakistan
                </p>
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Ghaz+Masjid+Tanga+Adda+Landi+Arbab+Peshawar+Pakistan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-[10.5px] font-bold text-[#0F6E8C] dark:text-teal-400 hover:underline pt-0.5"
                >
                  <span>Google Maps</span>
                  <ArrowUpRight size={11} />
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* 3. Simple Frequently Asked Questions (English Only) */}
      <section className="border-t border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-[#081220] py-8 sm:py-14">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-5 sm:space-y-6">
          
          <div className="text-center space-y-1">
            <h2 className="text-lg sm:text-2xl font-bold text-slate-900 dark:text-white font-heading">
              Frequently Asked Questions
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Click on any question below to see the quick answer.
            </p>
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-800 border-y border-slate-200 dark:border-slate-800">
            {SIMPLE_FAQS.map((faq, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={index} className="py-3 sm:py-3.5">
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between gap-3 text-left font-semibold text-slate-900 dark:text-white hover:text-[#0F6E8C] dark:hover:text-teal-400 transition-colors py-1 cursor-pointer"
                  >
                    <p className="text-xs sm:text-base leading-snug">{faq.question}</p>
                    <ChevronDown
                      size={17}
                      className={`text-slate-400 shrink-0 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#0F6E8C] dark:text-teal-400" : ""
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="pt-2 pb-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

    </div>
  );
}

export default Contact;