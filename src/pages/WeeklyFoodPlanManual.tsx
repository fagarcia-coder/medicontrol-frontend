import React, { useState } from 'react';
import { getWeeklyPlanManual } from '../services/weeklyPlanManual';
import type { WeeklyPlanResponse } from '../services/weeklyPlanManual';

const WeeklyFoodPlanManual: React.FC = () => {
  const [plan, setPlan] = useState<WeeklyPlanResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLevel) {
      setError("Por favor selecciona un nivel de glucosa");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getWeeklyPlanManual({
        level_glucose_id: Number(selectedLevel),
      });
      setPlan(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Error al generar el plan semanal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-sky-900 mb-6">Plan Semanal de Comidas</h2>

        {/* Formulario para seleccionar nivel de glucosa */}
        <form onSubmit={handleSubmit} className="mb-8 p-4 bg-sky-50 rounded-lg">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <label className="font-semibold text-sky-900">Selecciona el nivel de glucosa:</label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full md:w-auto"
            >
              <option value="">Seleccione</option>
              <option value="1">Normal</option>
              <option value="2">Prediabetes</option>
              <option value="3">Diabetes</option>
            </select>
            <button
              type="submit"
              disabled={loading}
              className="bg-sky-900 hover:bg-sky-800 text-white px-6 py-2 rounded shadow font-semibold disabled:opacity-50"
            >
              {loading ? 'Generando...' : 'Generar Plan'}
            </button>
          </div>
          {error && <p className="text-red-600 mt-2">{error}</p>}
        </form>

        {/* Mostrar plan si está disponible */}
        {plan && (
          <div>
            <p className="text-lg text-gray-700 mb-4">
              <strong>Nivel de glucosa:</strong> {plan.glucose_level}
            </p>

            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse rounded-xl overflow-hidden">
                <thead className="bg-sky-900 text-white">
                  <tr>
                    <th className="px-4 py-3 text-left">Día</th>
                    <th className="px-4 py-3 text-left">Desayuno</th>
                    <th className="px-4 py-3 text-left">Almuerzo</th>
                    <th className="px-4 py-3 text-left">Merienda</th>
                    <th className="px-4 py-3 text-left">Cena</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(plan.week).map(([day, meals], index) => (
                    <tr key={day} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-4 py-3 font-semibold text-sky-900">{day}</td>
                      <td className="px-4 py-3">{meals["Desayuno"]}</td>
                      <td className="px-4 py-3">{meals["Almuerzo"]}</td>
                      <td className="px-4 py-3">{meals["Merienda"]}</td>
                      <td className="px-4 py-3">{meals["Cena"]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyFoodPlanManual;