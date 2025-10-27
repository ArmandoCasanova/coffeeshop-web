export default function InfoCard({ title, content }) {
  return (
    <div className="bg-cream-100 p-6 rounded-2xl shadow-sm text-center">
      <p className="text-gray-500 text-sm mb-1">{title}</p>
      <p className="text-lg font-bold text-brown-600">{content}</p>
    </div>
  );
}
