"use client";

import React, { useRef } from "react";
import {
  Award,
  CheckCircle2,
  Printer,
  Calendar,
  User,
  BookOpen,
  FileCheck2,
  AlertCircle,
  Trophy,
  ShieldCheck,
  Download,
  Lock,
  Tag,
  GraduationCap,
} from "lucide-react";

export default function ResultCard({ result, onBack }) {
  const printRef = useRef(null);

  if (!result) return null;

  const handlePrint = () => {
    window.print();
  };

  const getStatusBadge = (status, isReleased) => {
    if (!isReleased) {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
          <Lock size={13} />
          Result On Hold / Withheld
        </span>
      );
    }

    switch (status) {
      case "Position Holder":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30">
            <Trophy size={13} />
            Position Holder
          </span>
        );
      case "Distinction":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/30">
            <Award size={13} />
            Distinction
          </span>
        );
      case "Pass":
      case "Promoted":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <CheckCircle2 size={13} />
            Passed
          </span>
        );
      case "Fail":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <AlertCircle size={13} />
            Needs Improvement / Fail
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/30">
            {status || "Certified"}
          </span>
        );
    }
  };

  const getGradeColor = (grade) => {
    if (grade?.includes("A")) return "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800";
    if (grade?.includes("B")) return "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800";
    if (grade?.includes("C")) return "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800";
    return "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800";
  };

  const percentage = Number(
    result.percentage || (result.totalMarks > 0 ? (result.obtainedMarks / result.totalMarks) * 100 : 0)
  ).toFixed(1);

  return (
    <div className="w-full max-w-4xl mx-auto my-4 sm:my-6 space-y-4 sm:space-y-5">
      {/* Top Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 no-print">
        {onBack && (
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-700 transition shadow-xs cursor-pointer active:scale-95"
          >
            ← Search Another Result
          </button>
        )}

        {result.isReleased !== false && (
          <div className="flex items-center gap-2.5 ml-auto">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-bold text-white bg-gradient-to-r from-[#0F6E8C] to-[#0B5C74] rounded-2xl shadow-md hover:shadow-lg hover:brightness-105 transition active:scale-95 cursor-pointer"
            >
              <Printer size={15} />
              Print / Save Result Card
            </button>
          </div>
        )}
      </div>

      {/* On Hold Banner if Result is Withheld */}
      {result.isReleased === false && (
        <div className="p-6 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-900 dark:text-amber-200 space-y-2">
          <div className="flex items-center gap-2.5 font-bold text-base text-amber-700 dark:text-amber-300">
            <Lock size={20} className="shrink-0" />
            <span>Examination Result On Hold</span>
          </div>
          <p className="text-xs sm:text-sm leading-relaxed">
            {result.holdReason ||
              "This examination result is temporarily withheld by the administration. Please contact the examination branch or administration office for resolution."}
          </p>
        </div>
      )}

      {/* Main Printable DMC Certificate */}
      <div
        ref={printRef}
        className="print-container bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl overflow-hidden relative"
      >
        {/* Accent Bar */}
        <div className="h-3.5 bg-gradient-to-r from-[#0B1E2D] via-[#0F6E8C] to-[#8FB3AA]" />

        <div className="p-6 sm:p-10 space-y-6">
          {/* Certificate Header */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-100 dark:border-slate-800 pb-6 text-center sm:text-left">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#0F6E8C] to-[#0B1E2D] flex items-center justify-center text-white shadow-lg border border-[#8FB3AA]/30 shrink-0">
                <BookOpen size={30} />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase font-mono tracking-widest text-[#0F6E8C] dark:text-[#8FB3AA] block">
                  Official Detailed Marks Certificate
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Al-Mukhtar Institute
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  Center for Islamic Education & Quranic Studies
                </p>
              </div>
            </div>

            <div className="flex flex-col items-center sm:items-end gap-1.5">
              {getStatusBadge(result.status, result.isReleased)}
              {result.position && result.isReleased !== false && (
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-md border border-amber-500/20">
                  ★ {result.position}
                </div>
              )}
              <span className="text-[11px] font-mono text-slate-400">
                Issued:{" "}
                {result.issueDate
                  ? new Date(result.issueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })
                  : new Date().toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Session & Exam Type Bar */}
          <div className="px-4 py-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs font-medium">
            <span className="text-slate-600 dark:text-slate-300">
              Exam: <strong className="text-slate-900 dark:text-white">{result.examType || "Annual"} Assessment</strong> • Session: <strong className="text-slate-900 dark:text-white">{result.examSession}</strong>
            </span>
            <span className="text-slate-500 dark:text-slate-400 font-mono">
              Class: <strong className="text-[#0F6E8C] dark:text-[#8FB3AA]">{result.className || "General"}</strong>
            </span>
          </div>

          {/* Student Profile Info */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/60 dark:from-slate-800/40 dark:to-slate-800/20 border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="text-[10px] font-bold uppercase font-mono text-slate-400 block mb-0.5">
                Student Name
              </span>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {result.studentName}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase font-mono text-slate-400 block mb-0.5">
                Father / Guardian
              </span>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {result.fatherName}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase font-mono text-slate-400 block mb-0.5">
                Course Enrolled
              </span>
              <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
                {result.courseName}
              </p>
            </div>

            <div>
              <span className="text-[10px] font-bold uppercase font-mono text-slate-400 block mb-0.5">
                Roll Number
              </span>
              <p className="text-sm font-extrabold text-[#0F6E8C] dark:text-[#8FB3AA] font-mono">
                {result.rollNumber || "AM-" + result.studentName.slice(0, 3).toUpperCase()}
              </p>
            </div>
          </div>

          {/* Subject-wise Marks Breakdown Table */}
          {result.isReleased !== false && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FileCheck2 size={16} className="text-[#0F6E8C]" />
                  Subject-wise Evaluation & Marks
                </h3>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs uppercase font-mono tracking-wider">
                    <tr>
                      <th className="py-3 px-4">#</th>
                      <th className="py-3 px-4">Subject / Module</th>
                      <th className="py-3 px-4 text-center">Total Marks</th>
                      <th className="py-3 px-4 text-center">Marks Obtained</th>
                      <th className="py-3 px-4 text-center">Percentage</th>
                      <th className="py-3 px-4 text-center">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 bg-white dark:bg-slate-900">
                    {result.subjects && result.subjects.length > 0 ? (
                      result.subjects.map((sub, i) => {
                        const subPct = sub.totalMarks > 0 ? ((sub.obtainedMarks / sub.totalMarks) * 100).toFixed(1) : 0;
                        return (
                          <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                            <td className="py-3 px-4 text-slate-400 font-mono text-xs">{i + 1}</td>
                            <td className="py-3 px-4 font-semibold text-slate-800 dark:text-slate-200">
                              {sub.subjectName}
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-slate-600 dark:text-slate-400">
                              {sub.totalMarks}
                            </td>
                            <td className="py-3 px-4 text-center font-bold font-mono text-slate-900 dark:text-white">
                              {sub.obtainedMarks}
                            </td>
                            <td className="py-3 px-4 text-center font-mono text-slate-600 dark:text-slate-400">
                              {subPct}%
                            </td>
                            <td className="py-3 px-4 text-center">
                              <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border ${getGradeColor(sub.grade || "A")}`}>
                                {sub.grade || (subPct >= 80 ? "A" : subPct >= 60 ? "B" : "Pass")}
                              </span>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td className="py-3.5 px-4 text-slate-400 font-mono text-xs">1</td>
                        <td className="py-3.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                          {result.courseName} (Comprehensive Evaluation)
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-400">
                          {result.totalMarks || 100}
                        </td>
                        <td className="py-3.5 px-4 text-center font-bold font-mono text-slate-900 dark:text-white">
                          {result.obtainedMarks || 0}
                        </td>
                        <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-400">
                          {percentage}%
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold border ${getGradeColor(result.grade)}`}>
                            {result.grade || "Pass"}
                          </span>
                        </td>
                      </tr>
                    )}
                  </tbody>
                  {/* Total Summary Footer */}
                  <tfoot className="bg-slate-50/90 dark:bg-slate-800/80 font-bold text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-700">
                    <tr>
                      <td colSpan={2} className="py-3.5 px-4 text-right uppercase tracking-wider text-xs">
                        Grand Total:
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-700 dark:text-slate-300">
                        {result.totalMarks || 100}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-emerald-600 dark:text-emerald-400 text-base">
                        {result.obtainedMarks || 0}
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-[#0F6E8C] dark:text-[#8FB3AA]">
                        {percentage}%
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className={`inline-block px-3 py-1 rounded-md text-xs font-black border ${getGradeColor(result.grade)}`}>
                          Grade: {result.grade || "Pass"}
                        </span>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}

          {/* Dynamic Custom Fields Section (if any were added by admin) */}
          {result.customFields && result.customFields.length > 0 && result.isReleased !== false && (
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                <Tag size={14} className="text-[#0F6E8C]" />
                Additional Assessments & Observations
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {result.customFields.map((cf, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800"
                  >
                    <span className="text-[10px] font-bold uppercase font-mono text-slate-400 block mb-0.5">
                      {cf.fieldName}
                    </span>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {cf.fieldValue || "—"}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Remarks */}
          {result.isReleased !== false && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800">
              <span className="text-[10px] font-bold uppercase font-mono text-slate-400 block mb-1">
                Examiner Assessment & Performance Remarks
              </span>
              <p className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 italic">
                "{result.remarks || "The student has demonstrated commendable progress throughout the session."}"
              </p>
            </div>
          )}

          {/* Security Seal & Signatures */}
          {result.isReleased !== false && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 grid grid-cols-3 gap-4 items-end text-center">
              <div>
                <div className="h-8 border-b border-dashed border-slate-300 dark:border-slate-700 mx-auto w-28 mb-1" />
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                  Class Teacher
                </span>
                <span className="text-[9px] text-slate-400 font-mono">Evaluation Section</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#0F6E8C]/40 flex flex-col items-center justify-center text-[#0F6E8C] dark:text-[#8FB3AA] mb-0.5">
                  <ShieldCheck size={18} />
                  <span className="text-[7px] font-bold tracking-widest uppercase">Certified</span>
                </div>
                <span className="text-[9px] text-slate-400 font-mono">Official E-Record</span>
              </div>

              <div>
                <div className="h-8 border-b border-dashed border-slate-300 dark:border-slate-700 mx-auto w-28 mb-1" />
                <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-400 block">
                  Controller of Exams
                </span>
                <span className="text-[9px] text-slate-400 font-mono">Al-Mukhtar Institute</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
