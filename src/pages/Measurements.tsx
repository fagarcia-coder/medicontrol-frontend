import { useEffect, useState, useRef } from "react";
import {
  createMeasurement,
  updateMeasurement,
  deleteMeasurement,
  getAllMeasurements,
  getMeasurementsByUser,
} from "../services/measurements";

interface Measurement {
  id: number;
  measurement_value: number;
  created_at: string;
  note?: string;
}

const moments = [
  { id: "ayunas", label: "Ayunas" },
  { id: "pre_comida", label: "Pre comida" },
  { id: "post_comida", label: "Post comida" },
  { id: "antes_dormir", label: "Antes de dormir" },
];

function Measurements() {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [moment, setMoment] = useState("");
  const [note, setNote] = useState("");
  const [editing, setEditing] = useState<Measurement | null>(null);
  const dateRef = useRef<HTMLInputElement | null>(null);
  const timeRef = useRef<HTMLInputElement | null>(null);

  const fetch = async () => {
    const user = JSON.parse(localStorage.getItem("user") || "null");
    try {
      if (user && user.user_type_id === 1) {
        const res = await getAllMeasurements();
        setMeasurements(res.data || []);
      } else if (user) {
        const res = await getMeasurementsByUser(user.id);
        setMeasurements(res.data || []);
      } else {
        setMeasurements([]);
      }
    } catch (err) {
      setMeasurements([]);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const resetForm = () => {
    setValue("");
    setDate("");
    setTime("");
    setMoment("");
    setNote("");
    setEditing(null);
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const measurementValue = Number(value);
      if (isNaN(measurementValue)) return;

      if (editing) {
        await updateMeasurement({ id: editing.id, measurement_value: measurementValue });
      } else {
        const user = JSON.parse(localStorage.getItem("user") || "null");
        await createMeasurement({ user_id: user?.id || 0, measurement_value: measurementValue });
      }
      await fetch();
      resetForm();
    } catch (err) {
      console.error(err);
    }
  };

  const onEdit = (m: Measurement) => {
    setEditing(m);
    setValue(String(m.measurement_value));
    const dt = new Date(m.created_at);
    setDate(dt.toISOString().slice(0, 10));
    setTime(dt.toTimeString().slice(0, 5));
    setNote(m.note || "");
  };

  const onDelete = async (id: number) => {
    if (!confirm("¿Eliminar registro?")) return;
    await deleteMeasurement(id);
    await fetch();
  };

  const openDatePicker = () => {
    if (!dateRef.current) return;
    const el: any = dateRef.current;
    if (typeof el.showPicker === "function") el.showPicker();
    else el.focus();
  };

  const openTimePicker = () => {
    if (!timeRef.current) return;
    const el: any = timeRef.current;
    if (typeof el.showPicker === "function") el.showPicker();
    else el.focus();
  };

  return (
    <div className="min-h-screen bg-bg-light px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-2xl shadow-card p-8 mb-8">
          <h2 className="text-2xl font-bold text-sky-900 mb-6">Nuevo registro</h2>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Fecha de registro *</label>
                <div className="relative mt-1">
                  <input
                    type="date"
                    ref={dateRef}
                    className="block w-full rounded-md border border-gray-200 px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                  <span role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key === 'Enter') openDatePicker(); }} onClick={openDatePicker} className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-sky-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hora *</label>
                <div className="relative mt-1">
                  <input
                    type="time"
                    ref={timeRef}
                    className="block w-full rounded-md border border-gray-200 px-3 py-2 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    required
                  />
                  <span role="button" tabIndex={0} onKeyDown={(e)=>{ if(e.key === 'Enter') openTimePicker(); }} onClick={openTimePicker} className="absolute inset-y-0 right-2 flex items-center cursor-pointer text-sky-900">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Glucosa (mg/dl) *</label>
                <div className="relative mt-1">
                  <input
                    type="number"
                    step="0.1"
                    className="block w-full rounded-md border border-gray-200 px-3 py-2 pr-10 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                    required
                  />
                  <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-500 text-xs">mg/dl</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Momento de medición *</label>
                <div className="relative mt-1">
                  <select
                    className="block w-full rounded-md border border-gray-200 px-3 py-2 bg-white appearance-none pr-8 focus:outline-none focus:ring-2 focus:ring-sky-300"
                    value={moment}
                    onChange={(e) => setMoment(e.target.value)}
                    required
                  >
                    <option value="">Seleccione</option>
                    {moments.map((m) => (
                      <option key={m.id} value={m.id}>{m.label}</option>
                    ))}
                  </select>
                  <span className="absolute inset-y-0 right-2 flex items-center pointer-events-none text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l3.999 3.999a1 1 0 11-1.414 1.414L10 5.414 6.707 8.706A1 1 0 115.293 7.293l4-4A1 1 0 0110 3z" clipRule="evenodd" />
                    </svg>
                  </span>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Nota</label>
              <textarea
                className="mt-1 block w-full rounded-md border border-gray-200 px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-sky-300"
                rows={3}
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="flex gap-4">
              <button type="button" className="bg-white border border-gray-200 px-4 py-2 rounded hover:bg-gray-50" onClick={resetForm}>Limpiar</button>
              <button type="submit" className="bg-sky-900 text-white px-4 py-2 rounded shadow hover:bg-sky-800">{editing ? "Actualizar" : "Guardar"}</button>
            </div>
          </form>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-sky-900 mb-4">Historial</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="bg-sky-900 text-white">
                <tr>
                  <th className="px-4 py-2">Fecha de registro</th>
                  <th className="px-4 py-2">Hora</th>
                  <th className="px-4 py-2">Glucosa (mg/dl)</th>
                  <th className="px-4 py-2">Momento</th>
                  <th className="px-4 py-2">Nota</th>
                  <th className="px-4 py-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {measurements.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-gray-400">No hay registros</td>
                  </tr>
                ) : (
                  measurements.map((m) => {
                    const d = new Date(m.created_at);
                    return (
                      <tr key={m.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2">{d.toLocaleDateString()}</td>
                        <td className="px-4 py-2">{d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                        <td className="px-4 py-2 font-semibold">{m.measurement_value}</td>
                        <td className="px-4 py-2">-</td>
                        <td className="px-4 py-2">{m.note || ""}</td>
                        <td className="px-4 py-2 flex gap-2">
                          <button className="text-sky-900" onClick={() => onEdit(m)}>Editar</button>
                          <button className="text-red-600" onClick={() => onDelete(m.id)}>Eliminar</button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Measurements;
