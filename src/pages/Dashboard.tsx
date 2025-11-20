import { useEffect, useState } from "react";
import { getAllMeasurements, getMeasurementsByUser } from "../services/measurements";
import SummaryCards from "../components/Dashboard/SummaryCards";
import GlucoseChart from "../components/Dashboard/GlucoseChart";

interface Measurement {
  id: number;
  measurement_value: number;
  created_at: string;
}

function Dashboard() {
  const [history, setHistory] = useState<Measurement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      let res;
      if (user && user.user_type_id === 1) {
        res = await getAllMeasurements();
      } else if (user) {
        res = await getMeasurementsByUser(user.id);
      } else {
        setHistory([]);
        return;
      }
      setHistory(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-sky-900 mb-4">Panel de control</h1>

        <SummaryCards measurements={history} />

        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-lg font-semibold text-sky-900 mb-4">Historial de glucosa (últimos registros)</h2>
          <GlucoseChart data={history} />
        </div>

        {/* Últimas mediciones resumen con botón a historial */}
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
                  history.slice(-10).reverse().map((m) => (
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
