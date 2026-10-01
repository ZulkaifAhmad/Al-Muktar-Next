import * as XLSX from "xlsx";

/**
 * Intelligent parser for Excel (.xlsx, .xls) and CSV (.csv) result files.
 * Maps varying column names flexibly to expected Result fields.
 */
export async function parseResultExcelFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: "array" });

        // Get the first worksheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // Convert to JSON with raw values
        const rows = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

        if (!rows || rows.length === 0) {
          throw new Error("The uploaded sheet is empty.");
        }

        const normalizedResults = rows.map((row, index) => {
          // Normalize column keys (case-insensitive and trimmed)
          const lowerKeyMap = {};
          Object.keys(row).forEach((k) => {
            const cleanKey = k.trim().toLowerCase().replace(/[^a-z0-9]/g, "");
            lowerKeyMap[cleanKey] = row[k];
          });

          // Helper to get value from multiple possible header keys
          const getValue = (keys, fallback = "") => {
            for (const key of keys) {
              const clean = key.toLowerCase().replace(/[^a-z0-9]/g, "");
              if (lowerKeyMap[clean] !== undefined && lowerKeyMap[clean] !== "") {
                return lowerKeyMap[clean];
              }
            }
            return fallback;
          };

          const rollNumber = String(
            getValue(["rollno", "rollnumber", "roll", "studentroll", "id", "regno"], `R-${index + 1}`)
          ).trim().toUpperCase();

          const studentName = String(
            getValue(["studentname", "name", "fullname", "student"], `Student ${index + 1}`)
          ).trim();

          const fatherName = String(
            getValue(["fathername", "father", "guardian", "guardianname", "parent"], "")
          ).trim();

          const courseName = String(
            getValue(["coursename", "course", "program", "department"], "")
          ).trim();

          const examSession = String(
            getValue(["examsession", "session", "exam", "term", "examination"], "")
          ).trim();

          const batchYear = String(
            getValue(["batchyear", "batch", "year", "class"], "2025-2026")
          ).trim();

          let totalMarks = Number(getValue(["totalmarks", "total", "maxmarks"], 100));
          let obtainedMarks = Number(getValue(["obtainedmarks", "obtained", "marks", "score", "totalobtained"], 0));

          if (isNaN(totalMarks) || totalMarks <= 0) totalMarks = 100;
          if (isNaN(obtainedMarks)) obtainedMarks = 0;

          let percentage = Number(getValue(["percentage", "percent", "pct"], 0));
          if (!percentage || isNaN(percentage)) {
            percentage = totalMarks > 0 ? Number(((obtainedMarks / totalMarks) * 100).toFixed(2)) : 0;
          }

          let grade = String(getValue(["grade", "lettergrade"], "")).trim();
          if (!grade) {
            if (percentage >= 90) grade = "A+";
            else if (percentage >= 80) grade = "A";
            else if (percentage >= 70) grade = "B";
            else if (percentage >= 60) grade = "C";
            else if (percentage >= 50) grade = "D";
            else grade = "F";
          }

          let status = String(getValue(["status", "resultstatus", "remark"], "")).trim();
          if (!status || !["Pass", "Fail", "Withheld", "Position Holder", "Promoted", "Distinction"].includes(status)) {
            status = percentage >= 50 ? "Pass" : "Fail";
          }

          const position = String(getValue(["position", "rank", "pos"], "")).trim();
          const remarks = String(getValue(["remarks", "comments", "note"], "")).trim();

          return {
            rollNumber,
            studentName,
            fatherName,
            courseName,
            examSession,
            batchYear,
            totalMarks,
            obtainedMarks,
            percentage,
            grade,
            status,
            position,
            remarks: remarks || (status === "Pass" ? "Passed" : "Needs Improvement"),
          };
        });

        resolve(normalizedResults);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}

/**
 * Downloads a pre-formatted Excel template for administrators
 */
export function downloadResultSampleTemplate() {
  const sampleData = [
    {
      "Roll Number": "AM-2026-101",
      "Student Name": "Muhammad Ali",
      "Father Name": "Tariq Mahmood",
      "Course Name": "Quran Recitation & Tajweed",
      "Exam Session": "Annual Examination 2025-2026",
      "Total Marks": 500,
      "Obtained Marks": 472,
      "Percentage": 94.4,
      "Grade": "A+",
      "Status": "Position Holder",
      "Position": "1st Position",
      "Remarks": "Outstanding Tajweed & Recitation",
    },
    {
      "Roll Number": "AM-2026-102",
      "Student Name": "Fatima Zahra",
      "Father Name": "Ahmed Raza",
      "Course Name": "Quran Recitation & Tajweed",
      "Exam Session": "Annual Examination 2025-2026",
      "Total Marks": 500,
      "Obtained Marks": 458,
      "Percentage": 91.6,
      "Grade": "A+",
      "Status": "Distinction",
      "Position": "2nd Position",
      "Remarks": "Excellent performance",
    },
    {
      "Roll Number": "AM-2026-103",
      "Student Name": "Usman Ghani",
      "Father Name": "Abdul Rehman",
      "Course Name": "Islamic Studies Fundamentals",
      "Exam Session": "Annual Examination 2025-2026",
      "Total Marks": 500,
      "Obtained Marks": 395,
      "Percentage": 79.0,
      "Grade": "B",
      "Status": "Pass",
      "Position": "",
      "Remarks": "Passed with good grade",
    },
    {
      "Roll Number": "AM-2026-104",
      "Student Name": "Hamza Khalid",
      "Father Name": "Khalid Saeed",
      "Course Name": "Arabic Language",
      "Exam Session": "Annual Examination 2025-2026",
      "Total Marks": 500,
      "Obtained Marks": 420,
      "Percentage": 84.0,
      "Grade": "A",
      "Status": "Pass",
      "Position": "",
      "Remarks": "Passed successfully",
    },
  ];

  const ws = XLSX.utils.json_to_sheet(sampleData);

  // Set column widths
  ws["!cols"] = [
    { wch: 15 }, // Roll Number
    { wch: 20 }, // Student Name
    { wch: 18 }, // Father Name
    { wch: 28 }, // Course Name
    { wch: 26 }, // Exam Session
    { wch: 12 }, // Total Marks
    { wch: 14 }, // Obtained Marks
    { wch: 12 }, // Percentage
    { wch: 8 },  // Grade
    { wch: 16 }, // Status
    { wch: 14 }, // Position
    { wch: 30 }, // Remarks
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Results_Template");
  XLSX.writeFile(wb, "Al-Mukhtar-Result-Import-Template.xlsx");
}

/**
 * Export results list to Excel (.xlsx)
 */
export function exportResultsToExcelFile(results, filename = "Al-Mukhtar-Student-Results.xlsx") {
  if (!results || results.length === 0) {
    alert("No results data available to export.");
    return;
  }

  const exportRows = results.map((r) => ({
    "Roll Number": r.rollNumber,
    "Student Name": r.studentName,
    "Father Name": r.fatherName || "—",
    "Course": r.courseName,
    "Session": r.examSession || "—",
    "Total Marks": r.totalMarks || 0,
    "Obtained Marks": r.obtainedMarks || 0,
    "Percentage": `${r.percentage || 0}%`,
    "Grade": r.grade || "Pass",
    "Status": r.status || "Pass",
    "Position": r.position || "—",
    "Remarks": r.remarks || "—",
    "Issue Date": r.issueDate ? new Date(r.issueDate).toLocaleDateString() : "—",
  }));

  const ws = XLSX.utils.json_to_sheet(exportRows);
  ws["!cols"] = [
    { wch: 14 },
    { wch: 22 },
    { wch: 20 },
    { wch: 28 },
    { wch: 26 },
    { wch: 12 },
    { wch: 14 },
    { wch: 12 },
    { wch: 8 },
    { wch: 14 },
    { wch: 14 },
    { wch: 28 },
    { wch: 14 },
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Results");
  XLSX.writeFile(wb, filename);
}
