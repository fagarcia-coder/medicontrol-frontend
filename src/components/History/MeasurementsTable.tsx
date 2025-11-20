import React, { useMemo, useState } from 'react';
import { saveAs } from 'file-saver';
import Papa from 'papaparse';

type Measurement = {
  id: number;
  measurement_value: number;
  created_at: string;
  note?: string;
};

type Props = {
  measurements: Measurement[];
};

const MeasurementsTable: React.FC<Props> = ({ measurements }) => {
  const [from, setFrom] = useState<string>('');
  const [to, setTo] = useState<string>('');
  const [query, setQuery] = useState<string>('');

  const filtered = useMemo(() => {
    let data = measurements.slice().sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    if (from) data = data.filter(d => new Date(d.created_at) >= new Date(from));
    if (to) data = data.filter(d => new Date(d.created_at) <= new Date(to));
    if (query) data = data.filter(d => (d.note || '').toLowerCase().includes(query.toLowerCase()));
    return data;
  }, [measurements, from, to, query]);

  const exportCSV = () => {
    const csv = Papa.unparse(filtered.map(f => ({ fecha: f.created_at, valor: f.measurement_value, nota: f.note || '' })));
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'mediciones_export.csv');
  };

  const [selected, setSelected] = useState<Measurement | null>(null);

  return (
    <div>
      <div className="flex gap-2 mb-4">
        <input type="date" value={from} onChange={(e) => setFrom(e.target.value)} className="border rounded px-2 py-1" />
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} className="border rounded px-2 py-1" />
        <input placeholder="Buscar nota" value={query} onChange={e => setQuery(e.target.value)} className="border rounded px-2 py-1 flex-1" />
        <button onClick={exportCSV} className="bg-sky-700 text-white px-3 py-1 rounded">Exportar CSV</button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-sky-900 text-white">
            <tr>
              <th className="px-4 py-2">Fecha</th>
              <th className="px-4 py-2">Valor</th>
              <th className="px-4 py-2">Nota</th>
              <th className="px-4 py-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-6 text-gray-400">No hay mediciones</td></tr>
            ) : (
              filtered.map(m => (
                <tr key={m.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-2">{new Date(m.created_at).toLocaleString()}</td>
                  <td className="px-4 py-2 font-semibold">{m.measurement_value}</td>
                  <td className="px-4 py-2">{m.note || ''}</td>
                  <td className="px-4 py-2">
                    <button onClick={() => setSelected(m)} className="text-sky-700 underline">Ver</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal simple */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-2">Detalle de medición</h3>
            <p><strong>Fecha:</strong> {new Date(selected.created_at).toLocaleString()}</p>
            <p><strong>Valor:</strong> {selected.measurement_value} mg/dL</p>
            <p><strong>Nota:</strong> {selected.note || '-'}</p>
            <div className="mt-4 flex justify-end gap-2">
              <button className="px-3 py-1 border rounded" onClick={() => setSelected(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementsTable;
