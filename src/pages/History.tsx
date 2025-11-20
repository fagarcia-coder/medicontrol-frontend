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
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-2xl font-bold text-sky-900 mb-6">Historial de Mediciones</h1>
          <MeasurementsTable measurements={measurements} />
        </div>
      </div>
    </div>
  );
}

export default History;
