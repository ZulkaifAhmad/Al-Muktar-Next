// Utility functions for exporting application data to Excel (.xls / .csv) and PDF Report

const COURSE_LABELS = {
  "quran-tajweed-course": "Quran Recitation & Tajweed",
  "islamic-studies-fundamentals": "Islamic Studies Fundamentals",
  "arabic-language": "Arabic Language",
  "hifz-program": "Hifz Program",
};

export function getCourseLabel(val) {
  return COURSE_LABELS[val] || val || "General";
}

export function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function escapeHtml(str) {
  if (!str) return "—";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Generates an Excel-compatible XML Spreadsheet (.xls) with custom styling, headers, and colors.
 * Opens natively in Microsoft Excel, Apple Numbers, Google Sheets, LibreOffice.
 */
export function exportToExcel(applications, filenamePrefix = "Al-Mukhtar-Applied-Students") {
  if (!applications || applications.length === 0) {
    alert("No application data available to export.");
    return;
  }

  const dateStamp = new Date().toISOString().split("T")[0];
  const filename = `${filenamePrefix}-${dateStamp}.xls`;

  // XML Spreadsheet 2003 template
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<?mso-application progid="Excel.Sheet"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:o="urn:schemas-microsoft-com:office:office"
 xmlns:x="urn:schemas-microsoft-com:office:excel"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:html="http://www.w3.org/TR/REC-html40">
 <DocumentProperties xmlns="urn:schemas-microsoft-com:office:office">
  <Title>Al-Mukhtar Applied Students</Title>
  <Author>Al-Mukhtar Institute</Author>
  <Created>${new Date().toISOString()}</Created>
 </DocumentProperties>
 <Styles>
  <Style ss:ID="Default" ss:Name="Normal">
   <Alignment ss:Vertical="Center"/>
   <Borders/>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Color="#1E293B"/>
   <Interior/>
   <NumberFormat/>
   <Protection/>
  </Style>
  <Style ss:ID="HeaderTitle">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="14" ss:Bold="1" ss:Color="#0F6E8C"/>
  </Style>
  <Style ss:ID="HeaderMeta">
   <Alignment ss:Horizontal="Left" ss:Vertical="Center"/>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Italic="1" ss:Color="#64748B"/>
  </Style>
  <Style ss:ID="TableHeader">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center" ss:WrapText="1"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="2" ss:Color="#0B5C74"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#CBD5E1"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="10" ss:Bold="1" ss:Color="#FFFFFF"/>
   <Interior ss:Color="#0F6E8C" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="RowEven">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Interior ss:Color="#F8FAFC" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="RowOdd">
   <Alignment ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Left" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Right" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
    <Border ss:Position="Top" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Interior ss:Color="#FFFFFF" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="StatusApproved">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Bold="1" ss:Color="#047857"/>
   <Interior ss:Color="#ECFDF5" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="StatusPending">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Bold="1" ss:Color="#B45309"/>
   <Interior ss:Color="#FFFBEB" ss:Pattern="Solid"/>
  </Style>
  <Style ss:ID="StatusRejected">
   <Alignment ss:Horizontal="Center" ss:Vertical="Center"/>
   <Borders>
    <Border ss:Position="Bottom" ss:LineStyle="Continuous" ss:Weight="1" ss:Color="#E2E8F0"/>
   </Borders>
   <Font ss:FontName="Segoe UI" ss:Size="9" ss:Bold="1" ss:Color="#BE123C"/>
   <Interior ss:Color="#FFF1F2" ss:Pattern="Solid"/>
  </Style>
 </Styles>
 <Worksheet ss:Name="Admissions">
  <Table ss:DefaultRowHeight="20">
   <Column ss:Width="40"/>
   <Column ss:Width="130"/>
   <Column ss:Width="120"/>
   <Column ss:Width="160"/>
   <Column ss:Width="70"/>
   <Column ss:Width="80"/>
   <Column ss:Width="100"/>
   <Column ss:Width="100"/>
   <Column ss:Width="110"/>
   <Column ss:Width="100"/>
   <Column ss:Width="45"/>
   <Column ss:Width="180"/>
   <Column ss:Width="90"/>

   <!-- Title Row -->
   <Row ss:Height="30">
    <Cell ss:MergeAcross="12" ss:StyleID="HeaderTitle">
     <Data ss:Type="String">Al-Mukhtar Islamic &amp; Academic Institute — Admissions Registry</Data>
    </Cell>
   </Row>
   <Row ss:Height="18">
    <Cell ss:MergeAcross="12" ss:StyleID="HeaderMeta">
     <Data ss:Type="String">Exported on: ${new Date().toLocaleString()} | Total Candidates: ${applications.length}</Data>
    </Cell>
   </Row>
   <Row ss:Height="10"/>

   <!-- Table Header -->
   <Row ss:Height="24">
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">#</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Candidate Name</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Father's Name</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Course</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Shift</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Status</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Mobile No</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">WhatsApp</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">CNIC / B-Form</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Qualification</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Age</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Address</Data></Cell>
    <Cell ss:StyleID="TableHeader"><Data ss:Type="String">Applied Date</Data></Cell>
   </Row>
`;

  applications.forEach((app, index) => {
    const rowStyle = index % 2 === 0 ? "RowEven" : "RowOdd";
    let statusStyle = "RowEven";
    if (app.status === "approved") statusStyle = "StatusApproved";
    else if (app.status === "pending") statusStyle = "StatusPending";
    else if (app.status === "rejected") statusStyle = "StatusRejected";

    const clean = (txt) =>
      String(txt || "—")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

    xml += `   <Row ss:Height="20">
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="Number">${index + 1}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${clean(app.name)}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${clean(app.fatherName)}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${clean(getCourseLabel(app.course))}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${clean(app.shift ? app.shift.toUpperCase() : "—")}</Data></Cell>
    <Cell ss:StyleID="${statusStyle}"><Data ss:Type="String">${clean((app.status || "pending").toUpperCase())}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${clean(app.mobile)}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${clean(app.whatsapp)}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${clean(app.cnic)}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${clean(app.qualification)}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="Number">${app.age || 0}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${clean(app.address)}</Data></Cell>
    <Cell ss:StyleID="${rowStyle}"><Data ss:Type="String">${clean(formatDate(app.createdAt))}</Data></Cell>
   </Row>
`;
  });

  xml += `  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: "application/vnd.ms-excel;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates a clean CSV file with UTF-8 BOM
 */
export function exportToCSV(applications, filenamePrefix = "Al-Mukhtar-Applied-Students") {
  if (!applications || applications.length === 0) {
    alert("No application data available to export.");
    return;
  }

  const dateStamp = new Date().toISOString().split("T")[0];
  const filename = `${filenamePrefix}-${dateStamp}.csv`;

  const headers = [
    "Sr #",
    "Candidate Name",
    "Father Name",
    "Course",
    "Shift",
    "Status",
    "Mobile Number",
    "WhatsApp Number",
    "CNIC / B-Form",
    "Qualification",
    "Age",
    "Address",
    "Application Date",
  ];

  const escapeCSV = (field) => {
    const stringField = String(field || "—").replace(/"/g, '""');
    return `"${stringField}"`;
  };

  const rows = applications.map((app, index) => [
    index + 1,
    escapeCSV(app.name),
    escapeCSV(app.fatherName),
    escapeCSV(getCourseLabel(app.course)),
    escapeCSV(app.shift ? app.shift.toUpperCase() : "—"),
    escapeCSV((app.status || "pending").toUpperCase()),
    escapeCSV(app.mobile),
    escapeCSV(app.whatsapp),
    escapeCSV(app.cnic),
    escapeCSV(app.qualification),
    escapeCSV(app.age || "—"),
    escapeCSV(app.address),
    escapeCSV(formatDate(app.createdAt)),
  ]);

  const csvContent = "\uFEFF" + [headers.join(","), ...rows.map((r) => r.join(","))].join("\r\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Generates a formatted institutional PDF dossier report via the browser's high-definition print engine.
 * Opens the preview and triggers print / Save as PDF immediately.
 */
export function exportToPDF(applications, title = "Al-Mukhtar Institute — Applied Students Dossier") {
  if (!applications || applications.length === 0) {
    alert("No application data available to export.");
    return;
  }

  const approvedCount = applications.filter((a) => a.status === "approved").length;
  const pendingCount = applications.filter((a) => a.status === "pending").length;
  const rejectedCount = applications.filter((a) => a.status === "rejected").length;
  const dateStr = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please allow popups to generate the PDF report.");
    return;
  }

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 12mm 10mm;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, Roboto, sans-serif;
    }
    body {
      color: #0f172a;
      background: #ffffff;
      padding: 16px;
      font-size: 11px;
    }
    .header {
      border-bottom: 2px solid #0F6E8C;
      padding-bottom: 12px;
      margin-bottom: 14px;
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
    }
    .institution-name {
      font-size: 20px;
      font-weight: 800;
      color: #0F6E8C;
      letter-spacing: -0.5px;
    }
    .doc-title {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      margin-top: 2px;
    }
    .meta-info {
      text-align: right;
      font-size: 10px;
      color: #64748b;
    }
    .summary-strip {
      display: flex;
      gap: 12px;
      margin-bottom: 14px;
    }
    .stat-box {
      flex: 1;
      padding: 8px 12px;
      border-radius: 6px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
    }
    .stat-label {
      font-size: 9px;
      text-transform: uppercase;
      font-weight: 700;
      color: #64748b;
    }
    .stat-value {
      font-size: 16px;
      font-weight: 800;
      color: #0f172a;
      margin-top: 2px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      font-size: 10px;
    }
    thead th {
      background-color: #0F6E8C;
      color: #ffffff;
      font-weight: 700;
      text-align: left;
      padding: 7px 8px;
      border: 1px solid #0b5c74;
      font-size: 9.5px;
      text-transform: uppercase;
      letter-spacing: 0.3px;
    }
    tbody td {
      padding: 6px 8px;
      border: 1px solid #e2e8f0;
      vertical-align: middle;
    }
    tbody tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .status-badge {
      display: inline-block;
      padding: 2px 6px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 9px;
      text-transform: uppercase;
    }
    .status-approved {
      background-color: #ecfdf5;
      color: #047857;
      border: 1px solid #a7f3d0;
    }
    .status-pending {
      background-color: #fffbeb;
      color: #b45309;
      border: 1px solid #fde68a;
    }
    .status-rejected {
      background-color: #fff1f2;
      color: #be123c;
      border: 1px solid #fecdd3;
    }
    .footer {
      margin-top: 18px;
      padding-top: 8px;
      border-top: 1px solid #e2e8f0;
      display: flex;
      justify-content: space-between;
      font-size: 9px;
      color: #94a3b8;
    }
    @media print {
      body {
        padding: 0;
      }
      .no-print {
        display: none;
      }
      table {
        page-break-inside: auto;
      }
      tr {
        page-break-inside: avoid;
        page-break-after: auto;
      }
      thead {
        display: table-header-group;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <div class="institution-name">Al-Mukhtar Islamic &amp; Academic Institute</div>
      <div class="doc-title">Official Admissions Application Registry &amp; Dossier</div>
    </div>
    <div class="meta-info">
      <div><strong>Report Date:</strong> ${dateStr}</div>
      <div><strong>Confidential Administrative Document</strong></div>
    </div>
  </div>

  <div class="summary-strip">
    <div class="stat-box">
      <div class="stat-label">Total Applied</div>
      <div class="stat-value" style="color:#0F6E8C">${applications.length}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Approved</div>
      <div class="stat-value" style="color:#059669">${approvedCount}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Pending Review</div>
      <div class="stat-value" style="color:#d97706">${pendingCount}</div>
    </div>
    <div class="stat-box">
      <div class="stat-label">Rejected</div>
      <div class="stat-value" style="color:#e11d48">${rejectedCount}</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th style="width: 25px; text-align: center;">#</th>
        <th>Candidate Name</th>
        <th>Father's Name</th>
        <th>Program / Course</th>
        <th>Shift</th>
        <th style="text-align: center;">Status</th>
        <th>Mobile</th>
        <th>WhatsApp</th>
        <th>CNIC / B-Form</th>
        <th>Qualification</th>
        <th style="width: 35px; text-align: center;">Age</th>
        <th>Applied Date</th>
      </tr>
    </thead>
    <tbody>
      ${applications
        .map(
          (app, idx) => `
        <tr>
          <td style="text-align: center; font-weight: bold; color: #64748b;">${idx + 1}</td>
          <td><strong>${escapeHtml(app.name)}</strong></td>
          <td>${escapeHtml(app.fatherName)}</td>
          <td>${escapeHtml(getCourseLabel(app.course))}</td>
          <td style="text-transform: capitalize;">${escapeHtml(app.shift)}</td>
          <td style="text-align: center;">
            <span class="status-badge status-${escapeHtml(app.status || "pending")}">${escapeHtml(app.status || "pending")}</span>
          </td>
          <td>${escapeHtml(app.mobile)}</td>
          <td>${escapeHtml(app.whatsapp)}</td>
          <td style="font-family: monospace;">${escapeHtml(app.cnic)}</td>
          <td>${escapeHtml(app.qualification)}</td>
          <td style="text-align: center;">${escapeHtml(app.age)}</td>
          <td style="font-family: monospace; font-size: 9px;">${escapeHtml(formatDate(app.createdAt))}</td>
        </tr>
      `
        )
        .join("")}
    </tbody>
  </table>

  <div class="footer">
    <div>Al-Mukhtar Institute of Islamic &amp; Arabic Studies • Official Management Portal</div>
    <div>Page 1 of 1 — Generated by Admin System</div>
  </div>

  <script>
    window.onload = function() {
      setTimeout(function() {
        window.print();
      }, 300);
    };
  </script>
</body>
</html>`;

  printWindow.document.open();
  printWindow.document.write(html);
  printWindow.document.close();
}
