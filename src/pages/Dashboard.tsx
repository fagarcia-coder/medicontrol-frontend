import { useEffect, useState } from "react";
import api from "../services/api";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

interface Measurement {
  id: number;
  measurement_value: number;
  created_at: string;
}

function Dashboard() {
  const [lastMeasurement, setLastMeasurement] = useState<Measurement | null>(null);
  const [history, setHistory] = useState<Measurement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/glucose/last"); // último registro
      setLastMeasurement(res.data);

      const historyRes = await api.get("/glucose/history"); // historial
      setHistory(historyRes.data);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-sky-900 mb-4">Panel de control</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Última medición */}
          <div className="bg-white rounded-xl shadow-lg p-8 flex flex-col justify-center items-center">
            <h2 className="text-lg font-semibold text-sky-900 mb-2">Última medición</h2>
            {lastMeasurement ? (
              <>
                <div className="text-5xl font-extrabold text-sky-700 mb-2">
                  {lastMeasurement.measurement_value} <span className="text-lg font-normal text-sky-900">mg/dL</span>
                </div>
                <div className="text-gray-500">{new Date(lastMeasurement.created_at).toLocaleString()}</div>
              </>
            ) : (
              <div className="text-gray-400">No hay mediciones recientes</div>
            )}
          </div>

          {/* Gráfica historial */}
          <div className="bg-white rounded-xl shadow-lg p-8 h-80 flex flex-col">
            <h2 className="text-lg font-semibold text-sky-900 mb-4">Historial de glucosa</h2>
            <div className="flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="created_at" tickFormatter={(d: string) => new Date(d).toLocaleDateString()} />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="measurement_value" stroke="#0ea5e9" strokeWidth={3} dot={{ r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabla historial */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-lg font-semibold text-sky-900 mb-4">Historial detallado</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse rounded-xl overflow-hidden text-sm">
              <thead className="bg-sky-900 text-white">
                <tr>
                  <th className="px-4 py-2 font-semibold">Fecha</th>
                  <th className="px-4 py-2 font-semibold">Valor (mg/dL)</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-6 text-gray-400">No hay datos</td>
                  </tr>
                ) : (
                  history.map((m) => (
                    <tr key={m.id} className="border-b hover:bg-gray-50">
                      <td className="px-4 py-2">{new Date(m.created_at).toLocaleString()}</td>
                      <td className="px-4 py-2 font-semibold">{m.measurement_value}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
