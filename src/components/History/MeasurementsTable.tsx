import React, { useEffect, useMemo, useState } from 'react';
import { deleteMeasurement, updateMeasurement } from '../../services/measurements';

interface Measurement {
  id: number;
  measurement_value: number;
  created_at: string;
  note?: string;
}

type Props = {
  measurements: Measurement[];
};

const pageSizes = [5, 10, 25];

const MeasurementsTable: React.FC<Props> = ({ measurements }) => {
  const [items, setItems] = useState<Measurement[]>([]);
  const [query, setQuery] = useState('');
  const [minValue, setMinValue] = useState<string>('');
  const [maxValue, setMaxValue] = useState<string>('');
  const [fromDate, setFromDate] = useState<string>('');
  const [toDate, setToDate] = useState<string>('');
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<number>(1);

  // modal
  const [selected, setSelected] = useState<Measurement | null>(null);
  const [editValue, setEditValue] = useState<string>('');
  const [editNote, setEditNote] = useState<string>('');

  useEffect(() => {
    setItems(measurements || []);
    setPage(1);
  }, [measurements]);

  const filtered = useMemo(() => {
    return items.filter((m) => {
      if (query && !(m.note || '').toLowerCase().includes(query.toLowerCase())) return false;
      if (minValue && m.measurement_value < Number(minValue)) return false;
      if (maxValue && m.measurement_value > Number(maxValue)) return false;
      if (fromDate) {
        const from = new Date(fromDate);
        if (new Date(m.created_at) < from) return false;
      }
      if (toDate) {
        const to = new Date(toDate);
        // include whole day
        to.setHours(23, 59, 59, 999);
        if (new Date(m.created_at) > to) return false;
      }
      return true;
    });
  }, [items, query, minValue, maxValue, fromDate, toDate]);

  const total = filtered.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  function openModal(m: Measurement) {
    setSelected(m);
    setEditValue(String(m.measurement_value));
    setEditNote(m.note || '');
  }

  async function handleSave() {
    if (!selected) return;
    const id = selected.id;
    const newValue = Number(editValue);
    try {
      await updateMeasurement({ id, measurement_value: newValue });
      setItems((prev) => prev.map((p) => (p.id === id ? { ...p, measurement_value: newValue, note: editNote } : p)));
      setSelected(null);
    } catch (err) {
      console.error(err);
      alert('Error al actualizar la medición');
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('¿Eliminar esta medición?')) return;
    try {
      await deleteMeasurement(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error(err);
      alert('Error al eliminar');
    }
  }

  function downloadCSV(rows: Measurement[]) {
    const header = ['id', 'value', 'created_at', 'note'];
    const lines = [header.join(',')];
    for (const r of rows) {
      const values = [r.id, r.measurement_value, `"${r.created_at}"`, `"${(r.note || '').replace(/"/g, '""')}"`];
      lines.push(values.join(','));
    }
    const blob = new Blob([lines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'measurements_export.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-4 items-end">
        <div className="md:col-span-2">
          <label className="block text-sm text-gray-600">Buscar notas</label>
          <input value={query} onChange={(e) => setQuery(e.target.value)} className="w-full border border-gray-200 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-300" placeholder="Buscar..." />
        </div>
        <div className="flex gap-2 flex-wrap items-end">
          <div>
            <label className="block text-sm text-gray-600">Valor min</label>
            <input type="number" value={minValue} onChange={(e) => setMinValue(e.target.value)} className="w-full md:w-24 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-300" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Valor max</label>
            <input type="number" value={maxValue} onChange={(e) => setMaxValue(e.target.value)} className="w-full md:w-24 border border-gray-200 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-sky-300" />
          </div>
        </div>
        <div className="flex gap-3 justify-end items-center flex-wrap">
          <div>
            <label className="block text-sm text-gray-600">Desde</label>
            <input type="date" value={fromDate} onChange={(e) => setFromDate(e.target.value)} className="border border-gray-200 rounded px-2 py-1 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-sky-300" />
          </div>
          <div>
            <label className="block text-sm text-gray-600">Hasta</label>
            <input type="date" value={toDate} onChange={(e) => setToDate(e.target.value)} className="border border-gray-200 rounded px-2 py-1 w-full md:w-auto focus:outline-none focus:ring-2 focus:ring-sky-300" />
          </div>
        </div>
        <div className="md:col-span-4 flex justify-end items-center gap-3">
          <button
            onClick={() => downloadCSV(filtered)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-sky-700 text-white text-sm font-medium shadow-sm hover:bg-sky-800 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-sky-300 transition"
            aria-label="Exportar CSV"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v12m0 0l4-4m-4 4-4-4M21 21H3" />
            </svg>
            <span>Exportar CSV</span>
          </button>
          <select value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }} className="select select-sm">
            {pageSizes.map((s) => <option key={s} value={s}>{s} / pág</option>)}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto border border-gray-100 rounded-lg">
        <table className="min-w-full bg-white">
          <thead className="bg-sky-900 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Fecha</th>
              <th className="px-4 py-3 text-right">Valor (mg/dL)</th>
              <th className="px-4 py-3 text-left">Nota</th>
              <th className="px-4 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.map((m) => {
              const isHigh = m.measurement_value >= 180;
              const isLow = m.measurement_value <= 70;
              return (
                <tr key={m.id} className="border-t last:border-b hover:bg-gray-50">
                  <td className="px-4 py-3 align-top text-sm text-gray-700 whitespace-normal break-words">{new Date(m.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 align-top text-right whitespace-normal break-words">
                    <div className="flex items-center justify-end gap-2">
                      <span className="text-lg font-semibold">{m.measurement_value}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${isHigh ? 'bg-red-100 text-red-800' : isLow ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{isHigh ? 'Alto' : isLow ? 'Bajo' : 'Normal'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 align-top text-sm text-gray-700 whitespace-normal break-words">{m.note || '-'}</td>
                  <td className="px-4 py-3 align-top text-center">
                    <div className="flex gap-2 items-center justify-center">
                      <button onClick={() => openModal(m)} className="btn btn-xs">Ver / Editar</button>
                      <button onClick={() => handleDelete(m.id)} className="btn btn-xs btn-error">Eliminar</button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {pageItems.length === 0 && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">No hay resultados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between mt-4">
        <div className="text-sm text-gray-600">Mostrando {Math.min((page - 1) * pageSize + 1, total)}-{Math.min(page * pageSize, total)} de {total}</div>
        <div className="flex gap-2">
          <button className="btn btn-sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>Anterior</button>
          <div className="flex items-center gap-2 px-2">{page} / {pages}</div>
          <button className="btn btn-sm" onClick={() => setPage((p) => Math.min(pages, p + 1))} disabled={page === pages}>Siguiente</button>
        </div>
      </div>

      {/* Modal */}
      {selected && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h3 className="text-lg font-semibold mb-2">Editar medición</h3>
            <div className="mb-3">
              <label className="block text-sm text-gray-600">Fecha</label>
              <div>{new Date(selected.created_at).toLocaleString()}</div>
            </div>
            <div className="mb-3">
              <label className="block text-sm text-gray-600">Valor</label>
              <input type="number" value={editValue} onChange={(e) => setEditValue(e.target.value)} className="input w-full" />
            </div>
            <div className="mb-3">
              <label className="block text-sm text-gray-600">Nota</label>
              <textarea value={editNote} onChange={(e) => setEditNote(e.target.value)} className="textarea w-full" />
            </div>
            <div className="flex justify-end gap-2">
              <button className="btn" onClick={() => setSelected(null)}>Cerrar</button>
              <button className="btn btn-primary" onClick={handleSave}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementsTable;

