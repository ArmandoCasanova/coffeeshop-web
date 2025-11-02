export default function StatCard({ title, value }) {
  return (
    <div className="bg-cream-100 p-6 rounded-2xl shadow-sm">
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold text-brown-600 my-1">${value}</p>
    </div>
  );
}
