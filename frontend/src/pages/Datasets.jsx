import { useEffect, useState } from "react";
import { Upload, Database, FileSpreadsheet } from "lucide-react";
import { motion } from "framer-motion";
import API from "../api/axios";

const Datasets = () => {
  const [file, setFile] = useState(null);
  const [datasets, setDatasets] = useState([]);
  const [message, setMessage] = useState("");

  const fetchDatasets = async () => {
    try {
      const res = await API.get("/datasets/my-datasets");
      setDatasets(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const uploadDataset = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!file) {
      setMessage("Please select a CSV or XLSX file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      await API.post("/datasets/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("Dataset uploaded successfully.");
      setFile(null);
      fetchDatasets();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Upload failed");
    }
  };

  useEffect(() => {
    fetchDatasets();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-3xl font-extrabold text-white">Dataset Upload</h1>
        <p className="text-cyan-50 mt-2">
          Upload sales, demand, stock, and inventory datasets for AI forecasting.
        </p>
      </div>

      <motion.form
        onSubmit={uploadDataset}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 space-y-5"
      >
        <div className="border-2 border-dashed border-cyan-400/30 rounded-3xl p-10 text-center bg-white/5">
          <div className="mx-auto h-16 w-16 rounded-3xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center mb-4">
            <Upload className="text-white" size={32} />
          </div>

          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={(e) => setFile(e.target.files[0])}
            className="block mx-auto text-sm text-slate-300"
          />

          <p className="text-sm text-slate-400 mt-4">
            Supported files: CSV, XLSX. Maximum size: 10 MB.
          </p>

          {file && (
            <p className="text-cyan-300 mt-3 text-sm">
              Selected: {file.name}
            </p>
          )}
        </div>

        {message && (
          <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 p-4 rounded-2xl">
            {message}
          </div>
        )}

        <button className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition">
          Upload Dataset
        </button>
      </motion.form>

      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <Database className="text-cyan-300" />
          <h2 className="text-xl font-bold text-white">My Datasets</h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/10 text-left text-slate-300">
                <th className="p-4">ID</th>
                <th className="p-4">File</th>
                <th className="p-4">Rows</th>
                <th className="p-4">Columns</th>
                <th className="p-4">Status</th>
              </tr>
            </thead>

            <tbody>
              {datasets.map((item) => (
                <tr key={item.id} className="border-t border-white/10 hover:bg-white/5">
                  <td className="p-4">{item.id}</td>
                  <td className="p-4 flex items-center gap-2">
                    <FileSpreadsheet size={16} className="text-cyan-300" />
                    {item.original_file_name}
                  </td>
                  <td className="p-4">{item.total_rows}</td>
                  <td className="p-4">{item.total_columns}</td>
                  <td className="p-4">
                    <span className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-3 py-1 rounded-full">
                      {item.processing_status}
                    </span>
                  </td>
                </tr>
              ))}

              {datasets.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No datasets uploaded yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Datasets;