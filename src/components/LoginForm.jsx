import { useState } from "react";
import LoginInput from "./LoginInput";
import Button from "./Button";
import { useLoginMutation } from "../hooks/auth/useLoginMutation";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate: loginUser, isPending } = useLoginMutation();

  const handleLogin = (e) => {
    e.preventDefault();
    loginUser({ email, password });
  };

  return (
    <div className="w-full p-8 md:p-12">
      <h1 className="text-3xl font-bold text-gray-800">Coffee Shop</h1>
      <p className="mt-2 text-gray-600">
        Lorem ipsum is simply dummy text of the printing and typesetting
        industry.
      </p>

      <form onSubmit={handleLogin} className="mt-8">
        <LoginInput
          id="email"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <LoginInput
          id="password"
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

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
          disabled={isPending}
        >
          {isPending ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>
    </div>
  );
}
