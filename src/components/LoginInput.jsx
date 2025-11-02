import { useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";

export default function LoginInput({
  id,
  placeholder,
  type = "text",
  value,
  onChange,
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const isPassword = type === "password";

  const toggleVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  return (
    <div className="relative w-full mb-4">
      <input
        id={id}
        type={isPassword ? (isPasswordVisible ? "text" : "password") : type}
        className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-brown-300"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      {isPassword && (
        <button
          type="button"
          onClick={toggleVisibility}
          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500 hover:text-gray-800 cursor-pointer"
        >
          {isPasswordVisible ? <FiEyeOff /> : <FiEye />}
        </button>
      )}
    </div>
  );
}
