import { Download } from "lucide-react";

const DashboardExportButtons = () => {
  const token = localStorage.getItem("token");

  const downloadFile = async (type) => {
    try {
      const response = await fetch(
        `http://localhost:8000/reports/dashboard/${type}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");

      a.href = url;

      a.download =
        type === "pdf"
          ? "dashboard_summary.pdf"
          : "dashboard_summary.xlsx";

      document.body.appendChild(a);

      a.click();

      a.remove();

      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed", error);
    }
  };

  return (
    <div className="flex flex-wrap gap-4">
      <button
        onClick={() => downloadFile("pdf")}
        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold shadow-lg hover:scale-105 transition"
      >
        <Download size={18} />
        Download PDF
      </button>

      <button
        onClick={() => downloadFile("excel")}
        className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-semibold shadow-lg hover:scale-105 transition"
      >
        <Download size={18} />
        Download Excel
      </button>
    </div>
  );
};

export default DashboardExportButtons;