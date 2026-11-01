import { Link } from "react-router-dom";
import { TaskFlowLogo } from "./Icons";

const Footer = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800/60 text-slate-400 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 pb-8 border-b border-slate-800/60">
          <div>
            <Link to="/" className="flex items-center gap-2 mb-2">
              <TaskFlowLogo className="w-5 h-5 text-indigo-500" />
              <span className="font-bold text-base text-white tracking-tight">
                Task<span className="text-slate-400">Flow</span>
              </span>
            </Link>
            <p className="text-xs text-slate-400 max-w-md leading-relaxed">
              Minimal, reliable task management built for clarity, speed, and real-time execution.
            </p>
          </div>

          <div className="flex flex-wrap gap-8 text-xs font-medium">
            <Link to="/#features" className="hover:text-white transition-colors">Features</Link>
            <Link to="/login" className="hover:text-white transition-colors">Sign In</Link>
            <Link to="/register" className="hover:text-white transition-colors">Create Account</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Workspace</Link>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row justify-between items-center text-[11px] text-slate-400 gap-3">
          <p>&copy; {new Date().getFullYear()} TaskFlow. Engineered for performance.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400 transition-colors">Privacy</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Terms</a>
            <a href="#" className="hover:text-slate-400 transition-colors">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
