import { api, API_BASE_URL, getAuthToken } from "./api";

export const reportService = {
  /**
   * Cardholders Report Data: GET /admin/reports/cardholders
   * Params: from_date, to_date, status, district_id, search, limit, offset
   */
  async getCardholdersReport(params = {}) {
    try {
      const res = await api.get("/admin/reports/cardholders", params);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch cardholders report from API", e);
    }
    return [];
  },

  /**
   * Cards Report Data: GET /admin/reports/cards
   * Params: from_date, to_date, status, district_id, search, limit, offset
   */
  async getCardsReport(params = {}) {
    try {
      const res = await api.get("/admin/reports/cards", params);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch cards report from API", e);
    }
    return [];
  },

  /**
   * Partners Report Data: GET /admin/reports/partners
   * Params: from_date, to_date, status, agreement_status, district_id, search, limit, offset
   */
  async getPartnersReport(params = {}) {
    try {
      const res = await api.get("/admin/reports/partners", params);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch partners report from API", e);
    }
    return [];
  },

  /**
   * Agents Report Data: GET /admin/reports/agents
   * Params: from_date, to_date, status, district_id, search, limit, offset
   */
  async getAgentsReport(params = {}) {
    try {
      const res = await api.get("/admin/reports/agents", params);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch agents report from API", e);
    }
    return [];
  },

  /**
   * Renewals Report Data: GET /admin/reports/renewals
   * Params: from_date, to_date, status, district_id, search, limit, offset
   */
  async getRenewalsReport(params = {}) {
    try {
      const res = await api.get("/admin/reports/renewals", params);
      if (res.success && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (e) {
      console.warn("Failed to fetch renewals report from API", e);
    }
    return [];
  },

  /**
   * Build complete API Export URL: GET /admin/reports/export
   */
  getExportUrl(type = "cardholders", format = "pdf", filters = {}) {
    const token = getAuthToken();
    const queryParams = new URLSearchParams();
    queryParams.append("type", type);
    queryParams.append("format", format.toLowerCase());
    if (token) queryParams.append("token", token);

    Object.entries(filters).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "" && val !== "All") {
        queryParams.append(key, val);
      }
    });

    return `${API_BASE_URL}/admin/reports/export?${queryParams.toString()}`;
  },

  /**
   * Client-side CSV Exporter with UTF-8 BOM
   */
  exportToCsv(filename, columns, data) {
    if (!data || !data.length) return;
    const headerRow = columns.map((col) => `"${(col.label || col.header || "").replace(/"/g, '""')}"`).join(",");
    const rows = data.map((item) =>
      columns
        .map((col) => {
          let val = item[col.key];
          if (typeof col.getValue === "function") {
            val = col.getValue(item);
          }
          if (val === undefined || val === null) val = "";
          return `"${String(val).replace(/"/g, '""')}"`;
        })
        .join(",")
    );

    const csvContent = "\uFEFF" + [headerRow, ...rows].join("\r\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Client-side Excel (.xls/HTML table) Exporter
   */
  exportToExcel(filename, sheetName, columns, data) {
    if (!data || !data.length) return;
    let tableHtml = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head><meta charset="utf-8"><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>${sheetName || "Report"}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]-->
    <style>
      table { border-collapse: collapse; width: 100%; font-family: Arial, sans-serif; font-size: 11pt; }
      th { background-color: #f97316; color: #ffffff; font-weight: bold; border: 1px solid #ea580c; padding: 8px; text-align: left; }
      td { border: 1px solid #e2e8f0; padding: 6px 8px; }
      tr:nth-child(even) { background-color: #f8fafc; }
    </style></head>
    <body>
      <h2>Health Mitra — ${sheetName || "Report"}</h2>
      <p>Generated on: ${new Date().toLocaleString()}</p>
      <table>
        <thead><tr>${columns.map((c) => `<th>${c.label || c.header}</th>`).join("")}</tr></thead>
        <tbody>
          ${data
            .map(
              (row) =>
                `<tr>${columns
                  .map((c) => {
                    let val = row[c.key];
                    if (typeof c.getValue === "function") val = c.getValue(row);
                    if (val === undefined || val === null) val = "";
                    return `<td>${String(val)}</td>`;
                  })
                  .join("")}</tr>`
            )
            .join("")}
        </tbody>
      </table>
    </body></html>`;

    const blob = new Blob([tableHtml], { type: "application/vnd.ms-excel;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${filename}_${new Date().toISOString().split("T")[0]}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  /**
   * Opens high-fidelity Printable Report Document
   */
  printReportDocument(reportTitle, filterSummary, columns, data) {
    const printWin = window.open("", "_blank", "width=1000,height=800");
    if (!printWin) return;

    const rowsHtml = data
      .map(
        (row, idx) => `
      <tr>
        <td style="text-align:center; font-weight:bold; color:#64748b;">${idx + 1}</td>
        ${columns
          .map((col) => {
            let val = row[col.key];
            if (typeof col.getValue === "function") val = col.getValue(row);
            if (val === undefined || val === null) val = "-";
            return `<td>${val}</td>`;
          })
          .join("")}
      </tr>`
      )
      .join("");

    const html = `<!DOCTYPE html>
    <html>
      <head>
        <title>Health Mitra — ${reportTitle}</title>
        <meta charset="utf-8" />
        <style>
          @page { size: landscape; margin: 12mm; }
          body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; color: #0f172a; margin: 0; padding: 20px; font-size: 11px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #f97316; padding-bottom: 12px; margin-bottom: 16px; }
          .logo-title { display: flex; align-items: center; gap: 10px; }
          .brand-name { font-size: 20px; font-weight: 900; color: #0f172a; }
          .brand-sub { font-size: 11px; color: #f97316; font-weight: 700; }
          .report-meta { text-align: right; font-size: 10px; color: #64748b; }
          .filter-bar { background: #f8fafc; border: 1px solid #e2e8f0; padding: 8px 12px; border-radius: 8px; margin-bottom: 14px; font-size: 10px; color: #334155; }
          table { width: 100%; border-collapse: collapse; margin-top: 8px; }
          th { background: #0f172a; color: #ffffff; text-align: left; padding: 8px 10px; font-weight: 700; font-size: 10px; text-transform: uppercase; letter-spacing: 0.5px; }
          td { border-bottom: 1px solid #e2e8f0; padding: 6px 10px; font-size: 10px; }
          tr:nth-child(even) { background-color: #f8fafc; }
          .footer { margin-top: 24px; padding-top: 12px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between; font-size: 9px; color: #94a3b8; }
          @media print {
            .no-print { display: none; }
            body { padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="no-print" style="margin-bottom: 16px; display: flex; justify-content: flex-end; gap: 10px;">
          <button onclick="window.print()" style="background:#f97316; color:#fff; border:none; padding:8px 18px; border-radius:8px; font-weight:bold; cursor:pointer;">
            🖨️ Print / Save as PDF
          </button>
          <button onclick="window.close()" style="background:#e2e8f0; color:#334155; border:none; padding:8px 14px; border-radius:8px; cursor:pointer;">
            Close
          </button>
        </div>

        <div class="header">
          <div class="logo-title">
            <div>
              <div class="brand-name">Health <span style="color:#f97316;">Mitra</span></div>
              <div class="brand-sub">Tripura Health Discount Card Platform • Official Admin Report</div>
            </div>
          </div>
          <div class="report-meta">
            <div style="font-weight:bold; font-size:12px; color:#0f172a;">${reportTitle}</div>
            <div>Generated: ${new Date().toLocaleString()}</div>
            <div>Total Records: ${data.length}</div>
          </div>
        </div>

        ${filterSummary ? `<div class="filter-bar"><strong>Applied Filter Parameters:</strong> ${filterSummary}</div>` : ""}

        <table>
          <thead>
            <tr>
              <th style="width: 40px; text-align:center;">#</th>
              ${columns.map((c) => `<th>${c.label || c.header}</th>`).join("")}
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
        </table>

        <div class="footer">
          <div>Health Mitra Operations Control • Tripura State Health Services</div>
          <div>Confidential • DPDPA 2023 Statutory Protected Audit Document</div>
          <div>Page 1 of 1</div>
        </div>
      </body>
    </html>`;

    printWin.document.open();
    printWin.document.write(html);
    printWin.document.close();
  }
};
