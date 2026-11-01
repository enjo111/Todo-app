import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { isValidEmail } from "../utils/validation";
import { TaskFlowLogo, ArrowRightIcon } from "../components/Icons";

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedEmail = email.trim();

    if (!trimmedEmail || !password) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    try {
      setIsSubmitting(true);
      await login(trimmedEmail, password);

      // token is stored in session cookie, so we can safely navigate to the dashboard
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to sign in. Please check your credentials.";
      setErrorMsg(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      <Header />

      <main className="flex-grow flex items-center justify-center min-h-[calc(100vh-4rem)] py-20 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-10 sm:p-12 shadow-sm">
            <div className="text-center mb-10">
              <div className="inline-flex justify-center mb-4">
                <TaskFlowLogo className="w-9 h-9 text-indigo-500" />
              </div>
              <h1 className="text-2xl font-bold text-white tracking-tight">Welcome back</h1>
              <p className="text-xs text-slate-400 mt-1.5">Sign in to continue to your workspace</p>
            </div>

            {errorMsg && (
              <div
                role="alert"
                className="mb-6 p-3.5 rounded-lg bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center justify-between"
              >
                <span>{errorMsg}</span>
                <button
                  type="button"
                  aria-label="Dismiss error"
                  onClick={() => setErrorMsg(null)}
                  className="text-red-400 hover:text-red-200 ml-2 font-bold cursor-pointer"
                >
                  ✕
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="login-email"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1.5">
                  <label
                    htmlFor="login-password"
                    className="block text-xs font-semibold text-slate-300"
                  >
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setIsVisible(!isVisible)}
                    className="text-xs text-slate-400 hover:text-white transition-colors cursor-pointer"
                  >
                    {isVisible ? "Hide" : "Show"}
                  </button>
                </div>
                <input
                  id="login-password"
                  type={isVisible ? "text" : "password"}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 px-4 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2 mt-6"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Create one now
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
