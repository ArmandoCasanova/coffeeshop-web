// src/Login.jsx
import bgLogin from "../assets/images/login-back-img.svg";
import coffeLoginImg from "../assets/images/coffee-login.svg";
import LoginForm from "../components/LoginForm";

export default function Login() {
  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center p-4"
      style={{ backgroundImage: `url(${bgLogin})` }}
    >
      <div className="bg-cream-100 bg-opacity-95 rounded-2xl shadow-xl w-full max-w-4xl grid md:grid-cols-2 overflow-hidden">
        <div className="flex flex-col justify-center">
          <LoginForm />
        </div>
        <div className="hidden md:flex justify-center items-center">
          <img
            src={coffeLoginImg}
            alt="Vasos de café"
            className="w-full h-auto object-cover"
          />
        </div>
      </div>
    </div>
  );
}
