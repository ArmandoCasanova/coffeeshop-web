import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Aquí iría la lógica real de autenticación
    navigate('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form onSubmit={handleLogin} className="bg-white p-8 rounded shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-4 text-center">Iniciar sesión</h2>
        <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Usuario" />
        <input className="w-full mb-3 px-3 py-2 border rounded" placeholder="Contraseña" type="password" />
        <button type="submit" className="w-full bg-brown-300 text-white py-2 rounded font-bold">Entrar</button>
      </form>
    </div>
  );
}