import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { TaskFlowLogo, LogOutIcon } from "./Icons";

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="bg-slate-950/90 border-b border-slate-800/80 text-white sticky top-0 z-50 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 group">
          <TaskFlowLogo className="w-7 h-7 text-indigo-500 transition-transform group-hover:scale-105" />
          <span className="font-bold text-lg tracking-tight text-white">
            Task<span className="text-slate-400">Flow</span>
          </span>
        </Link>

        <nav className="flex items-center gap-4" aria-label="Main Navigation">
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <Link
                to="/dashboard"
                className="text-sm font-medium text-slate-300 hover:text-white transition-colors"
              >
                Workspace
              </Link>
              <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
                <span className="text-xs font-medium text-slate-400 max-w-[140px] truncate hidden sm:inline">
                  {user?.name || user?.email}
                </span>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 hover:bg-slate-800 hover:text-white rounded-lg border border-slate-800 transition-colors cursor-pointer"
                >
                  <LogOutIcon className="w-3.5 h-3.5 text-slate-400" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/login"
                className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all cursor-pointer"
              >
                Get Started
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
