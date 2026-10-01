"use client";

import React, { useState } from "react";
import {
  FileText,
  Download,
  ExternalLink,
  Award,
  CheckCircle2,
  Calendar,
  User,
  GraduationCap,
  ShieldCheck,
  Maximize2,
  Share2,
} from "lucide-react";

export default function PdfResultViewer({ result, onBack }) {
  if (!result) return null;

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = result.pdfUrl;
    link.download = result.pdfName || `Result_${result.studentName.replace(/\s+/g, "_")}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleOpenNewTab = () => {
    const newWindow = window.open();
    if (newWindow) {
      newWindow.document.write(
        `<iframe src="${result.pdfUrl}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      );
      newWindow.document.title = `${result.studentName} - Examination Result | Al-Mukhtar Institute`;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Position Holder":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            ★ Position Holder
          </span>
        );
      case "Distinction":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
            <Award size={13} /> Distinction
          </span>
        );
      case "Pass":
      case "Promoted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={13} /> Passed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            {status || "Published"}
          </span>
        );
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto my-4 sm:my-6 space-y-4 sm:space-y-5 px-1 sm:px-0">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-xs cursor-pointer active:scale-95"
          >
            ← Search Another
          </button>
        )}

        <div className="flex items-center gap-2 ml-auto">
          <button
            onClick={handleOpenNewTab}
            className="inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-xs cursor-pointer active:scale-95"
          >
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Fullscreen</span>
          </button>

          <button
            onClick={handleDownload}
            className="inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#0F6E8C] to-[#0B5C74] rounded-2xl shadow-md hover:shadow-lg hover:brightness-105 transition active:scale-95 cursor-pointer"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </button>
        </div>
      </div>

      {/* Main Student Header & Verification Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="h-2.5 bg-gradient-to-r from-[#0B1E2D] via-[#0F6E8C] to-[#8FB3AA] absolute top-0 left-0 right-0" />

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#0F6E8C]/10 text-[#0F6E8C] dark:text-[#8FB3AA] flex items-center justify-center shrink-0 border border-[#0F6E8C]/20 shadow-xs">
              <FileText size={26} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase font-mono tracking-widest text-[#0F6E8C] dark:text-[#8FB3AA] block">
                Certified Examination Result
              </span>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {result.studentName}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Father: <strong className="text-slate-700 dark:text-slate-300">{result.fatherName}</strong>
              </p>
            </div>
          </div>

          <div className="flex flex-col items-start sm:items-end gap-1.5">
            {getStatusBadge(result.status)}
            <span className="text-[11px] font-mono text-slate-400">
              {result.examSession}
            </span>
          </div>
        </div>

        {/* Responsive Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mt-5 p-3.5 sm:p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              Course / Program
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200 block truncate">
              {result.courseName}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              Roll / Reg No
            </span>
            <span className="font-bold font-mono text-[#0F6E8C] dark:text-[#8FB3AA]">
              {result.rollNumber || "—"}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              Result Status
            </span>
            <span className="font-bold text-slate-800 dark:text-slate-200">
              {result.status || "Passed"}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-mono text-slate-400 block mb-0.5">
              Date Published
            </span>
            <span className="font-mono text-slate-600 dark:text-slate-300">
              {result.issueDate ? new Date(result.issueDate).toLocaleDateString() : new Date().toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>

      {/* Embedded PDF Viewer Box */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-slate-100 dark:bg-slate-800/80 border-b border-slate-200 dark:border-slate-700 text-xs">
          <div className="flex items-center gap-2 font-mono text-slate-600 dark:text-slate-300 truncate max-w-[240px] sm:max-w-md">
            <ShieldCheck size={16} className="text-emerald-500 shrink-0" />
            <span className="truncate">{result.pdfName || "Result_Document.pdf"}</span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1 text-xs font-semibold text-[#0F6E8C] dark:text-[#8FB3AA] hover:underline cursor-pointer"
            >
              <Download size={13} />
              <span className="hidden sm:inline">Download</span>
            </button>
          </div>
        </div>

        {/* Responsive Frame */}
        <div className="w-full h-[520px] sm:h-[750px] bg-slate-100 dark:bg-slate-950 flex flex-col items-center justify-center relative">
          {result.pdfUrl ? (
            <iframe
              src={`${result.pdfUrl}#toolbar=1&navpanes=0&scrollbar=1`}
              className="w-full h-full border-0"
              title={`Result for ${result.studentName}`}
            />
          ) : (
            <div className="text-center p-8">
              <FileText size={40} className="text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-bold text-slate-700 dark:text-slate-300">
                PDF Document is not available
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
