import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ZapIcon, ShieldIcon, FilterIcon, ArrowRightIcon, CheckIcon } from "../components/Icons";

export const Landing = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Header />

      <main className="flex-grow">
        {/* Full Viewport Hero Section */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-20 lg:py-28 border-b border-slate-900 relative">
          <div className="max-w-5xl mx-auto px-6 sm:px-8 text-center flex flex-col items-center">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.12] mb-8">
              Master your daily workflow with focus and velocity.
            </h1>

            <p className="text-base sm:text-xl text-slate-400 max-w-2xl leading-relaxed font-normal mb-12">
              A distraction-free task management environment with instant category filtering, status persistence, and zero unnecessary friction.
            </p>

            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-20">
              <Link
                to="/register"
                className="w-full sm:w-auto px-8 py-4 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition-all inline-flex items-center justify-center gap-2.5 cursor-pointer"
              >
                <span>Start Free Workspace</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="w-full sm:w-auto px-8 py-4 text-sm font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl border border-slate-800 transition-colors cursor-pointer"
              >
                Sign In
              </Link>
            </div>

            {/* Live Workspace Preview */}
            <div className="w-full max-w-3xl rounded-2xl border border-slate-800/90 bg-slate-900/60 p-6 sm:p-8 text-left shadow-2xl">
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-slate-800/80 px-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-800"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-800"></div>
                  <div className="w-3.5 h-3.5 rounded-full bg-slate-800"></div>
                  <span className="ml-2 text-xs font-medium text-slate-400">TaskFlow Workspace</span>
                </div>
                <span className="text-xs font-mono text-slate-400">3 tasks active</span>
              </div>

              <div className="space-y-3.5 px-2 pb-2">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-4 h-4 rounded border border-indigo-500 bg-indigo-500/20 flex items-center justify-center">
                      <CheckIcon className="w-3 h-3 text-indigo-400" />
                    </div>
                    <span className="text-xs font-medium text-slate-400 line-through">Review Q3 architecture proposals</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-md bg-slate-900 text-slate-400 font-medium">Completed</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-4 h-4 rounded border border-slate-700"></div>
                    <span className="text-xs font-medium text-slate-200">Refactor auth token refresh handler</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/50 font-medium">Active</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                  <div className="flex items-center gap-3.5">
                    <div className="w-4 h-4 rounded border border-slate-700"></div>
                    <span className="text-xs font-medium text-slate-200">Prepare launch notes for team review</span>
                  </div>
                  <span className="text-[10px] px-2.5 py-1 rounded-md bg-indigo-950 text-indigo-300 border border-indigo-800/50 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Full Viewport Features Section */}
        <section id="features" className="min-h-screen flex flex-col justify-center py-28 lg:py-36 bg-slate-950">
          <div className="max-w-6xl mx-auto px-6 sm:px-8">
            <div className="text-left max-w-2xl mb-20">
              <h2 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">Built for focused output</h2>
              <p className="mt-4 text-base text-slate-400 leading-relaxed">Every interaction engineered for clarity, spaciousness, and execution speed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
              <div className="bg-slate-900/40 p-8 sm:p-10 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center mb-6">
                    <FilterIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">Instant Filter Views</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Switch instantly between All, Active, and Completed views to maintain clarity over your current workload.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/40 p-8 sm:p-10 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center mb-6">
                    <ShieldIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">Protected Auth Context</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Secure session state persistence ensures your task state and identity remain synced reliably across reloads.
                  </p>
                </div>
              </div>

              <div className="bg-slate-900/40 p-8 sm:p-10 rounded-2xl border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col justify-between">
                <div>
                  <div className="w-11 h-11 rounded-xl bg-slate-800 text-indigo-400 flex items-center justify-center mb-6">
                    <ZapIcon className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-3">Zero-Latency Operations</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    Optimized optimistic updates update task states instantly, eliminating lag while maintaining backend sync.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Spacious Full Page CTA Section */}
        <section className="min-h-[70vh] flex flex-col justify-center py-28 bg-slate-900/30 border-t border-slate-900">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold text-white tracking-tight mb-6">Ready to organize your workflow?</h2>
            <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
              Create your account in seconds and experience distraction-free productivity.
            </p>
            <div>
              <Link
                to="/register"
                className="inline-flex items-center gap-2.5 px-8 py-4 text-base font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-sm transition-colors cursor-pointer"
              >
                <span>Get Started Now</span>
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};
