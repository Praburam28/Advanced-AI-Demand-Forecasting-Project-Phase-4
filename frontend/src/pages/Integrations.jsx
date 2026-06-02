import { useEffect, useState } from "react";
import { Plug, Wifi, RefreshCcw, Server } from "lucide-react";
import { motion } from "framer-motion";
import API from "../api/axios";

const Integrations = () => {
  const [integrations, setIntegrations] = useState([]);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    name: "",
    integration_type: "inventory",
    api_url: "",
    api_key: "",
  });

  const fetchIntegrations = async () => {
    const res = await API.get("/integrations/");
    setIntegrations(res.data);
  };

  const createIntegration = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      await API.post("/integrations/", form);
      setMessage("Integration created successfully.");
      setForm({
        name: "",
        integration_type: "inventory",
        api_url: "",
        api_key: "",
      });
      fetchIntegrations();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Integration creation failed");
    }
  };

  const testIntegration = async (id) => {
    try {
      await API.post(`/integrations/${id}/test`);
      setMessage("Connection test completed.");
      fetchIntegrations();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Connection test failed");
    }
  };

  const syncIntegration = async (id) => {
    try {
      await API.post(`/integrations/${id}/sync`);
      setMessage("Integration sync completed.");
      fetchIntegrations();
    } catch (error) {
      setMessage(error.response?.data?.detail || "Sync failed");
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  return (
    <div className="space-y-8">
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 to-cyan-500 p-8 shadow-2xl shadow-cyan-500/20">
        <h1 className="text-3xl font-extrabold text-white">
          Enterprise Integrations
        </h1>
        <p className="text-cyan-50 mt-2">
          Connect ERP, inventory systems, external APIs, and webhook services.
        </p>
      </div>

      <motion.form
        onSubmit={createIntegration}
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-3xl p-6 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none"
          placeholder="Integration Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
          required
        />

        <select
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none"
          value={form.integration_type}
          onChange={(e) =>
            setForm({ ...form, integration_type: e.target.value })
          }
        >
          <option className="text-slate-900" value="inventory">
            Inventory System
          </option>
          <option className="text-slate-900" value="erp">
            ERP
          </option>
          <option className="text-slate-900" value="external_api">
            External API
          </option>
          <option className="text-slate-900" value="webhook">
            Webhook
          </option>
        </select>

        <input
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none md:col-span-2"
          placeholder="API URL"
          value={form.api_url}
          onChange={(e) =>
            setForm({ ...form, api_url: e.target.value })
          }
        />

        <input
          className="bg-white/10 border border-white/10 rounded-2xl px-4 py-3 text-white outline-none md:col-span-2"
          placeholder="API Key"
          value={form.api_key}
          onChange={(e) =>
            setForm({ ...form, api_key: e.target.value })
          }
        />

        <button className="md:col-span-2 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-bold py-3 shadow-lg shadow-cyan-500/20 hover:scale-[1.02] transition">
          Add Integration
        </button>
      </motion.form>

      {message && (
        <div className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-200 p-4 rounded-2xl">
          {message}
        </div>
      )}

      <div className="glass-card rounded-3xl p-6">
        <div className="flex items-center gap-3 mb-5">
          <Plug className="text-cyan-300" />
          <h2 className="text-xl font-bold text-white">
            Integration Settings
          </h2>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-white/10 text-left text-slate-300">
                <th className="p-4">Name</th>
                <th className="p-4">Type</th>
                <th className="p-4">Status</th>
                <th className="p-4">Last Sync</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {integrations.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-white/10 hover:bg-white/5"
                >
                  <td className="p-4 flex items-center gap-2">
                    <Server size={16} className="text-cyan-300" />
                    {item.name}
                  </td>
                  <td className="p-4">{item.integration_type}</td>
                  <td className="p-4">
                    <span
                      className={
                        item.status === "active"
                          ? "text-emerald-300"
                          : "text-orange-300"
                      }
                    >
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4">
                    {item.last_sync_status || "Not synced"}
                  </td>
                  <td className="p-4 flex gap-2">
                    <button
                      onClick={() => testIntegration(item.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-cyan-500/20 text-cyan-300"
                    >
                      <Wifi size={15} />
                      Test
                    </button>

                    <button
                      onClick={() => syncIntegration(item.id)}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300"
                    >
                      <RefreshCcw size={15} />
                      Sync
                    </button>
                  </td>
                </tr>
              ))}

              {integrations.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-slate-400">
                    No integrations added yet.
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

export default Integrations;