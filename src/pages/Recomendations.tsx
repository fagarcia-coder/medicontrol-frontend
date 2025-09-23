import { useEffect, useState } from "react";
import api from "../services/api";

interface Recommendation {
  id: number;
  description: string;
  min_value: number;
  max_value: number;
  recommendation: string;
}

function Recommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await api.get("/recommendations");
      setRecommendations(res.data);
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-2xl font-bold text-sky-900 mb-6">Recomendaciones Alimenticias</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.length === 0 ? (
              <div className="col-span-2 text-center text-gray-400 py-8">No hay recomendaciones disponibles</div>
            ) : (
              recommendations.map((rec) => (
                <div key={rec.id} className="bg-sky-50 border border-sky-100 rounded-xl p-6 shadow flex flex-col gap-2">
                  <h2 className="text-lg font-semibold text-sky-900 mb-1">{rec.description}</h2>
                  <span className="inline-block bg-sky-200 text-sky-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
                    Rango: {rec.min_value} – {rec.max_value} mg/dL
                  </span>
                  <p className="text-gray-700">{rec.recommendation}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Recommendations;
