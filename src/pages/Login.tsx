
import { useState } from "react";
// ...existing code...

// Componente de Login preparado para integración con el backend
// Solo actualiza la función handleLogin cuando el endpoint esté disponible
function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Cuando el backend tenga el endpoint de login, actualiza la ruta y los datos aquí
  // Ejemplo recomendado:
  // const res = await api.post("/user/login", { email: username, password });
  // localStorage.setItem("token", res.data.token);
  // Redirige al dashboard o guarda el usuario en contexto
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulación de login para desarrollo
    // Puedes cambiar los datos simulados según tus usuarios admin reales
    const mockUser = {
      id: 1,
      name: "Admin",
      user_type_id: 1,
      email: username,
    };
    localStorage.setItem("token", "mock-token");
    localStorage.setItem("user", JSON.stringify(mockUser));
    if (mockUser.user_type_id === 1) {
      window.location.href = "/register";
    } else {
      window.location.href = "/dashboard";
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-bg-light">
      {/* Left image section */}
      <div className="hidden md:flex w-1/2 bg-primary-light items-center justify-center relative">
        <img
          src="https://framerusercontent.com/images/wsoVMdFp2Vwsrrw5LzDvwLS0u8.jpg"
          alt="Glucose Meter Login"
          className="object-cover h-full w-full rounded-r-3xl shadow-card"
        />
        <div className="absolute inset-0 bg-primary-light opacity-20 rounded-r-3xl"></div>
      </div>
      {/* Right login form section */}
      <div className="flex flex-1 items-center justify-center bg-bg-light px-4">
        <div className="bg-white rounded-2xl shadow-card p-10 w-full max-w-md border border-gray-100">
          <h2 className="text-3xl font-extrabold text-center mb-2 text-primary">Control de azúcar en la sangre</h2>
          <h3 className="text-lg font-semibold text-center mb-8 text-primary-dark">Iniciar sesión</h3>
          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-primary-dark font-medium mb-1" htmlFor="email">
                Correo electrónico*
              </label>
              {/* Usa el campo email para el login, puedes cambiar a username si el backend lo requiere */}
              <input
                id="email"
                type="email"
                placeholder="Ingresar correo"
                className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-light bg-bg-light text-gray-900 placeholder-gray-400 transition"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-primary-dark font-medium mb-1" htmlFor="password">
                Contraseña*
              </label>
              {/* Campo de contraseña, asegúrate de enviar el valor correcto al backend */}
              <input
                id="password"
                type="password"
                placeholder="Ingresar contraseña"
                className="border border-gray-300 rounded-xl px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-primary-light bg-bg-light text-gray-900 placeholder-gray-400 transition"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="bg-primary hover:bg-primary-dark text-black font-bold py-3 rounded-xl w-full shadow transition-colors text-lg tracking-wide"
            >
              Iniciar sesión
            </button>
            <div className="text-center mt-2">
              <a href="#" className="text-primary text-sky-500 text-sm hover:underline">Recupera tu contraseña</a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;
