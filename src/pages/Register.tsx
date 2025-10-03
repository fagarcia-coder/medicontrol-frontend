// ...existing code...
import { useState, useEffect, useMemo } from "react";
import { getUserTypes, getUserStatus } from "../services/userTypeStatus";
import Confetti from "react-confetti";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getUsers, createUser, updateUser } from "../services/users";

const initialForm = {
  name: "", 
  last_name: "",
  username: "",
  email: "",
  password: "",
  user_type_id: "",
  user_status_id: "",
  age: "",
  sex: "",
};

function Register() {
  const [formData, setFormData] = useState(initialForm);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [userTypes, setUserTypes] = useState<any[]>([]);
  const [userStatus, setUserStatus] = useState<any[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  // Sugerencia automática para username
  const usernameSuggestion = useMemo(() => {
    const name = formData.name.trim().toLowerCase().replace(/\s+/g, "");
    const lastName = formData.last_name.trim().toLowerCase().replace(/\s+/g, "");
    if (name && lastName) {
      return `${name}.${lastName}`;
    }
    return "";
  }, [formData.name, formData.last_name]);
  // Consultar tipos y estados de usuario
  useEffect(() => {
    const fetchTypesAndStatus = async () => {
      try {
        const typesRes = await getUserTypes();
        setUserTypes(typesRes.data);
        const statusRes = await getUserStatus();
        setUserStatus(statusRes.data);
      } catch (err) {
        setUserTypes([]);
        setUserStatus([]);
      }
    };
    fetchTypesAndStatus();
  }, []);
  // const [confirmDelete, setConfirmDelete] = useState<{ user: any; open: boolean }>({ user: null, open: false });

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (err) {
      setUsers([]);
    }
  };

  // Eliminar usuario
  // ...existing code...

  // Activar/desactivar usuario
  // ...existing code...

  // Editar usuario
  const openEditModal = (user: any) => {
    setEditUser(user);
    setShowEditModal(true);
  };

  const closeEditModal = () => {
    setEditUser(null);
    setShowEditModal(false);
  };

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setEditUser({
      ...editUser,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateUser({
        id: editUser.id,
        name: editUser.name,
        last_name: editUser.last_name,
        username: editUser.username,
        email: editUser.email,
        user_type_id: Number(editUser.user_type_id),
        user_status_id: Number(editUser.user_status_id),
        age: Number(editUser.age),
        //sex: editUser.sex,
        password: editUser.password || "", // Opcional
      });
      closeEditModal();
      await fetchUsers();
      toast.success("Usuario editado correctamente ✅", { position: "top-center", autoClose: 2500 });
    } catch (err) {
      toast.error("Error al editar usuario ❌", { position: "top-center", autoClose: 2500 });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (search.trim() === "") {
      setFilteredUsers(users);
    } else {
      setFilteredUsers(
        users.filter((u) =>
          `${u.name} ${u.lastName} ${u.email}`
            .toLowerCase()
            .includes(search.toLowerCase())
        )
      );
    }
  }, [search, users]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUser({
        name: formData.name,
        last_name: formData.last_name,
        username: formData.username,
        email: formData.email,
        password: formData.password,
        user_type_id: Number(formData.user_type_id),
        user_status_id: Number(formData.user_status_id),
        age: Number(formData.age),
        //sex: formData.sex,
      });
      setShowConfetti(true);
      toast.success("Usuario registrado correctamente ✅", { position: "top-center", autoClose: 2500 });
      setTimeout(() => setShowConfetti(false), 3000);
      setFormData(initialForm);
      fetchUsers();
    } catch (err: any) {
      // Mejorar alerta para duplicados
      let errorMsg = "Error al registrar usuario ❌";
      if (err?.response?.data?.message) {
        if (err.response.data.message.includes("correo")) {
          errorMsg = "El correo electrónico ya está registrado ❌";
        } else if (err.response.data.message.includes("usuario")) {
          errorMsg = "El nombre de usuario ya está registrado ❌";
        } else {
          errorMsg = err.response.data.message;
        }
      }
      toast.error(errorMsg, { position: "top-center", autoClose: 3500 });
    }
  };

  return (
    <div className="min-h-screen bg-bg-light px-4 py-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-card p-10 mb-10 border border-gray-100">
          <h2 className="text-3xl font-extrabold text-primary mb-8">
            Registro de usuarios
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-2">
              <div>
                <label className="block text-primary-dark font-semibold mb-2">Nombres</label>
                <input
                  type="text"
                  name="name"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-bg-light text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-primary-dark font-semibold mb-2">Apellidos</label>
                <input
                  type="text"
                  name="last_name"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-bg-light text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-primary-dark font-semibold mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-bg-light text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  placeholder={usernameSuggestion || "Ej: juan.perez"}
                />
              </div>
              <div>
                <label className="block text-primary-dark font-semibold mb-2">Contraseña</label>
                <input
                  type="password"
                  name="password"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-bg-light text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-primary-dark font-semibold mb-2">Edad</label>
                <input
                  type="number"
                  name="age"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-bg-light text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                  value={formData.age}
                  onChange={handleChange}
                  required
                  min={0}
                />
              </div>
              {/* Campo sexo oculto */}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-2">
              <div>
                <label className="block text-primary-dark font-semibold mb-2">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-bg-light text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-primary-dark font-semibold mb-2">
                  Estado
                </label>
                <select
                  name="user_status_id"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-bg-light text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                  value={formData.user_status_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione</option>
                  {userStatus.map((status: any) => (
                    <option key={status.id} value={status.id}>{status.description}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-primary-dark font-semibold mb-2">
                  Tipo de usuario
                </label>
                <select
                  name="user_type_id"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-bg-light text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                  value={formData.user_type_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione</option>
                  {userTypes.map((type: any) => (
                    <option key={type.id} value={type.id}>{type.description}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                className="bg-gray-200 text-primary-dark px-8 py-3 rounded-xl shadow hover:bg-gray-300 font-bold transition"
                onClick={() => setFormData(initialForm)}
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="bg-sky-900 hover:bg-sky-800 text-white px-8 py-3 rounded-xl shadow font-bold transition"
              >
                Registrar
              </button>
            </div>
          </form>
  </div>
  {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={400} />} 
  <ToastContainer />
        {/* Tabla de usuarios */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <div className="text-xl font-semibold text-sky-900">
              Usuarios registrados
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Escriba para buscar"
                className="border border-gray-300 rounded px-3 py-2 w-64"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="bg-gray-200 text-sky-900 px-4 py-2 rounded shadow hover:bg-gray-300 font-semibold"
                onClick={() => setSearch("")}
                type="button"
              >
                Limpiar
              </button>
              <button
                className="bg-sky-900 hover:bg-sky-800 text-white px-4 py-2 rounded shadow font-semibold"
                type="button"
                onClick={() => fetchUsers()}
              >
                Buscar
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse rounded-xl overflow-hidden text-sm">
              <thead className="bg-sky-900 text-white">
                <tr>
                  <th className="px-4 py-2 font-semibold">Nombres</th>
                  <th className="px-4 py-2 font-semibold">Apellidos</th>
                  <th className="px-4 py-2 font-semibold">Edad</th>
                  <th className="px-4 py-2 font-semibold">Correo electrónico</th>
                  <th className="px-4 py-2 font-semibold">Estado</th>
                  <th className="px-4 py-2 font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-6 text-gray-400">
                      No hay usuarios registrados
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user, idx) => (
                    <tr
                      key={user.id || idx}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2">{user.last_name}</td>
                      <td className="px-4 py-2">{user.age}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.user_status_id === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.user_status ? user.user_status : user.user_status_id === 1 ? "Activo" : "Desactivado"}
                        </span>
                      </td>
                      <td className="px-4 py-2 flex gap-2 justify-center">
                        <button
                          title="Editar"
                          className="text-sky-900 hover:text-sky-700"
                          onClick={() => openEditModal(user)}
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M16.862 4.487a2.1 2.1 0 1 1 2.97 2.97L7.5 19.789l-4 1 1-4 12.362-12.302ZM19 7l-2-2"
                            />
                          </svg>
                        </button>
                        {/* Botón eliminar oculto por desarrollo */}
                        {/* Botón activar/desactivar removido por solicitud */}
                        {/* Modal de edición */}
                        {showEditModal && editUser && (
                          <div className="fixed inset-0 bg-black bg-opacity-1 flex items-center justify-center z-50">
                            <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative">
                              <button
                                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                                onClick={closeEditModal}
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  strokeWidth={1.5}
                                  stroke="currentColor"
                                  className="w-6 h-6"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6 18 18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                              <h3 className="text-xl font-bold mb-4 text-sky-900">
                                Editar usuario
                              </h3>
                              <form
                                onSubmit={handleEditSubmit}
                                className="space-y-4"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div>
                                    <label className="block text-sky-900 font-medium mb-1">
                                      Nombres
                                    </label>
                                    <input
                                      type="text"
                                      name="name"
                                      className="border border-gray-300 rounded px-3 py-2 w-full"
                                      value={editUser.name}
                                      onChange={handleEditChange}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sky-900 font-medium mb-1">
                                      Apellidos
                                    </label>
                                    <input
                                      type="text"
                                      name="last_name"
                                      className="border border-gray-300 rounded px-3 py-2 w-full"
                                      value={editUser.last_name}
                                      onChange={handleEditChange}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sky-900 font-medium mb-1">
                                      Edad
                                    </label>
                                    <input
                                      type="number"
                                      name="age"
                                      className="border border-gray-300 rounded px-3 py-2 w-full"
                                      value={editUser.age}
                                      onChange={handleEditChange}
                                      required
                                      min={0}
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sky-900 font-medium mb-1">
                                      Sexo
                                    </label>
                                    <select
                                      name="sex"
                                      className="border border-gray-300 rounded px-3 py-2 w-full"
                                      value={editUser.sex}
                                      onChange={handleEditChange}
                                      required
                                    >
                                      <option value="">Seleccione</option>
                                      <option value="Masculino">
                                        Masculino
                                      </option>
                                      <option value="Femenino">Femenino</option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sky-900 font-medium mb-1">
                                      Correo electrónico
                                    </label>
                                    <input
                                      type="email"
                                      name="email"
                                      className="border border-gray-300 rounded px-3 py-2 w-full"
                                      value={editUser.email}
                                      onChange={handleEditChange}
                                      required
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-sky-900 font-medium mb-1">
                                      Estado
                                    </label>
                                    <select
                                      name="user_status_id"
                                      className="border border-gray-300 rounded px-3 py-2 w-full"
                                      value={editUser.user_status_id}
                                      onChange={handleEditChange}
                                      required
                                    >
                                      <option value="">Seleccione</option>
                                      {userStatus.map((status: any) => (
                                        <option key={status.id} value={status.id}>{status.description}</option>
                                      ))}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sky-900 font-medium mb-1">
                                      Tipo de usuario
                                    </label>
                                    <select
                                      name="user_type_id"
                                      className="border border-gray-300 rounded px-3 py-2 w-full"
                                      value={editUser.user_type_id}
                                      onChange={handleEditChange}
                                      required
                                    >
                                      <option value="">Seleccione</option>
                                      {userTypes.map((type: any) => (
                                        <option key={type.id} value={type.id}>{type.description}</option>
                                      ))}
                                    </select>
                                  </div>
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
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
