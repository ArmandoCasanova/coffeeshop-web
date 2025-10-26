export default function ProgressBar({ label, percentage }) {
  return (
    <div className="mb-4">
      <div className="flex justify-between text-sm font-semibold text-gray-700 mb-1">
        <span>{label}</span>
        <span>{percentage}%</span>
      </div>
      <div className="w-full bg-cream-200 rounded-full h-2">
        <div
          className="bg-brown-300 h-2 rounded-full"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}
