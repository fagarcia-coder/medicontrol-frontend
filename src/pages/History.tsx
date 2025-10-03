import { useEffect, useState } from "react";
import { getAllMeasurements, getMeasurementsByUser } from "../services/measurements";

interface Measurement {
  id: number;
  measurement_value: number;
  created_at: string;
}

function History() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      // Obtén el usuario logueado desde localStorage/context
      const user = JSON.parse(localStorage.getItem("user") || "null");
      // Si es admin (user_type_id === 1), muestra todas las mediciones
      if (user && user.user_type_id === 1) {
        const res = await getAllMeasurements();
        setMeasurements(res.data);
      } else if (user) {
        // Si es usuario normal, muestra solo sus mediciones
        const res = await getMeasurementsByUser(user.id);
        setMeasurements(res.data);
      } else {
        setMeasurements([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-sky-900 mb-6">Historial de Mediciones</h1>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse rounded-xl overflow-hidden text-sm">
              <thead className="bg-sky-900 text-white">
                <tr>
                  <th className="px-4 py-2 font-semibold">Fecha</th>
                  <th className="px-4 py-2 font-semibold">Valor (mg/dL)</th>
                </tr>
              </thead>
              <tbody>
                {measurements.length === 0 ? (
                  <tr>
                    <td colSpan={2} className="text-center py-6 text-gray-400">No hay mediciones registradas</td>
                  </tr>
                ) : (
                  measurements.map((m) => (
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

export default History;
