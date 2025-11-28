import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import logoIcon from "../assets/logo-icon-3.svg";

function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Hide navbar on login page
  if (location.pathname === "/login") return null;

  let user: any = null;
  try {
    const raw = localStorage.getItem("user");
    if (raw) user = JSON.parse(raw);
  } catch (err) {
    user = null;
  }

  const role = user?.user_type_id; // 1=admin,2=medico,3=paciente (assumption)

  // Role IDs assumption: 1=admin, 2=medico, 3=paciente, 4=enfermera
  const menu = [
    // Dashboard: everyone authenticated
    { to: "/dashboard", label: "Dashboard", roles: [1, 2, 3, 4] },
    // Weekly plan: medico + admin
    { to: "/weekly-plan", label: "Plan semanal", roles: [1, 2] },
    // Register: admin only
    { to: "/register", label: "Usuarios", roles: [1] },
    // Measurements: admin, medico, paciente, enfermera
    { to: "/measurements", label: "Mediciones", roles: [1, 2, 3, 4] },
    // History: admin, medico, enfermera
    { to: "/history", label: "Historial", roles: [1, 2, 4] },
    // Recommendations: admin, medico
    { to: "/recommendations", label: "Recomendaciones", roles: [1, 2] },
    // Informacion: all authenticated roles (or keep public if desired)
    { to: "/informacion", label: "Información", roles: [1, 2, 3, 4] },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <header className="bg-white border-b shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => setOpen((s) => !s)} className="p-2 rounded-lg hover:bg-gray-100 md:hidden">{open ? '✕' : '☰'}</button>
          <Link to="/dashboard" className="flex items-center gap-3">
            <img src={logoIcon} alt="Medicontrol" className="h-8 w-8" />
            <span className="text-sky-900 font-extrabold text-xl">Medicontrol</span>
          </Link>
        </div>

        <nav className={`md:flex items-center gap-4 ${open ? '' : 'hidden'} md:visible md:static`}>
          {menu.map((m) => (
            (role != null && m.roles.includes(role)) && (
              <Link key={m.to} to={m.to} className="block px-3 py-2 rounded hover:bg-sky-50 text-sm text-sky-700">{m.label}</Link>
            )
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col text-right">
            <span className="text-sm font-medium text-gray-700">{user?.name ?? 'Invitado'}</span>
            <span className="text-xs text-gray-500">{user?.email ?? ''}</span>
          </div>
          {user ? (
            <button onClick={handleLogout} className="bg-red-50 text-red-600 px-3 py-2 rounded text-sm">Cerrar sesión</button>
          ) : (
            <Link to="/login" className="bg-sky-900 text-white px-3 py-2 rounded text-sm">Iniciar sesión</Link>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;

