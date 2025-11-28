export default function Informacion() {
  return (
    <div className="min-h-screen bg-gray-50 px-6 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-3xl font-bold text-sky-900">Información</h1>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-sky-900 mb-4">Rangos de referencia</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Ayunas (antes del desayuno): 70 – 100 mg/dL (normal)</li>
            <li>Post comida (2h): &lt; 140 mg/dL (normal) / &lt; 180 mg/dL (personas con diabetes, según control médico)</li>
            <li>Antes de dormir: 100 – 140 mg/dL (meta para evitar hipoglucemia nocturna)</li>
          </ul>

          <div className="mt-4 p-4 bg-green-50 rounded-md border border-green-100 flex items-center gap-3">
            <div className="bg-green-100 text-green-700 rounded-full p-2">✔️</div>
            <div className="text-sm text-green-800">Este contenido es informativo y no sustituye la opinión médica.</div>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-sky-900 mb-4">Recomendaciones generales</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-2">
            <li>Realiza al menos 150 minutos/semana de ejercicio aeróbico moderado.</li>
            <li>Hidrátate y evita bebidas azucaradas.</li>
            <li>Bebe suficiente agua durante el día.</li>
            <li>Incluye ejercicios de fuerza 2-3 veces por semana.</li>
            <li>Reduce el consumo excesivo de alcohol.</li>
          </ul>
        </section>

        <section className="bg-white rounded-xl shadow p-6">
          <h2 className="text-lg font-semibold text-sky-900 mb-4">Datos de ejemplo</h2>
          <p className="text-gray-700">A continuación se muestran datos reales de ejemplo para ayudar al paciente a interpretar sus medidas:</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 rounded p-4">
              <div className="text-sm text-gray-500">Última medición</div>
              <div className="text-2xl font-bold text-sky-700">118 mg/dL</div>
              <div className="text-xs text-gray-500">Hace 2 horas</div>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <div className="text-sm text-gray-500">Promedio 7 días</div>
              <div className="text-2xl font-bold text-sky-700">122 mg/dL</div>
              <div className="text-xs text-gray-500">Rango: 95 - 140</div>
            </div>
            <div className="bg-gray-50 rounded p-4">
              <div className="text-sm text-gray-500">Objetivo</div>
              <div className="text-2xl font-bold text-sky-700">90 - 130 mg/dL</div>
              <div className="text-xs text-gray-500">Según recomendaciones generales</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
