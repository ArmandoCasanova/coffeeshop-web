// src/components/LoginForm.jsx
import { useNavigate } from "react-router-dom";
import LoginInput from "./LoginInput";
import Button from "./Button";

export default function LoginForm() {
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    // Navigate to Home when the button is clicked
    navigate("/dashboard");
  };

  return (
    <div className="w-full p-8 md:p-12">
      <h1 className="text-3xl font-bold text-gray-800">Coffee Shop</h1>
      <p className="mt-2 text-gray-600">
        Lorem ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>

      <form onSubmit={handleLogin} className="mt-8">
        <LoginInput id="email" type="email" placeholder="Email" />
        <LoginInput id="password" type="password" placeholder="Contraseña" />

        <div className="text-right mb-6">
          <a
            href="#"
            className="text-sm font-semibold text-brown-400 hover:text-brown-600 cursor-pointer"
          >
            Forgot password?
          </a>
        </div>

        <Button
          type="submit"
          bgColor="bg-brown-600"
          hoverColor="hover:bg-brown-300"
        >
          Ingresar
        </Button>
      </form>
    </div>
  );
}
