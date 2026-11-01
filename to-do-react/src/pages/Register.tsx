import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useAuth } from "../hooks/useAuth";
import { isValidEmail } from "../utils/validation";
import { TaskFlowLogo, ArrowRightIcon } from "../components/Icons";

export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMsg(null);

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    if (!trimmedName || !trimmedEmail || !password || !confirmPassword) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setErrorMsg("Please enter a valid email address.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await register(trimmedEmail, password, trimmedName);
      navigate("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Registration failed. Please try again.";
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
              <h1 className="text-2xl font-bold text-white tracking-tight">Create an account</h1>
              <p className="text-xs text-slate-400 mt-1.5">Get started with your personal workspace</p>
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
                  htmlFor="register-name"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Full Name
                </label>
                <input
                  id="register-name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="register-email"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Email Address
                </label>
                <input
                  id="register-email"
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
                    htmlFor="register-password"
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
                  id="register-password"
                  type={isVisible ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="At least 6 characters"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="register-confirm-password"
                  className="block text-xs font-semibold text-slate-300 mb-1.5"
                >
                  Confirm Password
                </label>
                <input
                  id="register-confirm-password"
                  type={isVisible ? "text" : "password"}
                  autoComplete="new-password"
                  placeholder="Repeat your password"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-xs"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
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
                    <span>Creating Account...</span>
                  </>
                ) : (
                  <>
                    <span>Create Account</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center text-xs text-slate-400">
              Already have an account?{" "}
              <Link to="/login" className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                Sign in instead
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};
