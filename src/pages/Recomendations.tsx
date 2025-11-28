import { useEffect, useState } from "react";
import {
  getFoodByLevel,
  createFoodRecommendation,
  updateFoodRecommendation,
  deleteFoodRecommendation,
  getFoodByUser,
} from "../services/food";

interface Recommendation {
  recommendation_id: number;
  recommendation: string;
  level_glucose_id: number;
  type_food_id: number;
}

function Recomendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [level, setLevel] = useState<string>("");
  const [form, setForm] = useState({
    recommendation: "",
    type_food_id: "",
  });
  const [userRole, setUserRole] = useState<number | null>(null);
  const [editRec, setEditRec] = useState<Recommendation | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!level) return alert("Selecciona un nivel de glucosa");
    try {
      await createFoodRecommendation({
        level_glucose_id: Number(level),
        recommendation: form.recommendation,
        type_food_id: Number(form.type_food_id),
      });
      setForm({ recommendation: "", type_food_id: "" });
      fetchRecommendations(Number(level));
    } catch {
      alert("Error al crear recomendación");
    }
  };

  const openEditModal = (rec: Recommendation) => {
    setEditRec(rec);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditRec(null);
    setShowEditModal(false);
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!editRec) return;
    setEditRec({ ...editRec, [e.target.name]: e.target.value } as Recommendation);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editRec) return;
    try {
      await updateFoodRecommendation({
        recommendation_id: editRec.recommendation_id,
        level_glucose_id: editRec.level_glucose_id,
        recommendation: editRec.recommendation,
        type_food_id: editRec.type_food_id,
      });
      closeEditModal();
      fetchRecommendations(Number(level));
    } catch {
      alert("Error al editar recomendación");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta recomendación?")) return;
    try {
      await deleteFoodRecommendation(id);
      fetchRecommendations(Number(level));
    } catch {
      alert("Error al eliminar recomendación");
    }
  };

  const fetchRecommendations = async (levelId: number) => {
    try {
      // If current user is a patient, try fetching recommendations assigned to that user first
      if (userRole === 3) {
        try {
          const raw = localStorage.getItem("user");
          const u = raw ? JSON.parse(raw) : null;
          const userId = u?.user_id ?? null;
          if (userId) {
            const userRes = await getFoodByUser(userId);
            // If user-specific recommendations exist, use them
            if (userRes?.data && userRes.data.length > 0) {
              setRecommendations(userRes.data);
              return;
            }
            // Otherwise fall through to level-based recommendations
          }
        } catch (e) {
          // ignore and fallback to level-based
        }
      }

      const res = await getFoodByLevel(levelId);
      setRecommendations(res.data);
    } catch {
      setRecommendations([]);
    }
  };

  useEffect(() => {
    if (level) {
      fetchRecommendations(Number(level));
    } else {
      setRecommendations([]);
    }
    // Re-run when either selected level or user role changes
  }, [level, userRole]);

  // determine user role to hide create/edit controls for patients
  useEffect(() => {
    try {
      const raw = localStorage.getItem('user');
      if (raw) {
        const u = JSON.parse(raw);
        setUserRole(u?.user_type_id ?? null);
      }
    } catch (e) {
      setUserRole(null);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h1 className="text-2xl font-bold text-sky-900 mb-6">Recomendaciones Alimenticias</h1>
          <div className="mb-6">
            <label className="block text-sky-900 font-semibold mb-2">Selecciona el nivel de glucosa:</label>
            <select
              value={level}
              onChange={e => setLevel(e.target.value)}
              className="border border-gray-300 rounded px-4 py-2 w-full"
            >
              <option value="">Seleccione</option>
              <option value="1">Nivel 1</option>
              <option value="2">Nivel 2</option>
              <option value="3">Nivel 3</option>
            </select>
          </div>
          {/* Hide create form for patients (role 3) */}
          {userRole !== 3 && (
            <form onSubmit={handleCreate} className="mb-8 flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sky-900 font-semibold mb-2">Nueva recomendación</label>
              <input
                type="text"
                name="recommendation"
                value={form.recommendation}
                onChange={handleFormChange}
                className="border border-gray-300 rounded px-4 py-2 w-full"
                required
                placeholder="Escribe la recomendación"
              />
            </div>
            <div>
              <label className="block text-sky-900 font-semibold mb-2">Tipo de alimento</label>
              <select
                name="type_food_id"
                value={form.type_food_id}
                onChange={handleFormChange}
                className="border border-gray-300 rounded px-4 py-2 w-full"
                required
              >
                <option value="">Seleccione</option>
                <option value="1">Tipo 1</option>
                <option value="2">Tipo 2</option>
                <option value="3">Tipo 3</option>
              </select>
            </div>
            <button
              type="submit"
              className="bg-sky-900 hover:bg-sky-800 text-white px-6 py-2 rounded shadow font-semibold"
            >
              Crear
            </button>
          </form>
          )}
          {userRole === 3 && (
            <div className="mb-6 text-sm text-gray-600">Como paciente solo puedes ver las recomendaciones asignadas a tu usuario. Si no ves recomendaciones, contacta a tu médico para que te asigne recomendaciones.</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.length === 0 ? (
              <div className="col-span-2 text-center text-gray-400 py-8">No hay recomendaciones disponibles</div>
            ) : (
              recommendations.map((rec) => (
                <div key={rec.recommendation_id} className="bg-sky-50 border border-sky-100 rounded-xl p-6 shadow flex flex-col gap-2 relative">
                  <h2 className="text-lg font-semibold text-sky-900 mb-1">Recomendación</h2>
                  <span className="inline-block bg-sky-200 text-sky-900 text-xs font-bold px-3 py-1 rounded-full mb-2">
                    Nivel de glucosa: {rec.level_glucose_id}
                  </span>
                  <span className="inline-block bg-sky-100 text-sky-800 text-xs font-bold px-3 py-1 rounded-full mb-2">
                    Tipo de alimento: {rec.type_food_id}
                  </span>
                  <p className="text-gray-700">{rec.recommendation}</p>
                  {userRole !== 3 && (
                    <div className="absolute top-2 right-2 flex gap-2">
                      <button
                        className="text-sky-900 hover:text-sky-700"
                        title="Editar"
                        onClick={() => openEditModal(rec)}
                      >
                        ✏️
                      </button>
                      <button
                        className="text-red-600 hover:text-red-400"
                        title="Eliminar"
                        onClick={() => handleDelete(rec.recommendation_id)}
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          {/* Modal de edición fuera del grid principal */}
        </div>
        {showEditModal && editRec && (
          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
              <button
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                onClick={closeEditModal}
              >
                ✖️
              </button>
              <h3 className="text-xl font-bold mb-4 text-sky-900">Editar recomendación</h3>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sky-900 font-medium mb-1">Recomendación</label>
                  <input
                    type="text"
                    name="recommendation"
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    value={editRec.recommendation}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sky-900 font-medium mb-1">Tipo de alimento</label>
                  <select
                    name="type_food_id"
                    className="border border-gray-300 rounded px-3 py-2 w-full"
                    value={editRec.type_food_id}
                    onChange={handleEditChange}
                    required
                  >
                    <option value="">Seleccione</option>
                    <option value="1">Tipo 1</option>
                    <option value="2">Tipo 2</option>
                    <option value="3">Tipo 3</option>
                  </select>
                </div>
                <div className="flex gap-4 mt-4">
                  <button
                    type="button"
                    className="bg-gray-200 text-sky-900 px-6 py-2 rounded shadow hover:bg-gray-300 font-semibold"
                    onClick={closeEditModal}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-sky-900 hover:bg-sky-800 text-white px-6 py-2 rounded shadow font-semibold"
                  >
                    Guardar cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default Recomendations;
