import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button onClick={logout} className="bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg text-sm transition">
          Logout
        </button>
      </div>
      <p className="text-gray-400">Welcome, {user?.name}! 🎉 Auth is working.</p>
    </div>
  );
};

export default Dashboard;