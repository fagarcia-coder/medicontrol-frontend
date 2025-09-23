import { useState, useEffect } from "react";
import api from "../services/api";
import { getUsers } from "../services/users";

const initialForm = {
  name: "",
  lastName: "",
  age: "",
  sex: "",
  email: "",
  userStatus: "",
  userType: "",
};

function Register() {
  const [formData, setFormData] = useState(initialForm);
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [editUser, setEditUser] = useState<any | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  // const [confirmDelete, setConfirmDelete] = useState<{ user: any; open: boolean }>({ user: null, open: false });

  const fetchUsers = async () => {
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      setUsers([]);
    }
  };

  // Eliminar usuario
  const handleDelete = async (userId: number) => {
    if (!window.confirm("¿Seguro que deseas eliminar este usuario?")) return;
    try {
      await api.delete(`/users/${userId}`);
      await fetchUsers();
    } catch (err) {
      alert("Error al eliminar usuario");
    }
  };

  // Activar/desactivar usuario
  const handleToggleStatus = async (user: any) => {
    try {
      await api.patch(`/users/${user.id}/status`, {
        status: user.userStatus === "Activo" ? "Desactivado" : "Activo",
      });
      await fetchUsers();
    } catch (err) {
      alert("Error al cambiar estado");
    }
  };

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
      await api.put(`/users/${editUser.id}`, editUser);
      closeEditModal();
      await fetchUsers();
    } catch (err) {
      alert("Error al editar usuario");
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
    // Aquí deberías mapear los campos a los nombres esperados por el backend/modelo ER
    try {
      await api.post("/users/register", formData);
      alert("Usuario registrado correctamente ✅");
      setFormData(initialForm);
      fetchUsers();
    } catch (err) {
      alert("Error al registrar usuario ❌");
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
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-2">
              <div>
                <label className="block text-primary-dark font-semibold mb-2">
                  Nombres
                </label>
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
                <label className="block text-primary-dark font-semibold mb-2">
                  Apellidos
                </label>
                <input
                  type="text"
                  name="lastName"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-bg-light text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="block text-primary-dark font-semibold mb-2">
                  Edad
                </label>
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
              <div>
                <label className="block text-primary-dark font-semibold mb-2">
                  Sexo
                </label>
                <select
                  name="sex"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-bg-light text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                  value={formData.sex}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="Masculino">Masculino</option>
                  <option value="Femenino">Femenino</option>
                </select>
              </div>
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
                  name="userStatus"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-bg-light text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                  value={formData.userStatus}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="Activo">Activo</option>
                  <option value="Desactivado">Desactivado</option>
                </select>
              </div>
              <div>
                <label className="block text-primary-dark font-semibold mb-2">
                  Tipo de usuario
                </label>
                <select
                  name="userType"
                  className="border border-gray-300 rounded-xl px-4 py-3 w-full bg-bg-light text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-light transition"
                  value={formData.userType}
                  onChange={handleChange}
                  required
                >
                  <option value="">Seleccione</option>
                  <option value="Administrador">Administrador</option>
                  <option value="User">User</option>
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
                  <th className="px-4 py-2 font-semibold">Sexo</th>
                  <th className="px-4 py-2 font-semibold">
                    Correo electrónico
                  </th>
                  <th className="px-4 py-2 font-semibold">Fecha de registro</th>
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
                      <td className="px-4 py-2">{user.lastName}</td>
                      <td className="px-4 py-2">{user.age}</td>
                      <td className="px-4 py-2">{user.sex}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">
                        {user.created_at
                          ? new Date(user.created_at).toLocaleDateString()
                          : ""}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            user.userStatus === "Activo"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {user.userStatus}
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
                        <button
                          title="Eliminar"
                          className="text-red-600 hover:text-red-400"
                          onClick={() => handleDelete(user.id)}
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
                              d="M6 18 18 6M6 6l12 12"
                            />
                          </svg>
                        </button>
                        <button
                          title={
                            user.userStatus === "Activo"
                              ? "Desactivar"
                              : "Activar"
                          }
                          className={
                            user.userStatus === "Activo"
                              ? "text-yellow-500 hover:text-yellow-400"
                              : "text-green-600 hover:text-green-400"
                          }
                          onClick={() => handleToggleStatus(user)}
                        >
                          {user.userStatus === "Activo" ? (
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
                                d="M18.364 5.636a9 9 0 1 1-12.728 0M12 3v9"
                              />
                            </svg>
                          ) : (
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
                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                              />
                            </svg>
                          )}
                        </button>
                        {/* Modal de edición */}
                        {showEditModal && editUser && (
                          <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
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
                                      name="lastName"
                                      className="border border-gray-300 rounded px-3 py-2 w-full"
                                      value={editUser.lastName}
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
                                      name="userStatus"
                                      className="border border-gray-300 rounded px-3 py-2 w-full"
                                      value={editUser.userStatus}
                                      onChange={handleEditChange}
                                      required
                                    >
                                      <option value="">Seleccione</option>
                                      <option value="Activo">Activo</option>
                                      <option value="Desactivado">
                                        Desactivado
                                      </option>
                                    </select>
                                  </div>
                                  <div>
                                    <label className="block text-sky-900 font-medium mb-1">
                                      Tipo de usuario
                                    </label>
                                    <select
                                      name="userType"
                                      className="border border-gray-300 rounded px-3 py-2 w-full"
                                      value={editUser.userType}
                                      onChange={handleEditChange}
                                      required
                                    >
                                      <option value="">Seleccione</option>
                                      <option value="Administrador">
                                        Administrador
                                      </option>
                                      <option value="User">User</option>
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
