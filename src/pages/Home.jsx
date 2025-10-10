import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';

export default function Home() {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 p-8 bg-white">
        <Outlet />
      </main>
    </div>
  );
}