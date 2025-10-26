export default function Button({
  children,
  type = "button",
  bgColor = "bg-brown-400",
  textColor = "text-white",
  hoverColor = "hover:bg-brown-500",
  fullWidth = true,
  ...props
}) {
  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button
      type={type}
      className={`py-3 px-6 rounded-lg font-bold text-lg transition-colors ${widthClass} ${bgColor} ${textColor} ${hoverColor} cursor-pointer`}
      {...props}
    >
      {children}
    </button>
  );
}
