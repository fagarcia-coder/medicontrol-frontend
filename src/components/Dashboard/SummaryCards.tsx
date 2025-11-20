import React from 'react';

type Props = {
  measurements: Array<{ measurement_value: number; created_at: string }>;
};

function average(values: number[]) {
  if (values.length === 0) return 0;
  return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
}

const SummaryCards: React.FC<Props> = ({ measurements }) => {
  const now = Date.now();
  const sevenDaysAgo = now - 1000 * 60 * 60 * 24 * 7;
  const recent = measurements.filter((m) => new Date(m.created_at).getTime() >= sevenDaysAgo);
  const values = recent.map((r) => r.measurement_value);

  const avg7 = average(values);
  const last = measurements.length > 0 ? measurements[measurements.length - 1].measurement_value : null;
  const highs = measurements.filter((m) => m.measurement_value > 180).length;
  const lows = measurements.filter((m) => m.measurement_value < 70).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow p-4">
        <div className="text-sm text-gray-500">Promedio (7 días)</div>
        <div className="text-2xl font-bold text-sky-700">{avg7} mg/dL</div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="text-sm text-gray-500">Última medición</div>
        <div className="text-2xl font-bold text-sky-700">{last ?? '—'} mg/dL</div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="text-sm text-gray-500">Altas (&gt;180)</div>
        <div className="text-2xl font-bold text-red-600">{highs}</div>
      </div>

      <div className="bg-white rounded-xl shadow p-4">
        <div className="text-sm text-gray-500">Bajas (&lt;70)</div>
        <div className="text-2xl font-bold text-indigo-600">{lows}</div>
      </div>
    </div>
  );
};

export default SummaryCards;
