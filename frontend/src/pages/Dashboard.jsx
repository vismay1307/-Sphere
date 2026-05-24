import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-5 text-white">
      <div className="w-full max-w-2xl rounded-[28px] border border-neutral-800 bg-neutral-900 p-8 text-center shadow-2xl shadow-black/30">
        <p className="text-sm uppercase tracking-[0.22em] text-neutral-500">
          Dashboard
        </p>
        <h1 className="mt-4 text-4xl font-semibold">wlcm to dashboard</h1>
        <p className="mt-4 text-sm leading-7 text-neutral-400">
          Logged in as {user?.name || user?.firstName}.
        </p>
        <button
          onClick={handleLogout}
          className="mt-8 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
