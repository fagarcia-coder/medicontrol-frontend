import { useEffect, useState } from "react";
import { getAllMeasurements, getMeasurementsByUser } from "../services/measurements";
import MeasurementsTable from "../components/History/MeasurementsTable";

interface Measurement {
  id: number;
  measurement_value: number;
  created_at: string;
  note?: string;
}

function History() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (user && user.user_type_id === 1) {
        const res = await getAllMeasurements();
        setMeasurements(res.data);
      } else if (user) {
        const res = await getMeasurementsByUser(user.id);
        setMeasurements(res.data);
      } else {
        setMeasurements([]);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-md p-6 md:p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
            <div>
              <h1 className="text-2xl font-bold text-sky-900">Historial de Mediciones</h1>
              <p className="text-sm text-gray-500 mt-1">Filtra, exporta y administra las mediciones registradas.</p>
            </div>
            <div className="text-sm text-gray-600">Mostrando tus mediciones — usa los filtros para refinar resultados</div>
          </div>

          <div className="w-full">
            <MeasurementsTable measurements={measurements} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default History;
